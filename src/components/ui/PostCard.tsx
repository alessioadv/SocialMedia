"use client";

import {
  getPosts,
  toggleLike,
  createComment,
  deletePost
} from "@/actions/post.action";
import { SignInButton, useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./card";
import Link from "next/link";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";

import Image from "next/image";
import { Button } from "./button";
import { HeartIcon, MessageCircleIcon, SendIcon } from "lucide-react";
import { Textarea } from "./textarea";
import { DeleteAlertDialog } from "./DeleteAlertDialog";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostCard({ post, dbUserId }: { post: Post; dbUserId: string | null }) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId)
  );
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const [isOpen, setIsOpen] = useState(false);
  // const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      setOptimisticLikes(post._count.likes);
      setHasLiked(post.likes.some((like) => like.userId === dbUserId));
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return;

    try {
      setIsCommenting(true);
      const response = await createComment(post.id, newComment);
      if (response?.success) {
        toast.success("Comment posted successfully");
        setNewComment("");
      }
    } catch (error) {
      toast.error("Failed to add comment");
      console.error("Failed to add comment:", error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      const response = await deletePost(post.id);
      if (response.success) toast.success("Post deleted successfully");
      else if (!response.success) throw new Error(response.error);
    } catch (error) {
      console.error("Failed to delete post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {post.authorId === dbUserId && (
        <Card className='overflow-hidden shadow-md'>
          <CardContent className='p-4 sm:p-6'>
            {/* Post Content */}
            <div className='space-y-4'>
              <div className='flex space-x-3 sm:space-x-4'>
                <Link href={`/profile/${post.author.username}`}>
                  <Avatar className='size-8 sm:w-10 sm:h-10'>
                    <AvatarImage
                      alt='Profile'
                      src={post.author.image ?? "/avatar.png"}
                      className='w-10 h-10 rounded-full'
                    />
                  </Avatar>
                </Link>
              </div>

              {/* POST HEADER & POST CONTENT */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-start justify-between'>
                  <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate'>
                    <Link
                      href={`/profile/${post.author.username}`}
                      className='font-semibold truncate'
                    >
                      {post.author.name}
                    </Link>

                    <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
                      <Link href={`/profile/${post.author.username}`}>
                        @{post.author.username}
                      </Link>
                      <span>-</span>
                      <p className='text-sm text-gray-500'>
                        {formatDistanceToNow(new Date(post.createdAt))} ago
                      </p>
                    </div>
                  </div>

                  {/* ICONA DELETE */}
                  {dbUserId === post.author.id && (
                    <DeleteAlertDialog
                      isDeleting={isDeleting}
                      onDelete={handleDeletePost}
                    />
                  )}
                </div>

                {/* CONTENUTO DEL POST */}
                <p className='mt-2 text-sm text-foreground break-words'>
                  {post.content}
                </p>
              </div>

              {/* POST IMAGE */}
              {post.image && (
                <div className='rounded-lg overflow-hidden'>
                  <Image
                    src={post.image}
                    alt='Post Content'
                    className='w-full h-auto object-cover'
                  />
                </div>
              )}

              {/* LIKES AND COMMENTS */}
              <div className='flex items-center pt-2 space-x-2'>
                {user ? (
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className={`text-muted-foreground gap-2 ${
                      hasLiked
                        ? "text-red-500 hover:text-red-600"
                        : "hover:text-red-500"
                    }`}
                    onClick={handleLike}
                  >
                    {hasLiked ? (
                      <HeartIcon className='size-5 fill-current' />
                    ) : (
                      <HeartIcon className='size-5' />
                    )}
                    <span>{optimisticLikes}</span>
                  </Button>
                ) : (
                  <SignInButton mode='modal'>
                    <Button
                      variant={"ghost"}
                      size={"sm"}
                      className='text-muted-foreground gap-2'
                    >
                      <HeartIcon className='size-5' />
                      <span>{optimisticLikes}</span>
                    </Button>
                  </SignInButton>
                )}

                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className='text-muted-foreground gap-2 hover:text-blue-500'
                  onClick={() => setShowComments((prev) => !prev)}
                >
                  <MessageCircleIcon
                    className={`size-5 ${
                      showComments ? "fill-blue-500 text-blue-500" : ""
                    }`}
                  />
                  <span>{post.comments.length}</span>
                </Button>
              </div>

              {/* COMMENTS SECTIONS */}
              {showComments && (
                <div className='space-y-4 pt-4 border-t'>
                  <div className='space-4'>
                    {/* DISPLAY COMMENT */}
                    {post.comments.map((comment) => (
                      <div key={comment.id} className='flex space-x-3'>
                        <Avatar className='size-8 flex-8 flex-shrink-0'>
                          <AvatarImage
                            src={comment.author.image ?? "/avatar.png"}
                          />
                        </Avatar>

                        <div className='flex-1 min-w-0'>
                          <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                            <span className='font-medium text-sm'>
                              {comment.author.name}
                            </span>
                            <span className='font-medium text-muted-foreground'>
                              {comment.author.username}
                            </span>
                            <span className='font-medium text-muted-foreground'>
                              -
                            </span>
                            <span className='font-medium text-muted-foreground'>
                              {formatDistanceToNow(new Date(comment.createdAt))}{" "}
                              ago
                            </span>
                          </div>
                          <p className='text-sm break-work'>
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {user && (
                    <div className='flex space-x-3'>
                      <Avatar className='size-8 flex-shrink-0'>
                        <AvatarImage src={user?.imageUrl || "avatar.png"} />
                      </Avatar>

                      <div className='flex-1'>
                        <Textarea
                          placeholder='Write a comment...'
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className='min-h-[80px] resize-none'
                        />

                        <div className='flex justify-end mt-2'>
                          <Button
                            size={"sm"}
                            onClick={handleAddComment}
                            className='flex items-center gap-2'
                            disabled={!newComment.trim() || isCommenting}
                          >
                            {isCommenting ? (
                              "Posting..."
                            ) : (
                              <>
                                <SendIcon className='size-4' />
                                Comment
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default PostCard;
