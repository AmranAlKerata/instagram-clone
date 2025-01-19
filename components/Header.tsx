import Image from "next/image";
import Link from "next/link";
import SingIn from "./SingIn";
import { SessionProvider } from "next-auth/react";
export default function Header(): React.ReactNode {
  return (
    <header className="grid grid-cols-3 justify-between items-center p-4 border-b border-gray-300">
      <div className="logo">
        <Link href="/">
          <Image
            src="/instagram.png"
            alt="Instagram Logo"
            width={100}
            height={100}
            className="hidden lg:block"
          />
          <Image
            src="/instagram-icon.png"
            alt="Instagram Logo"
            width={35}
            height={35}
            className="lg:hidden"
          />
        </Link>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search"
          name="search"
          className="w-full p-2 text-sm text-gray-500 border-2 bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <SessionProvider>
        <SingIn />
      </SessionProvider>
    </header>
  );
}
