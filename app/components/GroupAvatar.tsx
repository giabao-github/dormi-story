"use client";

import Image from "next/image";
import { SafeUser } from "../types";

interface GroupAvatarProps {
  users: SafeUser[];
}

const GroupAvatar: React.FC<GroupAvatarProps> = ({ users = [] }) => {
  const slicedUsers = users.slice(0, 3);

  const positionMap = {
    0: 'top-0 left-[17px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  }

  const getAbbreviation = (name: string) => {
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  return (
    <div className='relative h-16 w-16'>
      {slicedUsers.map((user, index) => (
        <div
          key={user.id}
          className={`absolute inline-block rounded-full overflow-hidden h-[30px] w-[30px] ${positionMap[index as keyof typeof positionMap]}`}
        >
          {user.image ? (
            <Image
              alt={user.name}
              fill
              src={user.image}
            />
          ) : (
            <div className='bg-button w-full h-full flex items-center justify-center text-white text-xs font-semibold select-none'>
              {getAbbreviation(user.name)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default GroupAvatar;