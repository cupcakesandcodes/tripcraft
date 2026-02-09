import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FcGoogle } from "react-icons/fc"
import { HiMenuAlt3 } from "react-icons/hi"
import { FaPlaneDeparture } from "react-icons/fa"
import { HiOutlineClipboardList } from "react-icons/hi"
import { googleLogout, useGoogleLogin } from "@react-oauth/google"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import axios from "axios"

function Header() {
  const [user, setUser] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    setUser(storedUser)
  }, [])

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  })

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        localStorage.setItem("user", JSON.stringify(resp.data))
        setOpenDialog(false)
        window.location.reload()
      })
  }

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-white/20">
      <div className="flex items-center justify-between w-full px-4 py-2.5 mx-auto max-w-7xl">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <img
              src="/logo.png"
              width={40}
              height={40}
              alt="Tripcraft Logo"
              className="relative object-contain rounded-full ring-2 ring-white/50 group-hover:ring-white/80 transition-all"
            />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TRIPCRAFT
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="items-center hidden gap-3 md:flex">
          {user ? (
            <>
              <a href="/create-trip">
                <Button
                  variant="outline"
                  className="px-4 py-1.5 text-sm font-medium rounded-full border-2 border-blue-600/20 hover:border-blue-600/40 hover:bg-blue-50 transition-all"
                >
                  Create Trip
                </Button>
              </a>
              <a href="/history">
                <Button
                  variant="outline"
                  className="px-4 py-1.5 text-sm font-medium rounded-full border-2 border-purple-600/20 hover:border-purple-600/40 hover:bg-purple-50 transition-all"
                >
                  History
                </Button>
              </a>
              <Popover>
                <PopoverTrigger>
                  <img
                    src={user?.picture || "/cat.png"}
                    alt={user?.name || "User"}
                    className="object-cover w-9 h-9 border-2 border-white rounded-full shadow-lg hover:shadow-xl transition-shadow ring-2 ring-blue-600/20"
                    referrerPolicy="no-referrer"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-32 text-center cursor-pointer">
                  <h2
                    className="text-sm font-medium transition hover:text-red-600"
                    onClick={() => {
                      googleLogout()
                      localStorage.clear()
                      window.location.reload()
                    }}
                  >
                    Logout
                  </h2>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              onClick={() => setOpenDialog(true)}
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="block md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <HiMenuAlt3 className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-6">
                {user ? (
                  <>
                    <a href="/create-trip">
                      <Button
                        variant="outline"
                        className="flex items-center w-full gap-3 text-black rounded-full"
                      >
                        <FaPlaneDeparture className="w-5 h-5 text-black" />
                        Create Trip
                      </Button>
                    </a>
                    <a href="/history">
                      <Button
                        variant="outline"
                        className="flex items-center w-full gap-3 text-black rounded-full"
                      >
                        <HiOutlineClipboardList className="w-5 h-5 text-black" />
                        History
                      </Button>
                    </a>
                    <div className="flex items-center gap-3 mt-4">
                      <img
                        src={user?.picture || "/cat.png"}
                        alt="User"
                        className="w-10 h-10 border rounded-full"
                      />
                      <div className="text-sm font-medium">{user?.name}</div>
                    </div>
                    <Button
                      variant="destructive"
                      className="mt-4 rounded-full"
                      onClick={() => {
                        googleLogout()
                        localStorage.clear()
                        window.location.reload()
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    className="mt-4 text-black bg-white border rounded-full"
                    onClick={() => setOpenDialog(true)}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Dialog open={openDialog}>
        <DialogContent className="w-[90%] max-w-sm sm:max-w-md rounded-md">
          <DialogHeader>
            <DialogDescription>
              <div className="flex flex-col items-center justify-center p-4">
                <img src="/logo.png" width={160} alt="App Logo" />
                <h2 className="mt-6 text-xl font-semibold text-black">
                  Sign In with Google
                </h2>
                <p className="text-sm text-center text-black bold">
                  Securely log in using your Google account
                </p>
                <Button
                  disabled={loading}
                  onClick={login}
                  className="flex items-center justify-center w-full gap-3 mt-6 text-black bg-white border shadow-sm hover:bg-gray-100"
                >
                  <FcGoogle className="w-6 h-6" />
                  <span className="text-sm font-medium">
                    Sign in with Google
                  </span>
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  )
}

export default Header
