import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();

  connect(token?: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: token ? { token } : undefined,
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    // Set up event listeners
    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    const events = [
      'menu-created',
      'menu-updated',
      'menu-deleted',
      'item-created',
      'item-updated',
      'item-deleted',
      'item-availability-changed',
      'display-created',
      'display-updated',
      'display-paired',
      'menu-assigned',
      'restaurant-updated',
    ];

    events.forEach((event) => {
      this.socket!.on(event, (data) => {
        const listeners = this.listeners.get(event);
        if (listeners) {
          listeners.forEach((listener) => listener(data));
        }
      });
    });
  }

  on(event: string, callback: (data: unknown) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: unknown) => void) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  // Join display room for real-time updates
  joinDisplay(displayId: string) {
    if (this.socket) {
      this.socket.emit('join-display', displayId);
    }
  }

  // Join pairing room
  joinPairing(pairingCode: string) {
    if (this.socket) {
      this.socket.emit('pair-display', { pairingCode });
    }
  }

  // Emit events (for future use)
  emit(event: string, data: unknown) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export const socketService = new SocketService();
export default socketService; 