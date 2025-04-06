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