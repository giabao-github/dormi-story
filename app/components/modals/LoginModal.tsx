"use client";

import { signIn } from 'next-auth/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import { usePathname, useRouter } from 'next/navigation';


const LoginModal = ({ title = 'Sign In' }) => {
  const router = useRouter();
  const pathname = usePathname();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);
  const idRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const idParts = {
    it: { major: 'IT', subMajors: ['IT', 'CS', 'DS'] },
    ba: { major: 'BA', subMajors: ['BA'] },
    bs: { major: 'BS', subMajors: ['BS'] },
    ee: { major: 'EE', subMajors: ['EE'] },
  };

  const curriculumLists = ['WE', 'IU'];

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      studentId: '',
      password: '',
    }
  });

  const sanitizeData = (data: FieldValues) => {
    const sanitizedData: FieldValues = {};
    Object.keys(data).forEach((key) => {
      sanitizedData[key] =
        typeof data[key] === 'string' ? data[key].replace(/\s+/g, ' ').trim() : data[key];
    });
    return sanitizedData;
  };

  const checkValidStudentId = (
    studentId: string,
    idParts: Record<string, { major: string; subMajors: string[] }>,
    curriculumLists: string[]
  ): { isValid: boolean; message: string } => {
    
    const normalizedId = studentId.toUpperCase();
  
    // Extract parts of the ID
    const majorCode = normalizedId.slice(0, 2);
    const subMajorCode = normalizedId.slice(2, 4);
    const curriculum = normalizedId.slice(4, 6);
    const id = normalizedId.slice(6);
  
    // Check empty student ID
    if (!studentId.trim()) {
      return { isValid: false, message: 'Please enter student ID' };
    }
  
    // Validate major
    const majorConfig = idParts[majorCode.toLowerCase()];
    if (!majorConfig) {
      return { isValid: false, message: 'Invalid student ID' };
    }
  
    // Validate sub-major
    if (!majorConfig.subMajors.includes(subMajorCode)) {
      return { isValid: false, message: 'Invalid student ID' };
    }
  
    // Validate curriculum
    if (!curriculumLists.includes(curriculum)) {
      return { isValid: false, message: 'Invalid student ID' };
    }
  
    // Validate ID structure
    if (!/^\d{5}$/.test(id)) {
      return { isValid: false, message: 'Invalid student ID' };
    }
  
    // Validate first two numbers of student ID (course year) do not exceed 24
    const yearPart = parseInt(id.slice(0, 2), 10);
    if (yearPart > 24) {
      return { isValid: false, message: 'The first two digits of student ID number cannot exceed 24' };
    }

    return { isValid: true, message: 'Valid student ID' };
  };

  const checkStrongPassword = (
    password: string, 
    studentId: string
  ): { isValid: boolean; message: string } => {
  
    // Check if password is undefined or empty
    if (!password || password.trim() === '') {
      return { isValid: false, message: 'Password cannot be empty' };
    }
  
    // Normalize inputs
    const normalizedPassword = password.toUpperCase();
    const normalizedStudentId = studentId.toUpperCase();
    
    // Check if password contains email or student ID
    if (normalizedPassword.includes(normalizedStudentId)) {
      return { isValid: false, message: 'Password cannot include student ID' };
    }
  
    // Check password length
    if (password.length < 8) {
        return { isValid: false, message: 'Password must contain at least 8 characters' };
    }
  
    // Check for at least one uppercase letter, one lowercase letter, and one digit
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
  
    if (!hasUpperCase) {
      return { isValid: false, message: 'Password must contain at least 1 uppercase letter' };
    }
    if (!hasLowerCase) {
      return { isValid: false, message: 'Password must contain at least 1 lowercase letter' };
    }
    if (!hasDigit) {
      return { isValid: false, message: 'Password must contain at least 1 digit' };
    }
  
    return { isValid: true, message: 'Valid password' };
  };
  
  const checkValidPassword = (password: string, data: FieldValues) => {
    const { studentId } = data;
    const { isValid, message } = checkStrongPassword(password, studentId);
  
    if (!isValid) {
      return message;
    }
    return true;
  };

  const validateFields = (data: FieldValues) => {
    const errors = [];
  
    // Check student ID
    const studentIdValidation = checkValidStudentId(data.studentId, idParts, curriculumLists);
    if (!studentIdValidation.isValid) {
      loginModal.onIdError();
      errors.push(studentIdValidation.message);
    } else {
      loginModal.onIdValid();
    }
  
    // Check password
    const passwordValidation = checkValidPassword(data.password, data);
    if (passwordValidation !== true) {
      loginModal.onPasswordError();
      errors.push(passwordValidation);
    } else {
      loginModal.onPasswordValid();
    }
  
    return errors;
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // Validate fields
    const validationErrors = validateFields(data);
    if (validationErrors.length > 0) {
      toast.remove();
      toast.error(validationErrors[0]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const sanitizedData = sanitizeData(data);

    signIn('credentials', {
      ...sanitizedData,
      redirect: false
    })
    .then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        toast.remove();
        toast.success('Logged in');
        router.push(pathname || '/?category=Announcement');
        loginModal.onClose();
        router.refresh();
      }

      if (callback?.error) {
        loginModal.onIdError();
        loginModal.onPasswordError();
        toast.remove();
        toast.error(callback.error);
        return;
      }
    })
    .catch((error) => {
      setIsLoading(false);
      console.log(error);
      toast.remove();
      toast.error(error);
      return;
    });
  }

  const handleSwitchModal = useCallback(() => {
    loginModal.onClose();
    title = 'Sign Up';
    registerModal.onOpen();
  }, [loginModal, registerModal])

  const handleKeyDown = (e: React.KeyboardEvent, nextFieldRef: React.RefObject<HTMLInputElement>) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      nextFieldRef.current?.focus();
    }

    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleSubmit(onSubmit)();
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        loginModal.onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Heading title='Login to Dormistory' subtitle='Filling credentials to sign in' center />
      <Input
        id='studentId'
        label='Student ID'
        disabled={isLoading}
        register={register}
        errors={errors}
        className={`${loginModal.isIdError ? 'border  border-red-500 focus:border-2 focus:border-red-500' : ''}`}
        inputRef={idRef}
        onKeyDown={(e) => handleKeyDown(e, passwordRef)}
      />
      <Input
        id='password'
        type='password'
        label='Password'
        disabled={isLoading}
        register={register}
        errors={errors}
        className={`${loginModal.isPasswordError ? 'border  border-red-500 focus:border-2 focus:border-red-500' : ''}`}
        inputRef={passwordRef}
        onKeyDown={(e) => handleKeyDown(e, idRef)}
      />
    </div>
  )

  const footerContent = (
    <div className='flex flex-col gap-4 mt-3'>
      <hr />
      <div className='text-neutral-500 text-center mt-4 font-normal'>
        <div className='justify-center flex flex-row items-center gap-2'>
          <div>
            Do not have an account?
          </div>
          <div
            onClick={handleSwitchModal}
            className='text-button font-semibold cursor-pointer hover:underline'
          >
            Register
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Modal
      ref={modalRef}
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title={title}
      actionLabel='Continue'
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default LoginModal;