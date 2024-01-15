import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetPostById } from "@/lib/react-query/queriesAndMutation";
import { multiFormatDateString } from "@/lib/utils";
import { Link, useParams } from "react-router-dom"


const PostDetails = () => {
  const { user } = useUserContext()
  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id || "")

  const handleDeletePost = () => {
    
  }


  return (
    <div className="flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar items-center">
      {isPending ? <Loader/> : (
        <div className="bg-dark-2 w-full max-w-5xl rounded-[30px] flex flex-col  xl:flex-row border border-dark-4 xl:rounded-l-[24px]">
          <img
            src={post?.imageUrl}
            alt="post-image"
            className="h-80 lg:h-[480px] xl:w-[48%] rounded-t-[30px] xl:rounded-l-[24px] xl:rounded-tr-none object-cover p-5 bg-dark-1"
          />

          <div className='bg-dark-2 flex flex-col gap-5 lg:gap-7 flex-1 items-start p-8 rounded-[30px]'>
            <div className="flex items-center justify-between w-full">
                <Link to={`/profile/${post?.creator.$id}`}
                  className='flex item-center gap-3'
                >
                    <img
                     src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                     alt='creator'
                     className='rounded-full w-12 lg:h-12'
                    />
                

                <div className='flex flex-col'>
                    <p className='base-medium lg:body-bold text-light-1'>
                        {post?.creator.name}
                    </p>
                    <div className='flex-center gap-2 text-light-3'>
                        <p className='subtle-semibold lg:small-regular'>
                            {multiFormatDateString(post?.$createdAt)}
                        </p>
                        -
                        <p className='subtle-semibold lg:small-regular'>
                            {post?.location}
                        </p>
                    </div>
                </div>
              </Link>
              <div className="flex items-center justify-center gap-1">
                <Link to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && 'hidden'}`}
                >
                  <img src="/assets/icons/edit.svg"
                    alt="edit"
                    width={20}
                    height={20}
                    className='w-6 h-6 lg:w-8 lg:h-8'
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant='ghost'
                  className={`ghost_details-delete_btn ${user.id !== post?.creator.$id && 'hidden'}`}
                >
                  <img 
                    src="/assets/icons/delete.svg"
                    alt='delete'
                    height={20}
                    width={20}
                    className='w-6 h-6 lg:w-8 lg:h-8'
                    />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80"/>

            <div className='flex flex-col flex-1 w-full small-medium lg:base-regular'>
                <p>{post?.caption}</p>
                <ul className='flex gap-1 mt-2'>
                    {post?.tags.map((tag: string) => 
                        <li key={tag} className='text-light-3'>
                            #{tag}
                        </li>
                    )}
                </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id}/>
            </div>
            
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails