import { db } from "@/service/firebaseConfig"
import { doc, getDoc } from "firebase/firestore"
import React, { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import InfoSection from "../components/InfoSection"
import Hotels from "../components/Hotels"
import PlacesToVisit from "../components/PlacesToVisit"
import Footer from "../components/Footer"
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { FiDownload } from "react-icons/fi"

function ViewTrip() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null) // ← Use null, not []
  const [exporting, setExporting] = useState(false)
  const contentRef = useRef(null)

  useEffect(() => {
    if (tripId) GetTripData()
  }, [tripId])

  const GetTripData = async () => {
    const docRef = doc(db, "AITrips", tripId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log("document:", docSnap.data())
      setTrip(docSnap.data())
    } else {
      console.log("No such document!")
      toast("No trip found")
    }
  }

  const exportToPDF = async () => {
    if (!contentRef.current) return

    setExporting(true)
    toast.info("Generating PDF... This may take a moment.")

    try {
      const element = contentRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10

      // Calculate how many pages we need
      const pageHeight = pdfHeight - 20 // Leave margin
      const totalPages = Math.ceil((imgHeight * ratio) / pageHeight)

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage()

        const yOffset = -(i * pageHeight / ratio)
        pdf.addImage(
          imgData,
          'PNG',
          imgX,
          imgY + (i === 0 ? 0 : -i * pageHeight),
          imgWidth * ratio,
          imgHeight * ratio
        )
      }

      const tripLocation = trip?.userSelection?.location?.display_name ||
        trip?.userSelection?.location?.name ||
        trip?.userSelection?.location ||
        'Trip'
      const fileName = `Tripcraft_${tripLocation.replace(/[^a-z0-9]/gi, '_')}.pdf`

      pdf.save(fileName)
      toast.success("PDF exported successfully!")
    } catch (error) {
      console.error("PDF export error:", error)
      toast.error("Failed to export PDF. Please try again.")
    } finally {
      setExporting(false)
    }
  }

  if (!trip) return <p className="text-center mt-20">Loading trip...</p>

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      {/* Export Button */}
      <div className="flex justify-end mb-6">
        <Button
          onClick={exportToPDF}
          disabled={exporting}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
        >
          <FiDownload className="w-4 h-4" />
          {exporting ? "Generating PDF..." : "Export to PDF"}
        </Button>
      </div>

      {/* Content to be exported */}
      <div ref={contentRef}>
        <InfoSection trip={trip} />
        <Hotels trip={trip} />
        <PlacesToVisit trip={trip} />
        <Footer trip={trip} />
      </div>
    </div>
  )
}

export default ViewTrip
