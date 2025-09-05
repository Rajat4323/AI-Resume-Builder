"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const Header = () => {
  const user = useUser();

  return (
    <header className="sticky top-0 z-50">
      <nav className="backdrop-blur-md px-6 py-2.5">
        <div className="flex justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/" className="flex items-center flex-shrink-0">
            <img src="/icons/logo.svg" className="mr-2 sm:mr-3 h-6 sm:h-7 lg:h-9" alt="logo" />
            <span className="self-center text-lg sm:text-xl font-bold whitespace-nowrap">
              ResumeCraft
            </span>
          </Link>
          <div className="flex items-center lg:order-2 flex-shrink-0">
            {user?.isLoaded && !user?.isSignedIn ? (
              <Link
                href="/sign-in"
                className="text-gray-800 hover:bg-primary-700/10 duration-300 focus:ring-4 focus:ring-primary-700/30 font-medium rounded-full text-xs sm:text-sm px-2 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 mr-1 sm:mr-2 focus:outline-none"
              >
                Log in
              </Link>
            ) : (
              <>
                <div className="mr-2 sm:mr-4 h-full items-center align-middle flex max-md:hidden justify-center">
                  <UserButton showName={true} />
                </div>
                <div className="mr-2 sm:mr-4 h-full items-center align-middle hidden max-md:flex justify-center">
                  <UserButton showName={false} />
                </div>
              </>
            )}
            <Link
              href={`${!user?.isSignedIn ? "/sign-up" : "/dashboard"}`}
              className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-full text-xs sm:text-sm px-2 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 focus:outline-none"
            >
              {!user?.isSignedIn ? (
                <>
                  <span className="hidden sm:inline">Get started</span>
                  <span className="sm:hidden">Start</span>
                </>
              ) : (
                "Dashboard"
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;