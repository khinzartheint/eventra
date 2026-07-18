import { useEffect, useRef, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"

import {
  checkInTicket,
  getTicketByCode,
} from "../services/ticketApiService"

function QRScanner() {
  const scannerRef = useRef(null)
  const processingRef = useRef(false)
  const lastScannedCodeRef = useRef("")

  const [ticket, setTicket] = useState(null)
  const [message, setMessage] = useState("")
  const [checkingTicket, setCheckingTicket] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [checkInSuccess, setCheckInSuccess] = useState(false)

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      false
    )

    scannerRef.current = scanner

    const handleScanSuccess = async (decodedText) => {
      if (
        processingRef.current ||
        lastScannedCodeRef.current === decodedText
      ) {
        return
      }

      processingRef.current = true
      lastScannedCodeRef.current = decodedText

      setCheckingTicket(true)
      setCheckingIn(false)
      setCheckInSuccess(false)
      setMessage("")
      setTicket(null)

      try {
        const ticketData = await getTicketByCode(decodedText)
        setTicket(ticketData)
      } catch (error) {
        console.error("Ticket loading error:", error)

        setMessage(
          error.message ||
            "Ticket not found. Please check the QR code."
        )

        window.setTimeout(() => {
          lastScannedCodeRef.current = ""
        }, 2500)
      } finally {
        setCheckingTicket(false)
        processingRef.current = false
      }
    }

    const handleScanFailure = () => {
      // The scanner checks continuously.
      // Individual unsuccessful frames do not need an error message.
    }

    scanner.render(handleScanSuccess, handleScanFailure)

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((error) =>
            console.error(
              "Could not stop QR scanner:",
              error
            )
          )
      }
    }
  }, [])

  const handleCheckIn = async () => {
    if (!ticket?.ticketCode || checkingIn) {
      return
    }

    setCheckingIn(true)
    setCheckInSuccess(false)
    setMessage("")

    try {
      const result = await checkInTicket(ticket.ticketCode)

      setTicket(result.ticket)
      setCheckInSuccess(true)
      setMessage(result.message || "Ticket checked in successfully.")
    } catch (error) {
      console.error("Ticket check-in error:", error)

      if (error.status === 409) {
        if (error.ticket) {
          setTicket(error.ticket)
        }

        setMessage("Ticket already used.")
      } else {
        setMessage(
          error.message ||
            "Could not check in the ticket. Please try again."
        )
      }
    } finally {
      setCheckingIn(false)
    }
  }

  const resetScannerResult = () => {
    setTicket(null)
    setMessage("")
    setCheckInSuccess(false)
    setCheckingTicket(false)
    setCheckingIn(false)

    processingRef.current = false
    lastScannedCodeRef.current = ""
  }

  return (
    <main className="max-w-5xl mx-auto px-8 py-10">
      <div className="mb-10">
        <p className="text-blue-600 font-semibold mb-2">
          Organizer Portal
        </p>

        <h1 className="text-5xl font-bold">
          QR Ticket Scanner
        </h1>

        <p className="text-gray-500 mt-3">
          Scan a customer ticket and check it in at the event entrance.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="border rounded-3xl p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-bold mb-5">
            Camera Scanner
          </h2>

          <div
            id="qr-reader"
            className="overflow-hidden rounded-2xl"
          />
        </section>

        <section className="border rounded-3xl p-7 bg-white shadow-sm">
          <h2 className="text-2xl font-bold mb-5">
            Ticket Result
          </h2>

          {checkingTicket && (
            <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
              <p className="text-blue-700">
                Checking ticket...
              </p>
            </div>
          )}

          {!ticket &&
            !message &&
            !checkingTicket && (
              <div className="border rounded-2xl p-8 text-center bg-gray-50">
                <p className="text-5xl">
                  📷
                </p>

                <h3 className="text-xl font-bold mt-4">
                  No ticket scanned yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Place the customer QR code inside the scanner box.
                </p>
              </div>
            )}

          {!ticket &&
            message &&
            !checkingTicket && (
              <div className="border border-red-300 bg-red-50 rounded-2xl p-6">
                <div className="text-5xl mb-4">
                  ❌
                </div>

                <h3 className="text-2xl font-bold text-red-700">
                  Invalid Ticket
                </h3>

                <p className="text-red-600 mt-3">
                  {message}
                </p>

                <button
                  type="button"
                  onClick={resetScannerResult}
                  className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
                >
                  Scan Another Ticket
                </button>
              </div>
            )}

          {ticket && (
            <div
              className={`border rounded-2xl p-6 ${
                ticket.used
                  ? "border-red-300 bg-red-50"
                  : "border-green-300 bg-green-50"
              }`}
            >
              <div className="text-5xl mb-4">
                {ticket.used ? "❌" : "✅"}
              </div>

              <h3 className="text-2xl font-bold">
                {ticket.used
                  ? "Ticket Already Used"
                  : "Valid Ticket"}
              </h3>

              {message && (
                <div
                  className={`mt-4 rounded-xl p-4 ${
                    checkInSuccess
                      ? "border border-green-300 bg-green-100 text-green-700"
                      : ticket.used
                        ? "border border-red-300 bg-red-100 text-red-700"
                        : "border border-blue-200 bg-blue-50 text-blue-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="mt-5 space-y-2 text-gray-700">
                <p>
                  <strong>Ticket ID:</strong>{" "}
                  {ticket.id}
                </p>

                <p>
                  <strong>Event:</strong>{" "}
                  {ticket.eventTitle}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {ticket.eventDate}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {ticket.location}
                </p>

                <p>
                  <strong>Ticket Type:</strong>{" "}
                  {ticket.ticketType}
                </p>

                <p>
                  <strong>Seat:</strong>{" "}
                  {ticket.seat}
                </p>

                <p className="break-all">
                  <strong>Ticket Code:</strong>{" "}
                  {ticket.ticketCode}
                </p>
              </div>

              {!ticket.used && (
                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="mt-6 w-full bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkingIn
                    ? "Checking In..."
                    : "Check In Ticket"}
                </button>
              )}

              <button
                type="button"
                onClick={resetScannerResult}
                disabled={checkingIn}
                className="mt-3 w-full border border-blue-300 text-blue-700 px-5 py-3 rounded-xl hover:bg-blue-50 transition disabled:opacity-50"
              >
                Scan Another Ticket
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default QRScanner