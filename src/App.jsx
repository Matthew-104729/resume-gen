import { useState } from 'react'
import EditorPanel from './components/EditorPanel'
import PreviewPanel from './components/PreviewPanel'

function App() {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: 'Steven Marino',
      position: '',
      address: 'Manchaca, TX, 78652',
      account: 'marino.steven.michael@gmail.com',
      phone: '+1 (323) 505-2377',
    },
    summary: '',
    experiences: [
      { company: 'BFC Software', title: '', start: 'Dec 2023', end: 'Feb 2026', bullets: [''] },
      { company: 'BetterWorld Technology', title: '', start: 'Apr 2020', end: 'Oct 2023', bullets: [''] },
      { company: 'Contigo Technology', title: '', start: 'May 2016', end: 'Mar 2020', bullets: [''] },
      { company: 'Syberry Corporation', title: '', start: 'Feb 2014', end: 'Apr 2016', bullets: [''] },
    ],
    technicalSkills: '',
    education: [
      {
        university: 'The University of Texas at Austin',
        major: 'Bachelor of Science in Computer Science',
        graduateYear: '2013',
      },
    ],
    certifications: [],
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Resume Builder
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Create your professional resume</p>
            </div>
          </div>
        </div>
      </header>
      <div className="flex h-[calc(100vh-89px)]">
        <EditorPanel resumeData={resumeData} setResumeData={setResumeData} />
        <PreviewPanel resumeData={resumeData} />
      </div>
    </div>
  )
}

export default App