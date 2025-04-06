"use client";

import React, { useState, useEffect } from "react";
import QueryForm from "@/components/queryForm";
import { useQueryResponseMutation } from "@/lib/redux/api";
import { useParams } from "next/navigation";
import SuggestionResponse from "@/components/responses/suggestionObj";
import PestResponse from "@/components/responses/pestObj";
import JSON5 from "json5";

import { useGetUserQuery } from "@/lib/redux/authApi";
import { useRouter } from "next/navigation";

const QueryPage = () => {
  const { farmId } = useParams();

  const router = useRouter();
  const { data: user, isLoading: userLoading, isError } = useGetUserQuery();

  const [hasImage, setHasImage] = useState(false);
  const [queryType, setQueryType] = useState("");

  const [response, setResponse] = useState(null);
  const [queryResponse, { isLoading, isSuccess, error }] =
    useQueryResponseMutation();


    useEffect(() => {
      if (!userLoading && (!user || isError)) {
        router.replace("/auth/login");
      }
    }, [user, userLoading, isError, router]);
  const handleQuerySubmit = async (formData) => {
    const data = new FormData();
    data.append("file", formData.image);
    data.append("text", formData.text);
    data.append("growth", formData.growthStage);

    setQueryType(formData.type);
    if (formData.image) {
      setHasImage(true);
    }

    try {
    const result = await queryResponse({
      farmId,
      formData: data,
      type: formData.type,
    });
    console.log(result);
      setResponse(JSON5.parse(result.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="flex-1 p-4 container mx-auto py-8 px-4 max-w-4xl">
      <QueryForm onSubmit={handleQuerySubmit} loading={isLoading} />
      {queryType === "suggestion" && isSuccess && (
        <SuggestionResponse
          response={response}
          isError={error}
          isLoading={isLoading}
        />
      )}

      {queryType === "pest" && isSuccess && (
        <PestResponse
          response={response}
          isError={error}
          isLoading={isLoading}
        />
      )}
    </main>
  );
};

export default QueryPage;
