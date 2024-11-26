"use client";

import { IoMenu } from 'react-icons/io5';
import Avatar from '../Avatar';
import { useCallback, useState } from 'react';
import MenuItem from './MenuItem';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { SafeUser } from '@/app/types';


interface UserMenuProps {
  currentUser?: SafeUser | null; 
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const pathname = usePathname();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);


  return (
    <div className='relative'>
      <div className='flex flex-row items-center gap-3'>
        <div
          onClick={() => {}}
          className='hidden md:block border-black border-[1px] text-base font-semibold py-2 px-4 rounded-full hover:bg-rose-100 transition cursor-pointer'
        >
          Username
        </div>
        <div
          onClick={toggleOpen}
          className='p-3 md:py-2 md:px-3 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition'
        >
          <IoMenu size={24} />
          <div className='hidden md:block'>
            <Avatar user={currentUser} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className='absolute rounded-xl border-[1px] shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-14 text-sm'>
          <div className='flex flex-col cursor-pointer'>
            {currentUser ? (
              <>
                <div className='cursor-default'>
                  <MenuItem label={currentUser.name} />
                </div>
                <hr />
                <MenuItem
                  onClick={() => {}}
                  label='My account'
                />
                <MenuItem
                  onClick={() => {}}
                  label='My report'
                />
                <hr />
                <MenuItem
                  onClick={() => {
                    signOut({ callbackUrl: `http://localhost:3100${pathname}` });
                    toast.remove();
                    toast.success('Logged out');
                  }}
                  label='Log out'
                />
              </>
            ) : (
              <>
                <MenuItem
                  onClick={loginModal.onOpen}
                  label='Log in'
                />
                <MenuItem
                  onClick={registerModal.onOpen}
                  label='Sign up'
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;