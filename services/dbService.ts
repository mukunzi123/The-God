
import { BiblePost, User, ContactMessage, GalleryImage } from '../types';

const POSTS_KEY = 'bsr_bible_posts';
const USERS_KEY = 'bsr_users';
const MESSAGES_KEY = 'bsr_contact_messages';
const GALLERY_KEY = 'bsr_gallery_images';

export const db = {
  // --- Posts / Reflections ---
  getPosts: (): BiblePost[] => {
    const data = localStorage.getItem(POSTS_KEY);
    let posts = data ? JSON.parse(data) : [];
    
    if (posts.length === 0) {
      posts = [
        {
          id: 'seed-en-1',
          title: 'The Light of the World',
          verse: 'John 8:12',
          reflection: 'Jesus is the guiding light for the people of Rwanda. In times of darkness, His word brings clarity and hope to our nation. We are called to walk in this light and share it with our neighbors.',
          authorId: 'system',
          createdAt: new Date().toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1490730141103-6ac277a5bf17?auto=format&fit=crop&q=80&w=800',
          tags: ['Hope', 'Faith'],
          language: 'English'
        },
        {
          id: 'seed-rw-1',
          title: 'Urumuri rw\'Isi',
          verse: 'Yohana 8:12',
          reflection: 'Yezu ni urumuri ruyobora abanyarwanda. Mu bihe by\'umwijima, ijambo rye rizura icyizere n\'ukwemera mu gihugu cyacu. Turahamagarirwa kugendera muri urwo rumuri.',
          authorId: 'system',
          createdAt: new Date().toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1544427928-c49cdfebf194?auto=format&fit=crop&q=80&w=1200',
          tags: ['Icyizere', 'Ukwemera'],
          language: 'Kinyarwanda'
        },
        {
          id: 'seed-fr-1',
          title: 'La Lumière du Monde',
          verse: 'Jean 8:12',
          reflection: 'Jésus est la lumière qui guide le peuple rwandais. Dans les moments d\'obscurité, sa parole apporte clarté et espoir à notre nation. Nous sommes appelés à marcher dans cette lumière.',
          authorId: 'system',
          createdAt: new Date().toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800',
          tags: ['Espoir', 'Foi'],
          language: 'French'
        }
      ];
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    }
    return posts;
  },

  savePost: (post: BiblePost) => {
    const data = localStorage.getItem(POSTS_KEY);
    const posts = data ? JSON.parse(data) : [];
    if (!posts.find((p: any) => p.id === post.id)) {
      posts.unshift(post);
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    }
  },

  updatePost: (updatedPost: BiblePost) => {
    const data = localStorage.getItem(POSTS_KEY);
    const posts = data ? JSON.parse(data) : [];
    const updated = posts.map((p: BiblePost) => p.id === updatedPost.id ? updatedPost : p);
    localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  },

  deletePost: (id: string) => {
    const data = localStorage.getItem(POSTS_KEY);
    const posts = data ? JSON.parse(data) : [];
    const filtered = posts.filter((p: BiblePost) => p.id !== id);
    localStorage.setItem(POSTS_KEY, JSON.stringify(filtered));
  },

  // --- Users ---
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User) => {
    const data = localStorage.getItem(USERS_KEY);
    const users = data ? JSON.parse(data) : [];
    if (!users.find((u: User) => u.email === user.email)) {
      users.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  // --- Messages ---
  getMessages: (): ContactMessage[] => {
    const data = localStorage.getItem(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveMessage: (message: ContactMessage) => {
    const data = localStorage.getItem(MESSAGES_KEY);
    const messages = data ? JSON.parse(data) : [];
    messages.unshift(message);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  },

  deleteMessage: (id: string) => {
    const data = localStorage.getItem(MESSAGES_KEY);
    const messages = data ? JSON.parse(data) : [];
    const filtered = messages.filter((m: ContactMessage) => m.id !== id);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(filtered));
  },

  // --- Gallery ---
  getGallery: (): GalleryImage[] => {
    const data = localStorage.getItem(GALLERY_KEY);
    let gallery = data ? JSON.parse(data) : [];
    
    if (gallery.length === 0) {
      gallery = [
        {
          id: 'g-seed-1',
          url: 'https://images.unsplash.com/photo-1544427928-c49cdfebf194?auto=format&fit=crop&q=80&w=1200',
          caption: 'Sacred moments in Kigali',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
    }
    return gallery;
  },

  saveGalleryImage: (image: GalleryImage) => {
    const data = localStorage.getItem(GALLERY_KEY);
    const gallery = data ? JSON.parse(data) : [];
    if (!gallery.find((img: GalleryImage) => img.id === image.id)) {
      gallery.unshift(image);
      localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
    }
  },

  updateGalleryImage: (updatedImage: GalleryImage) => {
    const data = localStorage.getItem(GALLERY_KEY);
    const gallery = data ? JSON.parse(data) : [];
    const updated = gallery.map((img: GalleryImage) => img.id === updatedImage.id ? updatedImage : img);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(updated));
  },

  deleteGalleryImage: (id: string) => {
    const data = localStorage.getItem(GALLERY_KEY);
    const gallery = data ? JSON.parse(data) : [];
    const filtered = gallery.filter((img: GalleryImage) => img.id !== id);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(filtered));
  }
};
