"use client"

import { MdGroups } from 'react-icons/md';
import { BsChatFill } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';


const MessengerTab = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className='h-[8%] flex flex-row'>
      <div className='flex justify-center items-center w-1/2'>
        <MdGroups 
          size={34}
          className={`${pathname === '/messenger' ? 'text-primary' : 'text-neutral-300 hover:text-primary/70'} cursor-pointer`}
          onClick={() => {
            if (pathname !== '/messenger') {
              router.push('/messenger');
            }
          }}
        />
      </div>
      <div className='flex justify-center items-center w-1/2'>
        <BsChatFill 
          size={24}
          className={`${pathname === '/conversations' || pathname?.includes('/conversations/') ? 'text-primary' : 'text-neutral-300 hover:text-primary/70'} cursor-pointer`}
          onClick={() => {
            if (pathname !== '/conversations' || !pathname?.includes('/conversations/')) {
              router.push('/conversations');
            }
          }}
        />
      </div>
    </div>
  );
}

export default MessengerTab;