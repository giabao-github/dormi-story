"use client";

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';


interface ImageType {
  src: string;
  alt: string;
  title: string;
}

const PageContent = () => {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const images = [
    {
      id: 1,
      src: 'https://tuyensinh.uel.edu.vn/wp-content/uploads/2023/05/Anh-chup-Man-hinh-2023-05-18-luc-15.12.14.png',
      alt: 'Dormitory Zone B - Close View',
      title: 'Dormitory Zone B - Close View'
    },
    {
      id: 2,
      src: 'https://tuyensinh.uel.edu.vn/wp-content/uploads/2023/05/Anh-chup-Man-hinh-2023-05-18-luc-15.12.28-1-1024x698.png',
      lt: 'Dormitory Zone B - Full View',
      title: 'Dormitory Zone B - Full View'
    },
    {
      id: 3,
      src: 'https://aps.vn/wp-content/uploads/2013/12/KTX-DHQG-TPHCM-768x576.jpg',
      alt: 'Dormitory Zone B - Front View',
      title: 'Dormitory Zone B - Front View'
    },
    {
      id: 4,
      src: 'https://aps.vn/wp-content/uploads/2013/12/Car-Parking-Khu-A-1-555x400.jpg',
      alt: 'Car Parking Lot - Zone A',
      title: 'Car Parking Lot - Zone A'
    },
    {
      id: 5,
      src: 'https://iuhouse.iuoss.com/wp-content/uploads/2021/08/5.jpg',
      alt: 'Building B2 - Zone B',
      title: 'Building B2 - Zone B'
    },
    {
      id: 6,
      src: 'https://ss-images.saostar.vn/wwebp1200/pc/1605586229694/125232924_2800846593464014_4595467467104586275_o.jpg',
      alt: 'Dormitory At Night',
      title: 'Dormitory At Night'
    },
  ];

  const openModal = (image: any) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <div className='flex justify-center my-20'>
        <span className='font-bold text-4xl'>VNU Dormitory's Gallery</span>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {images.map((image) => (
          <div
            key={image.id}
            className='relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer'
            onClick={() => openModal(image)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className='w-full h-96 object-cover'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/VNU-dorm.jpg';
                target.alt = 'Fallback Image';
              }}
            />
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-4'>
              <h3 className='text-white font-semibold'>{image.title}</h3>
            </div>
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'>
          <div className='relative max-w-4xl w-full'>
            <button
              type='button'
              onClick={closeModal}
              aria-label='Close modal'
              className='absolute -top-10 right-0 text-white text-2xl hover:text-gray-300'
            >
              <FaTimes />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className='w-full h-auto max-h-[80vh] object-contain rounded-lg'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/VNU-dorm.jpg';
                target.alt = 'Fallback Image';
              }}
            />
            <p className='text-white text-2xl font-semibold text-center mt-4'>{selectedImage.title}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default PageContent;