import { Lexend } from 'next/font/google';
import getConversations from '../actions/getConversations';
import ClientOnly from '../components/ClientOnly';
import MessengerSidebar from '../components/sidebar/MessengerSidebar';
import ConversationList from './components/ConversationList';
import getCurrentUser from '../actions/getCurrentUser';

const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700', '900']
});

export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {
  const conversations = await getConversations();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <ClientOnly>
      <title>Dormistory | Messenger</title>
      <MessengerSidebar>
        <div className={`h-[86vh] ml-[248px] ${lexend.className}`}>
          <ConversationList
            initialItems={conversations}
            currentUser={currentUser}
          />
          {children}
        </div>
      </MessengerSidebar>
    </ClientOnly>
  )
}