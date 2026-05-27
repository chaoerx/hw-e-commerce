import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { Spinner } from "../ui/Spinner";
import { Footer } from "./Footer";
import { Navbar } from "../../features/navbar/Navbar";

const RootLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
