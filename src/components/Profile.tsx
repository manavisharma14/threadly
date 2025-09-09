"use client"
import { useSession } from "next-auth/react";

export default function Profile() {
    const { data: session } = useSession();

    return (
        <div className="border p-4 rounded-xl shadow-md bg-olive/20">
            <h1 className="text-center">your user profie</h1>

            {session && (
                <div>
                    <div className="flex items-center space-x-4 mb-4 justify-center">
                        <img src={session.user?.image || ""} alt="Profile Image" className="w-16 h-16 rounded-full" />

                    </div>
                    <div className="text-center">
                        <p>{session.user?.name}</p>
                        <p> {session.user?.email}</p>
                    </div>
                </div>
            )}

        </div>
    )

}