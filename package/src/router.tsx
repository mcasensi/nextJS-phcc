import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./app/page";
import AboutUsPage from "./app/about-us/page";
import ChordsPage from "./app/chords/page";
import DelegatesPage from "./app/delegates/page";
import DelegatesListPage from "./app/delegates-list/page";
import DirectoryPage from "./app/directory/page";
import DirectoryBySlugPage from "./app/directory/[slug]/page";
import EventsPage from "./app/events/page";
import FindAChurchPage from "./app/find-a-church/page";
import GivingPage from "./app/giving/page";
import LoginPage from "./app/login/page";
import One80JamPage from "./app/one80jam/page";
import One80JamBySlugPage from "./app/one80jam/[slug]/page";
import SignupPage from "./app/signup/page";
import BrochureBySlugPage from "./app/brochure/[slug]/page";
import ConferenceBySlugPage from "./app/conference/[slug]/page";
import NotFoundPage from "./app/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about-us", element: <AboutUsPage /> },
      { path: "chords", element: <ChordsPage /> },
      { path: "delegates", element: <DelegatesPage /> },
      { path: "delegates-list", element: <DelegatesListPage /> },
      { path: "directory", element: <DirectoryPage /> },
      { path: "directory/:slug", element: <DirectoryBySlugPage /> },
      { path: "events", element: <EventsPage /> },
      { path: "find-a-church", element: <FindAChurchPage /> },
      { path: "giving", element: <GivingPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "one80jam", element: <One80JamPage /> },
      { path: "one80jam/:slug", element: <One80JamBySlugPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "brochure/:slug", element: <BrochureBySlugPage /> },
      { path: "conference/:slug", element: <ConferenceBySlugPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
