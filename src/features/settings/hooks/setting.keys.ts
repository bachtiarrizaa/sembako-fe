export const settingKeys = {
  all: ["settings"] as const,
  store: () => [...settingKeys.all, "store"] as const,
  loyalty: () => [...settingKeys.all, "loyalty"] as const,
};
