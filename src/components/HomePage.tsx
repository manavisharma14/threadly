"use client";
import { useState } from "react";

import CreatePost from "@/components/CreatePost";
import PostFeed from "@/components/PostFeed";
import Profile from "@/components/Profile";



type Post = {
  id: string;   // Prisma ObjectId is a string, not number
  content: string;
  createdAt: string;
  author?: {
    id: string;
    name: string | null;
    image: string | null;
    username: string;
  };
};



export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState<Post | undefined>(undefined);



  return (
    <div className="">
      <h1 className="text-3xl  font-bold text-white  text-center mt-10"> 
        <i>connect</i>Circle
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4 mt-10">

{/* Left Sidebar */}
<div className="md:col-span-3 lg:col-span-3 p-4 space-y-4 hidden md:block">
  <Profile />
</div>

{/* Main Content */}
<div className="col-span-1 md:col-span-5 lg:col-span-6 p-4 space-y-4">
  <CreatePost onPostCreated={setNewPost} />
  <PostFeed newPost={newPost} />
</div>

{/* Right Sidebar */}
<div className="md:col-span-3 lg:col-span-3 p-4 space-y-4 hidden md:block">
  <div className="bg-olive/20 rounded-xl p-4 shadow">Right sidebar</div>
</div>
</div>



    </div>
  );
}
