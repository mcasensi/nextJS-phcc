import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";

const HomePage = lazy(() => import("./app/page"));
const AboutUsPage = lazy(() => import("./app/about-us/page"));
const ChordsPage = lazy(() => import("./app/chords/page"));
const DelegatesPage = lazy(() => import("./app/delegates/page"));
const DelegatesListPage = lazy(() => import("./app/delegates-list/page"));
const DirectoryPage = lazy(() => import("./app/directory/page"));
const DirectoryBySlugPage = lazy(() => import("./app/directory/[slug]/page"));
const EventsPage = lazy(() => import("./app/events/page"));
const FindAChurchPage = lazy(() => import("./app/find-a-church/page"));
const GivingPage = lazy(() => import("./app/giving/page"));
const LoginPage = lazy(() => import("./app/login/page"));
const One80JamPage = lazy(() => import("./app/one80jam/page"));
const One80JamBySlugPage = lazy(() => import("./app/one80jam/[slug]/page"));
const SignupPage = lazy(() => import("./app/signup/page"));
const BrochureBySlugPage = lazy(() => import("./app/brochure/[slug]/page"));
const ConferenceBySlugPage = lazy(() => import("./app/conference/[slug]/page"));
const NotFoundPage = lazy(() => import("./app/not-found"));

const RouteLoadingFallback = () => (
  <div className="container pt-32 pb-16 text-center">
    <p>Loading...</p>
  </div>
);

const lazyElement = (Component: LazyExoticComponent<ComponentType>) => (
  <Suspense fallback={<RouteLoadingFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: lazyElement(HomePage) },
      { path: "about-us", element: lazyElement(AboutUsPage) },
      { path: "chords", element: lazyElement(ChordsPage) },
      { path: "delegates", element: lazyElement(DelegatesPage) },
      { path: "delegates-list", element: lazyElement(DelegatesListPage) },
      { path: "directory", element: lazyElement(DirectoryPage) },
      { path: "directory/:slug", element: lazyElement(DirectoryBySlugPage) },
      { path: "events", element: lazyElement(EventsPage) },
      { path: "find-a-church", element: lazyElement(FindAChurchPage) },
      { path: "giving", element: lazyElement(GivingPage) },
      { path: "login", element: lazyElement(LoginPage) },
      { path: "one80jam", element: lazyElement(One80JamPage) },
      { path: "one80jam/:slug", element: lazyElement(One80JamBySlugPage) },
      { path: "signup", element: lazyElement(SignupPage) },
      { path: "brochure/:slug", element: lazyElement(BrochureBySlugPage) },
      { path: "conference/:slug", element: lazyElement(ConferenceBySlugPage) },
      { path: "*", element: lazyElement(NotFoundPage) },
    ],
  },
]);
