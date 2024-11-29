"use client";

import { useRouter } from 'next/navigation';
import Heading from './Heading';
import Button from './Button';

interface EmptyStateProps {
  title? : string;
  subtitle?: string;
  showReset?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No exact matches',
  subtitle = 'Try changing some of your keywords',
  showReset
}) => {
  const router = useRouter();

  return (
    <div className='h-[60vh] ml-[241px] mt-20 flex justify-center items-center'>
      <div className='flex flex-col gap-3 justify-center items-center'>
        <Heading
          center
          title={title}
          subtitle={subtitle} 
        />
        <div className='w-48 mt-2 justify-center'>
          {showReset && (
            <Button
              outline
              label='Reset filters'
              onClick={() => router.push('/')}
            />  
          )}
        </div>
      </div>
    </div>
  );
}

export default EmptyState;