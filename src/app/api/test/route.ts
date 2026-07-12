
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest){
    let body: any = null;
    try{
        body = await req.text();
    } catch{
        body = null;
    }

    return NextResponse.json({totalSpent, spentByCategory: {food,
    travel,
    shopping}})

}