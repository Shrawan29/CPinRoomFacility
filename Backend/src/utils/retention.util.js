const MS_PER_DAY = 24 * 60 * 60 * 1000;

const parseRetentionDays = (raw, defaultDays) => {
  if (raw === undefined || raw === null || raw === "") {
    return defaultDays;
  }

  const n = Number(raw);
  if (!Number.isFinite(n)) {
    return defaultDays;
  }

  // 0 or negative disables expiry-based deletion.
  return Math.floor(n);
};

export const getRetentionDays = (envKey, defaultDays) => {
  return parseRetentionDays(process.env[envKey], defaultDays);
};

export const computeExpiresAtFromNow = (days) => {
  if (!Number.isFinite(days) || days <= 0) {
    return null;
  }
  return new Date(Date.now() + days * MS_PER_DAY);
};

export const computeExpiresAtFromEnv = (envKey, defaultDays) => {
  const days = getRetentionDays(envKey, defaultDays);
  return computeExpiresAtFromNow(days);
};
