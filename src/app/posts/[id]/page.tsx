import CommentButton from "@/components/CommentButton";
import LikeButton from "@/components/LikeButton";
import { notFound } from "next/navigation";
import CommentForm from "@/components/CommentForm";
import CommentList from "@/components/CommentList";

async function getPostById(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // ensures fresh data every request
    });

    if (!res.ok) {
      throw new Error("Failed to fetch post");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-1/2 mx-auto mt-10 p-4 bg-dark rounded-lg">

      <p>{post.content}</p>
      <p className="text-sm text-gray-500">
        {new Date(post.createdAt).toLocaleString()}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <img
          src={post.author?.image || ""}
          alt=""
          className="w-10 h-10 rounded-full"
        />
        <span>{post.author?.name || "Anonymous"}</span>
      </div>

       <div>
                        <div className="flex gap-5 mb-5 mt-2 justify-end">
                        <LikeButton postId={post.id} />
                        <CommentButton postId={post.id} />
                        </div>
      
                        <CommentList postId={post.id} />
                        <CommentForm postId={post.id} />
                      </div>


    </div>
  );
}