"use client";

import axios from 'axios';
import { useState, useRef, useCallback } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import toast from 'react-hot-toast';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import useLoginModal from '@/app/hooks/useLoginModal';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';


const RegisterModal = ({ title = 'Sign Up' }) => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const idParts = {
    it: { major: 'IT', subMajors: ['IT', 'CS', 'DS'] },
    ba: { major: 'BA', subMajors: ['BA'] },
    bs: { major: 'BS', subMajors: ['BS'] },
    ee: { major: 'EE', subMajors: ['EE'] },
  };
  const curriculumLists = ['WE', 'IU'];
  const acceptedDomains = ['hcmiu'];


  const checkValidName = (name: string): { isValid: boolean; message: string } => {
    // Regular expression to check if name contains only alphabetic characters and spaces
    const validNameRegex = /^[\p{L}\s]+$/u;
  
    if (!name.trim()) {
      return { isValid: false, message: 'Please enter full name' };
    }
  
    if (!validNameRegex.test(name)) {
      return { isValid: false, message: 'Full name must only contain alphabetic characters and spaces' };
    }
  
    // Check if the name contains at least two words
  const words = name.trim().split(/\s+/);
  if (words.length < 2) {
    return { isValid: false, message: 'Full name must contain at least two words' };
  }

    return { isValid: true, message: 'Valid name' };
  }
  
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
  }
  
  const checkValidStudentEmail = (
    email: string,
    studentId: string,
    acceptedDomains: string[],
    idParts: Record<string, { major: string; subMajors: string[] }>,
    curriculumLists: string[]
  ): { isValid: boolean; message: string } => {
    const normalizedEmail = email.toLowerCase();
    const [localPart, domainPart] = normalizedEmail.split('@');
  
    // Check empty student email
    if (!email.trim()) {
      return { isValid: false, message: 'Please enter student email' };
    }
  
    // Validate domain
    if (!domainPart || !acceptedDomains.some(domain => domainPart === `student.${domain}.edu.vn`)) {
      return { isValid: false, message: 'Invalid student email format' };
    }
  
    // Validate local part as student ID
    const studentIdValidation = checkValidStudentId(localPart.toUpperCase(), idParts, curriculumLists);
    if (!studentIdValidation.isValid) {
      return { isValid: false, message: 'Invalid student email' };
    }
  
    // Validate correspondence of student ID and student email
    if (localPart.toUpperCase() !== studentId.toUpperCase()) {
      return { isValid: false, message: 'Student email must be corresponding to student ID' };
    }
  
    return { isValid: true, message: 'Valid student email' };
  }
  
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
  }
  
  const checkValidPassword = (password: string, data: FieldValues) => {
    const { studentId } = data;
    const { isValid, message } = checkStrongPassword(password, studentId);
  
    if (!isValid) {
      return message;
    }
    return true;
  }
  
  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      studentId: '',
      email: '',
      password: '',
    }
  });

  const validateFields = (data: FieldValues) => {
    const errors = [];
  
    // Check name
    const nameValidation = checkValidName(data.name);
    if (!nameValidation.isValid) {
      registerModal.onNameError();
      errors.push(nameValidation.message);
    } else {
      registerModal.onNameValid();
    }
  
    // Check student ID
    const studentIdValidation = checkValidStudentId(data.studentId, idParts, curriculumLists);
    if (!studentIdValidation.isValid) {
      registerModal.onIdError();
      errors.push(studentIdValidation.message);
    } else {
      registerModal.onIdValid();
    }
  
    // Check email
    const emailValidation = checkValidStudentEmail(data.email, data.studentId, acceptedDomains, idParts, curriculumLists);
    if (!emailValidation.isValid) {
      registerModal.onEmailError();
      errors.push(emailValidation.message);
    } else {
      registerModal.onEmailValid();
    }
  
    // Check password
    const passwordValidation = checkValidPassword(data.password, data);
    if (passwordValidation !== true) {
      registerModal.onPasswordError();
      errors.push(passwordValidation);
    } else {
      registerModal.onPasswordValid();
    }
  
    return errors;
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // Validate fields
    const validationErrors = validateFields(data);
    if (validationErrors.length > 0) {
      toast.remove();
      toast.error(validationErrors[0]);
      setIsLoading(false);
      return;
    }

    console.log("Form submitted:", data);
    setIsLoading(true);

    axios
      .post('/api/register', data)
      .then(() => {
        return signIn('credentials', {
          studentId: data.studentId,
          password: data.password,
          redirect: false,
        });
      })
      .then((callback) => {
        setIsLoading(false);
        
        if (callback?.ok) {
          toast.remove();
          toast.success('Signed up successfully');
          router.refresh();
          registerModal.onClose();
        }
        
        if (callback?.error) {
          registerModal.onNameError();
          registerModal.onIdError();
          registerModal.onEmailError();
          registerModal.onPasswordError();
          toast.remove();
          toast.error(callback.error);
          return;
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        if (error.response.data.message === 'Email or student ID already exists') {
          toast.remove();
          toast.error('This student ID and student email are already linked to another account');
        }
        else {
          toast.remove();
          toast.error(error);
        }
        return;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const handleSwitchModal = useCallback(() => {
    registerModal.onClose();
    title = 'Sign In';
    loginModal.onOpen();
  }, [registerModal, loginModal])

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

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Heading title='Welcome to Dormistory' subtitle='Create an account' center />
      <Input
        id='name'
        label='Full name'
        disabled={isLoading}
        register={register}
        errors={errors}
        className={`${registerModal.isNameError ? 'border  border-red-500 focus:border-2 focus:border-red-500' : ''}`} 
        inputRef={nameRef}
        onKeyDown={(e) => handleKeyDown(e, idRef)}
      />
      <Input
        id='studentId'
        label='Student ID'
        disabled={isLoading}
        register={register}
        errors={errors}
        className={`${registerModal.isIdError ? 'border  border-red-500 focus:border-2 focus:border-red-500' : ''}`}
        inputRef={idRef}
        onKeyDown={(e) => handleKeyDown(e, emailRef)}
      />
      <Input
        id='email'
        label='Email'
        disabled={isLoading}
        register={register}
        errors={errors}
        className={`${registerModal.isEmailError ? 'border  border-red-500 focus:border-2 focus:border-red-500' : ''}`}
        inputRef={emailRef}
        onKeyDown={(e) => handleKeyDown(e, passwordRef)}
      />
      <Input
        id='password'
        type='password'
        label='Password'
        disabled={isLoading}
        register={register}
        errors={errors}
        className={`${registerModal.isPasswordError ? 'border  border-red-500 focus:border-2 focus:border-red-500' : ''}`}
        inputRef={passwordRef}
        onKeyDown={(e) => handleKeyDown(e, nameRef)}
      />
    </div>
  )

  const footerContent = (
    <div className='flex flex-col gap-4 mt-3'>
      <hr />
      <div className='text-neutral-500 text-center mt-4 font-normal'>
        <div className='justify-center flex flex-row items-center gap-2'>
          <div>
            Already have an account?
          </div>
          <div
            onClick={handleSwitchModal}
            className='text-primary font-semibold cursor-pointer hover:underline'
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title={title}
      actionLabel='Continue'
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default RegisterModal;