"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogDescription } from "./ui/dialog"

export default function CommentForm( { postId } : { postId: string }) {
    const [open, setOpen] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <Dialog>
            <DialogTrigger>
                Comment
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <div>

                    </div>

                </DialogHeader>
            </DialogContent>
        </Dialog>


    )
}