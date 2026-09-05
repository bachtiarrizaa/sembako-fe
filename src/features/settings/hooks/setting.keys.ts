export const settingKeys = {
  all: ["settings"] as const,
  store: () => [...settingKeys.all, "store"] as const,
};
