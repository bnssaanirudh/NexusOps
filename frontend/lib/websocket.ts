"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import type { WSMessage, DigitalTwinState, WSPayload } from "./types";

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

interface UseWebSocketOptions {
  machineId?: string; // If provided, subscribe to per-machine feed
  onSensorUpdate?: (machineId: string, payload: WSPayload) => void;
  onInitialState?: (twins: DigitalTwinState[] | DigitalTwinState) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { machineId, onSensorUpdate, onInitialState } = options;
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);

  const connect = useCallback(() => {
    const url = machineId
      ? `${WS_BASE}/ws/machine/${machineId}`
      : `${WS_BASE}/ws`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setReconnectCount(0);
      // Start keepalive ping every 30s
      const ping = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send("ping");
      }, 30000);
      ws.addEventListener("close", () => clearInterval(ping));
    };

    ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);
        if (msg.type === "sensor_update" && msg.machine_id) {
          onSensorUpdate?.(msg.machine_id, msg.payload as WSPayload);
        } else if (msg.type === "initial_state") {
          onInitialState?.(msg.payload as DigitalTwinState[] | DigitalTwinState);
        }
      } catch {
        // Ignore pong
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Exponential backoff reconnect
      const delay = Math.min(1000 * 2 ** reconnectCount, 30000);
      reconnectTimer.current = setTimeout(() => {
        setReconnectCount((c) => c + 1);
        connect();
      }, delay);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [machineId, onSensorUpdate, onInitialState, reconnectCount]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { isConnected };
}
