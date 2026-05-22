export const userKeys = {
  all: ["users"] as const,
  detail: (userId: number) => [...userKeys.all, userId] as const,
};
