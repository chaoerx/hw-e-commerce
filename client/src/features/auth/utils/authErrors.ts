import axios from "axios";

export const getAuthErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;

    if (data?.message) {
      return data.message;
    }

    if (error.response?.status === 401) {
      return "Invalid username or password";
    }

    if (error.code === "ERR_NETWORK") {
      return "Unable to reach the server. Check your connection and try again.";
    }

    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
