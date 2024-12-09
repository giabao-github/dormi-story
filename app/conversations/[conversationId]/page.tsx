import getConversationById from '@/app/actions/getConversationById';
import getMessages from '@/app/actions/getMessages';
import ChatEmptyState from '../components/ChatEmptyState';
import getCurrentUser from '@/app/actions/getCurrentUser';
import PageContent from './components/PageContent';

interface IParams {
  conversationId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
  const resolvedParams = await params;
  const currentUser = await getCurrentUser();
  const conversation = await getConversationById(resolvedParams.conversationId);
  const messages = await getMessages(resolvedParams.conversationId);

  if (!conversation || !messages) {
    return (
      <div className='h-full w-[60vw] lg:ml-[516px] absolute top-0'>
        <div className='h-full flex flex-col'>
          <ChatEmptyState />
        </div>
      </div>
    );
  }

  const safeUsers = conversation.users.map(user => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
  }));

  const fullConversation = {
    ...conversation,
    users: safeUsers,
    messages: messages,
  };

  return (
    <PageContent currentUser={currentUser} conversation={fullConversation} initialMessages={messages} />
  );
}

export default ConversationId;