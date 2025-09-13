export type Post = {
  id: string;
  content: string;
  createdAt: string;
  parentId?: string | null;
  replies?: {
    id: string;
    content: string;
    createdAt: string;
    author?: {
      id: string;
      name: string | null;
      image: string | null;
      username: string | null;
    };
  }[];
  repliesCount?: number;
  likesCount?: number;
  likedByMe?: boolean;
  author?: {
    id: string;
    name: string | null;
    image: string | null;
    username: string | null;
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