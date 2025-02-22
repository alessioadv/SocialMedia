import { getRandomUsers } from "@/actions/user.action";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import Link from "next/link";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
// import { CheckCircle } from "lucide-react"; // Icona per utenti verificati
import FollowButton from "./FollowButton";

async function WhoToFollow() {
  const users = await getRandomUsers();

  if (users.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who to Follow</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {users.map((user) => (
          <div
            key={user.id}
            className='flex items-center justify-between gap-4'
          >
            {/* Avatar e info utente */}
            <div className='flex items-center gap-3'>
              <Link href={`/profile/${user.username}`}>
                <Avatar className='w-4 h-4'>
                  <AvatarImage
                    src={user.image ?? "/avatar.png"}
                    className='rounded-full'
                  />
                </Avatar>
              </Link>

              <div className='text-sm'>
                <Link
                  href={`/profile/${user.username}`}
                  className='font-medium flex items-center gap-1 truncate'
                >
                  {user.name}
                  {/* {user.isVerified && (
                    <CheckCircle className='w-4 h-4 text-blue-500' />
                  )} */}
                  {/* Icona verifica */}
                </Link>
                <p className='text-muted-foreground text-xs truncate'>
                  @{user.username}
                </p>
                <p className='text-muted-foreground text-xs'>
                  {user._count.followers} followers
                </p>
              </div>
            </div>

            <FollowButton userId={user.id} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default WhoToFollow;
