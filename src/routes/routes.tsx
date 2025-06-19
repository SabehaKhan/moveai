import { Home } from "src/home";
import { ErrorPage, GeneratePage, ResultsPage } from "src/pages";

export enum Paths {
  HOME = "/",
  RESULTS = "/results",
}

export const routes = [
  {
    path: Paths.HOME,
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <GeneratePage />,
      },
      {
        path: Paths.RESULTS,
        element: <ResultsPage />,
      },
      // @TODO: Add additional pages and routes as needed.
    ],
  },
];
