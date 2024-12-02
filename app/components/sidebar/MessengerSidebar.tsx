import getCurrentUser from '@/app/actions/getCurrentUser';

async function MessengerSidebar({ children } : { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  return (
    <div className='h-[86vh] w-[27vw] ml-[250px] mt-4 flex flex-row'>
      <main className='h-[86vh] w-[40vw] fixed bottom-0 left-0'>
        {children}
      </main>
    </div>
  );
}

export default MessengerSidebar;