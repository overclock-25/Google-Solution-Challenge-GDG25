import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Thermometer,
  Droplet,
  CloudRain,
  Wind,
  Sun,
  Layers,
  Leaf,
  CloudSun,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RiceCultivationDashboard = ({ response }) => {
  const [activeTab, setActiveTab] = useState("weather");

  const tabs = [
    {
      value: "weather",
      label: "Weather",
      icon: CloudSun,
      content: () => (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Weather Conditions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(response?.weather)?.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
              >
                <WeatherIcon type={key} />
                <div>
                  <p className="font-semibold text-gray-700">{key}</p>
                  <p className="text-gray-600">{value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">{response?.suitability}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {response?.risks?.map((risk, index) => (
                <Badge key={index} variant="destructive">
                  {risk}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "soil",
      label: "Soil",
      icon: Leaf,
      content: () => (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Soil Analysis & Nutrients
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-green-600">
                Soil Composition
              </h3>
              {Object.entries(response?.soilAnalysis)?.map(([key, value]) => (
                <div key={key} className="flex justify-between border-b py-1">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-green-600">
                Fertilizer Recommendations
              </h3>
              {response?.fertilizerRecommendations?.map((fert, index) => (
                <div key={index} className="bg-green-50 p-2 rounded-lg mb-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">{fert.type}</span>
                    <span className="text-gray-600">{fert.quantity}</span>
                  </div>
                  <p className="text-sm text-gray-500">Method: {fert.method}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "guide",
      label: "Guide",
      icon: Layers,
      content: () => (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Farming Guide
          </h2>
          <div className="space-y-4">
            {Object.entries(response?.farmingGuide)?.map(([key, value]) => (
              <div key={key} className="border-b pb-2">
                <h4 className="font-semibold text-green-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </h4>
                <p className="text-gray-600">{value}</p>
              </div>
            ))}
            <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
              <h4 className="font-semibold text-yellow-700">
                Special Considerations
              </h4>
              <div className="">
                {response?.specialConsiderations?.map((sc, index) => (
                  <p className="text-gray-700" key={index}>
                    {sc}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const WeatherIcon = ({ type }) => {
    const icons = {
      Temperature: <Thermometer className="w-6 h-6 text-blue-500" />,
      Humidity: <Droplet className="w-6 h-6 text-blue-500" />,
      Rainfall: <CloudRain className="w-6 h-6 text-blue-500" />,
      "Wind Speed": <Wind className="w-6 h-6 text-blue-500" />,
      Sunlight: <Sun className="w-6 h-6 text-yellow-500" />,
    };
    return icons[type] || null;
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="w-full">
        <div className="relative flex justify-between items-center bg-gray-100 rounded-full p-1 mx-4 mb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`
                  flex flex-col items-center justify-center 
                  w-full py-2 rounded-full transition-all duration-300 
                  relative z-10 ${
                    activeTab === tab.value
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }
                `}
              >
                {activeTab === tab.value && (
                  <motion.div
                    layoutId="bubble"
                    className="absolute inset-0 bg-green-600 rounded-full"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 mb-1 z-20 relative ${
                    activeTab === tab.value ? "text-white" : "text-gray-500"
                  }`}
                />
                <span className="text-xs z-20 relative">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="px-4">
          {tabs.find((tab) => tab.value === activeTab)?.content()}
        </div>
      </div>
    </div>
  );
};

export default RiceCultivationDashboard;
