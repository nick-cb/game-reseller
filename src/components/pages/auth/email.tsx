import React, { useContext } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { InterposedInput, PasswordInput } from '../../Input';
import StandardButton from '../../StandardButton';
import AuthActions from '@/actions/auth-actions';
import { BASE_URL } from '@/utils/config';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SnackContext } from '@/components/SnackContext';
import { useSearchParams } from 'next/navigation';
import { mergeCls } from '@/utils';

export type EmailSignupFormPayload = {
  full_name: string | null;
  display_name: string | null;
  email: string;
  password: string;
  confirm_password: string;
  avatar: string;
};
export const EmailSignupForm = React.forwardRef<HTMLFormElement, JSX.IntrinsicElements['form']>(
  function ({ className = '', ...props }, ref) {
    const searchParams = useSearchParams();
    const order = searchParams.get('order');
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
      defaultValues: {
        full_name: null,
        display_name: null,
        email: '',
        password: '',
        confirm_password: '',
        avatar: '',
      },
    });
    const { handleSubmit, register } = form;

    const submitHandler = async (values: EmailSignupFormPayload) => {
      const { error } = await AuthActions.users.signup(values);
      if (error) {
        showMessage({ message: error.message, type: 'error' });
        return;
      }
      showMessage({ message: 'Signup successfully', type: 'success' });
      setTimeout(() => {
        if (order) {
          location.reload();
        } else {
          window.location.href = BASE_URL;
        }
      }, 1000);
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit(submitHandler)}
        className={
          'grid gap-x-4 gap-y-2 3/4sm:grid-cols-[max-content_min-content] 3/4sm:gap-y-4 ' +
          className
        }
        {...props}
      >
        <label htmlFor="first-name" className="my-auto block w-max">
          Full name
        </label>
        <InterposedInput
          id="first-name"
          leftIconProps={{
            className: 'fill-transparent stroke-white ml-3',
          }}
          leftIcon="/svg/sprites/actions.svg#user-generic-1"
          className="p-3"
          placeholder="Full name"
          {...register('full_name')}
        />
        <hr className="my-1 border-paper_2 3/4sm:hidden" />
        <label htmlFor="display-name" className="my-auto block w-max">
          Display name
        </label>
        <InterposedInput
          id="display-name"
          leftIconProps={{
            className: 'fill-transparent stroke-white ml-3',
          }}
          leftIcon="/svg/sprites/actions.svg#spartan-helmet"
          className="p-3"
          placeholder="Darth vader"
          {...register('display_name')}
        />
        <hr className="my-1 border-paper_2 3/4sm:hidden" />
        <label htmlFor="email" className="my-auto block w-max">
          Email
        </label>
        <InterposedInput
          id="email"
          type={'email'}
          leftIconProps={{
            className: 'fill-transparent stroke-white ml-3',
          }}
          leftIcon="/svg/sprites/actions.svg#email"
          placeholder="Enter your email"
          className="p-3"
          {...register('email')}
        />
        <hr className="my-1 border-paper_2 3/4sm:hidden" />
        <label htmlFor="password" className="my-auto block w-max">
          Password
        </label>
        <PasswordInput
          id={'password'}
          leftIconProps={{
            className: 'fill-white !stroke-white ml-3',
          }}
          placeholder="Enter your password"
          className="!w-[26ch] p-3"
          {...register('password')}
        />
        <label htmlFor="confirm-password" className="my-auto block w-max">
          Confirm password
        </label>
        <PasswordInput
          id={'confirm-password'}
          leftIconProps={{
            className: 'fill-white !stroke-white ml-3',
          }}
          leftIcon={'/svg/sprites/actions.svg#password-retry'}
          className="!w-[26ch] p-3"
          placeholder="Re-Enter your password"
          {...register('confirm_password')}
        />
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
);

export type EmailLoginFormPayload = {
  email: string;
  password: string;
};
export const EmailLoginForm = React.forwardRef<HTMLFormElement, JSX.IntrinsicElements['form']>(
  function (props, ref) {
    const { className, ...rest } = props;
    const searchParams = useSearchParams();
    const order = searchParams.get('order');
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
    const { register, handleSubmit } = form;

    const submitHandler = async (values: EmailLoginFormPayload) => {
      const { error } = await AuthActions.users.login(values);
      if (error) {
        showMessage({ message: error.message, type: 'error' });
        return;
      }
      showMessage({ message: 'Login successfully', type: 'success' });
      setTimeout(() => {
        if (order) {
          window.location.href = BASE_URL + '/' + order + '/order';
        } else {
          window.location.href = BASE_URL;
        }
      }, 1000);
    };

    return (
      <form
        ref={ref}
        className={mergeCls(
          className,
          'grid gap-x-4 gap-y-2 [grid-area:1_/_1] 3/4sm:grid-cols-[max-content_min-content] 3/4sm:gap-y-4'
        )}
        onSubmit={handleSubmit(submitHandler)}
        {...rest}
      >
        <label htmlFor="email" className="my-auto block w-max">
          Email
        </label>
        <InterposedInput
          id="email"
          type={'email'}
          leftIconProps={{
            className: 'fill-transparent stroke-white ml-3',
          }}
          leftIcon="/svg/sprites/actions.svg#email"
          placeholder="Enter your email"
          className="p-3 !text-base"
          containerProps={{ className: 'w-80' }}
          {...register('email')}
        />
        <hr className="my-1 border-paper_2 3/4sm:hidden" />
        <label htmlFor="password" className="my-auto block w-max">
          Password
        </label>
        <PasswordInput
          id={'password'}
          leftIconProps={{
            className: 'fill-white !stroke-white ml-3',
          }}
          placeholder="Enter your password"
          className="p-3 !text-base"
          containerProps={{ className: 'w-80' }}
          {...register('password')}
        />
        <hr className="my-1 border-paper_2 3/4sm:hidden" />
        <div className="flex items-center gap-2 3/4sm:col-span-2">
          <input type="checkbox" />
          <label>Remember me</label>
        </div>
        <StandardButton
          type="submit"
          className="mt-2 shadow shadow-default 3/4sm:col-span-2"
          loading={form.formState.isSubmitting}
        >
          Login
        </StandardButton>
      </form>
    );
  }
);
