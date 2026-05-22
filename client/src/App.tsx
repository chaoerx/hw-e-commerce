import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { queryClient } from "./lib/queryClient";
import { router } from "./router";

import "@mantine/core/styles.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MantineProvider>
          <RouterProvider router={router} />
        </MantineProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
