import { Lexend } from 'next/font/google';
import ClientOnly from '../components/ClientOnly';
import MessengerSidebar from '../components/sidebar/MessengerSidebar';
import UserList from './components/UserList';
import getCurrentUser from '../actions/getCurrentUser';
import MessengerTab from '../components/MessengerTab';
import getAllUsers from '../actions/getAllUsers';
import getFriendsByUserId from '../actions/getFriendsByUserId';
import { getSentFriendRequests } from '../actions/getSentFriendRequests';
import { getReceivedFriendRequests } from '../actions/getReceivedFriendRequests';


const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700', '900']
});

export default async function MessengerLayout({ children } : { children: React.ReactNode }) {
  const allUsers = await getAllUsers();
  const currentUser = await getCurrentUser();
  const sentRequests = await getSentFriendRequests(currentUser?.id || '');
  const receivedRequests = await getReceivedFriendRequests(currentUser?.id || '');
  const friendList = await getFriendsByUserId();

  if (!currentUser) {
    return null;
  }

  return (
    <ClientOnly>
      <MessengerSidebar>
        <div className={`h-[86vh] ml-[248px] flex flex-col justify-between ${lexend.className}`}>
          <UserList currentUser={currentUser} sentRequests={sentRequests} friendList={friendList} allUsers={allUsers} />
          <MessengerTab />
          {children}
        </div>
      </MessengerSidebar>
    </ClientOnly>
  );
}