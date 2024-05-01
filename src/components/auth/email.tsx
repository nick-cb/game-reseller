import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { InterposedInput, PasswordInput } from '../Input';
import StandardButton from '../StandardButton';

export type EmailSignupFormPayload = {
  full_name: string | null;
  display_name: string | null;
  email: string;
  password: string;
  confirm_password: string;
  avatar: string;
};
export const EmailSignupForm = React.forwardRef<
  HTMLFormElement,
  React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    form: UseFormReturn<EmailSignupFormPayload, any, undefined>;
  }
>(function ({ form, className = '', ...props }, ref) {
  const { register } = form;

  return (
    <form
      ref={ref}
      className={
        'grid gap-x-4 gap-y-2 3/4sm:grid-cols-[max-content_min-content] 3/4sm:gap-y-4 ' + className
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
});

export type EmailLoginFormPayload = {
  email: string;
  password: string;
};
export const EmailLoginForm = React.forwardRef<
  HTMLFormElement,
  React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    form: UseFormReturn<EmailLoginFormPayload, any, undefined>;
  }
>(function ({ form, className = '', ...props }, ref) {
  const { register } = form;

  return (
    <form
      ref={ref}
      className={
        'grid gap-x-4 gap-y-2 3/4sm:grid-cols-[max-content_min-content] 3/4sm:gap-y-4 ' + className
      }
      {...props}
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
});
