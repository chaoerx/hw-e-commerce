import { lazy, Suspense, type ReactNode } from "react";
import { createHashRouter } from "react-router-dom";

import GlobalErrorPage from "../components/errors/GlobalErrorPage";
import RouteErrorBoundary from "../components/errors/RouteErrorBoundary";
import { Spinner } from "../components/ui/Spinner";
import RootLayout from "../components/layout/RootLayout";

import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";

const Home = lazy(() => import("../features/products/pages/Home"));
const Products = lazy(() => import("../features/products/pages/Products"));
const ProductDetail = lazy(() => import("../features/products/pages/ProductDetail"));
const Cart = lazy(() => import("../features/cart/pages/Cart"));
const Login = lazy(() => import("../features/auth/pages/Login"));
const Signup = lazy(() => import("../features/auth/pages/Signup"));
const Settings = lazy(() => import("../features/settings/pages/Settings"));

const withSuspense = (node: ReactNode) => (
  <Suspense fallback={<Spinner />}>{node}</Suspense>
);

const withBoundary = (name: string, node: ReactNode) => (
  <RouteErrorBoundary name={name}>{node}</RouteErrorBoundary>
);

export const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <GlobalErrorPage />,
    children: [
      { index: true, element: withBoundary("Home", withSuspense(<Home />)) },
      { path: "products", element: withBoundary("Products", withSuspense(<Products />)) },
      {
        path: "products/:id",
        element: withBoundary("ProductDetail", withSuspense(<ProductDetail />)),
      },
      { path: "login", element: withBoundary("Login", withSuspense(<Login />)) },
      { path: "signup", element: withBoundary("Signup", withSuspense(<Signup />)) },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "cart", element: withBoundary("Cart", withSuspense(<Cart />)) },
          {
            path: "settings",
            element: withBoundary("Settings", withSuspense(<Settings />)),
          },
        ],
      },
    ],
  },
]);
