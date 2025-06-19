import { createHashRouter, RouterProvider } from "react-router-dom";
import { ContextProvider } from "./context";
import { routes } from "./routes";
import { AppI18nProvider } from "@canva/app-i18n-kit";
import { AppUiProvider } from "@canva/app-ui-kit";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "./pages";

export const App = () => (
  <AppI18nProvider>
    <AppUiProvider>
      <ErrorBoundary fallback={<ErrorPage />}>
        <ContextProvider>
          <RouterProvider router={createHashRouter(routes)} />
        </ContextProvider>
      </ErrorBoundary>
    </AppUiProvider>
  </AppI18nProvider>
);
