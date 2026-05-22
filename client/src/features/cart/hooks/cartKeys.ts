export const cartKeys = {
  all: ["cart"] as const,
  byUser: (userId: number) => [...cartKeys.all, userId] as const,
};
