import Home from "@/pages/Public/Home/Home";


export const publicRoutes = [
  {
    label: "Store",
    index: true,
    path: "/",
    element: <Home />,
  },
  {
    label: "Mac",
    path: "/mac",
    element: <Home />,
  },
  {
    label: "iPhone",
    path: "/iPhone",
    element: <Home />,
  },
  {
    label: "Watch",
    path: "/watch",
    element: <Home />,
  },
  {
    label: "Vision",
    path: "/vision",
    element: <Home />,
  },
{
    label: "AirPods",
    path: "/airpods",
    element: <Home />,
  }
];
