function PrintTicketButton() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <button
      onClick={handlePrint}
      className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
    >
      Print / Save as PDF
    </button>
  )
}

export default PrintTicketButton