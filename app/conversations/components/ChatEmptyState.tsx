"use client";

import Heading from '@/app/components/Heading';
import { useRouter } from 'next/navigation';


interface ChatEmptyStateProps {
  title? : string;
  subtitle?: string;
}

const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  title = 'No conversation',
  subtitle = "Say 'Hello' to start a conversation",
}) => {
  return (
    <div className='h-[60vh] ml-[241px] mt-20 flex justify-center items-center'>
      <div className='flex flex-col gap-3 justify-center items-center'>
        <Heading
          center
          title={title}
          subtitle={subtitle} 
        />
      </div>
    </div>
  );
}

export default ChatEmptyState;