"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

type LikeButtonProps = {
    postId: string;
}
export default function LikeButton({ postId }: LikeButtonProps) {
    const { data: session } = useSession();
    const [liked, setLiked] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    // initially fetch like status and count

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const res = await fetch('/api/likes?postId=' + postId, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (!res.ok){
                    throw new Error("Failed to fetch likes");
                }
                const data = await res.json();
                setLiked(data.liked);
                setCount(data.count);   
                setLoading(false);
            } catch (error) {
                setError((error as Error).message);
                setLoading(false);
            }
        }
        fetchLikes();
    }, [postId]);

    const handleLike = async () => {
        try{
            if(!session?.user?.email){
                setError("You must be logged in to like a post");
                return;
            }
            const res = await fetch('/api/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({postId})
            })
            if(!res.ok){
                throw new Error("Failed to update like");
            }
            const data = await res.json();
            setLiked(data.liked);
            setCount(data.count);
        }
        catch (error) {
            setError((error as Error).message);
        }
    };
    if(loading){
        return <button disabled>Loading...</button>
    }
    
    return (
        <button
      onClick={handleLike}
      className={`flex items-center gap-1 px-2 py-1 rounded-md ${
        liked ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
      }`}
    >
      {liked ? "❤️" : "🤍"} {count}
    </button>
    )
}