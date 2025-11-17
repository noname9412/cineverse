import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { AppLayout } from '@/components/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { DetailPage } from '@/pages/DetailPage';
import { PlayerPage } from '@/pages/PlayerPage';
import { LoginPage } from '@/pages/LoginPage';
import { MoviesPage } from '@/pages/MoviesPage';
import { ShowsPage } from '@/pages/ShowsPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
const router = createBrowserRouter([
  {
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/item/:id", element: <DetailPage /> },
      { path: "/movies", element: <MoviesPage /> },
      { path: "/shows", element: <ShowsPage /> },
    ],
  },
  {
    path: "/settings",
    element: <SettingsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/play/:id",
    element: <ProtectedRoute><PlayerPage /></ProtectedRoute>,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);