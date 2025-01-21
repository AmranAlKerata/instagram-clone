"use client";
import Image from "next/image";
import Link from "next/link";
import SingIn from "./SingIn";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { useSession } from "next-auth/react";
import AddPostModal from "./AddPostModal";

export default function Header(): React.ReactNode {
    const { data: session } = useSession();

    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <header className="grid grid-cols-3 justify-between items-center p-4 border-b border-gray-300 dark:border-dark-border">
            <div className="logo">
                <Link href="/">
                    <Image
                        src="/instagram.png"
                        alt="Instagram Logo Dark"
                        width={100}
                        height={100}
                        className="hidden lg:block dark:invert"
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
                    className="w-full p-2 text-sm text-gray-500 border-2 bg-gray-100 dark:bg-dark-secondary dark:border-dark-border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <div className="flex items-center justify-end gap-4">
                {session && session.user && (
                    <div className="add-post">
                        <AddPostModal />
                    </div>
                )}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-dark-secondary"
                >
                    {theme === "dark"
                        ? <SunIcon className="size-4" />
                        : <MoonIcon className="size-4" />}
                </button>
                <SingIn />
            </div>
        </header>
    );
}

