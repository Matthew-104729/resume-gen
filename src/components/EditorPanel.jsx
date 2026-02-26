import { useState } from 'react'

function EditorPanel({ resumeData, setResumeData }) {
  const [titles, setTitles] = useState(``)

  const updateField = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }))
  }

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }

  const updateEducation = (index, field, value) => {
    setResumeData(prev => {
      const newEducation = [...prev.education]
      newEducation[index] = { ...newEducation[index], [field]: value }
      return { ...prev, education: newEducation }
    })
  }

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { university: '', major: '', startYear: '', graduateYear: '' }]
    }))
  }

  const deleteEducation = (index) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      setResumeData(prev => {
        const newEducation = prev.education.filter((_, i) => i !== index)
        // Ensure we always have at least one empty education
        if (newEducation.length === 0) {
          newEducation.push({ university: '', major: '', startYear: '', graduateYear: '' })
        }
        return { ...prev, education: newEducation }
      })
    }
  }

  const updateCertification = (index, field, value) => {
    setResumeData(prev => {
      const newCertifications = [...prev.certifications]
      newCertifications[index] = { ...newCertifications[index], [field]: value }
      return { ...prev, certifications: newCertifications }
    })
  }

  const addCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { major: '', issueDate: '' }]
    }))
  }

  const deleteCertification = (index) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      setResumeData(prev => {
        const newCertifications = prev.certifications.filter((_, i) => i !== index)
        return { ...prev, certifications: newCertifications }
      })
    }
  }

  const updateExperience = (index, field, value) => {
    setResumeData(prev => {
      const newExperiences = [...prev.experiences]
      newExperiences[index] = { ...newExperiences[index], [field]: value }
      return { ...prev, experiences: newExperiences }
    })
  }

  const updateTitles = (value) => {
    setTitles(value)

    // Parse titles by newlines
    const titleLines = value.split('\n').map(line => line.trim())
    
    // Automatically fill resumeData
    setResumeData(prev => {
      const updated = { ...prev }
      
      // First title goes to personalInfo.position
      if (titleLines[0]) {
        updated.personalInfo = { ...prev.personalInfo, position: titleLines[0] }
      }
      
      // Titles 2-5 (indices 1-4) go to experiences[0-3].title
      const newExperiences = [...prev.experiences]
      for (let i = 1; i <= 4; i++) {
        const expIndex = i - 1
        if (newExperiences[expIndex] && titleLines[i]) {
          newExperiences[expIndex] = { ...newExperiences[expIndex], title: titleLines[i] }
        }
      }
      updated.experiences = newExperiences
      
      return updated
    })
  }

  const updateBullets = (expIndex, value) => {
    // Split by newlines and filter out empty lines
    const bullets = value.split('\n').filter(line => line.trim() !== '' || value.endsWith('\n'))
    // If the last line is empty (user just pressed enter), keep it for better UX
    const finalBullets = value.endsWith('\n') && value.trim() !== '' 
      ? [...bullets, ''] 
      : bullets.length === 0 
        ? [''] 
        : bullets
    
    setResumeData(prev => {
      const newExperiences = [...prev.experiences]
      newExperiences[expIndex] = { ...newExperiences[expIndex], bullets: finalBullets }
      return { ...prev, experiences: newExperiences }
    })
  }

  const deleteExperience = (expIndex) => {
    if (window.confirm('Are you sure you want to delete this company experience?')) {
      setResumeData(prev => {
        const newExperiences = prev.experiences.filter((_, index) => index !== expIndex)
        // Ensure we always have at least one empty experience
        if (newExperiences.length === 0) {
          newExperiences.push({ company: '', title: '', start: '', end: '', bullets: [''] })
        }
        return { ...prev, experiences: newExperiences }
      })
    }
  }

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { company: '', title: '', start: '', end: '', bullets: [''] }]
    }))
  }

  return (
    <div className="w-[40%] bg-white/70 backdrop-blur-sm border-r border-gray-200/50 shadow-xl overflow-y-auto">
      <div className="p-8 space-y-8">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></span>
            Resume Editor
          </h2>
          <p className="text-sm text-gray-500 mt-1">Fill in your information below</p>
        </div>

        {/* Personal Info */}
        {/* <div>
          <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
            <span className="text-blue-600">👤</span>
            Personal Information
          </h3>
          <div className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-gray-50/50 shadow-md hover:shadow-lg transition-shadow duration-300 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <span className="text-blue-600">•</span>
                Name
              </label>
              <input
                type="text"
                value={resumeData.personalInfo.name}
                onChange={(e) => updatePersonalInfo('name', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <span className="text-blue-600">•</span>
                Position
              </label>
              <input
                type="text"
                value={resumeData.personalInfo.position}
                onChange={(e) => updatePersonalInfo('position', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                placeholder="Job Title"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <span className="text-blue-600">•</span>
                Address
              </label>
              <input
                type="text"
                value={resumeData.personalInfo.address}
                onChange={(e) => updatePersonalInfo('address', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                placeholder="City, State, ZIP"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <span className="text-blue-600">•</span>
                Account (Email)
              </label>
              <input
                type="text"
                value={resumeData.personalInfo.account}
                onChange={(e) => updatePersonalInfo('account', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <span className="text-blue-600">•</span>
                Phone Number
              </label>
              <input
                type="text"
                value={resumeData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                placeholder="(XXX) XXX - XXXX"
              />
            </div>
          </div>
        </div> */}

        {/* Titles */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-blue-600">💼</span>
            Titles
          </label>
          <textarea
            value={titles}
            onChange={(e) => updateTitles(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300 resize-none"
            rows="5"
            placeholder="Enter 5 job titles (one per line):&#10;First line: Position (Personal Info)&#10;Lines 2-5: Company titles (Experiences 1-4)"
          />
        </div>
        

        {/* Summary */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-blue-600">📝</span>
            Summary
          </label>
          <textarea
            value={resumeData.summary}
            onChange={(e) => updateField('summary', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300 resize-none"
            rows="5"
            placeholder="Enter your professional summary..."
          />
        </div>

        

        {/* Technical Skills */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-blue-600">⚙️</span>
            Technical Skills
          </label>
          <textarea
            value={resumeData.technicalSkills}
            onChange={(e) => updateField('technicalSkills', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300 resize-none"
            rows="4"
            placeholder="e.g., JavaScript, React, Node.js, Python..."
          />
        </div>
        {/* Experience Sections */}
        <div>
          <h3 className="text-lg font-bold mb-5 text-gray-800 flex items-center gap-2">
            <span className="text-blue-600">💼</span>
            Experience
          </h3>
          <div className="space-y-6">
            {resumeData.experiences.map((exp, expIndex) => (
              <div key={expIndex} className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-blue-50/30 shadow-md hover:shadow-lg transition-all duration-300 relative">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {expIndex + 1}
                    </span>
                    Company {expIndex + 1}
                  </h4>
                  <button
                    onClick={() => deleteExperience(expIndex)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 font-semibold text-sm shadow-sm hover:shadow-md flex items-center gap-1.5"
                    title="Delete this company experience"
                  >
                    <span>🗑️</span>
                    <span>Delete</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(expIndex, 'title', e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                      placeholder="e.g., Software Engineer"
                    />
                  </div> */}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                      placeholder="e.g., Tech Company Inc."
                    />
                  </div>

                  {/* <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={exp.start}
                        onChange={(e) => updateExperience(expIndex, 'start', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                        placeholder="e.g., Jan 2020"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="text"
                        value={exp.end}
                        onChange={(e) => updateExperience(expIndex, 'end', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                        placeholder="e.g., Dec 2023 or Present"
                      />
                    </div>
                  </div> */}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Description / Bullet Points
                      <span className="text-xs font-normal text-gray-500 ml-2">(One bullet per line)</span>
                    </label>
                    <textarea
                      value={exp.bullets.join('\n')}
                      onChange={(e) => updateBullets(expIndex, e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300 resize-none text-sm leading-relaxed"
                      rows="6"
                      placeholder="Enter bullet points, one per line...&#10;&#10;Example:&#10;Developed new features&#10;Improved performance&#10;Led team of 5 developers"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <span>💡</span>
                      <span>Press Enter to create a new bullet point</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <button
            onClick={addExperience}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span>
            <span>Add Company Experience</span>
          </button> */}
        </div>


        {/* Education */}
        {/* <div>
          <h3 className="text-lg font-bold mb-5 text-gray-800 flex items-center gap-2">
            <span className="text-blue-600">🎓</span>
            Education
          </h3>
          <div className="space-y-6">
            {resumeData.education.map((edu, eduIndex) => (
              <div key={eduIndex} className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-indigo-50/30 shadow-md hover:shadow-lg transition-all duration-300 relative">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {eduIndex + 1}
                    </span>
                    Education {eduIndex + 1}
                  </h4>
                  {resumeData.education.length > 1 && (
                    <button
                      onClick={() => deleteEducation(eduIndex)}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 font-semibold text-sm shadow-sm hover:shadow-md flex items-center gap-1.5"
                      title="Delete this education entry"
                    >
                      <span>🗑️</span>
                      <span>Delete</span>
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <span className="text-blue-600">•</span>
                      University
                    </label>
                    <input
                      type="text"
                      value={edu.university}
                      onChange={(e) => updateEducation(eduIndex, 'university', e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                      placeholder="University Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <span className="text-blue-600">•</span>
                      Major
                    </label>
                    <input
                      type="text"
                      value={edu.major}
                      onChange={(e) => updateEducation(eduIndex, 'major', e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                      placeholder="Degree and Major"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Year
                      </label>
                      <input
                        type="text"
                        value={edu.startYear}
                        onChange={(e) => updateEducation(eduIndex, 'startYear', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                        placeholder="e.g., 2010"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Graduate Year
                      </label>
                      <input
                        type="text"
                        value={edu.graduateYear}
                        onChange={(e) => updateEducation(eduIndex, 'graduateYear', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                        placeholder="e.g., 2014"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addEducation}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span>
            <span>Add Education</span>
          </button>
        </div> */}

        {/* Licenses & Certifications */}
        {/* <div>
          <h3 className="text-lg font-bold mb-5 text-gray-800 flex items-center gap-2">
            <span className="text-blue-600">🏆</span>
            Licenses & Certifications
          </h3>
          <div className="space-y-6">
            {resumeData.certifications.map((cert, certIndex) => (
              <div key={certIndex} className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-green-50/30 shadow-md hover:shadow-lg transition-all duration-300 relative">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {certIndex + 1}
                    </span>
                    Certification {certIndex + 1}
                  </h4>
                  <button
                    onClick={() => deleteCertification(certIndex)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 font-semibold text-sm shadow-sm hover:shadow-md flex items-center gap-1.5"
                    title="Delete this certification"
                  >
                    <span>🗑️</span>
                    <span>Delete</span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <span className="text-blue-600">•</span>
                      Major
                    </label>
                    <input
                      type="text"
                      value={cert.major}
                      onChange={(e) => updateCertification(certIndex, 'major', e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                      placeholder="e.g., AWS Certified Solutions Architect"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <span className="text-blue-600">•</span>
                      Issue Date
                    </label>
                    <input
                      type="text"
                      value={cert.issueDate}
                      onChange={(e) => updateCertification(certIndex, 'issueDate', e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                      placeholder="e.g., Jan 2023"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addCertification}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span>
            <span>Add Certification</span>
          </button>
        </div>*/}
      </div>
    </div> 
  )
}

export default EditorPanel

