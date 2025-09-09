"use client"
import Link from "next/link";
import {signIn, signOut, useSession} from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Navbar() {

    const {data: session} = useSession();
    return (
        <nav className="w-full flex justify-between p-6 bg-olive/20 text-floral shadow-md">
            <h1 className="text-2xl font-bold">
                threadly
            </h1>
            <div className="flex items-center gap-12">
            <Link href="/">Home</Link>
            {
                session ? (
                    <div className="flex gap-4 items-center">
                        <img src={session.user?.image || ""} alt="" className="w-8 h-8 rounded-full"/>
                        
                        <Popover>
                            <PopoverTrigger><span>{session.user?.name}</span></PopoverTrigger>
                            <PopoverContent className="w-42 p-4 flex flex-col gap-2 border b border-white/40 bg-olive/10">
                                <Link href="/profile">Profile</Link>
                                <button onClick={() => signOut()}>Sign Out</button>
                                </PopoverContent>

                            
                        </Popover>
                    </div>
                ) : (
                    <button onClick={() => signIn()}>Sign In</button>
                )
            }
            </div>

        </nav>
    )
}