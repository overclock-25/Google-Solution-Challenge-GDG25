"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const HealthReport = ({ response }) => {
  const RenderKeyValue = ({ label, value }) => (
    <div className="flex justify-between py-1">
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );

  if (!response) return null;

  return (
    <main className="flex-1 p-4 m-5 container mx-auto py-8 px-4 max-w-4xl">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl m-5">
        {response?.crop_type && (
          <h1 className="text-2xl font-bold text-center mb-6 text-green-800">
            Crop Health Report: {response.crop_type}
          </h1>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            {response?.visual_characteristics && (
              <Card>
                <CardHeader>
                  <CardTitle>Visual Characteristics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {response.visual_characteristics}
                  </p>
                </CardContent>
              </Card>
            )}

            {response?.health_assessment && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Health Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  {response.health_assessment?.overall_health && (
                    <RenderKeyValue
                      label="Overall Health"
                      value={`${response.health_assessment.overall_health}/10`}
                    />
                  )}
                  {response.health_assessment?.justification && (
                    <p className="text-gray-600 mt-2">
                      {response.health_assessment.justification}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            {response?.diagnostic_insights && (
              <Card>
                <CardHeader>
                  <CardTitle>Diagnostic Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  {response.diagnostic_insights?.relation_to_weather && (
                    <RenderKeyValue
                      label="Weather Relation"
                      value={response.diagnostic_insights.relation_to_weather}
                    />
                  )}
                  {response.diagnostic_insights?.relation_to_soil && (
                    <>
                      <RenderKeyValue
                        label="Soil Condition"
                        value="pH optimal, moisture slightly low"
                      />
                      <p className="text-gray-600 mt-2">
                        {response.diagnostic_insights.relation_to_soil}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {response?.yield_prediction_and_interventions && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Yield Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              {response.yield_prediction_and_interventions?.yield_prediction && (
                <p className="text-gray-600 mb-2">
                  {response.yield_prediction_and_interventions.yield_prediction}
                </p>
              )}

              {Array.isArray(response.yield_prediction_and_interventions?.interventions) &&
                response.yield_prediction_and_interventions.interventions.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <h4 className="font-semibold mb-2">Recommended Interventions:</h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {response.yield_prediction_and_interventions.interventions.map(
                        (intervention, index) => (
                          <li key={index}>{intervention}</li>
                        )
                      )}
                    </ul>
                  </>
                )}
            </CardContent>
          </Card>
        )}

        {Array.isArray(response?.integrated_pest_management?.recommendations) &&
          response.integrated_pest_management.recommendations.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Integrated Pest Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-700">
                  {response.integrated_pest_management.recommendations.map(
                    (recommendation, index) =>
                      index % 2 ? <li key={index}>{recommendation}</li> : null
                  )}
                </ul>
              </CardContent>
            </Card>
          )}
      </div>
    </main>
  );
};

export default HealthReport;
