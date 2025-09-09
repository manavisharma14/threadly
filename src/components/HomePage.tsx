
import CreatePost from "@/components/CreatePost";
import PostFeed from "@/components/PostFeed";
import Profile from "@/components/Profile";






export default function HomePage() {


  return (
    <div className="">
      <h1 className="text-3xl  font-bold text-blue-400 hover:text-blue-700 text-center mt-10"> 
        <i>connect</i>Circle
      </h1>

<div className="grid grid-cols-12  gap-4 mt-10">

  <div className="col-span-3 p-4 space-y-4 hidden lg:block "> 
    <Profile />
  </div>

  <div className="col-span-6 p-4 space-y-4">
    <CreatePost />
    <PostFeed />
  </div>

  <div className="col-span-3 p-4 space-y-4 hidden lg:block">
    <div className="bg-olive/20 rounded-xl p-4 shadow">Right sidebar</div>
  </div>i






</div>



    </div>
  );
}
