export interface User {
  id: string;
  email: string;
  restaurant: Restaurant;
}

export interface Restaurant {
  id: string;
  name: string;
  owner: string;
  menus: Menu[];
  items: Item[];
  displays: Display[];
  schedules: Schedule[];
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Menu {
  id: string;
  name: string;
  description?: string;
  items: Item[];
  createdAt: string;
  updatedAt: string;
}

export interface Display {
  id: string;
  name: string;
  pairingCode: string;
  currentMenu?: Menu;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  menu: Menu;
  display: Display;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface SocketEvents {
  'menu-created': { menu: Menu };
  'menu-updated': { menu: Menu };
  'menu-deleted': { menuId: string };
  'item-created': { item: Item };
  'item-updated': { item: Item };
  'item-deleted': { itemId: string };
  'item-availability-changed': { itemId: string; isAvailable: boolean };
  'display-created': { display: Display };
  'display-updated': { display: Display };
  'display-paired': { displayId: string; displayName: string };
  'menu-assigned': { displayId: string; menuId: string };
  'restaurant-updated': { restaurant: Restaurant };
} 