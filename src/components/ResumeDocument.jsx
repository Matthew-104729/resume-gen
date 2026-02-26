// Helper function to format text with **bold** markers (for summary, experience, etc.)
function formatBoldText(text) {
  if (!text) return ''
  
  // Match **text** patterns (non-greedy to handle multiple matches)
  const parts = []
  let lastIndex = 0
  const regex = /\*\*(.*?)\*\*/g
  let match
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.substring(lastIndex, match.index), key: `text-${lastIndex}` })
    }
    // Add the bold text (without **)
    parts.push({ type: 'bold', content: match[1], key: `bold-${match.index}` })
    lastIndex = regex.lastIndex
  }
  
  // Add remaining text after last match
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.substring(lastIndex), key: `text-${lastIndex}` })
  }
  
  // If no matches found, return original text
  if (parts.length === 0) {
    return text
  }
  
  // Convert to React elements
  return parts.map(part => 
    part.type === 'bold' 
      ? <strong key={part.key}>{part.content}</strong>
      : part.content
  )
}

// Helper function to format technical skills: remove all **, bold until ":"
function formatTechnicalSkills(text) {
  if (!text) return ''
  
  // Remove all ** markers first
  let cleanedText = text.replace(/\*\*/g, '')
  
  // Split by newlines to handle multiple lines
  const lines = cleanedText.split('\n')
  
  return lines.map((line, lineIndex) => {
    if (!line.trim()) {
      return lineIndex < lines.length - 1 ? <br key={lineIndex} /> : null
    }
    
    const colonIndex = line.indexOf(':')
    if (colonIndex !== -1) {
      // Bold part before colon, normal after
      const beforeColon = line.substring(0, colonIndex)
      const afterColon = line.substring(colonIndex)
      return (
        <span key={lineIndex}>
          <strong>{beforeColon}</strong>{afterColon}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      )
    } else {
      // No colon found, return as is
      return (
        <span key={lineIndex}>
          {line}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      )
    }
  })
}

function ResumeDocument({ resumeData }) {
  return (
    <div className="bg-white p-10 max-w-4xl mx-auto" style={{ minHeight: '11in' }}>
      {/* Personal Info Section */}
      <div className="mb-2 text-center pb-6">
        <h1 className="text-5xl text-black tracking-tight" style={{ letterSpacing: '0.5px', fontFamily: 'Roboto Serif ExtraBold',fontWeight:1000}}>
          {resumeData.personalInfo.name}
        </h1>
        <p className="text-2xl font-semibold text-black mb-4" style={{ letterSpacing: '0.3px', fontFamily:'Roboto Serif Medium' }}>
          {resumeData.personalInfo.position}
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-black" style = {{fontSize:15, fontFamily: 'Roboto Serif Medium', fontWeight:500}}>
          <span className="flex items-center gap-1">
            <span className="text-black"></span>
            {resumeData.personalInfo.address}
          </span>
          <span className="text-black">|</span>
          <span className="flex items-center gap-1">
            <span className="text-black"></span>
            {resumeData.personalInfo.account}
          </span>
          <span className="text-black">|</span>
          <span className="flex items-center gap-1">
            <span className="text-black"></span>
            {resumeData.personalInfo.phone}
          </span>
        </div>
      </div>

      {/* Summary Section */}
      {resumeData.summary && (
        <div className="mb-4">
          <h2 className="font-bold mb-2  tracking-wider border-b-2 pb-2" style={{fontSize:20, fontFamily:'Cambria', letterSpacing: '0.5px', borderColor: 'black'}}>
            Summary
          </h2>
          <p className=" whitespace-pre-wrap" style={{ fontSize:14, fontFamily:'Cambria', letterSpacing: '0.5px', lineHeight:'1.2'}}>
            {resumeData.summary.split('\n').map((line, lineIndex) => (
              <span key={lineIndex}>
                {formatBoldText(line)}
                {lineIndex < resumeData.summary.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* Experience Section */}
      {resumeData.experiences.some(exp => exp.company || exp.title) && (
        <div className="mb-4">
          <h2 className="font-bold mb-2 tracking-wider border-b-2 pb-2" style={{ fontSize:20, fontFamily:'Cambria', letterSpacing: '0.5px', borderColor: 'black'}}>
            Experience
          </h2>
          <div className="space-y-2">
            {resumeData.experiences.map((exp, index) => {
              if (!exp.company && !exp.title) return null
              return (
                <div key={index} className="pb-4 border-b  last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      {exp.company && (
                        <p className=" font-bold " style={{ fontSize:16, fontFamily:'Cambria', letterSpacing: '0.5px'}}>
                          {exp.company}
                        </p>
                      )}
                      {exp.title && (
                        <h3 className=" font-bold" style={{ fontSize:15, fontFamily:'Cambria', letterSpacing: '0.5px'}}>
                          {exp.title}
                        </h3>
                      )}
                    </div>
                    {(exp.start || exp.end) && (
                      <p className="whitespace-nowrap ml-4 text-right" style={{ fontSize:14, fontFamily:'Cambria', letterSpacing: '0.5px'}}>
                        {exp.start} {exp.start && exp.end ? ' - ' : ''} {exp.end}
                      </p>
                    )}
                  </div>
                  {exp.bullets.some(b => b.trim()) && (
                    <ul className="list-none mt-3 space-y-1.5 ml-1">
                      {exp.bullets
                        .filter(bullet => bullet.trim())
                        .map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="text-sm  leading-relaxed flex items-start" style={{ fontSize:14, fontFamily:'Cambria', letterSpacing: '0.5px', lineHeight:'1.2'}}>
                            <span className=" font-bold mr-2">•</span>
                            <span className="flex-1">{formatBoldText(bullet)}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Technical Skills Section */}
      {resumeData.technicalSkills && (
        <div className="mb-4">
          <h2 className="font-bold mb-3 tracking-wider border-b-2 pb-2" style={{ fontSize:20, fontFamily:'Cambria', letterSpacing: '0.5px', borderColor: 'black'}}>
            Technical Skills
          </h2>
          <p className="leading-relaxed" style={{ fontSize:14, fontFamily:'Cambria', letterSpacing: '0.5px', lineHeight:'1.5'}}>
            {formatTechnicalSkills(resumeData.technicalSkills)}
          </p>
        </div>
      )}

      {/* Education Section */}
      {resumeData.education.some(edu => edu.university || edu.major) && (
        <div className="mb-4">
          <h2 className="font-bold  mb-5 tracking-wider border-b-2  pb-2" style={{ fontSize:20, fontFamily:'Cambria', letterSpacing: '0.5px', borderColor: 'black'}}>
            Education
          </h2>
          <div className="space-y-5">
            {resumeData.education.map((edu, index) => {
              if (!edu.university && !edu.major) return null
              return (
                <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      {edu.university && (
                        <h3 className="text-base font-bold  mb-1"  style={{ fontSize:14, fontFamily:'Cambria', letterSpacing: '0.5px', lineHeight:'1.2'}}>
                          {edu.university}
                        </h3>
                      )}
                      {edu.major && (
                        <p style={{ fontSize:14, fontFamily:'Cambria', letterSpacing: '0.5px', lineHeight:'1.2'}}>
                          {edu.major}
                        </p>
                      )}
                    </div>
                    {(edu.startYear || edu.graduateYear) && (
                      <p className="whitespace-nowrap ml-4 text-right"  style={{ fontSize:14, fontFamily:'Cambria', letterSpacing: '0.5px', lineHeight:'1.2'}}>
                        {edu.startYear} {edu.startYear && edu.graduateYear ? ' - ' : ''} {edu.graduateYear}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Licenses & Certifications Section */}
      {resumeData.certifications && resumeData.certifications.length > 0 && resumeData.certifications.some(cert => cert.major) && (
        <div className="mb-7">
          <h2 className="text-lg font-bold  mb-5 uppercase tracking-wider border-b-2 pb-2" style={{ letterSpacing: '1px' }}>
            Licenses & Certifications
          </h2>
          <div className="space-y-4">
            {resumeData.certifications.map((cert, index) => {
              if (!cert.major) return null
              return (
                <div key={index} className="mb-3 pb-3 border-b last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {cert.major && (
                        <h3 className="text-base font-bold mb-1">
                          {cert.major}
                        </h3>
                      )}
                    </div>
                    {cert.issueDate && (
                      <p className="text-sm font-medium whitespace-nowrap ml-4 text-right">
                        {cert.issueDate}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeDocument