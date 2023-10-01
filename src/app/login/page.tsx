import { LoginView } from "@/components/auth/LoginView";
import Image from "next/image";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const random = Math.floor(Math.random() * 10 + 1);

  return (
    <div className="flex justify-center items-center my-auto">
      <Image
        src={`/images/login-splash-${random < 10 ? "0" + random : random}.jpg`}
        alt={""}
        width={500}
        height={250}
        className="object-cover fixed inset-0 z-0 blur-lg opacity-40 h-full w-full"
      />
      <div className="bg-paper_2 rounded flex overflow-hidden shadow-md shadow-paper_3 z-[1]">
        <Image
          src={`/images/login-splash-${
            random < 10 ? "0" + random : random
          }.jpg`}
          alt={""}
          width={500}
          height={250}
          className="object-cover hidden lg:block"
        />
        <div className="px-4 overflow-hidden flex-grow">
          <LoginView modal={false} order={searchParams["order"]} />
        </div>
      </div>
    </div>
  );
}
