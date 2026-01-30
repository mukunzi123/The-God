
export type Language = 'Kinyarwanda' | 'English' | 'French';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
  phone?: string;
}

export interface BiblePost {
  id: string;
  title: string;
  verse: string;
  reflection: string;
  authorId: string;
  createdAt: string;
  imageUrl?: string;
  tags: string[];
  language: Language;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
