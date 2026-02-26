import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import ResumeDocument from './ResumeDocument'
import DownloadButton from './DownloadButton'

function PreviewPanel({ resumeData }) {
  const componentRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Resume',
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  })

  return (
    <div className="w-[60%] bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-y-auto">
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-lg z-10 px-8 py-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></span>
              Resume Preview
            </h2>
            <p className="text-xs text-gray-500 mt-1">Live preview of your resume</p>
          </div>
          <DownloadButton onDownload={handlePrint} />
        </div>
      </div>
      <div className="p-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200/50" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
          <div ref={componentRef} className="print:shadow-none">
            <ResumeDocument resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewPanel