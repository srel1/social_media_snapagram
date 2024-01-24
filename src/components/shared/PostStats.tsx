import * as React from "react";
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queries";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
//import Loader from "./Loader";

type PostStatsProps = {
    post: Models.Document;
    userId: string;
}

const PostStats = ({post, userId}: PostStatsProps) => {
    const likesList = post?.likes.map((user: Models.Document) => user.$id)

    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false);

    const { mutate: likePost } = useLikePost();
    const { mutate: savePost } = useSavePost();
    const { mutate: deleteSavedPost} = useDeleteSavedPost();

    const {data: currentUser} = useGetCurrentUser();

    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post?.$id)

    //console.log(currentUser, "on post stats")

    //console.log(userId, 'FROM POST DETAILS', post?.$id)
    
    //console.log(likes)

    useEffect(() => {
        setIsSaved(!!savedPostRecord)
    }, [currentUser])
    

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        let newLikes = [...likes]

        //const hasLiked = newLikes.includes(userId);

        if(newLikes.includes(userId)){
            newLikes = newLikes.filter((id) => id !== userId)
        }
        else{
            newLikes.push(userId);
        }
           
        
        likePost({ postId: post?.$id || '', likesArray: newLikes})
        setLikes(newLikes)
    }

    const handleSavePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.stopPropagation();

        if(savedPostRecord){
            setIsSaved(false)
            return deleteSavedPost(savedPostRecord.$id)
        } 
        setIsSaved(true)
        savePost({ userId: userId, postId: post.$id })     
    }

  return (
    <div className="flex items-center justify-between z-20">
        <div className="flex gap-2 mr-5">
            <img src={`${checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}`} 
                alt="like"
                height={20}
                width={20}
                className="cursor-pointer"
                onClick={handleLikePost}
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>

        <div className="flex gap-2">
            <img src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg" }
                alt="save"
                height={20}
                width={20}
                className="cursor-pointer"
                onClick={handleSavePost}
            />
        </div>
    </div>
  )
}

export default PostStats
