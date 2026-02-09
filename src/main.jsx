import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Toaster } from "sonner"

// Components
import Layout from "./Layout"
import App from "./App" // homepage with Hero
import CreateTrip from "./create-trip"
import ViewTrip from "./view-trip/[tripId]/index"
import History from "./history"
import TestFirebase from "./TestFirebase"

// immediate-global-debugging — put at top of src/main.jsx after imports
window.addEventListener("error", (e) => {
  console.error("🌐 GLOBAL ERROR:", e.error || e.message, e)
})
window.addEventListener("unhandledrejection", (ev) => {
  console.error("🌐 UNHANDLED REJECTION:", ev.reason, ev)
})
console.log("🐞 DEBUG: main.jsx loaded — console ready")

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // contains Header + Outlet
    children: [
      {
        index: true,
        element: <App />, // renders Hero section
      },
      {
        path: "create-trip",
        element: <CreateTrip />,
      },
      {
        path: "view-trip/:tripId",
        element: <ViewTrip />,
      },
      {
        path: "history",
        element: <History />,
      },
      {
        path: "test-firebase",
        element: <TestFirebase />,
      },
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
)
