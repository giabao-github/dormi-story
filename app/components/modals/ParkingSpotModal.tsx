"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Candal } from 'next/font/google';
import { RiEBikeFill } from 'react-icons/ri';
import { GiOpenGate } from 'react-icons/gi';
import { IoInformationCircle } from 'react-icons/io5';
import { MdContentCopy, MdAccountBalance, MdAttachMoney } from 'react-icons/md';
import { BsQrCodeScan } from 'react-icons/bs';
import { SafeUser } from '@/app/types';
import Modal from './Modal'
import Heading from '../Heading';
import useParkingLotModal from '@/app/hooks/useParkingLotModal';
import { Building, ParkingSpot } from '@prisma/client';
import Calendar from '../inputs/Calendar';
import ResourceUpload from '../inputs/ResourceUpload';
import ActionModal from './ActionModal';


const candal = Candal({
  subsets: ['latin'],
  weight: ['400']
});

enum STEPS {
  INFORMATION = 0,
  BUILDING = 1,
  DATE = 2,
  SPOT = 3,
  PAYMENT = 4,
  LICENSE = 5,
}

const SLOTS_PER_LINE = 5;
let matrix: ParkingSpot[][] = [];

interface ParkingSpotModalProps {
  currentUser?: SafeUser | null;
  buildings: Building[];
}

const period = [
  {
    id: 1,
    name: '1 month',
  },
  {
    id: 2,
    name: '2 months',
  },
  {
    id: 3,
    name: '3 months',
  },
  {
    id: 4,
    name: '4 months',
  },
  {
    id: 5,
    name: '5 months',
  },
  {
    id: 6,
    name: '6 months',
  },
];

const ParkingSpotModal: React.FC<ParkingSpotModalProps> = ({ currentUser, buildings }) => {
  const router = useRouter();
  const parkingLotModal = useParkingLotModal();
  const [step, setStep] = useState(STEPS.INFORMATION);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [isBuildingOpen, setIsBuildingOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [hoveredSpot, setHoveredSpot] = useState<ParkingSpot | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isTimeout, setIsTimeout] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activeTab, setActiveTab] = useState('cash');
  const [validTime, setValidTime] = useState('');
  const [isRed, setIsRed] = useState(false);
  const [difference, setDifference] = useState(0);

  const tabs = [
    { id: 'cash', label: 'Cash' },
    { id: 'banking', label: 'Internet Banking' }
  ];

  const { handleSubmit, setValue, watch, reset } = useForm<FieldValues>({
    defaultValues: {
      buildingId: '',
      month: '',
      status: '',
      licensePlateImage: '',
      spot: '',
    }
  });

  const buildingId = watch('buildingId');
  const month = watch('month');
  const status = watch('status');
  const license = watch('licensePlateImage');
  const spot = watch('spot');

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,  
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const sanitizeData = (data: FieldValues) => {
    const sanitizedData: FieldValues = {};
    Object.keys(data).forEach((key) => {
      sanitizedData[key] =
        typeof data[key] === 'string' ? data[key].replace(/\s+/g, ' ').trim() : data[key];
    });
    return sanitizedData;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.remove();
    toast.success('Copied to clipboard!');
  };

  const fetchParkingSpots = useCallback(async (buildingId: string): Promise<ParkingSpot[]>  => {
    const response = await axios.post('/api/parking-spot/fetch', { buildingId: buildingId })
    return response.data;
  }, []);

  const handleSelectBuilding = (building: Building) => {
    if (building.availableSlots > 0) {
      setCustomValue('buildingId', building.id);
      setSelectedBuilding(building.name);
      setIsBuildingOpen(false);
    }
  };

  const getSpotColor = useCallback((spot: ParkingSpot) => {
    switch (spot.status) {
      case 'available':
        return 'text-primary';
      case 'taken':
        return 'text-button';
      case 'locked':
        if (spot.userId === currentUser?.id) {
          return 'text-special';
        }
        else if (!spot.userId || spot.userId !== currentUser?.id) {
          return 'text-lock';
        }
      default:
        return 'text-gray-500';
    }
  }, [parkingSpots]);

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    if (step === STEPS.BUILDING && !buildingId) {
      toast.remove();
      toast.error('Please select a building before proceeding');
      return;
    } else if (step === STEPS.DATE && !month) {
      toast.remove();
      toast.error('Please select a period before proceeding');
      return;
    } else if (step === STEPS.SPOT && !status) {
      toast.remove();
      toast.error('Please select a parking spot before proceeding');
      return;
    } else if (step === STEPS.LICENSE && !license) {
      toast.remove();
      toast.error('Please upload your license plate image before proceeding');
      return;
    }
    setStep((value) => value + 1);
  };

  const handleSpotClick = useCallback(async (spot: ParkingSpot, buildingId: string) => {
    if (isLoading || !currentUser || spot.status !== 'available' || spot.userId !== null) {
      return;
    }

    setIsLoading(true);

    try {
      const parkingSpots = await axios.post('/api/parking-spot/select', {
        id: spot.id,
        buildingId,
        userId: currentUser.id
      });
      setParkingSpots(parkingSpots.data);
      setSelectedSpot(spot);
      if (!isActive) {
        setTimeLeft(600);
        setIsActive(true);
      }
    } catch (error) {
      console.error('Error selecting spot:', error);
      toast.remove();
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [buildingId, isLoading]);
  

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PAYMENT) {
      return onNext();
    }

    setIsLoading(true);

    const sanitizedData = sanitizeData(data);

    axios.post('/api/parking-spot/register', sanitizedData)
    .then(() => {
      toast.remove();
      toast.success('Parking lot registered successfully');
      parkingLotModal.onClose();
      router.refresh();
      reset();
      setStep(STEPS.INFORMATION);
    })
    .catch((error) => {
      console.log(error);
      toast.remove();
      toast.error('An error occurred. Please try again');
    })
    .finally(() => {
      setIsLoading(false);
    })
  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.PAYMENT) {
      return 'Complete';
    }
    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.INFORMATION) {
      return undefined;
    }
    return 'Back';
  }, [step]);

  const endDate = useMemo(() => {
    if (startDate && month) {
      return new Date(startDate.getFullYear(), startDate.getMonth() + Number(month), startDate.getDate());
    }
    return startDate;
  }, [startDate, month]);

  useEffect(() => {
    const fetchData = async () => {
      const updatedSpots = await fetchParkingSpots(buildingId)
      setParkingSpots(updatedSpots);
    }
    if (step && buildingId) {
      fetchData();
    }
  }, [buildingId]);

  useEffect(() => {
    matrix = [];
    for (let i = 0; i < parkingSpots.length; i += SLOTS_PER_LINE) {
      matrix.push(parkingSpots.slice(i, i + SLOTS_PER_LINE));
    }
    setCustomValue('status', selectedSpot?.status);
    console.log(
      matrix.map(row => 
        row.map(({ id, userId, status, time }) => ({ id, userId, status, time }))
      )
    );    
  }, [parkingSpots])

  useEffect(() => {
    const resetData = async () => {
      await axios.post('/api/parking-spot/reset', {
        userId: currentUser?.id
      });
    }
    resetData();
  }, []);

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimeout(true);
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (step === STEPS.DATE && matrix.length <= 0) {
      setIsLoading(true);
    } else if (step === STEPS.DATE && matrix.length > 0) {
      setIsLoading(false);
    }
  }, [matrix.length, step]);

  useEffect(() => {
    const initializeTime = async () => {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      endDate.setDate(endDate.getDate() + 3); 
      setDifference(endDate.getTime() - new Date().getTime());
      const updatedSpot = await axios.post('/api/parking-spot/time', {
        id: selectedSpot?.id,
        buildingId,
        userId: currentUser?.id,
        time: difference
      });
      setSelectedSpot(updatedSpot.data);
    }
    if (step === STEPS.SPOT && status) {
      initializeTime();
    }
    const intervalId = setInterval(() => {
      setDifference(prevDifference => prevDifference - 1000);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [step, status]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (difference <= 0) {
        setValidTime('Time Expired');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));

      setIsRed(hours < 3);
    };

    if (step === STEPS.SPOT && status) {
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [step, status, difference]);


  let bodyContent = (
    <div className='flex flex-col gap-8'>
      <div className='mx-6'>
        <Heading
          title='Student Information'
          subtitle='These information will be used to register your parking spot'
        />
      </div>
      <div className='flex flex-row items-center mx-6'>
        <p className='text-xl font-semibold w-1/4 px-2'>
          Student name
        </p>
        <div className='ml-8 w-2/3 py-2 px-4 text-lg font-semibold text-neutral-700 border-2 border-neutral-700 rounded-md'>
          {currentUser?.name}
        </div>
      </div>
      <div className='flex flex-row items-center mx-6'>
        <p className='text-xl font-semibold w-1/4 px-2'>
          Student ID
        </p>
        <div className='ml-8 w-2/3 py-2 px-4 text-lg font-semibold text-neutral-700 border-2 border-neutral-700 rounded-md'>
          {currentUser?.studentId}
        </div>
      </div>
    </div>
  );

  if (step === STEPS.BUILDING) {
    bodyContent = (
      <div className='flex flex-col gap-y-6 mb-10'>
        <div className='mx-6'>
          <Heading
            title='Select a building of your parking spot'
            subtitle="Building marked as 'Full' cannot be chosen"
          />
        </div>
        <div className='flex flex-col gap-y-4'>
          <div className='mx-6'>
            <div className='relative'>
              <button
                onClick={() => setIsBuildingOpen(!isBuildingOpen)}
                className={`w-2/3 border ${selectedBuilding ? 'border-primary' : 'border-gray-400 hover:border-gray-700'} rounded-md p-3 text-base shadow-sm hover:shadow-md focus:outline-none`}
              >
                <div className={`flex items-center ${selectedBuilding ? 'justify-between px-2' : 'justify-center'}`}>
                  <span className={`${selectedBuilding ? 'text-primary' : ''}`}>
                    {selectedBuilding ? `Building ${selectedBuilding}` : 'Select a building'}
                  </span>
                  {selectedBuilding && (
                    <span className='text-sm text-primary'>Available</span>
                  )}
                </div>
              </button>
              {isBuildingOpen && (
                <ul className='absolute mt-1 py-2 z-10 w-2/3 border border-gray-400 bg-white rounded-md shadow-lg'>
                  {buildings.map((building) => (
                    <li
                      key={building.id}
                      onClick={() => handleSelectBuilding(building)}
                      className={`py-2 px-4 flex items-center justify-between ${
                        building.availableSlots === 0 ? 'text-gray-400' : 'text-gray-700 cursor-pointer hover:bg-neutral-200'
                      }`}
                      style={{ pointerEvents: building.availableSlots === 0 ? 'none' : 'auto' }}
                    >
                      <span>
                        {building.name} ({building.availableSlots} slots available)
                      </span>
                      {building.availableSlots <= 0 ? (
                        <span className='text-sm text-rose-500'>Full</span>
                      ) : (
                        <span className='text-sm text-primary'>Available</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {!buildings.length && (
              <p className='text-sm text-gray-500'>
                No buildings available for registration.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Choose a start date and period'
            subtitle='You should pay the parking lot fee before the start date'
          />
          <div className='flex flex-row gap-x-8'>
            <div className='flex flex-col justify-start gap-y-2 w-1/2'>
              <h3 className='text-lg text-center font-medium mb-2'>Start date</h3>
              <Calendar
                value={startDate}
                minDate={new Date()}
                maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())}
                onChange={(date) => {
                  setStartDate(date);
                }}
              />
            </div>
            <div className='w-full'>
              <div className='h-1/2'>
                <div className='flex flex-col justify-start gap-y-2'>
                  <h3 className='text-lg text-center font-medium mb-2'>Period</h3>
                  <div className='relative'>
                    <button
                      onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                      className={`w-full border ${selectedMonth ? 'border-primary' : 'border-gray-400'} rounded-md p-3 text-base shadow-sm hover:shadow-md focus:outline-none`}
                    >
                      <div className='flex items-center justify-center'>
                        <span className={`${selectedMonth ? 'text-primary' : ''}`}>
                          {selectedMonth ? `${selectedMonth}` : 'Select a period'}
                        </span>
                      </div>
                    </button>
                    {isPeriodOpen && (
                      <ul className='absolute mt-1 py-2 z-10 w-full border border-gray-400 bg-white rounded-md shadow-lg'>
                        {period.map((month) => (
                          <li
                            key={month.id}
                            onClick={() => {
                              setCustomValue('month', month.id);
                              setSelectedMonth(month.name);
                              setIsPeriodOpen(false);
                            }}
                            className='py-2 px-6 flex items-center justify-between text-gray-700 cursor-pointer hover:bg-neutral-200'
                            style={{ pointerEvents: 'auto' }}
                          >
                            <span>
                              {month.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              {month && (
                <div className='h-1/2'>
                  <div className='flex flex-col justify-start gap-y-4 py-4 rounded-md border border-primary text-primary hover:shadow-md'>
                    <h3 className='text-lg text-center font-medium mb-4'>Parking Lot Period</h3>
                    <div className='px-8 w-2/3 flex justify-between items-center'>
                      <p className='text-base'>From:</p>
                      <span className='font-semibold'>{formatDate(startDate)}</span>
                    </div>
                    <div className='px-8 w-2/3 flex justify-between items-center'>
                      <p className='text-base'>To:</p>
                      <span className='font-semibold'>{formatDate(endDate)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === STEPS.SPOT) {
    bodyContent = (
      <div className='flex flex-col gap-8 mx-6'>
        <div className='flex justify-between'>
          <Heading
            title='Choose an available spot'
            subtitle='Please complete the registration process within 10 minutes'
          />
          {timeLeft > 0 && !isTimeout && isActive && (
            <div className={`flex items-center justify-center h-fit w-36 text-3xl font-bold border shadow-sm bg-gray-50 px-4 py-3 rounded ${timeLeft > 10 ? 'text-secondary' : 'text-button'} ${candal.className}`}>
              {formatTime(timeLeft)}
          </div>
          )}
        </div>
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
                    <div
                      key={spot.id}
                      onClick={() => handleSpotClick(spot, buildingId)}
                      onMouseEnter={() => setHoveredSpot(spot)}
                      onMouseLeave={() => setHoveredSpot(null)}
                      className={`p-2 transition-all duration-300 cursor-pointer ${spot.status === 'taken' ? 'cursor-not-allowed' : 'hover:scale-110'}`}
                    >
                      <RiEBikeFill className={`text-3xl ${getSpotColor(spot)}`} />
                    </div>
                    {hoveredSpot && hoveredSpot.id === spot.id && (
                      <div className='absolute z-10 bg-white border p-3 rounded-lg shadow-lg transform -translate-x-1/2 -top-20 left-1/2 w-36 ring-2 ring-primary'>
                        <p className='text-sm font-semibold text-gray-800 mb-1'>
                          Spot:&nbsp;
                          <span>{String.fromCharCode(65 + lineIndex)}{spotIndex + 1}</span>
                        </p>
                        <p className='text-sm font-semibold text-gray-800 mb-1 capitalize'>
                          Status:&nbsp;
                          <span className={`${getSpotColor(hoveredSpot)}`}>
                            {hoveredSpot.status === 'locked' ? hoveredSpot.userId === currentUser?.id ? 'selected' : 'locked' : hoveredSpot.status}
                          </span>
                        </p>
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

  if (step === STEPS.LICENSE) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Upload your license plate image'
            subtitle='The image must be legible (it can be read clearly, cracks are accepted but must not obscure the numbers)'
          />
          <ResourceUpload
            value={license}
            onChange={(value) => setCustomValue('licensePlateImage', value)}
            limited='image'
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.PAYMENT) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Choose a payment method'
            subtitle='Please carefully check the payment information'
          />
          <div className='max-w-3xl max-h-[55vh] mx-auto p-6 bg-white overflow-y-auto'>
            <div className='mb-8'>
              <div className='flex border-b border-gray-200' role='tablist'>
                {tabs.map((tab) => (
                  <button
                    type='button'
                    title={tab.label}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 text-lg font-medium transition-colors duration-200 relative ${activeTab === tab.id ? 'text-secondary' : 'text-gray-500 hover:text-gray-700'}`}
                    role='tab'
                  >
                    <div className='flex items-center'>
                      {tab.label === 'Cash' ? (
                        <MdAttachMoney className='mr-2 text-xl' />
                      ) : (
                        <MdAccountBalance className='mr-2 text-xl' />
                      )}
                      {tab.label}
                    </div>
                    {activeTab === tab.id && (
                      <div className='absolute bottom-0 left-0 w-full h-0.5 bg-secondary'></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className='mt-4' role='tabpanel'>
              <div className='mb-4 text-center'>
                <p className='text-xl font-bold text-gray-800'>Payment Amount: 30,000 VND</p>
              </div>
              {activeTab === 'cash' ? (
                <div className='space-y-6'>
                  <p className='text-lg text-gray-700 px-4'>
                    Please go to Finance Office to pay your parking fee and complete the registration in the next 3 days.
                  </p>
                  <div className='text-center'>
                    <p className='text-lg font-semibold mb-2'>Time Remaining:</p>
                    <p
                      className={`text-4xl font-bold ${isRed ? 'text-button' : 'text-primary'} ${candal.className}`}
                    >
                      {difference > 0 ? formatTime(Math.floor(difference / 1000)) : validTime}
                    </p>
                  </div>
                </div>
              ) : (
                <div className='space-y-6'>
                  <div className='flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg'>
                    <div className='bg-gray-100 p-8 rounded-lg mb-4'>
                      <BsQrCodeScan className='w-32 h-32 text-gray-400' />
                    </div>
                    <p className='text-sm text-gray-500 mt-2'>
                      If the QR code does not work, please contact the admin.
                    </p>
                  </div>
                  <div className='space-y-4'>
                    <div className='p-4 bg-gray-50 rounded-lg flex justify-between items-center'>
                      <div>
                        <p className='text-sm text-gray-500 mb-1'>Account Holder</p>
                        <p className='text-lg font-medium'>Dormistory Admin</p>
                      </div>
                      <div
                        onClick={() => handleCopy('Dormistory Admin')}
                        className='p-2 cursor-pointer hover:bg-gray-200 rounded-full'
                      >
                        <MdContentCopy className='text-gray-500' />
                      </div>
                    </div>
                    <div className='p-4 bg-gray-50 rounded-lg flex justify-between items-center'>
                      <div>
                        <p className='text-sm text-gray-500 mb-1'>Account Number</p>
                        <p className='text-lg font-medium'>1027 313 598</p>
                      </div>
                      <div
                        onClick={() => handleCopy('1027 313 598')}
                        className='p-2 cursor-pointer hover:bg-gray-200 rounded-full'
                      >
                        <MdContentCopy className='text-gray-500' />
                      </div>
                    </div>
                    <div className='p-4 bg-gray-50 rounded-lg'>
                      <p className='text-sm text-gray-500 mb-1'>Transfer Description Format</p>
                      <p className='text-lg font-medium'>[Student name] - [Student ID]</p>
                      <p className='text-sm text-gray-500 mt-1'>Example: Nguyen Van A - ITITDS12345</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {timeLeft === 0 && (
        <ActionModal isOpen={isTimeout}>
          <div className='border-b border-gray-900/10 pb-4 flex flex-col gap-y-8 justify-center items-center'>
            <p className='text-2xl font-semibold text-gray-900'>
              Time's Up!
            </p>
            <p className='text-lg font-medium text-gray-700 my-2 mx-2 text-center'>
              Your spot registration has expired. Please click 'OK' to reload the page.
            </p>
            <button
              type='button'
              onClick={() => window.location.reload()}
              className='py-[6px] px-5 mr-4 bg-primary hover:opacity-70 rounded-md select-none'
            >
              <span className='text-white text-base font-semibold'>OK</span>
            </button>
          </div>  
        </ActionModal>
      )}
      <Modal
        title='Register A Parking Spot'
        isOpen={parkingLotModal.isOpen}
        onClose={parkingLotModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        disabled={isLoading}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.INFORMATION ? undefined : onBack}
        body={bodyContent}
      />
    </>
  );
}

export default ParkingSpotModal;