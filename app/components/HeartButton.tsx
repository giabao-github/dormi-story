"use client";

import { useState } from 'react';
import { SafeUser } from '../types';
import { PiHeart, PiHeartFill } from 'react-icons/pi';

interface HeartButtonProps {
  articleId: string;
  currentUser?: SafeUser | null;
}

const HeartButton: React.FC<HeartButtonProps> = ({ articleId, currentUser }) => {
  const [hasFavorite, setHasFavorite] = useState(false);
  const toggleHeart = () => {
    setHasFavorite(!hasFavorite);
  }

  return (
    <div
      onClick={toggleHeart}
      className='relative hover:opacity-80 transition cursor-pointer'
    >
      {hasFavorite ? 
        <PiHeartFill size={46} className='fill-rose-500' title='Unlike' /> :
        <PiHeart size={50} className='fill-primary' title='Like' />
      }
      
    </div>
  );
}

export default HeartButton;