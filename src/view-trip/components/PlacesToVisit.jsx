import React from "react"
import PlaceCardItem from "./PlaceCardItem"

function PlacesToVisit({ trip }) {
  return (
    <div>
      <h2 className="my-5 text-xl font-bold">Top Attractions</h2>
      {trip?.tripData?.itinerary?.map((dayItem, idx) => (
        <div key={idx} className="mt-5">
          <h2 className="text-lg font-medium">Day {dayItem.day}</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {dayItem.plan.map((place, idy) => (
              <div key={idy}>
                <h2 className="text-sm font-medium text-blue-600">
                  {place.time}
                </h2>
                <PlaceCardItem place={place} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlacesToVisit
