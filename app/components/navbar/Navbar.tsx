"use client";

import Container from '../Container';
import Logo from './Logo';
import Search from './Search';
import UserMenu from './UserMenu';
import { usePathname } from 'next/navigation';
import { SafeUser } from '@/app/types';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import { Bungee_Spice, Bungee_Tint } from 'next/font/google';


const bungeeTint = Bungee_Spice({ subsets: ["latin", "vietnamese"], weight: '400' });

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const pathname = usePathname();
  const is404Page = pathname !== '/';

  if (!is404Page) {
    return (
      <div className='fixed w-full bg-white z-10 shadow-md'>
        <div className='py-4 border-b-[1px]'>
          <Container>
            <div className='flex flex-row items-center justify-between gap-3 md:gap-0'>
              <Logo />
              {!currentUser && (
                <div className='w-4/5 flex items-center justify-start'>
                  <p className={`pl-2 text-6xl select-none ${bungeeTint.className}`}>DORMISTORY</p>
                </div>
              )}
              {currentUser && <Search />}
              {currentUser && <UserMenu currentUser={currentUser} />}
              {!currentUser && (
                <div>
                  <button
                    type='button' 
                    onClick={loginModal.onOpen} 
                    className="mr-6 px-6 py-3 text-lg font-semibold bg-blue-500 hover:bg-blue-400 text-white rounded-full"
                  >
                    Sign In
                  </button>
                  <button 
                    type='button' 
                    onClick={registerModal.onOpen} 
                    className="px-6 py-3 text-lg font-semibold bg-teal-500 hover:bg-teal-400 text-white rounded-full"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

export default Navbar;