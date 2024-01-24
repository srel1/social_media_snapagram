import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { followUser } from "@/lib/appwrite/api";
import { useGetCurrentUser, useGetFollowers, useGetUserPosts, useGetUsers } from "@/lib/react-query/queries"
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


const Profile = () => {
  const navigate = useNavigate()
  const [isPostsActive, setIsPostsActive] = useState(true);
  const [isLikedActive, setIsLikedActive] = useState(false);
  let userAlreadyFollowed = false;

  const { id } = useParams();
  const { data: posts } = useGetUserPosts(id || "");
  const userData = useGetCurrentUser();
  const { data: users } = useGetUsers();
  const followerList = useGetFollowers();
  let following = 0;
  let followers = 0;

  const { user } = useUserContext();

  let actualUser = users?.documents.filter((item) => item.$id === id);
  let userInfo = actualUser?.at(0);

  //console.log(user.id, "ID useUserContext()")
  //console.log(userData?.data?.$id, "ID userData?.data?.$id")
  //console.log(id, "ID useParams()")

  followerList.data?.map(
    (item) => item.accountId === userInfo?.$id && following++
  );
  followerList.data?.map(
    (item) => item.followeeId === userInfo?.$id && followers++
  );

  if (!posts || !userData) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const handleFollow = (followId: string) => {
    console.log(followId, "followee ID", user.id, "MY PROFILE ID", "HANDLEFOLLOW")
    followUser(followId, user.id )
    return navigate(`/profile/${followId}`)
  }

  console.log(followerList.data, "followerList")
for(let i = 0; i < followerList?.data?.length!; i++){
  if(followerList?.data?.[i].accountId == user.id && followerList?.data?.[i].followeeId === id){
    console.log("you follow THIS USER follows")
    userAlreadyFollowed = true
  }
}

  return (
    <div className="flex flex-col flex-1 items-center overflow-y-scroll py-10 px-5 md:p-14 custom-scrollbar">
      <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
        <div className="w-full flex justify-between">
          <div className="flex gap-6">
            <img
              src={userInfo?.imageUrl}
              className="rounded-full h-[115px] w-[115px]"
            />
            <div className="flex flex-col">
              <h2 className="h3-bold lg:h2-bold text-left w-full">
                {userInfo?.name}
              </h2>
              <p className="lg:small-regular subtle-semibold text-light-3">
                @{userInfo?.username}
              </p>
              <p className="mt-4">
                <span>
                  {!userInfo?.bio ? "No bio available." : userInfo?.bio}
                </span>
              </p>

              <div className="mt-5 flex items-end gap-4 small-regular">
                <p className="">
                  <span className="text-primary-500 text-md base-medium">
                    {userInfo?.posts.length}
                  </span>{" "}
                  Posts
                </p>
                <p>
                  <span className="text-primary-500 base-medium">
                    {followers}
                  </span>{" "}
                  Followers
                </p>
                <p>
                  <span className="text-primary-500 text-md base-medium">
                    {following}
                  </span>{" "}
                  Following
                </p>
              </div>
            </div>
          </div>

          <div>
            {userData?.data?.$id !== id ? (
              
                <Button
                  disabled={userAlreadyFollowed}
                  onClick={() => handleFollow(id as string)}
                  type="button"
                  className="h-10 bg-primary-500 px-8 text-light-1 flex gap-2 items-center justify-center !important subtle-semibold md:small-medium"
                >
                  Follow
                </Button>
              
            ) : (
              <Link to={`/update-profile/${userInfo?.$id}`}>
                <Button
                  type="button"
                  className={`h-10 bg-dark-4 px-5 text-light-1 flex gap-2 items-center !important subtle-semibold md:small-medium ${
                    userData?.data?.$id !== id && `hidden`
                  } `}
                >
                  <img src="/assets/icons/edit.svg" className="h-5 w-5" />
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex w-full mt-8">
          <Button
            type="button"
            className={`h-12 bg-dark-4 px-10 text-light-1 flex gap-2 rounded-md rounded-r-none items-center !important
             ${isLikedActive === true ? "opacity-50" : ""}`}
            onClick={() => {
              setIsPostsActive(true), setIsLikedActive(false);
            }}
          >
            <img src="/assets/icons/posts.svg" className="h-5 w-5" />
            Posts
          </Button>
          <Button
            type="button"
            className={`h-12 bg-dark-4 px-7 text-light-1 flex gap-2 rounded-md rounded-l-none items-center !important
             ${isPostsActive === true ? "opacity-50" : ""}`}
            onClick={() => {
              setIsPostsActive(false), setIsLikedActive(true);
            }}
          >
            <img src="/assets/icons/like.svg" className="h-5 w-5" />
            Liked Posts
          </Button>
        </div>

        {/* Posts */}
        <div className="flex w-full">
          {isPostsActive ? (
            <GridPostList posts={posts.documents} />
          ) : (
            <GridPostList posts={userInfo?.liked} showStats={false} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile