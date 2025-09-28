"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
export default function FollowButton({
    isFollowingInitial,
    targetUserId,
    currentUserId
} : { 
    isFollowingInitial: boolean; 
    targetUserId: string;
    currentUserId: string;
} ){
    const [isFollowing, setIsFollowing] = useState(isFollowingInitial);
    const [isLoading, setIsLoading] = useState(false);

    const toggleFlow = async () => {
        setIsLoading(true);

        try{
            if(isFollowing){
                // unfollow
                await fetch('/api/follow', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ targetUserId })
    
                });
                setIsFollowing(false);
    
            } else {
                // follow
                await fetch('/api/follow', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ targetUserId })
                })
                setIsFollowing(true);
            }
        }
        catch(error){
            console.error("Error toggling follow status:", error);
        }
        finally{
            setIsLoading(false);
        }
    }
    return (
        <Button
          onClick={toggleFlow}
          disabled={isLoading || targetUserId === currentUserId}
          className={`rounded-full px-5 py-2 shadow ${
            isFollowing
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-olive text-white hover:opacity-90"
          }`}
        >
          {isLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )
    }