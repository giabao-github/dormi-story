"use client";

import { useRouter } from 'next/navigation';
import Heading from './Heading';
import Button from './Button';
import useSearchResult from '../hooks/useSearchResult';


interface EmptyStateProps {
  title? : string;
  subtitle?: string;
  type?: string;
  buttonLabel?: string;
  showReset?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No exact matches',
  subtitle = 'Try changing some of your keywords',
  type,
  buttonLabel = 'Reset all filters',
  showReset
}) => {
  const router = useRouter();
  const searchResult = useSearchResult();

  return (
    <div className='h-[60vh] ml-[241px] mt-20 flex justify-center items-center'>
      <div className='flex flex-col gap-3 max-w-[80%] justify-center items-center'>
        <Heading
          center
          title={title}
          subtitle={subtitle} 
        />
        <div className='w-48 mt-2 justify-center'>
          {showReset && !type && (
            <Button
              outline
              label={buttonLabel}
              onClick={() => {
                searchResult.offFilter();
                router.push('/');
              }}
            />  
          )}
          {showReset && type === 'article' && (
            <Button
              outline
              label={buttonLabel}
              onClick={() => {
                searchResult.offFilter();
                router.push('/articles');
              }}
            />  
          )}
          {showReset && type === 'report' && (
            <Button
              outline
              label={buttonLabel}
              onClick={() => {
                searchResult.offFilter();
                router.push('/reports');
              }}
            />  
          )}
          {showReset && type === 'survey' && (
            <Button
              outline
              label={buttonLabel}
              onClick={() => {
                searchResult.offFilter();
                router.push('/surveys');
              }}
            />  
          )}
          {showReset && type === 'event' && (
            <Button
              outline
              label={buttonLabel}
              onClick={() => {
                searchResult.offFilter();
                router.push('/events');
              }}
            />  
          )}
          {showReset && type === 'parking lot' && (
            <Button
              outline
              label={buttonLabel}
              onClick={() => {
                searchResult.offFilter();
                router.push('/parking-lot-registration');
              }}
            />  
          )}
        </div>
      </div>
    </div>
  );
}

export default EmptyState;