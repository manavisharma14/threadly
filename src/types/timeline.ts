import type { Post } from "./index";

export type TimelinePost = Post & {
  type: "post";
};

export type TimelineRepost = {
  type: "repost";
  id: string;
  count: number; // Represents reposts count for the post
  createdAt: string;
  post: Post;
};

export type TimelineItem = TimelinePost | TimelineRepost;