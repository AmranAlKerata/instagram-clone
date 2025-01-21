"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
    ArrowLeftStartOnRectangleIcon,
    ChevronDownIcon,

} from "@heroicons/react/16/solid";
import Image from "next/image";

export default function SignIn(): React.ReactNode {
    const { data: session } = useSession();

    if (session && session.user) {
        const { name = "", email = "", image = "" } = session.user;
        const firstName = name?.split(" ")[0] || "";

        return (
            <div>
                <div className="text-right">
                    <Menu>
                        <MenuButton className="inline-flex items-center gap-2 rounded-md bg-white dark:bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-black dark:text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Image
                                src={image || ''}
                                alt={name || ''}
                                width={20}
                                height={20}
                                className="size-4 rounded-full"
                            />
                            Hi, {firstName}
                            <ChevronDownIcon className="size-4 fill-current opacity-60" />
                        </MenuButton>

                        <MenuItems
                            transition
                            anchor="bottom end"
                            className="w-52 origin-top-right rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-gray-800 p-1 text-sm/6 text-gray-900 dark:text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white group flex w-full items-center gap-2 rounded-lg py-1.5 px-3">
                                {name}
                            </h3>
                            <div className="my-1 h-px bg-white/5" />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white group flex w-full items-center gap-2 rounded-lg py-1.5 px-3">
                                {email}
                            </h3>
                            <div className="my-1 h-px bg-white/5" />
                            <MenuItem>
                                <button
                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-100 dark:hover:bg-white/10"
                                    onClick={() => signOut()}
                                >
                                    <ArrowLeftStartOnRectangleIcon className="size-4 fill-gray-400 dark:fill-white/30" />
                                    Sign Out
                                </button>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
        );
    }

    return (
        <div className="login text-end text-blue-500">
            <button onClick={() => signIn("google")}>Sign in with Google</button>
        </div>
    );
}
