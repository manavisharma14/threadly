"use client"
import { useState, useEffect } from "react";
import LikeButton from "@/components/LikeButton";

type Post = {
    id: string;   // Prisma ObjectId is a string, not number
    content: string;
    createdAt: string;
    author?: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
export default function PostFeed() {
        const [posts, setPosts] = useState<Post[]>([]);
        const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<string | null>(null);
        

        
        useEffect(() => {
            const fetchPosts = async () => {
                try {
                    const res = await fetch('/api/posts', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if(!res.ok){
                        throw new Error("Failed to fetch posts");
                    }
                    const data = await res.json();
                    setPosts(data);
                    setLoading(false);
    
                }
                catch (error) {
                    setError((error as Error).message);
                    setLoading(false);
                }
                
    
            }
            fetchPosts();
        }, []);
    return (
        <div>
            <h2>Recent Posts</h2>
            {loading && <p>Loading posts...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && !error && posts.length === 0 && <p>No posts available.</p>}
            <ul>
                {posts.map(post => (
                    <li key={post.id} className="border-b border-gray-300 py-4">
                        <div>
                        <p>{post.content}</p>
                        <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="mt-2 justify-end flex">
                            {post.author ? (
                                <div className="flex items-center gap-2">
                                    <img src={post.author.image || ''} alt=""  className="w-8 h-8 rounded-full"/>
                                    <p className="text-sm text-gray-700">- {post.author.name}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-700">- Anonymous</p>
                            )}
                        </div>
                        <LikeButton postId={post.id} />

                    </li>
                ))}
            </ul>

        </div>
    )
}


