export type User = {
  id: string;
  name: string | null;
  username: string | null;
  email?: string | null; 
  image: string | null;
  bio?: string | null;
  linkedIn?: string | null;
  website?: string | null;
  building?: string | null;
};

// export type Reply = {
//   id: string;

//   content: string;
//   createdAt: string;
//   author: User;
// };


export type Post = {
  id: string;
  content: string;
  createdAt: string;
  parentId?: string | null;
  replies: Post[];
  repliesCount: number;
  likesCount: number;
  likedByMe: boolean;
  repostedByMe?: boolean;
  repostsCount: number;
  author: User;
};
