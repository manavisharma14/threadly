"use client"
import { signIn } from "next-auth/react"

export default function SignInPage(){
    return (
        <div>
            <h1>SignIn to thready</h1>
            <button onClick={() => signIn("github")}>Sign In w github</button>
            <button onClick={() => signIn("google")}>Sign In w google</button>
        </div>
    )
}