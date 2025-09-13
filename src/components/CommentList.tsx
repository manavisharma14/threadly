"use client"
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"

type Comment = {
  id: string
  content: string
  createdAt: string
  user?: { id: string; name: string | null; image: string | null }
}

export type CommentListHandle = {
  addComment: (comment: Comment) => void
}

function CommentListBase(
  {
    postId,
    initialComments = [],
    onDeleteComment,   // ✅ accept this prop
  }: {
    postId: string
    initialComments?: Comment[]
    onDeleteComment?: () => void
  },
  ref: React.Ref<CommentListHandle>
) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [loading, setLoading] = useState(initialComments.length === 0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialComments && initialComments.length > 0) {
      setLoading(false) // ✅ immediately clear loading
      setComments(initialComments)
      return
    }
  
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?postId=${postId}`)
        if (!res.ok) throw new Error("Failed to fetch comments")
        const data = await res.json()
        setComments(data.comments || [])
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
  
    fetchComments()
  }, [postId])

  const handleDelete = async (commentId: string) => {
    const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" })
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      onDeleteComment?.() // ✅ tell parent to decrement count
    }
  }

  useImperativeHandle(ref, () => ({
    addComment: (comment: Comment) => {
      setComments((prev) => [comment, ...prev])
    },
  }))

  return (
    <div className="mt-2 space-y-2">
      {loading && comments.length === 0 && (
        <p className="text-sm text-gray-400">Loading comments...</p>
      )}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && comments.length === 0 && (
        <p className="text-gray-400 italic text-sm">Be the first to comment </p>
      )}
      {comments.map((comment) => (
        <div key={comment.id} className="p-2 border-b border-gray-800 rounded">
          <p className="text-sm ">{comment.content}</p>
          <p className="text-xs text-gray-500">
            {comment.user?.name || "Anonymous"} •{" "}
            {new Date(comment.createdAt).toLocaleString()}
          </p>
          {/* <button
            onClick={() => handleDelete(comment.id)}
            className="text-xs text-red-500 mt-1"
          >
            Delete
          </button> */}
        </div>
      ))}
    </div>
  )
}

const CommentList = forwardRef(CommentListBase)
export default CommentList