import Image from "next/image";
import { LoginView } from "@/components/auth/LoginView";

export default function LoginPage() {
  const random = Math.floor(Math.random() * 10 + 1);

  return (
    <div className="flex justify-center items-center my-auto">
      <div className="bg-paper_2 rounded flex overflow-hidden shadow-md shadow-paper_3">
        <Image
          src={`/images/login-splash-${
            random < 10 ? "0" + random : random
          }.jpg`}
          alt={""}
          width={500}
          height={250}
          className="object-cover"
        />
        <div className="px-4 overflow-hidden ">
          <LoginView modal={false} />
        </div>
      </div>
    </div>
  );
}
