"use client";

import { GiOpenGate } from "react-icons/gi";
import Heading from "../Heading";
import { ParkingSpot } from "@prisma/client";
import { useState } from "react";
import { RiEBikeFill } from "react-icons/ri";
import { IoInformationCircle } from "react-icons/io5";

interface SpotSelectionProps {
  matrix: ParkingSpot[][];
  buildingId: string;
  handleSpotClick: (spot: ParkingSpot, buildingId: string) => void;
  getSpotColor: (spot: ParkingSpot) => string;
}

const SpotSelectionModal: React.FC<SpotSelectionProps> = ({ 
  matrix, 
  buildingId, 
  handleSpotClick, 
  getSpotColor 
}) => {
  const [hoveredSpot, setHoveredSpot] = useState<ParkingSpot | null>(null);
  return (
    <div className='flex flex-col gap-8 mx-6'>
        <Heading
          title='Choose an available slot'
          subtitle='Available slots are those in white'
        />
        <div className='flex-1'>
          <div className='flex justify-start mb-8'>
            <GiOpenGate className='text-4xl text-gray-600' />
          </div>
          <div className='grid gap-4 justify-center'>
            {matrix.map((line, lineIndex) => (
              <div  
                key={lineIndex}
                className='flex gap-4'
              >
                {line.map((spot, spotIndex) => (
                  <div key={spot.id} className='relative'>
                    <button
                      title={`${String.fromCharCode(65 + lineIndex)}${spotIndex + 1}`}
                      key={spot.id}
                      onClick={() => handleSpotClick(spot, buildingId)}
                      onMouseEnter={() => setHoveredSpot(spot)}
                      onMouseLeave={() => setHoveredSpot(null)}
                      disabled={spot.status === 'taken'}
                      className={`p-2 transition-all duration-300 ${spot.status === 'taken' ? 'cursor-not-allowed' : 'hover:scale-110'}`}
                    >
                      <RiEBikeFill className={`text-3xl ${getSpotColor(spot)}`} />
                    </button>
                    {hoveredSpot && hoveredSpot.id === spot.id && (
                      <div className='absolute z-10 bg-white p-3 rounded-lg shadow-lg -top-16 left-1/2 transform -translate-x-1/2 w-48'>
                        <p className="text-sm font-medium">Spot: ${String.fromCharCode(65 + lineIndex)}${spotIndex + 1}</p>
                        <p className="text-sm font-medium capitalize">Status: {spot.status}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className='mt-8 p-4 bg-gray-50 rounded-lg'>
          <h3 className='text-lg font-semibold mb-4'>Spot Legend</h3>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center'>
              <RiEBikeFill className='text-2xl text-primary mr-2' />
              <span>Available</span>
            </div>
            <div className='flex items-center'>
              <RiEBikeFill className='text-2xl text-button mr-2' />
              <span>Taken</span>
            </div>
            <div className='flex items-center'>
              <RiEBikeFill className='text-2xl text-special mr-2' />
              <span>Selected</span>
            </div>
            <div className='flex items-center'>
              <RiEBikeFill className='text-2xl text-lock mr-2' />
              <span>Locked</span>
            </div>
            <div className='flex items-center'>
              <IoInformationCircle className='text-2xl text-gray-600 mr-2' />
              <span>Hover for details</span>
            </div>
          </div>
        </div>
      </div>
  );
}

export default SpotSelectionModal;