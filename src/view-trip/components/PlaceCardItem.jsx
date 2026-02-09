import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (place) fetchPlacePhoto()
  }, [place])

  const fetchPlacePhoto = async () => {
    const query = place?.placeName
    if (!query) return

    setLoading(true)
    try {
      const res = await axios.get(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          query
        )}&per_page=1`,
        {
          headers: {
            Authorization: import.meta.env.VITE_PEXELS_API_KEY,
          },
        }
      )
      setPhotoUrl(res.data.photos?.[0]?.src?.landscape || "/placeholder.jpg")
    } catch (err) {
      console.error("Error fetching place photo:", err)
      setPhotoUrl("/placeholder.jpg")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        place?.placeName
      )}`}
      target="_blank"
    >
      <div className="flex gap-5 p-3 mt-2 transition-all border cursor-pointer rounded-xl hover:scale-105 hover:shadow-md">
        <div className="relative w-[130px] h-[130px] rounded-xl overflow-hidden bg-gray-200">
          {loading && (
            <div className="absolute inset-0 animate-pulse bg-gray-300"></div>
          )}
          <img
            src={photoUrl}
            alt={place?.placeName}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              loading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setLoading(false)}
          />
        </div>
        <div>
          <h2 className="text-lg font-bold">
            {place?.placeName || "Unknown Place"}
          </h2>
          <p className="text-sm text-gray-400">
            {place?.placeDetails || "No details available."}
          </p>
          {place?.ticketPricing && (
            <h2 className="flex items-center gap-2 text-sm text-black">
              <img
                src="https://em-content.zobj.net/source/whatsapp/401/ticket_1f3ab.png"
                width={15}
                alt="Ticket icon"
              />
              {place.ticketPricing}
            </h2>
          )}
          {place?.timeTravel && (
            <h2 className="flex items-center gap-2 text-sm text-black">
              <img
                src="https://em-content.zobj.net/source/samsung/405/ten-oclock_1f559.png"
                width={15}
                alt="Time icon"
              />
              {place.timeTravel}
            </h2>
          )}
        </div>
      </div>
    </Link>
  )
}

export default PlaceCardItem
