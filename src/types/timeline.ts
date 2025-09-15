import type { Post } from "./index";

export type TimelinePost = Post & {
  type: "post";
};

export type TimelineRepost = {
  type: "repost";
  id: string;
  count: number; 
  createdAt: string;
  post: Post;
};

export type TimelineItem = TimelinePost | TimelineRepost;