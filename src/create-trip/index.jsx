import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelesList,
} from "@/constants/options"
import { generateAIResponse } from "@/service/AIModel"
import React, { useState } from "react"
import { toast } from "sonner"
import { FcGoogle } from "react-icons/fc"
import { FiLoader } from "react-icons/fi"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import axios from "axios"
import { doc, setDoc } from "firebase/firestore"
import { db, auth, googleProvider } from "@/service/firebaseConfig"
import { useNavigate } from "react-router-dom"
import LocationSearchInput from "@/components/custom/LocationSearchInput"

function CreateTrip() {
  const [formData, setFormData] = useState({})
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }))

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save to localStorage for compatibility with other components
      localStorage.setItem("user", JSON.stringify({
        email: user.email,
        name: user.displayName,
        picture: user.photoURL,
        id: user.uid
      }));

      setOpenDialog(false);
      OnGenerateTrip();
    } catch (error) {
      console.error(error);
      toast.error("Google Auth Failed: " + error.message);
    }
  }

  const OnGenerateTrip = async () => {
    // Check if user is authenticated with Firebase
    const user = auth.currentUser;
    const loggedUser = localStorage.getItem("user");

    // If no localStorage user OR no Firebase session, force login
    if (!loggedUser || !user) {
      setOpenDialog(true);
      return;
    }

    // Validation
    if (!formData?.location) return toast.error("Select a location.")
    if (!formData.noOfDays || Number(formData.noOfDays) < 1)
      return toast.error("Enter valid days.")
    if (Number(formData.noOfDays) > 10)
      return toast.error("Trips longer than 10 days are not supported.")
    if (!formData.budget) return toast.error("Select budget.")
    if (!formData.traveler) return toast.error("Select travellers.")

    setLoading(true)
    const finalLocation =
      formData?.location?.display_name ||
      formData?.location?.name ||
      formData?.location

    const STRICT_PROMPT = `
ONLY RETURN VALID JSON. No markdown or extra text.
{
  "hotels": [
    {
      "hotelName": "string",
      "hotelAddress": "string",
      "price": "string",
      "hotelImageUrl": "string",
      "geoCoordinates": "lat,lng",
      "rating": "string",
      "description": "string"
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "plan": [
        {
          "placeName": "string",
          "placeDetails": "string",
          "placeImageUrl": "string",
          "geoCoordinates": "lat,lng",
          "ticketPricing": "string",
          "rating": "string",
          "time": "string"
        }
      ]
    }
  ]
}

Generate a trip for:
Location: ${finalLocation}
Days: ${formData.noOfDays}
Travellers: ${formData.traveler}
Budget: ${formData.budget}
Include between 3 to 20 hotels, with varying price ranges.
Output MUST be only valid JSON.
`.trim()

    let finalParsed = null
    const maxAttempts = 3

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`💡 Sending AI prompt, attempt ${attempt}`)
        const ai = await generateAIResponse(STRICT_PROMPT)
        console.log("Raw AI response:", ai)

        if (!ai?.ok || !ai.text) continue

        // Clean AI output
        let cleaned = ai.text.replace(/```json|```/gi, "").trim()
        const jsonStart = cleaned.indexOf("{")
        const jsonEnd = cleaned.lastIndexOf("}")
        if (jsonStart >= 0 && jsonEnd >= 0)
          cleaned = cleaned.slice(jsonStart, jsonEnd + 1)

        // Fix unquoted lat,lng
        cleaned = cleaned.replace(
          /"geoCoordinates"\s*:\s*([0-9.-]+),([0-9.-]+)/g,
          '"geoCoordinates":"$1,$2"'
        )
        // Remove trailing commas
        cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1")
        // Remove invisible characters
        cleaned = cleaned.replace(/^\uFEFF/, "").trim()

        try {
          const parsed = JSON.parse(cleaned)
          if (Array.isArray(parsed.hotels) && Array.isArray(parsed.itinerary)) {
            finalParsed = parsed
            console.log("✅ JSON parsed successfully")
            break
          }
        } catch (err) {
          console.warn("❌ JSON parse failed, retrying...", err)
        }
      } catch (err) {
        console.warn("AI call failed, retrying...", err)
      }
    }

    if (!finalParsed) {
      toast.error(
        "AI returned invalid JSON after 3 attempts. Check console for raw AI output."
      )
      setLoading(false)
      return
    }

    // Save trip
    try {
      const userObj = JSON.parse(loggedUser)
      const docId = Date.now().toString()
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: finalParsed,
        userEmail: userObj?.email,
        id: docId,
        createdAt: new Date().toISOString(),
      })
      navigate(`/view-trip/${docId}`)
    } catch (err) {
      console.error("Save Trip Error:", err)
      toast.error("Failed to save trip: " + (err.message || "Unknown error"))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-purple-50/30 px-5 py-10 sm:px-10 md:px-32 lg:px-56 xl:px-72">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center sm:text-left mb-3">
          <span className="gradient-text">Share your ideal travel style</span> ✈️
        </h2>
        <p className="mt-3 text-lg text-center sm:text-left text-gray-600 leading-relaxed">
          Give us a few details — our AI will craft a personalized itinerary just for you.
        </p>

        <div className="flex flex-col gap-12 mt-16">
          {/* Location */}
          <div className="fade-in">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Where to?</h2>
            <LocationSearchInput
              onSelect={(place) => handleInputChange("location", place)}
            />
          </div>

          {/* Trip Duration */}
          <div className="fade-in">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Trip Duration (days)</h2>
            <Input
              type="number"
              min="1"
              placeholder="e.g., 3"
              className="text-lg py-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all"
              onChange={(e) => handleInputChange("noOfDays", e.target.value)}
            />
          </div>

          {/* Budget */}
          <div className="fade-in">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Estimated Budget</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SelectBudgetOptions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleInputChange("budget", item.title)}
                  className={`group relative p-6 rounded-2xl border-2 bg-white cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${formData?.budget === item.title
                      ? "shadow-xl border-blue-600 bg-gradient-to-br from-blue-50 to-purple-50"
                      : "border-gray-200 hover:border-blue-300"
                    }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${formData?.budget === item.title ? 'opacity-100' : ''}`}></div>
                  <div className="relative">
                    <h2 className="text-4xl mb-3">{item.icon}</h2>
                    <h2 className="font-bold text-lg mb-2 text-gray-800">{item.title}</h2>
                    <h2 className="text-sm text-gray-600">{item.desc}</h2>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Travellers */}
          <div className="fade-in">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Travellers</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SelectTravelesList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleInputChange("traveler", item.people)}
                  className={`group relative p-6 rounded-2xl border-2 bg-white cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${formData?.traveler === item.people
                      ? "shadow-xl border-purple-600 bg-gradient-to-br from-purple-50 to-pink-50"
                      : "border-gray-200 hover:border-purple-300"
                    }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${formData?.traveler === item.people ? 'opacity-100' : ''}`}></div>
                  <div className="relative">
                    <h2 className="text-4xl mb-3">{item.icon}</h2>
                    <h2 className="font-bold text-lg mb-2 text-gray-800">{item.title}</h2>
                    <h2 className="text-sm text-gray-600">{item.desc}</h2>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end mt-16 mb-3">
          <Button
            className="px-8 py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-500 hover:to-purple-500 disabled:opacity-60 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all hover:scale-105"
            disabled={loading}
            onClick={OnGenerateTrip}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <FiLoader className="w-6 h-6 animate-spin" />
                <span>Crafting your journey...</span>
              </div>
            ) : (
              "Plan My Journey"
            )}
          </Button>
        </div>
      </div>

      {/* Google Sign Dialog */}
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Sign In Required
            </DialogTitle>
            <DialogDescription asChild>
              <div>
                <img src="/logo.png" width={200} className="mx-auto" />
                <h2 className="mt-7 text-lg font-bold">Continue with Google</h2>
                <p>Please sign in to generate your itinerary.</p>
                <Button
                  disabled={loading}
                  onClick={login}
                  className="flex items-center w-full gap-4 mt-5"
                >
                  <FcGoogle className="h-9 w-9" /> Continue with Google
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateTrip
