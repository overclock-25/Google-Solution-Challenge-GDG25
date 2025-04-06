"use client";
import { Loader2 } from "lucide-react";
import { FaCheckCircle, FaDotCircle, FaInfoCircle, FaRedo } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Home() {
  const [dataFromServer, setDataFromServer] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchData = async () => {
    try {
      setIsLoading(true); // Set loading to true before fetching data
      const response = await fetch(`/api/ready`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDataFromServer(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally, set an error state here to display an error message
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-center text-gray-800 mb-4">
          <FaDotCircle className="text-red-500 text-sm animate-ping" /><div className="text-cyan-500 text-3xl ml-2" >App Status</div>
            <FaRedo onClick={fetchData} className={`text-cyan-500 text-xl font-bold mr-1 ${isLoading ? 'animate-spin' : ''}`} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Loader2 className="animate-spin mr-1 text-2xl" />Loading data from api server...
            {/* <p>Loading data from server...</p> */}
          </div>
        ) : dataFromServer ? (
          <div className="space-y-3">
            {dataFromServer.api_key ?
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-yellow-800">API Key:</span>
                  <span className="flex items-center space-x-2 text-yellow-600"><FaCheckCircle className="text-xl mr-1" /> Valid</span>
                </div>
              </div> :
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-red-800">API Key:</span>
                  <span className="flex items-center space-x-2 text-red-600"><FaInfoCircle className="text-xl mr-1" />Invalid</span>
                </div>
              </div>}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-800">Model:</span>
                <span className="text-blue-600">{dataFromServer.model}</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-green-800">Status:</span>
                <span className="text-green-600">{dataFromServer.status}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-red-500 flex justify-center items-center space-x-2">
            <p>Failed to load data from server.</p>
          </div>
        )}
        {/* <div className="flex justify-center items-center">
          <button type="button" onClick={fetchData} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2">
            <FaRedo className={`text mr-1 ${isLoading ? 'animate-spin' : ''}`} /> Recheck
          </button>
        </div> */}
      </div>
    </div>
  );
}
