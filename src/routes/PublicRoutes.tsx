import { lazy } from "react";
import Loadable from "@/utils/Loadable";
import { PublicSkeleton } from "@/common/Skeleton/Public/PublicSkeleton";
const Home = Loadable(
  lazy(() => import("@/pages/Public/Home/Home")),
  PublicSkeleton
);


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
