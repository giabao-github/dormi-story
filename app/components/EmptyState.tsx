"use client";

import { useRouter } from 'next/navigation';
import Heading from './Heading';
import Button from './Button';
import useArticleModal from '../hooks/useArticleModal';
import useReportModal from '../hooks/useReportModal';
import useSurveyModal from '../hooks/useSurveyModal';
import useEventModal from '../hooks/useEventModal';

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
  buttonLabel = 'Reset filters',
  showReset
}) => {
  const router = useRouter();
  const articleModal = useArticleModal();
  const reportModal = useReportModal();
  const surveyModal = useSurveyModal();
  const eventModal = useEventModal();

  return (
    <div className='h-[60vh] ml-[241px] mt-20 flex justify-center items-center'>
      <div className='flex flex-col gap-3 justify-center items-center'>
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
              onClick={() => router.push('/')}
            />  
          )}
          {showReset && type === 'article' && (
            <Button
              outline
              label={buttonLabel}
              onClick={() => articleModal.onOpen()}
            />  
          )}
          {showReset && type === 'report' && (
            <Button
              outline
              label={buttonLabel}
              onClick={() => reportModal.onOpen()}
            />  
          )}
          {showReset && type === 'survey' && (
            <Button
              outline
              label={buttonLabel}
              onClick={() => surveyModal.onOpen()}
            />  
          )}
          {showReset && type === 'event' && (
            <Button
              outline
              label={buttonLabel}
              onClick={() => eventModal.onOpen()}
            />  
          )}
          {showReset && type === 'parking lot' && (
            <Button
              outline
              label={buttonLabel}
              onClick={() => eventModal.onOpen()}
            />  
          )}
        </div>
      </div>
    </div>
  );
}

export default EmptyState;