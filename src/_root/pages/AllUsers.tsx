import Loader from "@/components/shared/Loader"
import UserCard from "@/components/shared/UserCard"
import { useGetCurrentUser, useGetUsers } from "@/lib/react-query/queries"


const AllUsers = () => {
  const { data: users} = useGetUsers()
  const userData = useGetCurrentUser()
  const userId = userData?.data?.$id;
  const tempUsers = users?.documents.filter((item) => item.$id !== userId)

  //console.log(tempUsers)
  
  if(!users && !tempUsers){
    return <Loader/>
  }

  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:p-14 custom-scrollbar">
      <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
        <h2 className="h3-bold md:h2-bold w-full">All Users</h2>
        <UserCard users={tempUsers!}/>
      </div>
    </div>
  )
}

export default AllUsers