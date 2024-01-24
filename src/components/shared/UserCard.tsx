import { Models } from "appwrite"
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useFollowUser, useGetCurrentUser, useGetFollowers } from "@/lib/react-query/queries";

type userCardProps = {
    users: Models.Document[];
    style?: boolean;
}

const UserCard = ({users, style}: userCardProps) => {
  const userData = useGetCurrentUser()
  const { mutate: followUser } = useFollowUser();
  const id = userData?.data?.$id.toString();
  const followerList = useGetFollowers()
  const navigate = useNavigate()
  let disabledFollows: string[] = [];
  let userId = ''

  console.log(followerList.data)

  console.log(users, "HERE AT USER LIST")

if (id !== undefined) {
  userId = id;
}

const handleFollow = (followId: string) => {
  console.log(followId, "followeeId", "current USER ID", userId);
  followUser({ followId, userId });
  return navigate(`/profile/${followId}`);
};

for(let i = 0; i < followerList?.data?.length!; i++){
  if(followerList?.data?.[i].accountId == id){
    for(let j = 0; j < users?.length; j++){
      if(followerList?.data?.[i].followeeId == users[j].$id){
        disabledFollows.push(users[j].$id)
      }
    }
  }
}

  return (
    <div className={ style ? `grid 2xl:grid-cols-2 gap-6` : "w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7"}>
      {users.map((user) => (
        <li key={user.username} className='relative min-w-80'>
          <div className='flex flex-col items-center justify-center rounded-[24px] border border-dark-4 overflow-hidden cursor-pointer p-8'>
            <Link to={`/profile/${user.$id}`} className='flex flex-col items-center justify-center'>
              <img src={user.imageUrl} alt='profile' className="h-12 w-12 object-cover rounded-full"/>
              <h3 className="body-bold text-light-1 mt-4">{user.name}</h3>
              <p className="small-regular text-light-3 mt-2">@{user.username}</p>
            </Link>
            <Button onClick={() => handleFollow(user.$id)} disabled={disabledFollows.includes(user.$id) || user.$id == id}  
            className="mt-5 px-6 bg-primary-500 hover:bg-primary-500 text-light-1 flex gap-2 !important"
            >
              Follow
            </Button>
          </div>
        </li>
      ))}
    </div>
  )
}

export default UserCard
