import "./globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";
import {
  SearchbarDistributeBottom,
  SearchbarDistributeTop,
} from "../components/searchbar";
import QueryContext from "../components/QueryContext";
import Link from "next/link";
import { redirect } from "next/navigation";
import ActiveLink from "../components/ActiveLink";
// import OfflineBanner from "@/components/OfflineBanner";
// import "@/worker/offline_worker";
import { SnackContextProvider } from "@/components/SnackContext";
import { AuthControls } from "@/components/AuthControls";
import { HideOnRoute } from "@/components/HideOnRoutes";

const atkinsonHyper = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  preload: true,
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const handleSubmitSearch = async (data: FormData) => {
    "use server";
    redirect(`/browse?keyword=${data.get("keyword")}`);
  };

  return (
    <html lang="en" className="scroll-pt-[116px]">
      <QueryContext>
        <body className={atkinsonHyper.className + " bg-default"}>
          <SnackContextProvider>
            <header
              className="px-4 lg:px-24 xl:px-44 py-2 min-h-[56px]
              flex justify-between 
              bg-paper 
              fixed top-0 w-full z-20"
            >
              <Link href={`/`}>
                <Image
                  src={
                    "https://firebasestorage.googleapis.com/v0/b/images-b3099.appspot.com/o/269863143_480068400349256_2256909955739492979_n.png?alt=media&token=3a12e3c5-a40d-4747-8607-a42eb4917cd2"
                  }
                  alt={"logo-of-a-penguine"}
                  width={40}
                  height={40}
                />
              </Link>
              <HideOnRoute
                matches={[{ pathname: "/login" }, { pathname: "/signup" }]}
              >
                <div className="flex gap-2 text-sm pl-4 text-white_primary items-center">
                  <form
                    className="hidden h-full sm:block"
                    action={handleSubmitSearch}
                  >
                    <SearchbarDistributeTop />
                  </form>
                  {/* @ts-expect-error Server Component */}
                  <AuthControls />
                </div>
              </HideOnRoute>
            </header>
            <HideOnRoute
              matches={[
                { pathname: "/order" },
                { pathname: "/login" },
                { pathname: "/signup" },
              ]}
            >
              <nav
                className="px-4 lg:px-24 xl:px-44 
              flex gap-4 
              bg-default/90 backdrop-blur-lg 
              fixed w-full top-[56px] z-10"
              >
                <ActiveLink
                  matches={[{ name: "/", exact: true }, { name: "discover" }]}
                >
                  <Link
                    className="text-sm text-white/60 py-4 hover:text-white_primary transition-colors"
                    href={"/"}
                  >
                    Discover
                  </Link>
                </ActiveLink>
                <ActiveLink match="browse">
                  <Link
                    className="text-sm text-white/60 py-4 hover:text-white_primary transition-colors"
                    href={"/browse"}
                  >
                    Browse
                  </Link>
                </ActiveLink>
              </nav>
            </HideOnRoute>
            <main className="px-4 lg:px-24 xl:px-44 pt-[116px] pb-16 text-white_primary max-w-[1952px] mx-auto">
              {children}
              {modal}
            </main>
          </SnackContextProvider>
          <form
            className="fixed bottom-0 left-0 right-0 p-2 bg-default block sm:hidden z-50"
            action={handleSubmitSearch}
          >
            <SearchbarDistributeBottom />
          </form>
        </body>
      </QueryContext>
    </html>
  );
}
