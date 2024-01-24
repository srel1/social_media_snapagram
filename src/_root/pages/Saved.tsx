import GridPostList from "@/components/shared/GridPostList"
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserSavedPosts } from "@/lib/react-query/queries";

const Saved = () => {
  const { user } = useUserContext();
  const { data: posts } = useGetUserSavedPosts()
  //console.log(user, "ON SAVED")
  //console.log(posts, "ON SAVED")
  
  const filteredPosts = posts?.documents.filter((item) => item.user.$id === user.id)
  const formattedPosts = filteredPosts?.map((items) => items.post) as any[];

  //console.log(formattedPosts, "formatted", "ON SAVED")

  if(!posts){
    return <Loader/>
  }

  return (
    <div className="flex flex-col flex-1 items-center overflow-y-scroll py-10 px-5 md:p-14 custom-scrollbar">
      <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/save.svg"
            alt="saved-post"
            width={36}
            height={36}
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold w-full">Saved</h2>
        </div>
        {formattedPosts?.length! > 0 ? (
          <GridPostList posts={formattedPosts} showStats={false} />
        ) : (
          <p className="flex flex-col items-center justify-center">
            You have no saved posts.
          </p>
        )}
      </div>
    </div>
  );
}

export default Saved