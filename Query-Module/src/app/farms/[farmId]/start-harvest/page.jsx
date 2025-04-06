"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetCropsQuery, useStartHarvestMutation } from "@/lib/redux/api";
import { useGetUserQuery } from "@/lib/redux/authApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import StartHarvestResponse from "@/components/responses/startHarvest";
import CropSuggestions from "@/components/responses/cropSuggestion";

export default function StartHarvestPage() {
  const { farmId } = useParams();
  const router = useRouter();
  const { data: user, isLoading, isError: userError } = useGetUserQuery();
  const [cropName, setCropName] = useState("");
  const [shouldFetchCrops, setShouldFetchCrops] = useState(false);
  const [response, setResponse] = useState(null);

  const [
    getStartHarvest,
    { isLoading: isHarvestLoading, isError, isSuccess: isHarvestSuccess },
  ] = useStartHarvestMutation();

  const {
    data: cropsData,
    isLoading: isCropsLoading,
    isError: isCropsError,
    isSuccess: isCropsSuccess,
  } = useGetCropsQuery(farmId, {
    skip: !shouldFetchCrops,
  });

  useEffect(() => {
    if (!isLoading && (!user || userError)) {
      router.replace("/auth/login");
    }
  }, [user, isLoading, userError, router]);

  console.log(cropsData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cropName.trim()) return;
    try {
      const result = await getStartHarvest({ farmId, cropName });
      console.log({ result });
      setResponse(JSON.parse(result.data));
      setCropName("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className="p-6 shadow-lg w-full max-w-2xl mx-auto mt-8 h-fit">
      <h2 className="text-xl font-semibold text-center mb-4">
        Get detailed Harvest Information about any Crop
      </h2>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Enter Crop name..."
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="border p-2 rounded-md flex-1"
            />
            <Button
              type="submit"
              variant="success"
              disabled={isHarvestLoading || !cropName.trim()}
              className="sm:w-auto w-full"
            >
              {isHarvestLoading ? "Please wait..." : "Get Harvest Info"}
            </Button>
          </div>

          {isError && (
            <p className="text-red-500 text-center">Error Fetching data!</p>
          )}
        </form>

        {!isHarvestSuccess && (
          <div className="my-10 mx-auto">
            <Button
              variant="success"
              onClick={() => setShouldFetchCrops(true)}
              disabled={isCropsLoading}
            >
              {isCropsLoading ? "Please wait..." : "Get Crops Suggestion"}
            </Button>
          </div>
        )}
      </CardContent>
      {isHarvestSuccess && !isCropsSuccess && (
        <StartHarvestResponse response={response} />
      )}
      {isCropsSuccess && !isHarvestSuccess && (
        <CropSuggestions cropSuggestions={cropsData?.crops} />
      )}
    </Card>
  );
}
