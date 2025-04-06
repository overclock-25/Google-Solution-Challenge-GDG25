"use client";

import { AlertCircle, Loader2 } from "lucide-react";

const ResponseDisplay = ({ response, loading, error }) => {
  console.log({ response });
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-600">
          Processing your query with Gemini...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-red-500">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  return (
    <div className="prose prose-blue max-w-none">
      <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        {/* {Object.keys(response).map((key) => (
          <div key={key} style={{ marginBottom: '20px' }}>
            <h3>{key.replace(/_/g, ' ').toUpperCase()}</h3>
            <p>{response[key]}</p>
          </div>
        ))} */}

        <pre>{JSON.stringify(response, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ResponseDisplay;
