import { Lexend } from 'next/font/google';
import getConversations from '../actions/getConversations';
import ClientOnly from '../components/ClientOnly';
import MessengerSidebar from '../components/sidebar/MessengerSidebar';
import ConversationList from './components/ConversationList';
import getCurrentUser from '../actions/getCurrentUser';
import getUsers from '../actions/getUsers';
import MessengerTab from '../components/MessengerTab';

const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700', '900']
});

export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  const conversations = await getConversations();
  const users = await getUsers();

  if (!currentUser) {
    return null;
  }

  return (
    <ClientOnly>
      <title>Dormistory | Messenger</title>
      <MessengerSidebar>
        <div className={`h-[86vh] ml-[248px] flex flex-col justify-between ${lexend.className}`}>
          <ConversationList
            currentUser={currentUser}
            users={users}
            initialItems={conversations}
          />
          <MessengerTab />
          {children}
        </div>
      </MessengerSidebar>
    </ClientOnly>
  )
}