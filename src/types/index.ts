export type User = {
  id: string;
  name: string | null;
  username: string | null;
  email?: string | null; // Optional to avoid mismatch
  image: string | null;
  bio?: string | null;
  linkedIn?: string | null;
  website?: string | null;
  building?: string | null;
};

export type Reply = {
  id: string;
  content: string;
  createdAt: string;
  author: User;
};

export type Post = {
  id: string;
  content: string;
  createdAt: string;
  parentId?: string | null;
  replies: Reply[];
  repliesCount: number;
  likesCount: number;
  likedByMe: boolean;
  repostedByMe?: boolean;
  repostsCount: number;
  author: User;
};