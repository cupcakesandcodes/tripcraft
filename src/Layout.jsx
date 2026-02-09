import React from "react"
import Header from "./components/custom/Header"
import { Outlet } from "react-router-dom"

function Layout() {
  return (
    <>
      <Header />
      <Outlet /> {/* all pages (Hero, CreateTrip, etc.) render here */}
    </>
  )
}

export default Layout
