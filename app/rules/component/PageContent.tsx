"use client";

import useReportModal from '@/app/hooks/useReportModal';
import { FaHelmetSafety, FaBan, FaUserShield } from 'react-icons/fa6';


const PageContent = () => {
  const rules = [
    {
      id: 1,
      title: "Student Conduct",
      style: 'text-blue-600',
      icon: <FaUserShield className='text-3xl text-blue-600' />,
      items: [
        "All students must strictly adhere to the curfew hours (from 5:00 AM to 11:00 PM)",
        "Maintain silence after 11:00 PM to avoid disturbing others",
        "Avoid damaging or spoiling flower and herb gardens within the premises",
      ]
    },
    {
      id: 2,
      title: "Forbidden Activities",
      style: 'text-rose-600',
      icon: <FaBan className='text-3xl text-rose-600' />,
      items: [
        "Organizing illegal activities within the dormitory is strictly prohibited",
        "Storing or using illegal items such as weapons or drugs is forbidden",
        "Do not vandalize public property, including dormitory facilities",
      ]
    },
    {
      id: 3,
      title: "Safety Guidelines",
      style: 'text-green-600',
      icon: <FaHelmetSafety className='text-3xl text-green-600' />,
      items: [
        "Maintain order and security at all times",
        "Equip yourself with a clear understanding of fire prevention and emergency procedures",
        "Familiarize yourself with fire safety measures and follow them diligently",
      ]
    },
  ];

  const reportModal = useReportModal();


  return (
    <div className={`ml-[248px] mt-4 mb-32 grid grid-cols-1 gap-8`}>
      <div className='flex justify-center my-20'>
        <span className='font-bold text-4xl'>VNU Dormitory's Rules</span>
      </div>
      <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {rules.map((section) => (
          <div
            key={section.id}
            className='rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105'
          >
            <div className='mb-8 flex items-center space-x-3'>
              {section.icon}
              <h2 className={`text-2xl font-semibold ${section.style}`}>{section.title}</h2>
            </div>
            <ul className='space-y-3'>
              {section.items.map((item, index) => (
                <li key={index} className='flex items-start space-x-2'>
                  <div className='flex items-start flex-row gap-x-4'>
                    <span className='mt-2 h-3 w-3 aspect-square rounded-full bg-gray-600' />
                    <span className='text-gray-600 text-lg'>{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className='mt-12 flex flex-row justify-center text-lg text-gray-700'>
        <p className='font-medium'>Encounter a violated conduct?&nbsp;</p>
        <p 
          onClick={reportModal.onOpen}
          className='font-semibold hover:underline hover:text-red-500 cursor-pointer' 
        >
          Report here
        </p>
      </div>
    </div>
  );
}

export default PageContent;