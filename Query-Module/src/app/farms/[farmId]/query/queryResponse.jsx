import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// Utility function to convert step-by-step solutions to formatted list
const formatSteps = (steps) => {
  return steps.split('**').filter(step => step.trim().length > 0).map((step, index) => {
    const [title, description] = step.split(':');
    return (
      <div key={index} className="mb-2 p-2 bg-gray-50 rounded-md">
        <span className="font-bold text-green-700">{title.trim()}</span>: 
        {/* <span className="ml-2 text-gray-800">{description.trim()}</span> */}
      </div>
    );
  });
};

// Component for text-based agricultural issue
const TextBasedIssue = ({ issue }) => {
  return (
    <Card className="w-full mx-auto border-2 border-green-100 shadow-lg">
      <CardHeader className="bg-green-50 p-4">
        <CardTitle className="text-2xl text-green-800">{issue.agriculturalIssue}</CardTitle>
        <CardDescription className="text-green-600">Agricultural Issue Analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="significance" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-green-100">
            <TabsTrigger 
              value="significance" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Significance
            </TabsTrigger>
            <TabsTrigger 
              value="solution" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Solution
            </TabsTrigger>
            <TabsTrigger 
              value="sustainability" 
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
            >
              Sustainability
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="significance">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <h3 className="text-lg font-semibold mb-2 text-green-700">Weather Influence</h3>
              <p className="text-gray-700">{issue.weatherInfluence}</p>
              
              <h3 className="text-lg font-semibold mt-4 mb-2 text-green-700">Soil Influence</h3>
              <p className="text-gray-700">{issue.soilInfluence}</p>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="solution">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Step-by-Step Solution</h3>
              {formatSteps(issue.stepByStepSolution)}
              
              <h3 className="text-lg font-semibold mt-4 mb-2 text-blue-700">Fertilizers & Pesticides</h3>
              <p className="text-gray-700">{issue.fertilizersPesticides}</p>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="sustainability">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <h3 className="text-lg font-semibold mb-2 text-yellow-700">Sustainability Mitigation</h3>
              {formatSteps(issue.sustainabilityMitigation)}
              
              <h3 className="text-lg font-semibold mt-4 mb-2 text-yellow-700">Summary</h3>
              <p className="text-gray-700">{issue.summary}</p>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Component for image-based agricultural issue
const ImageBasedIssue = ({ issue }) => {
  return (
    <Card className="w-full mx-auto border-2 border-blue-100 shadow-lg">
      <CardHeader className="bg-blue-50 p-4">
        <CardTitle className="text-2xl text-blue-800">Eggplant Disease Analysis</CardTitle>
        <CardDescription className="text-blue-600">Detailed Agricultural Image Assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-blue-100">
            <TabsTrigger 
              value="analysis" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Image Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="solution" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Solution
            </TabsTrigger>
            <TabsTrigger 
              value="management" 
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              Risk Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Image Analysis</h3>
              <p className="text-gray-700">{issue.imageAnalysis}</p>
              
              <h3 className="text-lg font-semibold mt-4 mb-2 text-blue-700">Weather Conditions</h3>
              <p className="text-gray-700">{issue.weatherConditionsInfluence}</p>
              
              <h3 className="text-lg font-semibold mt-4 mb-2 text-blue-700">Soil Conditions</h3>
              <p className="text-gray-700">{issue.soilConditionsInfluence}</p>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="solution">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <h3 className="text-lg font-semibold mb-2 text-green-700">Step-by-Step Solution</h3>
              {formatSteps(issue.stepByStepSolution)}
              
              <h3 className="text-lg font-semibold mt-4 mb-2 text-green-700">Fertilizers & Pesticides</h3>
              <p className="text-gray-700">{issue.fertilizersPesticides}</p>
              
              <h3 className="text-lg font-semibold mt-4 mb-2 text-green-700">Water Management</h3>
              <p className="text-gray-700">{issue.waterManagement}</p>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="management">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <h3 className="text-lg font-semibold mb-2 text-red-700">Sustainability & Risk Mitigation</h3>
              {formatSteps(issue.sustainabilityRiskMitigation)}
              
              <h3 className="text-lg font-semibold mt-4 mb-2 text-red-700">Crop Health Assessment</h3>
              <p className="text-gray-700">{issue.cropHealthAssessment}</p>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};


export default function AgriculturalIssues({response, hasImage}) {

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-900">Agricultural Issue Analysis</h1>
      
      <div className="grid grid-cols-1">
        {!hasImage && response&&  <TextBasedIssue issue={response} />}
        {hasImage && response && <ImageBasedIssue issue={response} />}
      </div>
    </div>
  );
}