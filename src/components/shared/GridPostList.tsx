import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridPostListsProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
}

const GridPostList = ({ posts, showUser = true, showStats = true}: GridPostListsProps) => {
  const { user } = useUserContext();

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7">
      {posts.map((post) => (
        <li key={post.$id} className='relative min-w-80 h-80'>
          <Link to={`/posts/${post.$id}`} className='flex rounded-[24px] border border-dark-4 overflow-hidden cursor-pointer w-full h-full'>
            <img src={post.imageUrl} alt='post' className="h-full w-full object-cover"/>
          </Link>
          <div className="absolute bottom-0 p-5 flex-between w-full bg-gradient-to-t from-dark-3 to-transparent rounded-b-[24px] gap-2">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img src={post.creator.imageUrl} 
                  className='h-8 w-8 rounded-full'
                />
                <p className="">{post.creator.name}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id}/>}
          </div>
        </li>
      ))}
    </div>
  )
}

export default GridPostList