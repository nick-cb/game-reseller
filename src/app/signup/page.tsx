import Image from 'next/image';
import { SignupView } from '@/components/pages/auth/SignupView';

export default function SignupPage(props: PageProps) {
  const { searchParams } = props;
  const random = Math.floor(Math.random() * 10 + 1);

  return (
    <div className="my-auto flex items-center justify-center">
      <Image
        src={`/images/login-splash-${random < 10 ? '0' + random : random}.jpg`}
        alt={''}
        width={500}
        height={250}
        className="fixed inset-0 z-0 h-full w-full object-cover opacity-40 blur-lg"
      />
      <div className="z-[1] flex w-11/12 overflow-hidden rounded bg-paper_2 shadow shadow-paper_3/80 2xl:w-4/5">
        <div>
        <Image
          src={`/images/login-splash-${random < 10 ? '0' + random : random}.jpg`}
          alt={''}
          width={500}
          height={250}
          className="w-full hidden h-full object-cover md:block"
        />
        </div>
        <div className="min-w-max flex-grow overflow-hidden px-4 md:px-8">
          <SignupView searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}
