"use client";

import React, { useState, useEffect } from "react";
import { useHealthReportMutation } from "@/lib/redux/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/imageUpload";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Loader2 } from '@/components/ui/loader';

import { useGetUserQuery } from "@/lib/redux/authApi";
import { useRouter } from "next/navigation";
import HealthReport from "@/components/responses/healthReport";

const HealthReportPage = () => {
  const { farmId } = useParams();
  const router = useRouter();
  const { data: user, isLoading: userLoading, isError } = useGetUserQuery();

  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);
  const [growthStage, setGrowthStage] = useState("1");
  const [getHealthReport, { isLoading, error }] = useHealthReportMutation();

  useEffect(() => {
    if (!userLoading && (!user || isError)) {
      router.replace("/auth/login");
    }
  }, [user, userLoading, isError, router]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", image);
    data.append("growth", growthStage);
    
    try {
    const result = await getHealthReport({ farmId, formData: data });
    // setResponse(JSON.parse(result, null, 2))
      const resultData = await JSON.parse(result?.data);
      setResponse(resultData);
      console.dir(resultData, { depth: null });
    } catch (error) {
      console.log(error);
    }
  };

  // Render a section with a title and content
  const RenderSection = ({ title, children }) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="bg-gray-50 p-3 rounded-md">{children}</div>
    </div>
  );

  // Render a key-value pair
  const RenderKeyValue = ({ label, value }) => (
    <div className="flex justify-between py-1">
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );

  return (
    <main className="flex-1 p-4 m-5 container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="font-bold text-2xl mx-auto w-fit mb-2">
        Generate Health Report of your Plant
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="image-upload">Upload Image</Label>
          <ImageUpload onImageChange={setImage} />
        </div>

        <div className="space-y-2">
          <RadioGroup
            onValueChange={setGrowthStage}
            defaultValue={growthStage}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="seeding" />
              <Label htmlFor="seeding">Seeding</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="vegetative" />
              <Label htmlFor="vegetative">Vegetative</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="flowering" />
              <Label htmlFor="flowering">Flowering</Label>
            </div>
          </RadioGroup>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          variant="success"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
            </>
          ) : (
            "Generate Health Report"
          )}
        </Button>
      </form>

      

      <HealthReport response={response} />
    </main>
  );
};

export default HealthReportPage;
