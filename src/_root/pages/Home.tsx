import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import { Models } from 'appwrite'

const Home = () => {
  const { data: posts, isLoading: isPostLoading } = useGetRecentPosts();
  const { data: creatorList } = useGetUsers()
  const homeUserStyle = true;

  //console.log(posts, "FROM HOME")
  //console.log(creatorList?.documents, "FROM HOME")

  if(isPostLoading && !posts){
    return <Loader/>
  }

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-y-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
          <h2 className="h3-bold md:h2-bold text-left w-full">
            Home Feed
          </h2>
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id}>
                  <PostCard post={post}/>
                </li>
              ))}
            </ul>
        </div>
      </div>

      <div className="hidden xl:flex flex-col w-72 2xl:w-465 px-6 py-10 gap-10 overflow-y-scroll custom-scrollbar">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {!creatorList ? (
          <Loader/>
        ) : (
          <ul className="flex flex-col">
              <UserCard users={creatorList.documents} style={homeUserStyle}/>
          </ul>
        )}
      </div>

    </div>
  )
}

export default Home