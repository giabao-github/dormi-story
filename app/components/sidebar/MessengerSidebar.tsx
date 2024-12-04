async function MessengerSidebar({ children } : { children: React.ReactNode }) {
  return (
    <div className='h-[86vh] w-[26vw] ml-[248px] mt-4 flex flex-row'>
      <main className='h-[86vh] w-[40vw] fixed bottom-0 left-0'>
        {children}
      </main>
    </div>
  );
}

export default MessengerSidebar;