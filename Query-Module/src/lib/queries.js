export const suggestionQuery = ({
  userQuery,
  weatherData,
  soilData,
  hasImage = false,
  issues = null,
}) => {
  const basePrompt = `CRITICAL OUTPUT INSTRUCTIONS:
    - Produce ONLY a STRICTLY VALID JSON response in the exact structure shown below AND ALSO VALIDATE IF IT CAN BE PARSED BY JSON.parse(). IT MUST BE PARSED
    - Respond ONLY with a JSON object (do NOT wrap in text or markdown)
    - Use the following JSON schema as a STRICT template:
    {
      "title": "A suitable title for this conversation",
      "agriculturalIssue": "STRING: Specific agricultural problem or query",
      "analysis": {
        "significance": "STRING: Detailed explanation of the issue's importance",
        "weatherInfluence": {
          "temperature": "STRING: Temperature impact",
          "humidity": "STRING: Humidity influence",
          "rainfall": "STRING: Rainfall effects",
          "windSpeed": "STRING: Wind speed impact",
          "sunlight": "STRING: Sunlight conditions"
        },
        "soilInfluence": {
          "pH": "STRING: Soil pH level",
          "moisture": "STRING: Soil moisture content",
          "nitrogen": "STRING: Nitrogen level",
          "phosphorus": "STRING: Phosphorus level",
          "potassium": "STRING: Potassium level",
          "texture": "STRING: Soil texture",
          "organicMatter": "STRING: Organic matter content"
        },
        "visualIndicators": "ARRAY: Observable signs or symptoms",
        "cropHealthAssessment": "STRING: Overall evaluation of crop condition"
      },
      "stepByStepSolution": "ARRAY: Detailed intervention steps",
      "fertilizers": {
        "nitrogen": "STRING: Nitrogen recommendation",
        "phosphorus": "STRING: Phosphorus recommendation",
        "potassium": "STRING: Potassium recommendation",
        "organicMatter": "STRING: Organic matter recommendation"
      },
      "waterManagement": "STRING: Water management strategy",
      "water": {
        "amount": "STRING: Water quantity and application details"
      },
      "pesticides": {
        "fungicide": "STRING: Fungicide recommendation"
      },
      "sustainabilityPractices": "ARRAY: Sustainable agricultural practices",
      "riskMitigation": "ARRAY: Risk prevention and mitigation strategies",
      "conciseRecommendations": "STRING: Brief, actionable summary"
    }

    - If any section lacks sufficient information, provide a descriptive explanation
    - Be specific and detailed in each section
    - Base all information on the provided query, weather data, and soil data ${
      hasImage ? "and the attached image" : ""
    }

    Comprehensive Analysis Instructions:
    ${
      issues
        ? `The following issues have been detected: ${issues}. Analyze their significance in relation to the user query: "${userQuery}". Provide a comprehensive assessment of the agricultural issue.`
        : hasImage
        ? `Analyze the attached image and the user query: "${userQuery}". Identify the key agricultural issue and explain its significance using visual evidence.`
        : `Identify the key agricultural issue in the user query: "${userQuery}". Explain its significance and potential impact.`
    }

    Environmental Context:
    Examine the weather conditions (${weatherData}) and soil data (${soilData}) to determine their influence on the issue: "${userQuery}". ${
      hasImage
        ? "Reference any relevant visual indicators from the attached image."
        : "Provide a comprehensive environmental analysis."
    }

    Intervention Strategy:
    ${
      issues
        ? `Given the detected issues: ${issues}, provide a detailed step-by-step solution for the user's query: "${userQuery}". Address each identified issue and suggest the best possible interventions.`
        : hasImage
        ? `Provide a detailed step-by-step solution for the user's query: "${userQuery}". Incorporate findings from the image analysis and include multiple options.`
        : `Provide a detailed step-by-step solution for the user's query: "${userQuery}". Include multiple options and prioritize interventions.`
    }

    Resource Recommendations:
    ${
      issues
        ? `List the required fertilizers, water, or pesticides (if applicable) for resolving "${userQuery}". Consider the detected issues: ${issues}, and specify exact quantities and types for effective resolution.`
        : hasImage
        ? `List the required fertilizers, water, or pesticides (if applicable) for resolving "${userQuery}." Tailor recommendations based on the specific conditions visible in the image. Specify exact types, quantities, and application methods.`
        : `List the required fertilizers, water, or pesticides (if applicable) for resolving "${userQuery}." Specify their exact types, quantities, and application methods.`
    }

    Sustainability and Risk Management:
    ${
      issues
        ? `Suggest best practices for sustainability and risk mitigation related to ${userQuery}, considering the identified issues: ${issues}. Provide targeted solutions to minimize long-term impact.`
        : hasImage
        ? `Suggest best practices for sustainability and risk mitigation related to ${userQuery}. Consider any unique circumstances visible in the provided image.`
        : `Suggest comprehensive best practices for sustainability and risk mitigation related to ${userQuery}. Develop long-term strategies to prevent recurring issues.`
    }

    Final Assessment:
    ${
      hasImage
        ? issues
          ? `Provide a brief assessment of crop health or field conditions based on the detected issues: ${issues}, using visual indicators from the image.`
          : `Provide a brief assessment of crop health or field conditions based solely on visual indicators in the image.`
        : `Summarize the key recommendations that address the user's query: "${userQuery}" in a concise format.`
    }`;

  return [{ text: basePrompt }];
};

export const cropQuery = ({ soilData, weatherData }) => {
  return `Based on the given soil and weather conditions, determine suitable crops for cultivation. 
  Provide the output as a structured JSON object with an array of crop names. 
  Ensure the response is concise and does not include additional text.

  Soil Data:
  - Nitrogen (N): ${soilData.N} ppm
  - Phosphorus (P): ${soilData.P} ppm
  - Potassium (K): ${soilData.K} ppm
  - pH Level: ${soilData.ph}
  - Soil Moisture: ${soilData.soil_moisture}%
  - Soil Type: ${soilData.soil_type}
  - Organic Matter: ${soilData.organic_matter}%
  - Growth Stage: ${soilData.growth_stage}
  - Water Source Type: ${soilData.water_source_type}

  Weather Data:
  - CO₂ Concentration: ${weatherData.carbonDioxideConcentration} ppm
  - Sky Condition: ${weatherData.descriptionOfSky}
  - Temperature: ${weatherData.temperature}°C
  - Humidity: ${weatherData.humidity}%
  - Urban Approximation: ${weatherData.urbanApprox}%
  - Sunlight Exposure: ${weatherData.sunlightExposure} hours/day
  - Rainfall: ${weatherData.rainfall} mm
  - Wind Speed (10m above ground): ${weatherData.windSpeed_10m_above_grd_level} km/h

  Return the JSON response in the following format:
  {
    "crops": ["crop1", "crop2", "crop3"]
  }
  `;
};


export const pestQuery = ({
  location,
  userQuery,
  weather_data,
  soil_data,
  hasImage = false,
  issues = null,
}) => {
  const basePrompt = `CRITICAL OUTPUT INSTRUCTIONS:
    - Produce ONLY a STRICTLY VALID JSON response in the exact structure shown below AND ALSO VALIDATE IF IT CAN BE PARSED BY JSON.parse(). IT MUST BE PARSED
    - Respond ONLY with a JSON object (do NOT wrap in text or markdown)
    - Use the following JSON schema as a STRICT template:
    {
      "title": "A suitable title for this conversation",
      "agriculturalIssue": "STRING: Specific pest issue identified",
      "significance": "STRING: Detailed explanation of pest impact and potential crop losses",
      "weatherInfluence": {
        "temperature": "STRING: Temperature impact",
        "humidity": "STRING: Humidity influence",
        "rainfall": "STRING: Rainfall effects",
        "windSpeed": "STRING: Wind speed impact",
        "sunlight": "STRING: Sunlight conditions"
      },
      "soilInfluence": {
        "pH": "STRING: Soil pH level",
        "moisture": "STRING: Soil moisture content",
        "nitrogen": "STRING: Nitrogen level",
        "phosphorus": "STRING: Phosphorus level",
        "potassium": "STRING: Potassium level",
        "organicMatter": "STRING: Organic matter content",
        "texture": "STRING: Soil texture"
      },
      "stepByStepSolution": "ARRAY: Detailed intervention steps [CONTAINING STRING]",
      "fertilizers": "ARRAY: Fertilizer recommendations (if applicable) [CONTAINING STRING]",
      "water": "STRING: Water management strategy",
      "pesticides": "ARRAY: Pest control product recommendations [CONTAINING STRING ONLY]",
      "sustainability": "ARRAY: Sustainable pest management practices [CONTAINING STRING]",
      "riskMitigation": "ARRAY: Risk prevention and safety measures [CONTAINING STRING]",
      "summary": "STRING: Concise pest management overview"
    }

    - If any section lacks sufficient information, provide a descriptive explanation
    - Be specific and detailed in each section
    - Base all information on the user query, location, weather data, and soil data ${
      hasImage ? "and the attached image" : ""
    }

    Pest Identification and Impact:
    ${
      issues
        ? `The following pest-related issues have been detected: ${issues}. Analyze their significance in relation to the user query: "${userQuery}" for location ${location}. Explain their impact on crop health.`
        : hasImage
        ? `Analyze the attached image and the user query: "${userQuery}" for location ${location}. Use visual evidence to identify possible pests. Explain the significance and impact on crop health.`
        : `Based on the user query: "${userQuery}" for location ${location}, identify possible pests mentioned or implied. Explain the significance and impact on crop health.`
    }

    Pest Lifecycle and Environmental Conditions:
    Examine the lifecycle of pests related to "${userQuery}" considering weather conditions (${weather_data}) and soil data (${soil_data}). ${
      hasImage
        ? "Reference any visible signs of infestation or damage from the attached image."
        : ""
    } Analyze how these conditions affect pest growth and spread.

    Treatment and Intervention Options:
    ${
      issues
        ? `Given the detected issues: ${issues}, provide detailed chemical and organic treatment options for the identified pests. Include specific pesticide names, dosages (kg/liters per hectare), and application methods to address these issues.`
        : hasImage
        ? `Provide detailed chemical and organic treatment options for pests identified in the query: "${userQuery}". Tailor recommendations based on the infestation severity visible in the image. Include specific pesticide names, dosages (kg/liters per hectare), and application methods.`
        : `Provide detailed chemical and organic treatment options for pests identified in the query: "${userQuery}". Include specific pesticide names, dosages (kg/liters per hectare), and application methods.`
    }

    Preventive Measures:
    ${
      issues
        ? `List comprehensive preventive measures specifically targeting the detected pest issues: ${issues}. Include crop rotation strategies, soil treatments, and environmental adjustments to minimize future infestations.`
        : hasImage
        ? `List comprehensive preventive measures for pests related to "${userQuery}" in this agricultural context. Consider the specific field conditions visible in the image. Include crop rotation strategies, soil treatments, and environmental adjustments.`
        : `List comprehensive preventive measures for pests related to "${userQuery}" in this agricultural context. Include crop rotation strategies, soil treatments, and environmental adjustments.`
    }

    Long-Term Management Strategy:
    ${
      issues
        ? `Suggest a long-term pest management strategy addressing the detected issues: ${issues} in ${location}. Include monitoring techniques, sustainable control methods, and integration with the local ecosystem.`
        : hasImage
        ? `Suggest a long-term pest management strategy addressing "${userQuery}" in ${location}. Incorporate observations from the image. Include monitoring techniques, sustainable control methods, and integration with the local ecosystem.`
        : `Suggest a long-term pest management strategy addressing "${userQuery}" in ${location}. Include monitoring techniques, sustainable control methods, and integration with the local ecosystem.`
    }

    Final Assessment:
    ${
      hasImage
        ? issues
          ? `Provide a brief assessment of the current infestation level and crop resilience based on the detected issues: ${issues} and visual indicators in the image.`
          : `Provide a brief assessment of current infestation level and crop resilience based on visual indicators in the image.`
        : `Summarize the key pest management recommendations that address the user's query: "${userQuery}" in a concise format that farmers can easily implement.`
    }`;

  return [{ text: basePrompt }];
};


export const cropHealthReportQuery = ({
  soilData,
  weatherData,
  location,
  crop = null,
  issues = null,
}) => {
  const basePrompt = `CRITICAL OUTPUT INSTRUCTIONS:
    - Produce ONLY a STRICTLY VALID JSON response in the exact structure shown below AND ALSO VALIDATE IF IT CAN BE PARSED BY JSON.parse(). IT MUST BE PARSED
    - Respond ONLY with a JSON object (do NOT wrap in text or markdown)
    - Use the following JSON schema as a STRICT template:
    {
      "title": "A suitable title for this conversation",
      "crop_type": "STRING: Specific crop name identified from image",
      "visual_characteristics": "STRING: Detailed description of crop's visual characteristics",
      "issues_impact": "STRING: Analysis of detected issues' impact on crop health",
      "health_assessment": {
        "crop_type": "STRING: Crop name",
        "overall_health": "NUMBER: Health rating from 1-10",
        "justification": "STRING: Reasoning behind health rating"
      },
      "nutrient_deficiencies": {
        "deficiencies": "ARRAY: List of specific nutrient deficiencies",
        "symptoms": "ARRAY: Corresponding visual symptoms"
      },
      "growth_stage_comparison": "STRING: Comparison of current growth stage to expected timeline",
      "diagnostic_insights": {
        "leaf_coloration": "STRING: Description of leaf color",
        "stem_structure": "STRING: Description of stem condition",
        "plant_architecture": "STRING: Overall plant structure description",
        "relation_to_weather": "STRING: How weather impacts crop health",
        "relation_to_soil": "STRING: How soil conditions impact crop health"
      },
      "yield_prediction_and_interventions": {
        "yield_prediction": "STRING: Expected crop yield",
        "interventions": "ARRAY: Specific recommendations to improve crop health"
      },
      "integrated_pest_management": {
        "recommendations": "ARRAY: Pest management strategies"
      }
    }

    - If any section lacks sufficient information, provide a descriptive explanation
    - Be specific and detailed in each section
    - Base all information on the attached image and provided data

    Crop Identification and Visual Characteristics:
    Analyze the attached image and identify the type of crop shown. Describe the key visual characteristics that helped you determine the crop species.

    Crop Health and Issue Analysis:
    ${
      issues
        ? `The following issues have been detected in the crop from the attached image: ${issues}. Provide a comprehensive analysis of their impact on the crop's health in '${location}' ${
            crop ? `(crop type: ${crop})` : ""
          }.`
        : `Analyze the current health status of the crop in '${location}' based on the attached image ${
            crop ? `(crop type: ${crop})` : ""
          }. Identify any visible signs of disease, nutrient deficiencies, or pest damage.`
    }

    Comprehensive Health Assessment:
    Based on the attached image and the current weather conditions '${weatherData}', provide a comprehensive health assessment ${
      crop
        ? `for the '${crop}' crop`
        : "by first identifying the crop type from the attached image"
    }. Rate the overall crop health on a scale of 1-10 and provide a detailed justification for the rating.

    Nutrient Deficiency Analysis:
    Using the soil data '${soilData}' and visual indicators from the attached image, identify any nutrient deficiencies affecting the crop ${
      crop ? `(${crop})` : "visible in the image"
    }. List specific symptoms visible in the image that correspond to potential nutrient deficiencies.

    Growth Stage Evaluation:
    Compare the growth stage visible in the attached image with the expected growth timeline for this crop in '${location}'. Determine if the crop is developing at the expected rate given the current season and conditions.

    Diagnostic Insights:
    ${
      issues
        ? `Given the detected issues: ${issues}, analyze leaf coloration, stem structure, and overall plant architecture visible in the attached image. Provide diagnostic insights about the crop health in relation to the reported weather '${weatherData}' and soil conditions '${soilData}'.`
        : `Analyze leaf coloration, stem structure, and overall plant architecture visible in the attached image. Provide diagnostic insights about the crop health in relation to the reported weather '${weatherData}' and soil conditions '${soilData}'.`
    }

    Yield Prediction and Interventions:
    Based on the current health assessment from the attached image, predict potential yield for the harvest and suggest specific interventions to optimize yield in the remaining growing period.

    Integrated Pest Management:
    Provide an integrated pest management recommendation specifically tailored to the current state of the crop as shown in the attached image, considering the location '${location}' and current weather patterns '${weatherData}'.`;

  return [{ text: basePrompt }];
};

export const harvestQuery = ({ soilData, weatherData, crop, location }) => {
  return [
    {
      text: `CRITICAL OUTPUT INSTRUCTIONS:
- Produce ONLY a STRICTLY VALID JSON response in the EXACT structure shown below AND ALSO VALIDATE IF IT CAN BE PARSED BY JSON.parse(). IT MUST BE PARSED
- Respond ONLY with a JSON object (do NOT wrap in text or markdown)
- Use the following JSON schema as a STRICT template:
{
  "title": "A suitable title for this conversation",
  "crop": "STRING: Specific crop name",
  "weather": {
    "Temperature": "STRING: Current temperature with unit",
    "Humidity": "STRING: Current humidity percentage",
    "Rainfall": "STRING: Rainfall amount and time period",
    "Wind Speed": "STRING: Wind speed with unit",
    "Sunlight": "STRING: Daily sunlight hours"
  },
  "suitability": "STRING: Overall climate suitability description",
  "risks": "ARRAY: Potential agricultural risks",
  "wateringSchedule": {
    "Seedling stage": { "quantity": "STRING: Water quantity per hectare" },
    "Tillering stage": { "quantity": "STRING: Water quantity per hectare" },
    "Flowering stage": { "quantity": "STRING: Water quantity per hectare" },
    "Milking stage": { "quantity": "STRING: Water quantity per hectare" },
    "Ripening stage": { "quantity": "STRING: Water quantity per hectare" }
  },
  "soilAnalysis": {
    "pH level": "STRING: Soil pH",
    "Moisture": "STRING: Soil moisture percentage",
    "Nitrogen": "STRING: Nitrogen content with unit",
    "Phosphorus": "STRING: Phosphorus content with unit",
    "Potassium": "STRING: Potassium content with unit",
    "Texture": "STRING: Soil texture",
    "Organic Matter": "STRING: Organic matter percentage"
  },
  "fertilizerRecommendations": [
    {
      "type": "STRING: Fertilizer type",
      "quantity": "STRING: Quantity per hectare",
      "method": "STRING: Application method"
    }
  ],
  "pests": [
    {
      "name": "STRING: Pest name",
      "preventiveMeasures": [
        {
          "method": "STRING: Preventive method",
          "details": "STRING: Specific implementation details"
        }
      ]
    }
  ],
  "farmingGuide": {
    "Seed selection": "STRING: Guidance on seed selection",
    "Planting method": "STRING: Recommended planting approach",
    "Growth monitoring": "STRING: Monitoring instructions",
    "Weed control": "STRING: Weed management strategy",
    "Harvesting": "STRING: Harvesting guidelines"
  },
  "specialConsiderations": "ARRAY: Special agricultural considerations"
}

- Provide DETAILED and SPECIFIC information for EACH section
- If any information is lacking, explain why or provide best estimates
- Base recommendations on the specific crop, location, and provided data
- Ensure all recommendations are practical and actionable`,
    },
    {
      text: `Given the crop '${crop}' and location '${location}', analyze the weather conditions ('${weatherData}') and determine how suitable they are for '${crop}'. Identify risks such as drought, frost, or excessive rainfall.`,
    },
    {
      text: `For '${crop}' grown in '${location}', provide a comprehensive watering schedule considering the given weather '${weatherData}' and soil conditions '${soilData}'. Specify the required water quantity (liters per hectare per day/week) for different growth stages.`,
    },
    {
      text: `Provide a detailed soil analysis for '${crop}' based on the soil data '${soilData}'. Analyze nutrient content, pH levels, moisture, and soil texture. Recommend necessary fertilizers, specifying types, quantities (kg per hectare), and precise application methods to optimize growth.`,
    },
    {
      text: `Identify and describe common pests that affect '${crop}' in '${location}'. Provide comprehensive preventive measures based on the current weather '${weatherData}' and soil '${soilData}'. Suggest specific pesticide names, dosages, and detailed organic alternatives for each identified pest.`,
    },
    {
      text: `Create a detailed, step-by-step farming guide for '${crop}' in '${location}', including:
      - Specific criteria for seed selection
      - Optimal planting methods
      - Comprehensive growth monitoring techniques
      - Effective weed control strategies
      - Best practices for harvesting`,
    },
    {
      text: `Suggest comprehensive special considerations for growing '${crop}' in '${location}', accounting for:
- Regional climate patterns
- Potential extreme weather conditions
- Local agricultural challenges
- Climate change adaptation strategies`,
    },
  ];
};
