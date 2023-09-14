import React from "react";
import Image from "next/image";

export const StrategyList = React.forwardRef<
  HTMLDivElement,
  {
    onClickStrategy: (
      event: React.MouseEvent<HTMLButtonElement, any>,
      strategy: "email" | "facebook" | "google" | "apple"
    ) => void;
    type: "signup" | "login";
  }
>(function ({ onClickStrategy, type }, ref) {
  const text = type === "login" ? "Login" : "Signup";

  return (
    <div ref={ref} className="flex flex-col justify-center items-center w-max">
      <button
        onClick={(event) => {
          onClickStrategy(event, "email");
        }}
        className="rounded overflow-hidden flex items-center bg-paper w-72 3/4sm:w-96 hover:brightness-125 transition-[filter]"
      >
        <div className="w-20 py-4 bg-default flex justify-center items-center">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/images-b3099.appspot.com/o/269863143_480068400349256_2256909955739492979_n.png?alt=media&token=3a12e3c5-a40d-4747-8607-a42eb4917cd2"
            width={24}
            height={24}
            alt=""
          />
        </div>
        <p className="px-4">{text} with Email</p>
      </button>
      <hr className="border-paper_2 my-2" />
      <button
        onClick={(event) => {
          onClickStrategy(event, "facebook");
        }}
        className="rounded overflow-hidden flex items-center bg-paper w-72 3/4sm:w-96 hover:brightness-125 transition-[filter]"
      >
        <div className="w-20 py-4 bg-[#135FC2] flex justify-center items-center">
          <Image
            src="/images/facebook-white.png"
            width={24}
            height={24}
            alt=""
          />
        </div>
        <p className="px-4">{text} with Facebook</p>
      </button>
      <hr className="border-paper_2 my-2" />
      <button
        onClick={(event) => {
          onClickStrategy(event, "facebook");
        }}
        className="rounded overflow-hidden flex items-center bg-paper w-72 3/4sm:w-96 hover:brightness-125 transition-[filter]"
      >
        <div className="w-20 py-4 bg-white_primary flex justify-center items-center">
          <Image
            src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
            width={24}
            height={24}
            alt=""
          />
        </div>
        <p className="px-4">{text} with Google</p>
      </button>
      <hr className="border-paper_2 my-2" />
      <button
        onClick={(event) => {
          onClickStrategy(event, "facebook");
        }}
        className="rounded overflow-hidden flex items-center bg-paper w-72 3/4sm:w-96 hover:brightness-125 transition-[filter]"
      >
        <div className="w-20 py-4 bg-white flex justify-center items-center">
          <Image src="/images/apple-black.png" width={24} height={24} alt="" />
        </div>
        <p className="px-4">{text} with Apple</p>
      </button>
    </div>
  );
});
