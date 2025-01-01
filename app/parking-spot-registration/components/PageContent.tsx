"use client";

import Image from "next/image";


interface PageContentProps {
  parkingSpot: any;
}

const PageContent: React.FC<PageContentProps> = ({ parkingSpot }) => {
  return (
    <div>
      <table className='w-full border-collapse border border-gray-300 mt-4'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border border-gray-300 py-2 text-center w-44'>Building</th>
            <th className='border border-gray-300 px-4 py-2 text-center w-44'>Spot</th>
            <th className='border border-gray-300 px-4 py-2 text-center w-56'>Payment Status</th>
            <th className='border border-gray-300 px-4 py-2 text-center w-96'>License Plate</th>
            <th className='border border-gray-300 py-2 text-center w-48'>Period</th>
            <th className='border border-gray-300 py-2 text-center w-52'>Start Date</th>
            <th className='border border-gray-300 py-2 text-center w-52'>End Date</th>
          </tr>
        </thead>
        <tbody className='text-center'>
          <tr>
            <td className='border border-gray-300 px-4 py-2'>
              <p className='w-full'>
                {parkingSpot?.building.name}
              </p>
            </td>
            <td className='border border-gray-300 px-4 py-2'>
              <p className='w-full'>
                {parkingSpot?.spot}
              </p>            
            </td>
            <td className='border border-gray-300 px-4 py-2'>
              <p className='w-full'>
                {parkingSpot?.paid ? 'Paid' : 'Unpaid'}
              </p>
            </td>
            <td className='border border-gray-300 px-6 py-4'>
              {parkingSpot.licensePlateImage && (
                <div className='relative w-full h-52'>
                  <Image
                    alt='License Plate'
                    fill
                    src={parkingSpot.licensePlateImage}
                    className='object-contain'
                  />
                </div>
              )}
            </td>
            <td className='border border-gray-300 px-4 py-2'>
              <p className='w-full'>
                {`${parkingSpot?.month} ${parkingSpot?.month && parkingSpot?.month > 1 ? 'months' : 'month'}`}
              </p>
            </td>
            <td className='border border-gray-300 px-4 py-2'>
              <p className='w-full'>
                {parkingSpot?.startDate?.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </td>
            <td className='border border-gray-300 px-4 py-2'>
              <p className='w-full'>
              {parkingSpot?.endDate?.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PageContent;