"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import RiceIcon from "@/components/svgIcons/riceIconSvg.svg";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
// import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";

import FarmForm from "@/components/farmForm";

import { useGetFarmsQuery } from "@/lib/redux/api";
import { useGetUserQuery } from "@/lib/redux/authApi";

import EnableNotificationModal from "@/components/enableNotification";
import SimpleRiceLoader from "@/components/riceLoader";
import FCMSetup from "@/components/FCMSetup";

const Home = () => {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetUserQuery();
  const { data: allFarms, isLoading: farmsLoading, error } = useGetFarmsQuery();

  const [isMobile, setIsMobile] = useState(false);
  const [location, setLocation] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFarm, setCurrentFarm] = useState("");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // console.log({user})
    if (!isLoading && (!user || isError)) {
      router.replace("/auth/login");
    }
  }, [user, isLoading, isError, router]);

  if (farmsLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <SimpleRiceLoader />
      </div>
    );
  }

  return (
    <div>
      {user && <FCMSetup userId={user?.user?.uid} />}
      <div className="m-4 text-xl font-semibold text-slate-800">Home</div>
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-4 flex flex-col gap-1">
            {allFarms?.map((farm) => (
              <Link href={`/farms/${farm?.id}`} key={farm?.id}>
                <Card className="flex items-center justify-between p-4 hover:shadow-md transition-shadow border-emerald-200">
                  <div className="flex items-center space-x-4">
                    <Image
                      src="/riceIconSvg.svg"
                      alt="Farmicon"
                      height={40}
                      width={40}
                    />

                    {/* <RiceIcon className="h-4 w-4" /> */}
                    <span className="font-medium">{farm?.name}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <span className="text-sm mr-2">View</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-700"
                      // onClick={() => handleBellClick(farm?.id)}
                    >
                      {farm?.notification ? <Bell /> : <BellOff />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <MoreVertical />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 shadow-lg flex justify-center">
            {!isMobile ? (
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTitle className="sr-only">Add Farm</DialogTitle>
                <DialogTrigger asChild>
                  <Button
                    className="w-[75%] md:w-[25%] rounded-2xl"
                    variant="success"
                    onClick={() => setModalOpen(true)}
                  >
                    + Add Farms
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <FarmForm onClose={() => setModalOpen(false)} />
                </DialogContent>
              </Dialog>
            ) : (
              <Sheet open={modalOpen} onOpenChange={setModalOpen}>
                <SheetTitle className="sr-only">Add Farm</SheetTitle>
                <SheetTrigger asChild>
                  <Button
                    className="w-[75%] md:w-[25%] rounded-2xl"
                    variant="success"
                    onClick={() => setModalOpen(true)}
                  >
                    + Add Farms
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="top-10">
                  <FarmForm onClose={() => setModalOpen(false)} />
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
      <EnableNotificationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        farmId={currentFarm}
      />
    </div>
  );
};

export default Home;
