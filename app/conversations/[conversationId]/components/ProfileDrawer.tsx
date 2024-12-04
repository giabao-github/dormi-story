"use client";

import { Fragment, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FaTrashCan } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { Conversation } from '@prisma/client';
import useOtherUser from '@/app/hooks/useOtherUser';
import { SafeUser } from '@/app/types';
import Avatar from '@/app/components/Avatar';
import { Lexend } from 'next/font/google';
import ConfirmModal from './ConfirmModal';
import GroupAvatar from '@/app/components/GroupAvatar';


const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700', '900']
});

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: SafeUser[];
  }
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose, data }) => {
  const otherUser = useOtherUser(data);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), 'PP');
  }, [otherUser.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }

    return 'Active';
  }, [data]);

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <Transition show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={onClose}>
          <TransitionChild 
            as={Fragment}
            enter='ease-out duration-500' 
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-500'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/40'/>
          </TransitionChild>
          <div className={`fixed inset-0 overflow-hidden ${lexend.className}`}>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
                <TransitionChild
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500'
                  enterFrom='translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500'
                  leaveTo='translate-x-full'
                >
                  <DialogPanel
                    className='pointer-events-auto w-screen max-w-md'
                  >
                    <div className='flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl'>
                      <div className='px-4 sm:px-6'>
                        <div className='flex items-start justify-end'>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              onClick={onClose}
                              type='button'
                              className='rounded-full bg-white text-gray-400 hover:text-gray-700 focus:outline-none'
                            >
                              <span className='sr-only'>Close panel</span>
                              <IoClose size={24} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                        <div className='flex flex-col items-center'>
                          <div className='mb-2'>
                            {data.isGroup ? (
                              <GroupAvatar users={data.users} />
                            ) : (
                              <Avatar user={otherUser} type='panel' />
                            )}
                          </div>
                          <div>{title}</div>
                          <div className='text-sm text-gray-500'>{statusText}</div>
                          <div className='flex gap-10 my-12'>
                            <div
                              onClick={() => setConfirmOpen(true)}
                              className='flex flex-col gap-3 items-center cursor-pointer text-red-500 hover:opacity-80'
                            >
                              <div className='w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center'>
                                <FaTrashCan size={18} />
                              </div>
                              <div className='text-sm font-medium'>
                                Delete
                              </div>
                            </div>
                          </div>
                          <div className='w-full py-5 sm:px-0 sm:pt-0'>
                            <dl className='space-y-8 px-4 sm:space-y-6 sm:px-6'>
                              {data.isGroup && (
                                <div>
                                  <dt className='text-base mb-4 font-medium text-gray-600 sm:w-40 sm:flex-shrink-0'>
                                    Emails
                                  </dt>
                                  <dd className='mt-1 text-sm leading-8 text-gray-900 sm:col-span-2'>
                                    {data.users.map((user) => user.email).join('\n')}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <div>
                                  <dt className='text-base font-medium text-gray-600 sm:w-40 sm:flex-shrink-0'>
                                    Email
                                  </dt>
                                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                                    {otherUser.email}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <>
                                  <hr />
                                  <div>
                                    <dt className='text-base font-medium text-gray-600 sm:w-40 sm:flex-shrink-0'>
                                      Joined
                                    </dt>
                                    <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                                      <time dateTime={joinedDate}>
                                        {joinedDate}
                                      </time>
                                    </dd>
                                  </div>
                                </>
                              )}
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default ProfileDrawer;