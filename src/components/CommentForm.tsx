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

export default function CommentForm({ postId, onSuccess }: { postId: string; onSuccess?: () => void }) {
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

      // success
      setContent("")
      setOpen(false)
      onSuccess?.() // tell parent to refresh comments
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Comment</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment..."
            rows={4}
            disabled={loading}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                handleSubmit()
              }
            }}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="bg-olive text-bone hover:bg-olive/80"
            >
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}