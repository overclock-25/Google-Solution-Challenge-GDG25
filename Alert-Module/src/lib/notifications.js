export const getDistrictRefs = (payload) => {
  return Object.keys(payload).reduce((dist_refs, key) => {
    const dist_code = key.split(',')[0].trim();
    const dist_path = `districts/IN${dist_code}`;
    dist_refs[dist_path] = key;
    return dist_refs;
  }, {});
};

export function annotateTokenstoFarms(farms, token_map) {
  return farms.map(dist_farms =>
    dist_farms.map(farm => ({
      ...farm,
      fcmTokens: token_map[farm.userRef.path] || [],
    }))
  );
}

export function groupFinalFarms(annotated_farms, dist_refs) {
  const final_farms = {};

  annotated_farms.forEach(dist_farms => {
    if (dist_farms.length === 0) return;

    const dist_path = dist_farms[0].districtRef.path;
    const dist_name = dist_refs[dist_path];
    final_farms[dist_name] = dist_farms;
  });
  return final_farms;
}

export function normalizeTimestamps(payload) {
  for (const alerts of Object.values(payload)) {
    alerts.forEach(alert => {
      alert.expires = alert.expires.toDate?.() || alert.expires;
      alert.effective = alert.effective.toDate?.() || alert.effective;
    });
  }
  return payload;
}

export function prepareNotification(alert, token) {
  return {
    token: token,
    notification: {
        title: alert.event,
        body: alert.instruction,
    },
    data: {
        headline: alert.headline,
        severity: alert.severity,
        district: alert.district,
    },
  };
};

export const apiresponse = [
    {
      "dist": "304, 24 Pargranas South, West Bengal",
      "alerts": [
        {
          "headline": "Heavy Rainfall Warning issued April 05 at 07:00 AM IST until April 06 at 07:00 PM IST by IMD Gangtok",
          "msgtype": "Alert",
          "severity": "Moderate",
          "urgency": "Expected",
          "areas": "Darjeeling; Kalimpong",
          "category": "Met",
          "certainty": "Likely",
          "event": "Heavy Rainfall",
          "note": "Heavy rainfall expected over Darjeeling and Kalimpong districts.",
          "effective": "2025-04-05T07:00:00+05:30",
          "expires": "2025-04-06T19:00:00+05:30",
          "desc": "Heavy rainfall is expected over Darjeeling and Kalimpong districts starting tomorrow morning and continuing for the next 36 hours. This may lead to landslides in vulnerable areas and disruption of transportation.",
          "instruction": "Avoid travel to landslide-prone areas. Exercise caution and stay updated on road conditions."
        },
        {
          "headline": "Landslide Advisory issued April 05 at 09:00 AM IST until April 06 at 09:00 AM IST by GDMA Darjeeling",
          "msgtype": "Alert",
          "severity": "Moderate",
          "urgency": "Ongoing",
          "areas": "Darjeeling Hill Sub-division",
          "category": "Geo",
          "certainty": "Observed",
          "event": "Landslide Advisory",
          "note": "Minor landslides reported in some parts of Darjeeling Hill Sub-division.",
          "effective": "2025-04-05T09:00:00+05:30",
          "expires": "2025-04-06T09:00:00+05:30",
          "desc": "Minor landslides have been reported in certain areas of the Darjeeling Hill Sub-division following recent rainfall. Exercise caution while traveling and avoid vulnerable slopes.",
          "instruction": "Be vigilant for signs of landslides. Report any new occurrences to local authorities."
        }
      ]
    },
    {
      "dist": "305, Bankura, West Bengal",
      "alerts": [
        {
          "headline": "Moderate Rainfall Warning issued April 05 at 08:00 AM IST until April 05 at 08:00 PM IST by IMD Jalpaiguri",
          "msgtype": "Alert",
          "severity": "Minor",
          "urgency": "Expected",
          "areas": "Jalpaiguri; Alipurduar",
          "category": "Met",
          "certainty": "Likely",
          "event": "Moderate Rainfall",
          "note": "Moderate rainfall expected over Jalpaiguri and Alipurduar districts.",
          "effective": "2025-04-05T08:00:00+05:30",
          "expires": "2025-04-05T20:00:00+05:30",
          "desc": "Moderate rainfall is expected over Jalpaiguri and Alipurduar districts during the day tomorrow.",
          "instruction": "Carry umbrellas or raincoats if venturing out."
        }
      ]
    },
  {
    "dist": "306, Purba Bardhaman, West Bengal",
    "alerts": []
  }
]