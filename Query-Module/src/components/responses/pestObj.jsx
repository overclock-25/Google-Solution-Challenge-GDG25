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
  ShieldIcon,
  LeafIcon,
  Bug,
  CloudSun,
  Droplet,
  ScrollText,
  ShieldCheck,
  Layers
} from 'lucide-react';

const PestObj = ({ response, isLoading, isError }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const generateTabItems = () => {
    const tabs = [
      { 
        value: 'overview', 
        label: 'Overview', 
        icon: <BarChartIcon className="w-5 h-5" />,
        activeIcon: <Bug className="w-5 h-5 text-red-500" />
      }
    ];

    if (response?.weatherInfluence) {
      tabs.push({
        value: 'weather',
        label: 'Environment',
        icon: <DropletIcon className="w-5 h-5" />,
        activeIcon: <CloudSun className="w-5 h-5 text-blue-500" />
      });
    }

    if (response?.soilInfluence) {
      tabs.push({
        value: 'soil',
        label: 'Soil',
        icon: <Layers className="w-5 h-5" />,
        activeIcon: <Layers className="w-5 h-5 text-green-500" />
      });
    }

    if (response?.stepByStepSolution) {
      tabs.push({
        value: 'solutions',
        label: 'Solutions',
        icon: <LeafIcon className="w-5 h-5" />,
        activeIcon: <ScrollText className="w-5 h-5 text-purple-500" />
      });
    }

    if (response?.sustainability || response?.riskMitigation) {
      tabs.push({
        value: 'strategy',
        label: 'Strategy',
        icon: <ShieldIcon className="w-5 h-5" />,
        activeIcon: <ShieldCheck className="w-5 h-5 text-green-600" />
      });
    }

    return tabs;
  };

  const tabItems = generateTabItems();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-red-600" />
          <p className="text-gray-600 font-semibold">Analyzing Pest Insights...</p>
        </div>
      </div>
    );
  }

  if (isError || !response) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Analysis Failed</AlertTitle>
        <AlertDescription>Unable to generate pest management insights</AlertDescription>
      </Alert>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 max-w-4xl"
    >
      <Card className="w-full shadow-lg">
        <CardContent className="pt-6">

          {/* Tabs */}
          {tabItems.length > 0 && (
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
                        ? 'bg-sky-100 text-sky-700' 
                        : 'text-gray-600 hover:bg-gray-200'
                      }
                    `}
                    whileTap={{ scale: 0.95 }}
                  >
                    {activeTab === tab.value ? tab.activeIcon : tab.icon}
                    <span className="text-base font-medium ml-2">{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-red-50 p-4 rounded-lg space-y-4"
            >
              {response.title && (
                <div className="flex items-center space-x-3">
                  <Bug className="w-7 h-7 text-red-600" />
                  <h2 className="text-xl font-bold text-red-800">{response.title}</h2>
                </div>
              )}
              {response.agriculturalIssue && (
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <p className="text-base text-gray-700">
                    <strong className="block mb-2">Issue:</strong> {response.agriculturalIssue}
                  </p>
                </div>
              )}
              {response.significance && (
                <div className="bg-red-100 p-4 rounded-md">
                  <h3 className="font-semibold text-red-900 mb-3 text-lg">Significance</h3>
                  <p className="text-base text-gray-800">{response.significance}</p>
                </div>
              )}
              {response.summary && (
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold mb-3 text-lg">Summary</h3>
                  <p className="text-base text-gray-700">{response.summary}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Weather Tab */}
          {activeTab === 'weather' && response.weatherInfluence && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 p-4 rounded-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CloudSun className="w-7 h-7 text-blue-600" />
                  <h2 className="text-xl font-bold text-blue-800">Environmental Conditions</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(response.weatherInfluence).map(([key, value]) => (
                    <div key={key} className="bg-white p-4 rounded-md shadow-sm">
                      <h3 className="font-semibold capitalize mb-3 text-lg">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </h3>
                      <p className="text-base text-gray-700">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Soil Tab */}
          {activeTab === 'soil' && response.soilInfluence && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 p-4 rounded-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Layers className="w-7 h-7 text-green-600" />
                  <h2 className="text-xl font-bold text-green-800">Soil Analysis</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(response.soilInfluence).map(([key, value]) => (
                    <div key={key} className="bg-white p-4 rounded-md shadow-sm">
                      <h3 className="font-semibold capitalize mb-3 text-lg">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </h3>
                      <p className="text-base text-gray-700">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Solutions Tab */}
          {activeTab === 'solutions' && response.stepByStepSolution && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-purple-50 p-4 rounded-lg space-y-4"
            >
              <div className="flex items-center space-x-3">
                <ScrollText className="w-7 h-7 text-purple-600" />
                <h2 className="text-xl font-bold text-purple-800">Step-by-Step Solutions</h2>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <ol className="list-decimal list-inside text-base text-gray-700 space-y-3">
                  {response.stepByStepSolution.map((step, index) => (
                    <li key={index} className="pl-2">{step}</li>
                  ))}
                </ol>
              </div>
              {response.pesticides?.length > 0 && (
                <div className="bg-purple-100 p-4 rounded-md">
                  <h3 className="font-semibold text-purple-900 mb-3 text-lg">Pesticide Recommendations</h3>
                  <ul className="list-disc list-inside text-base text-gray-800">
                    {response.pesticides.map((pesticide, index) => (
                      <li key={index}>{pesticide}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {/* Strategy Tab */}
          {activeTab === 'strategy' && (response.sustainability || response.riskMitigation) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 p-4 rounded-lg space-y-4"
            >
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-7 h-7 text-green-600" />
                <h2 className="text-xl font-bold text-green-800">Management Strategy</h2>
              </div>

              {response.sustainability?.length > 0 && (
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold mb-3 text-lg">Sustainability Practices</h3>
                  <ul className="list-disc list-inside text-base text-gray-700 space-y-2">
                    {response.sustainability.map((practice, index) => (
                      <li key={index}>{practice}</li>
                    ))}
                  </ul>
                </div>
              )}

              {response.riskMitigation?.length > 0 && (
                <div className="bg-green-100 p-4 rounded-md">
                  <h3 className="font-semibold text-green-900 mb-3 text-lg">Risk Mitigation</h3>
                  <ul className="list-disc list-inside text-base text-gray-800 space-y-2">
                    {response.riskMitigation.map((risk, index) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PestObj;
