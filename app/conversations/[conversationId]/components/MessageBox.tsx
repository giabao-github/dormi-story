"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { format } from 'date-fns';
import { parseBlob } from 'music-metadata';
import { PDFDocument } from 'pdf-lib';
import { BsDot } from 'react-icons/bs';
import { FaArrowUpRightFromSquare, FaArrowRightToBracket } from 'react-icons/fa6';
import ImageModal from './ImageModal';
import Avatar from '@/app/components/Avatar';
import { FullMessageType, SafeUser } from '@/app/types';
import useMetadata from '@/app/hooks/useMetadata';


interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
  currentUser?: SafeUser | null;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast, currentUser }) => {
  const router = useRouter();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [fileMetadata, setFileMetadata] = useState<{ [url: string]: any }>({});
  const audioMetadata = useMetadata();
  const documentMetadata = useMetadata();
  const [isSingleLine, setIsSingleLine] = useState(true);
  const messageRef = useRef<HTMLDivElement>(null);

  const detectFileType = (url: string): string => {
    const fileTypes: { [key: string]: string } = {
      // Image file extensions
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'bmp': 'image',
      'svg': 'image',
      'webp': 'image',
      // Audio file extensions
      'mp3': 'audio',
      'wav': 'audio',
      'flac': 'audio',
      'aac': 'audio',
      'ogg': 'audio',
      'm4a': 'audio',
      // Video file extensions
      'mp4': 'video',
      'avi': 'video',
      'mov': 'video',
      'wmv': 'video',
      'mkv': 'video',
      'flv': 'video',
      'webm': 'video',
      // Document file extensions
      'pdf': 'document',
      'doc': 'document',
      'docx': 'document',
      'ppt': 'document',
      'pptx': 'document',
      'xls': 'document',
      'xlsx': 'document',
      'txt': 'document',
      'csv': 'document',
    };

    const extensionMatch = url.split('.').pop()?.toLowerCase();

    // Match the extension to a file type
    if (extensionMatch && fileTypes[extensionMatch]) {
      return fileTypes[extensionMatch];
    }

    return 'unknown';
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  const getAudioVideoMetadata = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Network Issue');
      }

      const blob = await response.blob();
      const metadata = await parseBlob(blob);

      setFileMetadata((prev) => ({
        ...prev,
        [fileUrl]: {
          title: metadata.common.title || new URL(fileUrl).pathname.split('/').pop(),
          artist: metadata.common.artist || '',
          album: metadata.common.album || '',
          duration: metadata.format.duration || 0,
          type: 'audio',
        },
      }));
    } catch (error) {
      console.error('Error reading audio metadata:', error);
      return null;
    }
  };

  const getPdfMetadata = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      let title = pdfDoc.getTitle();
      if (!title || title.length === 0) {
        title = new URL(fileUrl).pathname.split('/').pop();
      }
      setFileMetadata((prev) => ({
        ...prev,
        [fileUrl]: {
          title,
          type: 'document',
        },
      }));
      return { title, type: 'document' };
    } catch (error) {
      console.error('Error reading document metadata:', error);
    }
  }

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const parseMessage = (message: string) => {
    const parts = [];
    let lastIndex = 0;

    let match;
    while ((match = urlRegex.exec(message)) !== null) {
      const url = match[0];
      const start = match.index;
      const end = urlRegex.lastIndex;
      if (start > lastIndex) {
        parts.push({ type: 'text', content: message.slice(lastIndex, start) });
      }
      parts.push({ type: 'link', content: url });
      lastIndex = end;
    }

    if (lastIndex < message.length) {
      parts.push({ type: 'text', content: message.slice(lastIndex) });
    }

    return parts;
  }

  const messageParts = parseMessage(data.body || '');
  const isOwn = currentUser?.email === data?.sender?.email;
  const seenList = (data.seen || [])
  .filter((user) => user.email !== data?.sender?.email)
  .map((user) => user.name)
  .join(', ');

  const container = clsx(
    'flex gap-3 p-4',
    isOwn && 'justify-end'
  );

  const avatar = clsx('h-8 w-8 aspect-square', isOwn && 'order-2');

  const body = clsx(
    'flex flex-col gap-2',
    isOwn && 'items-end'
  );

  const dataStyle = data.image && (detectFileType(data.image) === 'image' || detectFileType(data.image) === 'video') ? 'rounded-md p-0' : data.image && (detectFileType(data.image) === 'audio' || detectFileType(data.image) === 'document') ? 'p-0 bg-transparent' : isSingleLine ? 'rounded-full py-2 px-3 max-w-full' : 'rounded-2xl py-2 px-4 max-w-[70%]';

  const message = clsx(
    'text-sm w-fit overflow-hidden break-all whitespace-normal',
    isOwn ? 'bg-primary text-white' : 'bg-gray-200',
    data.body && isValidUrl(data.body) ? 'underline cursor-pointer' : '',
    dataStyle
  );

  useEffect(() => {
    const fetchMetadata = async () => {
      const fileType = detectFileType(data.image || '');
      if (fileType === 'audio' || fileType === 'video') {
        await getAudioVideoMetadata(data.image!);
      } else if (fileType === 'document') {
        const title = await getPdfMetadata(data.image!);
        if (!title) {
          setFileMetadata((prev) => ({
            ...prev,
            [data.image!]: {
              title: new URL(data.image!).pathname.split('/').pop(),
              type: 'document',
            },
          }));
        }
      }
    }
    if (data.image) {
      fetchMetadata();
    } 
  }, []);

  useEffect(() => {
    if (messageRef.current) {
      const element = messageRef.current;
      const lineHeight = element.getBoundingClientRect().height || 20;
      setIsSingleLine(lineHeight <= 20);
    }
  }, [data.body, data.image]); 


  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className='flex items-center gap-1'>
          <div className='text-sm text-gray-400'>
            {data.sender.name}
          </div>
          <BsDot className='text-gray-400' />
          <div className='text-xs text-gray-400'>
            {format(new Date(data.createdAt), 'p')}
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image && detectFileType(data.image) === 'image' && (
            <Image
              onClick={() => setImageModalOpen(true)}
              alt='Image'
              height={288}
              width={288}
              src={data.image}
              className='object-cover cursor-pointer hover:scale-110 transition translate'
            />
          )}
          {data.image && detectFileType(data.image) === 'audio' && (
            <div className='bg-neutral-200 p-4 rounded-2xl flex flex-col items-center space-y-3 max-w-prose'>
              {fileMetadata[data.image] && (
                <div 
                  className='text-base text-black font-semibold mx-4 max-w-[88%] overflow-hidden whitespace-nowrap relative'
                  ref={(element) => {
                    if (!element) return;
                    const content = element.querySelector('.content');
                    if (content && content.scrollWidth > element.offsetWidth) {
                      content.classList.add('animate-marquee');
                    } else if (content) {
                      content.classList.remove('animate-marquee');
                    }
                  }}
                >
                  <div className='inline-block content'>
                    {fileMetadata[data.image].title && fileMetadata[data.image].artist && <p>{`${fileMetadata[data.image].title} - ${fileMetadata[data.image].artist}`}</p>}
                    {fileMetadata[data.image].title && !fileMetadata[data.image].artist && <p>{`${fileMetadata[data.image].title}`}</p>}
                  </div>
                </div>
              )}
              <audio controls>
                <source src={data.image} type={`audio/${data.image.split('.').pop()}`} />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          {data.image && detectFileType(data.image) === 'video' && (
            <video controls className='max-w-full'>
              <source src={data.image} type={`video/${data.image.split('.').pop()}`} />
              Your browser does not support the video element.
            </video>
          )}
          {data.image && detectFileType(data.image) === 'document' && (
            <div className='bg-neutral-200 p-4 rounded-2xl flex flex-col justify-center items-center space-y-3 max-w-prose'>
              {fileMetadata[data.image] && (
                <div className='text-base text-black font-semibold truncate mx-4 max-w-[88%]'>
                  {fileMetadata[data.image].title && <p>{`${fileMetadata[data.image].title}`}</p>}
                </div>
              )}
              <div className='flex flex-row px-4 w-full min-w-40 justify-between items-center'>
                <a
                  href={data.image}
                  target='_blank'
                  title='Open document'
                  rel='noopener noreferrer'
                >
                  <div className='bg-white p-3 shadow-md rounded-full cursor-pointer hover:scale-105'>
                    <FaArrowUpRightFromSquare size={19} fontWeight={800} className='text-black' />
                  </div>
                </a>
                <a
                  href={data.image}
                  download
                  title='Download document'
                >
                  <div className='bg-white p-3 shadow-md rounded-full cursor-pointer hover:scale-105'>
                    <FaArrowRightToBracket size={20} className='text-black transform rotate-90' />
                  </div>
                </a>
              </div>
            </div>
          )}
          {data.image && detectFileType(data.image) === 'unknown' && (
            <div ref={messageRef}>
            {messageParts.map((part, index) =>
              part.type === 'text' ? (
                <span key={index}>{part.content}</span>
              ) : (
                <a
                  key={index}
                  href={part.content}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`underline ${isOwn ? 'hover:text-highlight' : 'hover:text-primary'}`}
                >
                  {part.content}
                </a>
              )
            )}
          </div>
          )}
          {!data.image && (
            <div ref={messageRef}>
              {messageParts.map((part, index) =>
                part.type === 'text' ? (
                  <span key={index}>{part.content}</span>
                ) : (
                  <a
                    key={index}
                    href={part.content}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`underline ${isOwn ? 'hover:text-highlight' : 'hover:text-primary'}`}
                  >
                    {part.content}
                  </a>
                )
              )}
            </div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className='mx-4 text-xs font-light text-gray-500'>
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBox;