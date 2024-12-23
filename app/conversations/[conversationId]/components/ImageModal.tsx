"use client";

import MessengerModal from "@/app/components/modals/MessengerModal";
import Image from "next/image";

interface ImageModalProps {
  src?: string | null;
  isOpen?: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, isOpen, onClose }) => {
  if (!src) {
    return null;
  }

  return (
    <MessengerModal isOpen={isOpen} onClose={onClose}>
      <div className='w-80 h-80'>
        <Image
          alt='Image'
          src={src}
          fill
          className='object-cover'
        />
      </div>
    </MessengerModal>
  );
}

export default ImageModal;