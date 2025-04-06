"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  Settings,
  CircleDollarSign,
  CoffeeIcon,
  LogOut,
  ChevronDown,
  LucideLogIn,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SwitchTheme from "./switchTheme";

const ProfileDropdown = ({ userData, handleLogout, logoutLoading }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={userData ? userData?.user?.profilePicture: ""}
              alt="Profile"
            />
            <AvatarFallback>{userData ? userData?.user?.name?.charAt(0) : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium">
              {userData ? userData?.user?.name : "Try Now"}
            </span>
            {userData && <span className="text-xs text-muted-foreground">Premium Plan</span>}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        {userData ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userData?.user?.displayName}</p>
                <p className="text-xs text-muted-foreground">{userData?.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CircleDollarSign className="mr-2 h-4 w-4" />
                <span>Subscription</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CoffeeIcon className="mr-2 h-4 w-4" />
                <span>Buy Dev a Coffee</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        ) : (
          <>
            <DropdownMenuGroup>
              <Link href="/auth/login">
                <DropdownMenuItem>
                  <LucideLogIn className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/auth/sign-up">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Sign up</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <CircleDollarSign className="mr-2 h-4 w-4" />
                <span>Subscription</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CoffeeIcon className="mr-2 h-4 w-4" />
                <span>Buy Dev a Coffee</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />
        {/* <div className="px-2 py-1.5">
          <SwitchTheme />
        </div> */}
        {userData && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleLogout()} 
              disabled={logoutLoading}
              className="text-red-500 focus:text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;