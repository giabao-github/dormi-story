"use client";

import { IoMenu } from 'react-icons/io5';
import Avatar from '../Avatar';
import { useCallback, useEffect, useRef, useState } from 'react';
import MenuItem from './MenuItem';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import useTokenModal from '@/app/hooks/useTokenModal';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { SafeUser } from '@/app/types';
import { MdOutlineToken } from 'react-icons/md';
import useReportModal from '@/app/hooks/useReportModal';
import useArticleModal from '@/app/hooks/useArticleModal';
import useProfileModal from '@/app/hooks/useProfileModal';
import ProfileModal from '../modals/ProfileModal';
import useSurveyModal from '@/app/hooks/useSurveyModal';
import useEventModal from '@/app/hooks/useEventModal';
import useRequestsModal from '@/app/hooks/useRequestsModal';
import useBuildingModal from '@/app/hooks/useBuildingModal';


interface UserMenuProps {
  currentUser?: SafeUser | null; 
  notification: number;
}

const adminAccounts = ['ITITIU13579@student.hcmiu.edu.vn'];

const UserMenu: React.FC<UserMenuProps> = ({ currentUser, notification }) => {
  const pathname = usePathname();
  const loginModal = useLoginModal();
  const profileModal = useProfileModal();
  const registerModal = useRegisterModal();
  const tokenModal = useTokenModal();
  const reportModal = useReportModal();
  const articleModal = useArticleModal();
  const surveyModal = useSurveyModal();
  const eventModal = useEventModal();
  const buildingModal = useBuildingModal();
  const requestsModal = useRequestsModal();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); 
  const menuItemRef = useRef<HTMLDivElement>(null); 

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const handleProfileModal = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    profileModal.onOpen();
  }, [currentUser, loginModal, profileModal]);

  const handleMessengerToken = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    tokenModal.onOpen();
  }, [currentUser, loginModal, tokenModal]);

  const handleReportModal = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    reportModal.onOpen();
  }, [currentUser, loginModal, reportModal]);

  const handleArticleModal = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    articleModal.onOpen();
  }, [currentUser, loginModal, articleModal]);

  const handleSurveyModal = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    surveyModal.onOpen();
  }, [currentUser, loginModal, surveyModal]);

  const handleEventModal = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    eventModal.onOpen();
  }, [currentUser, loginModal, eventModal]);

  const handleBuildingModal = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    buildingModal.onOpen();
  }, [currentUser, loginModal, buildingModal]);

  const handleRequestsModal = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    requestsModal.onOpen();
  }, [currentUser, loginModal, requestsModal]);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node) && menuItemRef.current && !menuItemRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuItemRef} className='relative'>
      <ProfileModal currentUser={currentUser} isOpen={profileModal.isOpen} onClose={profileModal.onClose} />
      <div className='flex flex-row items-center gap-3'>
        <div
          onClick={handleMessengerToken}
          className='hidden md:block border-black border-[1px] text-base font-semibold py-2 px-4 rounded-full hover:bg-highlight transition cursor-pointer'
        >
          <div className='flex flex-row select-none'>
            <MdOutlineToken size={24} className='mr-3' />
            Messenger Token
          </div>
        </div>
        <div
          onClick={toggleOpen}
          className='p-3 md:py-2 md:px-3 border-[1px] border-neutral-300 bg-highlight flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition'
        >
          <IoMenu size={24} />
          <div className='hidden md:block'>
            <Avatar user={currentUser} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div ref={menuRef} className='absolute rounded-xl border-[1px] shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-14 text-sm'>
          <div className='flex flex-col cursor-pointer select-none'>
            {currentUser ? (
              <>
                <div className={`cursor-default select-text mx-2`}>
                  <MenuItem label={currentUser.name} />
                </div>
                <hr />
                <MenuItem
                  onClick={handleProfileModal}
                  label='Edit Profile'
                />
                <MenuItem
                  onClick={handleReportModal}
                  label='Submit A Report'
                />
                <MenuItem
                  onClick={handleSurveyModal}
                  label='Create A Survey'
                />
                <MenuItem
                  onClick={handleEventModal}
                  label='Schedule An Event'
                />
                {currentUser.email && adminAccounts.includes(currentUser.email) && (
                  <>
                    <MenuItem
                      onClick={handleArticleModal}
                      label='Post An Article'
                    />
                    <MenuItem
                      onClick={handleBuildingModal}
                      label='Create A Building'
                    />
                  </>
                )}
                <MenuItem
                  onClick={handleRequestsModal}
                  label='Friend Requests'
                  notification={notification}
                />
                <hr />
                <MenuItem
                  onClick={() => {
                    signOut({ callbackUrl: `http://localhost:3100${pathname}` });
                    if (!currentUser) {
                      toast.remove();
                      toast.success('Logged out');
                    }
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