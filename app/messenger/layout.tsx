import { Lexend } from 'next/font/google';
import getUsers from '../actions/getUsers';
import ClientOnly from '../components/ClientOnly';
import MessengerSidebar from '../components/sidebar/MessengerSidebar';
import UserList from './components/UserList';
import getCurrentUser from '../actions/getCurrentUser';
import MessengerTab from '../components/MessengerTab';


const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700', '900']
});

export default async function MessengerLayout({ children } : { children: React.ReactNode }) {
  const users = await getUsers();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <ClientOnly>
      <MessengerSidebar>
        <div className={`h-[86vh] ml-[248px] flex flex-col justify-between ${lexend.className}`}>
          <UserList items={users} />
          <MessengerTab />
          {children}
        </div>
      </MessengerSidebar>
    </ClientOnly>
  );
}