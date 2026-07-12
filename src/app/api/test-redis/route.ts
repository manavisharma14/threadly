import { NextResponse } from 'next/server'
import { redis } from "@/lib/redis"

export async function GET(){
    await redis.set("threadO:test", "working", {
        ex:60,
    })
    
    const value = await redis.get<string>("threadO:test");
    return NextResponse.json({
        success: true,
        value,
    })
}