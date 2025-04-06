"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  User,
  Settings,
  CircleDollarSign,
  CoffeeIcon,
  AlignJustify,
  LucideLogIn} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { useGetUserQuery } from "@/lib/redux/authApi";
import { useLogoutUserMutation } from "@/lib/redux/authApi";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const {
    data: userData,
    error,
    isLoading: userLoading,
    refetch,
  } = useGetUserQuery();
  const [
    logout,
    { data: logoutData, error: logoutError, isLoading: logoutLoading },
  ] = useLogoutUserMutation();

  // console.log(userData?.user)
  const handleLogout = async () => {
    await logout();
    window.location.href="/auth/login"
    // refetch();
  };

  return (
    <nav className="flex items-center justify-between px-4 w-full">
      {/* Logo/brand on the left */}
      <div className="flex items-center justify-between w-full md:w-fit">
        <Link href="/" className="text-xl font-bold mr-4 flex gap-1 text-green-500">
          <Image src="/leafIcon.svg" alt="logo" height={32} width={32} /> GreenTip
        </Link>
        
        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="ms-2">
              <AlignJustify />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-[95%] justify-between my-2">
                <div className="border-t-2">
                  <ul className="flex flex-col gap-4 my-2">
                    {userData && (
                      <>
                        <li className="flex gap-2 font-bold text-lg">
                          <User /> Profile
                        </li>
                        <li className="flex gap-2 font-bold text-lg">
                          <Settings /> Settings
                        </li>
                      </>
                    )}
                    {!userData && (
                      <>
                        <Link href="/auth/login">
                          <li className="flex gap-2 font-bold text-lg">
                            <LucideLogIn /> Login
                          </li>
                        </Link>
                        <Link href="/auth/sign-up">
                          <li className="flex gap-2 font-bold text-lg">
                            <User /> Sign up
                          </li>
                        </Link>
                      </>
                    )}
                    <li className="flex gap-2 font-bold text-lg">
                      <CircleDollarSign /> Subscription
                    </li>
                    <li className="flex gap-2 text-md">
                      <CoffeeIcon /> Buy Dev a Coffee
                    </li>
                  </ul>
                </div>
                <div className="">
                  <div className="flex gap-2 items-center justify-between border-t-2 mt-2 pt-2">
                    <div className="flex gap-2 items-center">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>{userData ? userData?.user?.name?.charAt(0) : "U"}</AvatarFallback>
                      </Avatar>
                      <div className="">
                        <p className="font-bold text-md">
                          {userData ? `${userData?.user?.name}` : "Try Now"}
                        </p>
                        {userData && <p className="text-gray-500">Premium Plan</p>}
                      </div>
                    </div>
                    {userData && (
                      <Button onClick={() => handleLogout()} disabled={logoutLoading}>
                        Logout
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Navigation links - shown only on desktop */}
      {/* <div className="hidden md:flex items-center space-x-4">
        <Link href="/features" className="hover:text-primary">
          Features
        </Link>
        <Link href="/pricing" className="hover:text-primary">
          Pricing
        </Link>
        <Link href="/about" className="hover:text-primary">
          About
        </Link>
      </div> */}
      
      {/* Profile dropdown - shown only on desktop */}
      <div className="hidden md:block">
        <ProfileDropdown 
          userData={userData} 
          handleLogout={handleLogout} 
          logoutLoading={logoutLoading} 
        />
      </div>
    </nav>
  );
};

export default Navbar;