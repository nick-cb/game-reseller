import React from "react";
import { UseFormReturn } from "react-hook-form";
import { InterposedInput, PasswordInput } from "../Input";
import StandardButton from "../StandardButton";

export type EmailSignupFormPayload = {
  full_name: string | null;
  display_name: string | null;
  email: string;
  password: string;
  confirm_password: string;
};
export const EmailSignupForm = React.forwardRef<
  HTMLFormElement,
  React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > & { form: UseFormReturn<EmailSignupFormPayload, any, undefined> }
>(function ({ form, className = "", ...props }, ref) {
  const { register } = form;

  return (
    <form
      ref={ref}
      className={
        "grid 3/4sm:grid-cols-[max-content_min-content] gap-x-4 gap-y-2 3/4sm:gap-y-4 " + className
      }
      {...props}
    >
      <label htmlFor="first-name" className="w-max my-auto block">
        Full name
      </label>
      <InterposedInput
        id="first-name"
        leftIconProps={{
          className: "fill-transparent stroke-white ml-3",
        }}
        leftIcon="/svg/sprites/actions.svg#user-generic-1"
        className="p-3"
        placeholder="Full name"
        {...register("full_name")}
      />
      <hr className="3/4sm:hidden my-1 border-paper_2" />
      <label htmlFor="display-name" className="w-max my-auto block">
        Display name
      </label>
      <InterposedInput
        id="display-name"
        leftIconProps={{
          className: "fill-transparent stroke-white ml-3",
        }}
        leftIcon="/svg/sprites/actions.svg#spartan-helmet"
        className="p-3"
        placeholder="Darth vader"
        {...register("display_name")}
      />
      <hr className="3/4sm:hidden my-1 border-paper_2" />
      <label htmlFor="email" className="w-max my-auto block">
        Email
      </label>
      <InterposedInput
        id="email"
        type={"email"}
        leftIconProps={{
          className: "fill-transparent stroke-white ml-3",
        }}
        leftIcon="/svg/sprites/actions.svg#email"
        placeholder="Enter your email"
        className="p-3"
        {...register("email")}
      />
      <hr className="3/4sm:hidden my-1 border-paper_2" />
      <label htmlFor="password" className="w-max my-auto block">
        Password
      </label>
      <PasswordInput
        id={"password"}
        leftIconProps={{
          className: "fill-white !stroke-white ml-3",
        }}
        placeholder="Enter your password"
        className="p-3 !w-[26ch]"
        {...register("password")}
      />
      <label htmlFor="confirm-password" className="w-max my-auto block">
        Confirm password
      </label>
      <PasswordInput
        id={"confirm-password"}
        leftIconProps={{
          className: "fill-white !stroke-white ml-3",
        }}
        leftIcon={"/svg/sprites/actions.svg#password-retry"}
        className="p-3 !w-[26ch]"
        placeholder="Re-Enter your password"
        {...register("confirm_password")}
      />
      <StandardButton
        type="submit"
        className="3/4sm:col-span-2 shadow shadow-default mt-2"
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
  React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > & { form: UseFormReturn<EmailLoginFormPayload, any, undefined> }
>(function ({ form, className = "", ...props }, ref) {
  const { register } = form;

  return (
    <form
      ref={ref}
      className={
        "grid 3/4sm:grid-cols-[max-content_min-content] gap-x-4 gap-y-2 3/4sm:gap-y-4 " +
        className
      }
      {...props}
    >
      <label htmlFor="email" className="w-max my-auto block">
        Email
      </label>
      <InterposedInput
        id="email"
        type={"email"}
        leftIconProps={{
          className: "fill-transparent stroke-white ml-3",
        }}
        leftIcon="/svg/sprites/actions.svg#email"
        placeholder="Enter your email"
        className="p-3"
        {...register("email")}
      />
      <hr className="3/4sm:hidden my-1 border-paper_2" />
      <label htmlFor="password" className="w-max my-auto block">
        Password
      </label>
      <PasswordInput
        id={"password"}
        leftIconProps={{
          className: "fill-white !stroke-white ml-3",
        }}
        placeholder="Enter your password"
        className="p-3"
        {...register("password")}
      />
      <hr className="3/4sm:hidden my-1 border-paper_2" />
      <div className="3/4sm:col-span-2 flex items-center gap-2">
        <input type="checkbox" />
        <label>Remember me</label>
      </div>
      <StandardButton
        type="submit"
        className="3/4sm:col-span-2 shadow shadow-default mt-2"
        loading={form.formState.isSubmitting}
      >
        Login
      </StandardButton>
    </form>
  );
});
