'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  TreeDeciduous,
  DropletIcon,
  BarChartIcon,
  AlertCircle,
  Loader2,
  Sprout,
  Sun,
  Thermometer,
  CloudRain,
  Leaf,
  Droplets,
  Smile,
  Waves
} from 'lucide-react';

const SuggestionObj = ({ response, isLoading, isError }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const generateTabItems = () => {
    const tabs = [
      {
        value: 'overview',
        label: 'Overview',
        icon: <BarChartIcon className="w-5 h-5" />,
        iconActive: <Sprout className="w-5 h-5 text-green-500" />
      }
    ];

    if (response?.analysis?.weatherInfluence) {
      tabs.push({
        value: 'weather',
        label: 'Environment',
        icon: <DropletIcon className="w-5 h-5" />,
        iconActive: <Sun className="w-5 h-5 text-yellow-500" />
      });
    }

    if (response?.analysis?.soilInfluence) {
      tabs.push({
        value: 'soil',
        label: 'Soil',
        icon: <TreeDeciduous className="w-5 h-5" />,
        iconActive: <Leaf className="w-5 h-5 text-emerald-600" />
      });
    }

    if (response?.stepByStepSolution) {
      tabs.push({
        value: 'solutions',
        label: 'Solutions',
        icon: <Droplets className="w-5 h-5" />,
        iconActive: <Waves className="w-5 h-5 text-blue-500" />
      });
    }

    return tabs;
  };

  const tabItems = generateTabItems();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
          <p className="text-gray-600 font-semibold">Analyzing Agricultural Insights...</p>
        </div>
      </div>
    );
  }

  if (isError || !response) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Analysis Failed</AlertTitle>
        <AlertDescription>Unable to generate agricultural insights</AlertDescription>
      </Alert>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 max-w-4xl md:max-w-2xl sm:max-w-md"
    >
      <Card className="w-full shadow-lg">
        <CardContent className="pt-6">
          <div className="overflow-x-auto mb-4">
            <div className="flex space-x-2 pb-2">
              {tabItems.map((tab) => (
                <motion.button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`
                    flex-shrink-0 flex items-center justify-center 
                    px-4 py-2 rounded-full 
                    transition-all duration-300 
                    ${activeTab === tab.value 
                      ? 'bg-sky-100 scale-105' 
                      : 'text-gray-600 hover:bg-gray-200'
                    }
                  `}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeTab === tab.value ? tab.iconActive : tab.icon}
                  <span className="text-sm font-medium ml-2">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 p-4 rounded-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Sprout className="w-6 h-6 text-green-600" />
                  <h2 className="text-lg font-bold text-green-800">Agricultural Insight</h2>
                </div>
                <p className="text-gray-700"><strong>Issue:</strong> {response?.agriculturalIssue || 'Comprehensive Analysis Pending'}</p>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-600"><strong>Significance:</strong> {response?.analysis?.significance || 'Evaluating Impact'}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-md">
                  <h3 className="font-semibold text-green-900 mb-2">Visual Indicators</h3>
                  <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                    {(response?.analysis?.visualIndicators?.length > 0) ? (
                      response.analysis.visualIndicators.map((indicator, index) => (
                        <li key={index} className="flex items-center">
                          <Leaf className="w-4 h-4 mr-2 text-green-600" />
                          {indicator}
                        </li>
                      ))
                    ) : (
                      <li>No specific indicators detected</li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Weather */}
          {activeTab === 'weather' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-yellow-50 p-4 rounded-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Sun className="w-6 h-6 text-yellow-600" />
                  <h2 className="text-lg font-bold text-yellow-800">Environmental Conditions</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <div className="flex items-center mb-2">
                      <Thermometer className="w-5 h-5 mr-2 text-red-500" />
                      <h3 className="font-semibold">Temperature</h3>
                    </div>
                    <p className="text-gray-700">{response?.analysis?.weatherInfluence?.temperature || 'No data'}</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <div className="flex items-center mb-2">
                      <CloudRain className="w-5 h-5 mr-2 text-blue-500" />
                      <h3 className="font-semibold">Rainfall</h3>
                    </div>
                    <p className="text-gray-700">{response?.analysis?.weatherInfluence?.rainfall || 'No data'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Soil */}
          {activeTab === 'soil' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-emerald-50 p-4 rounded-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Leaf className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-lg font-bold text-emerald-800">Soil Analysis</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <h3 className="font-semibold mb-2">Soil Composition</h3>
                    <p>pH Level: {response?.analysis?.soilInfluence?.pH || 'N/A'}</p>
                    <p>Moisture: {response?.analysis?.soilInfluence?.moisture || 'N/A'}</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <h3 className="font-semibold mb-2">Organic Content</h3>
                    <p>Organic Matter: {response?.analysis?.soilInfluence?.organicMatter || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Solutions */}
          {activeTab === 'solutions' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 p-4 rounded-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Waves className="w-6 h-6 text-blue-600" />
                  <h2 className="text-lg font-bold text-blue-800">Actionable Solutions</h2>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h3 className="font-semibold mb-2">Recommendations</h3>
                  <p className="text-gray-700 mb-3">{response?.conciseRecommendations || 'No specific recommendations at this time'}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-md">
                  <h3 className="font-semibold text-blue-900 mb-2">Step-by-Step Guide</h3>
                  <ol className="list-decimal list-inside text-sm text-gray-800 space-y-2">
                    {(response?.stepByStepSolution?.length > 0) ? (
                      response.stepByStepSolution.map((step, index) => (
                        <li key={index} className="flex items-center">
                          <Smile className="w-4 h-4 mr-2 text-blue-600" />
                          {step}
                        </li>
                      ))
                    ) : (
                      <li>No step-by-step guidance available</li>
                    )}
                  </ol>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SuggestionObj;
