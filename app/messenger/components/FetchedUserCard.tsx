"use client";

import Avatar from "@/app/components/Avatar";
import { SafeUser } from "@/app/types";

interface FetchedUserCardProps {
  currentUser: SafeUser;
  user: SafeUser | undefined;
  matchedEmail: boolean;
}

const FetchedUserCard: React.FC<FetchedUserCardProps> = ({ 
  currentUser, 
  user, 
  matchedEmail
}) => {
  if (!user && !matchedEmail) {
    return (
      <div className='mx-2 bg-neutral-100 rounded-md flex flex-row gap-x-5 px-4 py-3'>
        <p className='text-base text-button'>No user found</p>
      </div>
    );
  } else if (!user && matchedEmail) {
    return (
      <div className='mx-2 bg-neutral-100 rounded-md flex flex-row gap-x-5 px-4 py-3'>
        <p className='text-base text-button'>Incorrect Messenger token</p>
      </div>
    );
  } else if (user) {
    const displayedName = user.name.length > 30 ? user.name.slice(0, 30) + '...' : user.name;
  
    return (
      <div className='mx-2 bg-neutral-100 rounded-md flex flex-row gap-x-5 p-4'>
        <Avatar user={user} />
        <div className='font-semibold text-lg'>{user.id === currentUser.id ? `${displayedName} (You)` : displayedName}</div>
      </div>
    );
  }
};

export default FetchedUserCard;
