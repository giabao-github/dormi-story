import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import useConversation from './useConversation';
import { IoChatbubbleEllipses } from 'react-icons/io5';

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(() => [
    {
      label: 'Chat',
      href: '/conversations',
      icon: IoChatbubbleEllipses,
      active: pathname === '/conversations' || !!conversationId
    }
  ], [pathname, conversationId]);

  return routes;
}

export default useRoutes;