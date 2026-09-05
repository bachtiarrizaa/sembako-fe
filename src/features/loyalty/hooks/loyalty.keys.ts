export const loyaltyKeys = {
  all: ["loyalty-settings"] as const,
  settings: () => [...loyaltyKeys.all, "settings"] as const,
};
