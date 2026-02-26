function DownloadButton({ onDownload }) {
  return (
    <button
      onClick={onDownload}
      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 flex items-center gap-2"
    >
      <span>📥</span>
      Download PDF
    </button>
  )
}

export default DownloadButton

