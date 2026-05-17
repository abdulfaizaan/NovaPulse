import { useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { API_URL } from '../constants';

export interface WebSocketEvent {
  type: string;
  data: any;
}

export function useWebSocket(userId: string | null, onEvent?: (event: WebSocketEvent) => void) {
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  const onEventRef = useRef(onEvent);
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!userId) return;

    const baseUrl = API_URL.replace('/api', '').replace('http://', 'ws://').replace('https://', 'wss://');
    const wsUrl = `${baseUrl}/ws`;

    socketRef.current = io(wsUrl, {
      query: { userId },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    });

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected');
      reconnectAttempts.current = 0;
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected');
      reconnectAttempts.current++;
    });

    socketRef.current.on('goal:created', (event) => {
      onEventRef.current?.({ type: 'goal:created', data: event });
    });

    socketRef.current.on('goal:submitted', (event) => {
      onEventRef.current?.({ type: 'goal:submitted', data: event });
    });

    socketRef.current.on('goal:approved', (event) => {
      onEventRef.current?.({ type: 'goal:approved', data: event });
    });

    socketRef.current.on('goal:rejected', (event) => {
      onEventRef.current?.({ type: 'goal:rejected', data: event });
    });

    socketRef.current.on('escalation:triggered', (event) => {
      onEventRef.current?.({ type: 'escalation:triggered', data: event });
    });

    socketRef.current.on('system:event', (event) => {
      onEventRef.current?.({ type: 'system:event', data: event });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId]);

  const sendMessage = useCallback((event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  return { sendMessage, isConnected: socketRef.current?.connected ?? false };
}
