"use client"

import { Geologica } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import ClientOnly from "./components/ClientOnly";


const geologica = Geologica({ subsets: ["latin", "cyrillic", "vietnamese", "greek"]});

export default function Page404() {
  const handleRedirect = () => {
    redirect('/');
  };

  return (
    <ClientOnly>
      <div className={`h-full flex flex-col gap-y-20 items-center justify-center ${geologica.className}`}>
        <title>Dormistory | 404</title>
        <Image 
          src={'/images/logo.jpg'} 
          priority 
          alt='Dormistory logo'
          height={240} width={240} 
          className='border-4 border-white rounded-full'
        />
        <div className='font-bold text-3xl md:text-4xl lg:text-5xl'>
          Oops, You Are Off-Campus!
        </div>
        <div className='flex flex-col gap-y-10 justify-center items-center'>
          <p className='text-neutral-400 text-center px-4 text-lg md:text-xl lg:text-2xl'>
            It looks like the page you were searching for has packed its bags and moved out. 
          </p>
          <p className='text-base md:text-xl'>
            Please navigate back to the&nbsp;
            <Link
              href={'/'}
              onClick={handleRedirect}
              className='text-rose-500 hover:underline'
            >
              Dormistory home page
            </Link>
            .
          </p>
        </div>
      </div>
    </ClientOnly>
  );
}
