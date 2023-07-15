import React from "react";
import {UseFormReturn} from "react-hook-form";
import {InterposedInput, PasswordInput} from "../Input";
import StandardButton from "../StandardButton";

export type EmailLoginFormPayload = {
  firstname: string;
  lastname: string;
  displayname: string;
  email: string;
  password: string;
  confirm_password: string;
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
        "grid grid-cols-[max-content_min-content] gap-x-4 gap-y-5 " + className
      }
      {...props}
    >
      <label htmlFor="first-name" className="w-max my-auto">
        Fist name
      </label>
      <InterposedInput
        id="first-name"
        leftIconProps={{
          className: "fill-transparent stroke-white ml-3",
        }}
        leftIcon="/svg/sprites/actions.svg#user-generic-1"
        className="p-3"
        placeholder="First name"
        {...register("firstname")}
      />
      <label htmlFor="last-name" className="w-max my-auto">
        Last name
      </label>
      <InterposedInput
        id="last-name"
        leftIconProps={{
          className: "fill-transparent stroke-white ml-3",
        }}
        leftIcon="/svg/sprites/actions.svg#user-generic-1"
        className="p-3"
        placeholder="Last name"
        {...register("lastname")}
      />
      <label htmlFor="display-name" className="w-max my-auto">
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
        {...register("displayname")}
      />
      <label htmlFor="email" className="w-max my-auto">
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
      <label htmlFor="password" className="w-max my-auto">
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
      <label htmlFor="confirm-password" className="w-max my-auto">
        Confirm password
      </label>
      <PasswordInput
        id={"confirm-password"}
        leftIconProps={{
          className: "fill-white !stroke-white ml-3",
        }}
        leftIcon={"/svg/sprites/actions.svg#password-retry"}
        placeholder="Re-Enter your password"
        className="p-3"
        {...register("confirm_password")}
      />
      <StandardButton
        type="submit"
        className="col-span-2 shadow shadow-default mt-2"
        loading={form.formState.isSubmitting}
      >
        Login
      </StandardButton>
    </form>
  );
});
