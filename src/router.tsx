import { createBrowserRouter } from "react-router";

import DetailPage from "./pages/detail";
import NotFound from "./pages/notfound";
import Layout from "./components/layout";
import { Home } from "./pages/home";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/detail/:cripto",
        element: <DetailPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export { router };
