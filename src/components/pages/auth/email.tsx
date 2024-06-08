import React, { FormEvent, useContext, useEffect, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { Input, InputWrapper } from '../../Input';
import StandardButton from '../../StandardButton';
import AuthActions from '@/+actions/auth-actions';
import { BASE_URL } from '@/utils/config';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SnackContext } from '@/components/SnackContext';
import { mergeCls } from '@/utils';
import { Icon } from '@/components/Icon';

function usePasswordToggle() {
  return useReducer((state: boolean, _: FormEvent) => {
    return !state;
  }, false);
}

const Divider = () => <hr className="my-1 border-paper_2 3/4sm:hidden" />;

const defaultValues = {
  full_name: null,
  display_name: null,
  email: '',
  password: '',
  confirm_password: '',
  avatar: '',
};
export type EmailSignupFormPayload = {
  full_name: string | null;
  display_name: string | null;
  email: string;
  password: string;
  confirm_password: string;
  avatar: string;
};
type EmailSignupFormProps = {
  orderId?: number;
};
export function EmailSignupForm(props: EmailSignupFormProps) {
  const { orderId } = props;
  const { showMessage } = useContext(SnackContext);
  const form = useForm<EmailSignupFormPayload>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(
      z.object({
        full_name: z.string().nullable(),
        display_name: z.string().nullable(),
        email: z.string().min(1),
        password: z.string().min(1),
        confirm_password: z.string().min(1),
        avatar: z.string().default(''),
      })
    ),
    defaultValues: defaultValues,
  });
  const { formState, handleSubmit, register } = form;
  const { isSubmitSuccessful } = formState;
  const [isShowPassword, showPassword] = usePasswordToggle();
  const [isShowConfirmPassword, showConfirmPassword] = usePasswordToggle();

  const submitHandler = async (values: EmailSignupFormPayload) => {
    const { error } = await AuthActions.users.signup(values);
    if (error) {
      showMessage({ message: error.message, type: 'error' });
      return;
    }
    showMessage({ message: 'Signup successfully', type: 'success' });
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  useEffect(() => {
    if (!isSubmitSuccessful) {
      return;
    }
    if (orderId) {
      location.reload();
    } else {
      window.location.href = BASE_URL;
    }
  }, [isSubmitSuccessful]);

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className={'grid gap-x-4 gap-y-2 3/4sm:grid-cols-[max-content_min-content] 3/4sm:gap-y-4'}
    >
      <label htmlFor="first-name" className="my-auto block w-max">
        Full name
      </label>
      <InputWrapper className="w-80">
        <Icon name="user" className="ml-3" />
        <Input placeholder="Full name" {...register('full_name')} className="p-3" />
      </InputWrapper>
      <Divider />
      <label htmlFor="display-name" className="my-auto block w-max">
        Display name
      </label>
      <InputWrapper className="w-80">
        <Icon name="robot-2" className="ml-3" />
        <Input placeholder="Darth vader" {...register('display_name')} className="p-3" />
      </InputWrapper>
      <Divider />
      <label htmlFor="email" className="my-auto block w-max">
        Email
      </label>
      <InputWrapper className="w-80">
        <Icon name="mail" className="ml-3" />
        <Input placeholder="Enter your email" type="email" {...register('email')} className="p-3" />
      </InputWrapper>
      <Divider />
      <label htmlFor="password" className="my-auto block w-max">
        Password
      </label>
      <InputWrapper className="w-80">
        <Icon name="lock-password" className="ml-3 h-5 w-5" />
        <Input
          placeholder="Enter your password"
          type={isShowPassword ? 'text' : 'password'}
          {...register('password')}
          className="p-3 !text-base"
        />
        <Icon
          name={isShowPassword ? 'eye' : 'eye-off'}
          data-type="password"
          onClick={showPassword}
          className="ml-3 mr-3 h-5 w-5"
        />
      </InputWrapper>
      <Divider />
      <label htmlFor="confirm-password" className="my-auto block w-max">
        Confirm password
      </label>
      <InputWrapper className="w-80">
        <Icon name="lock-password" className="ml-3 h-5 w-5" />
        <Input
          placeholder="Re-Enter your password"
          type={isShowConfirmPassword ? 'text' : 'password'}
          {...register('password')}
          className="w-[unset] flex-1 p-3 !text-base"
        />
        <Icon
          name={isShowPassword ? 'eye' : 'eye-off'}
          data-type="confirm_password"
          onClick={showConfirmPassword}
          className="h-full !w-10 p-3"
        />
      </InputWrapper>
      <StandardButton
        type="submit"
        className="mt-2 shadow shadow-default 3/4sm:col-span-2"
        loading={form.formState.isSubmitting}
      >
        Signup
      </StandardButton>
    </form>
  );
}

export type EmailLoginFormPayload = {
  email: string;
  password: string;
};
type EmailLoginFormProps = {
  orderId?: number;
};
export function EmailLoginForm(props: EmailLoginFormProps) {
  const { orderId } = props;
  const { showMessage } = useContext(SnackContext);
  const form = useForm<EmailLoginFormPayload>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(
      z.object({
        email: z.string().min(1),
        password: z.string().min(1),
      })
    ),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { formState, register, handleSubmit } = form;
  const { isSubmitted, isSubmitSuccessful } = formState;
  const [isShowPassword, showPassword] = usePasswordToggle();

  const submitHandler = async (values: EmailLoginFormPayload) => {
    const { error } = await AuthActions.users.login(values);
    if (error) {
      showMessage({ message: error.message, type: 'error' });
      return;
    }
    showMessage({ message: 'Login successfully', type: 'success' });
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  useEffect(() => {
    if (!isSubmitted) {
      return;
    }
    if (orderId) {
      window.location.href = BASE_URL + '/' + orderId + '/order';
    } else {
      window.location.href = BASE_URL;
    }
  }, [isSubmitted, isSubmitSuccessful]);

  return (
    <form className={mergeCls('flex flex-col gap-4')} onSubmit={handleSubmit(submitHandler)}>
      <div>
        <label htmlFor="email" className="mb-2 block">
          Email
        </label>
        <InputWrapper>
          <Icon name="mail" className="ml-3" />
          <Input
            placeholder="Enter your email"
            type="email"
            {...register('email')}
            className="flex-grow p-3 3/4sm:!text-base"
          />
        </InputWrapper>
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block">
          Password
        </label>
        <InputWrapper className="overflow-clip">
          <Icon name="lock-password" className="ml-3" />
          <Input
            placeholder="Enter your password"
            type={isShowPassword ? 'text' : 'password'}
            {...register('password')}
            className="flex-grow p-3 w-[20ch] 3/4sm:w-auto 3/4sm:!text-base"
          />
          <label className="relative flex items-center self-stretch px-3 has-[input:focus]:bg-paper">
            <input
              type="checkbox"
              onChange={showPassword}
              className="absolute h-full w-full opacity-0"
            />
            <Icon name={isShowPassword ? 'eye' : 'eye-off'} />
          </label>
        </InputWrapper>
      </div>
      <div className="flex items-center gap-2 3/4sm:col-span-2">
        <input id="remember-user-checkbox" type="checkbox" className="h-4 w-4" />
        <input id="remember-user-checkbox" type="checkbox" className="h-4 w-4" />
        <label htmlFor="remember-user-checkbox">Remember me</label>
      </div>
      <StandardButton
        type="submit"
        className="mt-2 shadow-sm shadow-default 3/4sm:col-span-2"
        loading={form.formState.isSubmitting}
      >
        Login
      </StandardButton>
    </form>
  );
}
