"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useGetFarmByIdQuery } from "@/lib/redux/api";
import StartHarvest from "@/components/responses/startHarvest";
import HealthReport from "@/components/responses/healthReport";
import SuggestionObj from "@/components/responses/suggestionObj";
import PestObj from "@/components/responses/pestObj";

import { useGetUserQuery } from "@/lib/redux/authApi";
import { useRouter } from "next/navigation";

const QueryResponse = () => {
  const { queryId, farmId } = useParams();
  const router = useRouter();
  const { data: user, isLoading: userLoading, isError } = useGetUserQuery();
  const [query, setQuery] = useState(null);

  const { data, error, isLoading } = useGetFarmByIdQuery(farmId);

  useEffect(() => {
    if (!userLoading && (!user || isError)) {
      router.replace("/auth/login");
    }
  }, [user, userLoading, isError, router]);
  useEffect(() => {
    try{
      const textQuery = data?.farm?.interactions?.[queryId]?.data;
      setQuery(typeof textQuery === "string" ? JSON.parse(textQuery) : textQuery);
    }catch(err){
      console.log(err)
    }
  }, [queryId, data]);

  return (
    <div className="w-fit mx-auto p-3 max-w-4xl overflow-auto">
      {data?.farm?.interactions?.[queryId]?.type === "start-harvest" && (
        <StartHarvest response={query} />
      )}
      {data?.farm?.interactions?.[queryId]?.type === "health-report" &&
        query && <HealthReport response={query} />}

      {data?.farm?.interactions?.[queryId]?.type === "suggestion" && query && (
        <SuggestionObj response={query} />
      )}

      {data?.farm?.interactions?.[queryId]?.type === "pest" && query && (
        <PestObj response={query} />
      )}
    </div>
  );
};

export default QueryResponse;
