import { useMemo } from 'react';
import { FullConversationType } from '../types';
import { SafeUser } from '../types';

const useOtherUser = (conversation: FullConversationType | { users: SafeUser[] }, currentUser: SafeUser | null) => {

  const otherUser = useMemo(() => {
    const currentUserEmail = currentUser?.email;

    const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail);

    return otherUser[0];
  }, [currentUser?.email, conversation.users]);

  return {
    ...otherUser,
    createdAt: otherUser.createdAt.toString(),
    updatedAt: otherUser.updatedAt.toString(),
    emailVerified: otherUser.emailVerified?.toString() || null,  
  };
}

export default useOtherUser;