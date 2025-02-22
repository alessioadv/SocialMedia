import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./button";
import { getUserByClerkId } from "@/actions/user.action";
import Link from "next/link";
import { Avatar, AvatarImage } from "./avatar";
import { Separator } from "./separator";
import { LinkIcon, MapPinIcon } from "lucide-react";

async function Sidebar() {
  const authUser = await currentUser();

  if (!authUser) return <UnAuthenticatedSidebar />;

  //Get
  const user = await getUserByClerkId(authUser.id);

  if (!user) return null;

  //Info User
  console.log({ user });

  return (
    <div className='sticky top-20'>
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col item-center text-center'>
            <Link
              href={`/profile/${user.username}`}
              className='flex flex-col items-center justify-center'
            >
              <Avatar className='w-20 h-20 border-2 hover:animate-pulse'>
                <AvatarImage src={user.image || "/avatar.png"}></AvatarImage>
              </Avatar>

              <div className='mt-4 space-x-1'>
                <h3 className='font-semibold'>{user.name}</h3>
                <p className='text-sm text-muted-foreground'>{user.username}</p>
              </div>
            </Link>

            {user.bio && (
              <p className='mt-3 text-sm text-muted-foreground'>{user.bio}</p>
            )}

            <div className='w-full'>
              <Separator className='mt-4' />
              <div className='flex justify-between'>
                <div>
                  <p className='font-medium'>{user._count.following}</p>
                  <p className='text-xs text-muted-foreground'>Following</p>
                </div>
                <Separator orientation='vertical' />
                <div>
                  <p className='font-medium'>{user._count.followers}</p>
                  <p className='text-xs text-muted-foreground'>Followers</p>
                </div>
              </div>
              <Separator className='mt-4' />
            </div>

            <div className='w-full space-y-2 text-sm mt-2'>
              <div className='flex items-center text-muted-foreground'>
                <MapPinIcon className='w-4 h-4 mr-2' />
                {user.location || "No Location"}
              </div>
              <div className='flex items-center text-muted-foreground'>
                <LinkIcon className='w-4 h-4 mr-2' />
                {user.website ? (
                  <a
                    href={`${user.website}`}
                    className='hover:underline truncate'
                    target='_blank'
                  >
                    {user.website}
                  </a>
                ) : (
                  "No Website"
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Sidebar;

const UnAuthenticatedSidebar = () => (
  <div className='sticky top-20'>
    <Card>
      <CardHeader>
        <CardTitle className='text-center txt-xl font-semibold'>
          Welcome Back!
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className='text-center text-muted-foreground mb-4'>
          Login to access your profile and connect with others.
        </p>
        <SignInButton mode='modal'>
          <Button className='w-full' variant='outline'>
            Login
          </Button>
        </SignInButton>
        <SignUpButton mode='modal'>
          <Button className='w-full' variant='outline'>
            Sign Up
          </Button>
        </SignUpButton>
      </CardContent>
    </Card>
  </div>
);
