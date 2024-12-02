import { Lexend } from 'next/font/google';
import getUsers from '../actions/getUsers';
import ClientOnly from '../components/ClientOnly';
import MessengerSidebar from '../components/sidebar/MessengerSidebar';
import UserList from './components/UserList';

const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700', '900']
});

export default async function MessengerLayout({ children } : { children: React.ReactNode }) {
  const users = await getUsers();

  return (
    <ClientOnly>
      <MessengerSidebar>
        <div className={`h-[86vh] ml-[248px] flex flex-col ${lexend.className}`}>
          <UserList items={users} />
          {children}
        </div>
      </MessengerSidebar>
    </ClientOnly>
  );
}