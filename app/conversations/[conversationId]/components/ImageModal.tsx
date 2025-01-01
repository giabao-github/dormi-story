"use client";

import MessengerModal from "@/app/components/modals/MessengerModal";
import Image from "next/image";

interface ImageModalProps {
  src?: string | null;
  isOpen?: boolean;
  onClose: () => void;
  type?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, isOpen, onClose, type }) => {
  if (!src) {
    return null;
  }

  return (
    <MessengerModal isOpen={isOpen} onClose={onClose}>
      {type === 'parking' ? (
        <Image
          alt='Image'
          src={src}
          layout='intrinsic' 
          width={0}
          height={0}
          sizes='100vw'
          className='w-auto h-auto max-w-full max-h-full object-cover mx-auto mt-6'
        />
      ) : (
        <div className={'w-80 h-80'}>
          <Image
            alt='Image'
            src={src}
            fill
            className='object-cover'
          />
        </div>
      )}
    </MessengerModal>
  );
}

export default ImageModal;