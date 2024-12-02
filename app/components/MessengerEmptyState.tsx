const MessengerEmptyState = () => {
  return (
    <div className='px-4 py-10 sm:px-6 lg:px-8 h-full w-full min-h-[85vh] flex justify-center items-center bg-gray-200'>
      <div className='flex flex-col text-center items-center'>
        <h3 className='text-2xl font-semibold text-gray-900'>Select a chat or start a new conversation</h3>
      </div>
    </div>
  );
}

export default MessengerEmptyState;