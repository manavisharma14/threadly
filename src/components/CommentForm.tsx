"use client"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

type Comment = {
  id: string
  content: string
  createdAt: string
  user?: { id: string; name: string | null; image: string | null }
}

export default function CommentForm({
  postId,
  onSuccess,
}: {
  postId: string
  onSuccess?: (comment: Comment) => void
}) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: content.trim() }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")

      // ✅ notify parent with the new comment
      setContent("")
      setOpen(false)
      onSuccess?.(data.comment)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); setError(null) }}>
      <DialogTrigger className="text-sm text-gray-600 hover:text-olive transition">
        Post your reply
      </DialogTrigger>
      <DialogContent className="bg-olive text-floral border border-bone/40 rounded-xl shadow-lg p-6">
  <DialogHeader>
    <DialogTitle className="text-lg font-semibold text-floral">
      Add a Comment
    </DialogTitle>
  </DialogHeader>

  <div className="flex flex-col gap-4 mt-2">
    <Textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Write your comment..."
      rows={4}
      disabled={loading}
      className="bg-smoky text-floral placeholder-floral/50 border border-bone/40 rounded-lg focus:ring-2 focus:ring-floral/70 focus:border-floral resize-none"
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          handleSubmit()
        }
      }}
    />
    {error && <p className="text-red-400 text-sm">{error}</p>}

    <div className="flex justify-end gap-3">
      <Button
        variant="ghost"
        type="button"
        disabled={loading}
        onClick={() => setOpen(false)}
        className="text-floral/70 hover:text-floral hover:bg-bone/20 rounded-md px-4"
      >
        Cancel
      </Button>
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !content.trim()}
        className="bg-bone text-floral font-medium rounded-md px-6 hover:bg-bone/80 transition"
      >
        {loading ? "Posting..." : "Post"}
      </Button>
    </div>
  </div>
</DialogContent>
    </Dialog>
  )
}