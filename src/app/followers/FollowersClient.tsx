"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

interface User {
    id: string;
    name?: string | null;
    username?: string | null;
    image?: string | null;
  }

export default function FollowersClient() {
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const [followers, setFollowers] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    if(!userId) {
        return <div>No userId provided in query parameters.</div>;
    }

    useEffect(() => {
        const fetchFollowers = async () => {
            try{
                setLoading(true);
                const res = await fetch(`/api/users/${userId}/followers`);
                const data = await res.json();
                setUsers(data);
                setFollowers(data.length);
            }
            catch(error){
                console.error("Error fetching followers:", error);
            }
            finally{
                setLoading(false);
            }
        }
        fetchFollowers();

    }, [userId])
  return (
    <div>
       { loading ? (
            <p>Loading</p>

       ) : users.length === 0 ? (
            <p>No followers yet</p>


       ) : (
        <ul>
            <li key={userId}>
                {users.map(user => (
                    <div key={user.id} className="flex items-center space-x-4 mb-4">
                        {user.image && (
                            <img 
                                src={user.image} 
                                alt={user.name || "User Avatar"} 
                                className="w-10 h-10 rounded-full"
                            />
                        )}
                        <div>
                            <p className="font-medium">{user.name || "Unnamed User"}</p>
                            <p className="text-sm text-gray-500">@{user.username || "unknown"}</p>
                        </div>
                    </div>
                ))}

            </li>
        </ul>
       )} 
    </div>
  )
}