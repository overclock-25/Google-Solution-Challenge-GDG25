"use client";
import React, {useEffect} from "react";
import {
  Bell,
  Search,
  MoreVertical,
  MapPin,
  PlusCircle,
  BellOff,
  Droplets,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import JSON5 from "json5";

import { useRouter } from "next/navigation";

import { useState } from "react";
import { useGetFarmByIdQuery } from "@/lib/redux/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import EnableNotificationModal from "@/components/enableNotification";
import { Button } from "@/components/ui/button";
import SimpleRiceLoader from "@/components/riceLoader";

import { useGetUserQuery } from "@/lib/redux/authApi";

const waterSourceMap = {
  1: "River",
  2: "Underground",
  3: "Rainwater / Others",
};

const FarmManagementApp = () => {
  const { farmId } = useParams();
  const router = useRouter();
  const { data: user, isLoading: userLoading, isError } = useGetUserQuery();
  const { data, error, isLoading } = useGetFarmByIdQuery(farmId);

  const [isModalOpen, setModalOpen] = useState(false);
  // console.log(data);

  const farmData = data?.farm;
  const interactions = farmData?.interactions?.slice()?.reverse();

  // console.log(interactions, "interactions")
  
  useEffect(() => {
    if (!userLoading && (!user || isError)) {
      router.replace("/auth/login");
    }
  }, [user, userLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <SimpleRiceLoader />
      </div>
    );
  }

  return (
    <main className="flex-1 p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{farmData?.name}</h1>
        <Button variant="ghost" onClick={() => setModalOpen(true)}>
          {farmData?.notification ? <Bell size={20} /> : <BellOff size={20} />}
        </Button>
      </header>
      <div className="flex items-center gap-2 bg-emerald-50 p-2 rounded-lg">
        <MapPin size={20} className="text-green-800" />
        {`Lat: ${farmData?.location?._latitude}, Long: ${farmData?.location?._longitude}`}
      </div>
      <div className="flex items-center gap-2 bg-emerald-50 p-2 rounded-lg mt-2">
        <Droplets size={20} className="text-blue-700" />
        {`${waterSourceMap[farmData?.waterSource]} (Major Water Source)`}
      </div>

      <div className="mt-4 space-y-3 flex flex-col gap-1">
        <Link href={`/farms/${farmId}/health-report`}>
          <Card className="p-4 flex items-center hover:bg-green-100 justify-between border-emerald-200">
            <div className="flex items-center gap-2">
              <PlusCircle size={20} /> Generate Health Report
            </div>
            <span>&rarr;</span>
          </Card>
        </Link>
        <Link href={`/farms/${farmId}/start-harvest`}>
          <Card className="p-4 flex items-center hover:bg-green-100 justify-between border-emerald-200">
            <div className="flex items-center gap-2">
              <PlusCircle size={20} /> Start Harvesting
            </div>
            <span>&rarr;</span>
          </Card>
        </Link>
        <Link href={`/farms/${farmId}/query`}>
          <Card className="p-4 flex items-center hover:bg-green-100 justify-between border-emerald-200">
            <div className="flex items-center gap-2">
              <PlusCircle size={20} /> Get Suggestions
            </div>
            <span>&rarr;</span>
          </Card>
        </Link>
      </div>
      <div className="mt-6 bg-emerald-100 p-4 rounded-lg overflow-auto h-[50%]">
        <h2 className="text-lg font-semibold">Previous Interactions</h2>
        <div className="mt-3 border-red-200 space-y-2">
          {interactions?.length > 0 &&
            interactions?.map((interaction, index) => {
              // console.log({ index });
              const parsedData =
                typeof interaction?.data === "string"
                  ? JSON5.parse(interaction?.data)
                  : interaction?.data;
              return (
                <Link href={`/farms/${farmId}/query/${interactions?.length-1-index}`} key={index}>
                  <Card className="p-3 flex items-center hover:bg-green-50 justify-between my-2 border-emerald-100">
                    <div className="flex items-center gap-2">
                      <Search size={20} /> {parsedData?.title}
                    </div>
                    <MoreVertical size={20} />
                  </Card>
                </Link>
              );
            })}
        </div>
      </div>
      <EnableNotificationModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        farmId={farmId}
      />
    </main>
  );
};

export default FarmManagementApp;
