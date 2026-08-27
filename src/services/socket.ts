// VITE_SOCKET_URL should now point to wss://<api-id>.execute-api.<region>.amazonaws.com/<stage>
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'wss://api.yaadsign.com';

type Callback = (data: any) => void;

class SocketService {
  private socket: WebSocket | null = null;
  private listeners: Record<string, Callback[]> = {};
  private token: string | null = null;

  connect(token?: string) {
    if (this.socket?.readyState === WebSocket.OPEN) return;
    
    if (token) {
      this.token = token;
    }

    try {
      // In a real API Gateway WebSocket, we might need to pass token in query string if auth is required
      // e.g. wss://url?token=xxx. Here we just connect.
      this.socket = new WebSocket(SOCKET_URL);

      this.socket.onopen = () => {
        console.log('Connected to WebSocket server');
        this.triggerEvent('connect', null);
      };

      this.socket.onclose = () => {
        console.log('Disconnected from WebSocket server');
        this.triggerEvent('disconnect', null);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      this.socket.onmessage = (messageEvent) => {
        try {
          const payload = JSON.parse(messageEvent.data);
          // Assuming backend sends: { event: 'menu-created', data: { ... } }
          if (payload.event) {
            this.triggerEvent(payload.event, payload.data);
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message', e);
        }
      };
    } catch (e) {
      console.error('Failed to create WebSocket', e);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  on(event: string, callback: Callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return a function to unsubscribe
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  private triggerEvent(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  emit(action: string, data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      // API Gateway expects a JSON body. We can use `action` to route it to different Lambda handlers or $default
      this.socket.send(JSON.stringify({ action, data }));
    } else {
      console.warn('WebSocket is not connected. Cannot emit:', action);
    }
  }
}

export const socketService = new SocketService();
export default socketService;