// types/index.ts
export type Post = {
    id: string;
    content: string;
    createdAt: string; // always serialized to string
    comments?: {
      id: string;
      content: string;
      createdAt: string;
      user?: {
        id: string;
        name: string | null;
        image: string | null;
        username: string | null; // Prisma allows null
      };
    }[];
    commentsCount?: number; 
    likesCount?: number; 
    likedByMe?: boolean;
    author?: {
      id: string;
      name: string | null;
      image: string | null;
      username: string | null; // Prisma allows null
    };
  };
  
  export type User = {
    id: string;
    name: string | null;
    username: string | null; // ✅ allow null
    email: string | null;
    image: string | null;
    bio?: string | null;
    linkedIn?: string | null;
    website?: string | null;
    building?: string | null;
  };