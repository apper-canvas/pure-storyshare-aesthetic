import { createBrowserRouter } from "react-router-dom"
import { lazy, Suspense } from "react"
import Layout from "@/components/organisms/Layout"

// Lazy load page components
const Browse = lazy(() => import("@/components/pages/Browse"))
const StoryDetail = lazy(() => import("@/components/pages/StoryDetail"))
const ReadChapter = lazy(() => import("@/components/pages/ReadChapter"))
const Write = lazy(() => import("@/components/pages/Write"))
const Dashboard = lazy(() => import("@/components/pages/Dashboard"))
const EditStory = lazy(() => import("@/components/pages/EditStory"))
const Profile = lazy(() => import("@/components/pages/Profile"))
const Search = lazy(() => import("@/components/pages/Search"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-primary font-medium">Loading story...</p>
    </div>
  </div>
)

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Browse />
      </Suspense>
    ),
  },
  {
    path: "story/:id",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <StoryDetail />
      </Suspense>
    ),
  },
  {
    path: "story/:id/chapter/:chapterId",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ReadChapter />
      </Suspense>
    ),
  },
  {
    path: "write",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Write />
      </Suspense>
    ),
  },
  {
    path: "dashboard",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "edit/:id",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <EditStory />
      </Suspense>
    ),
  },
  {
    path: "profile/:username",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Profile />
      </Suspense>
    ),
  },
  {
    path: "search",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Search />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
  },
]

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes,
  },
]

export const router = createBrowserRouter(routes)