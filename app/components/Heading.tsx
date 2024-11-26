"use client";

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ title, subtitle, center }) => {
  return (
    <div className={`mb-6 ${center ? 'text-center' : 'text-start'}`}>
      <div className='text-2xl font-bold'>
        {title}
      </div>
      <div className='font-normal text-neutral-500 mt-4'>
        {subtitle}
      </div>
    </div>
  );
}

export default Heading; 