// Helper function to format text with **bold** markers (for summary, experience, etc.)
function formatBoldText(text) {
  if (!text) return ''

  const parts = []
  let lastIndex = 0
  const regex = /\*\*(.*?)\*\*/g
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.substring(lastIndex, match.index), key: `text-${lastIndex}` })
    }
    parts.push({ type: 'bold', content: match[1], key: `bold-${match.index}` })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.substring(lastIndex), key: `text-${lastIndex}` })
  }

  if (parts.length === 0) {
    return text
  }

  return parts.map(part =>
    part.type === 'bold'
      ? <strong key={part.key}>{part.content}</strong>
      : part.content
  )
}

// Helper function to format technical skills: remove all **, bold until ":"
function formatTechnicalSkills(text) {
  if (!text) return ''

  const cleanedText = text.replace(/\*\*/g, '')
  const lines = cleanedText.split('\n')

  return lines.map((line, lineIndex) => {
    if (!line.trim()) {
      return lineIndex < lines.length - 1 ? <br key={lineIndex} /> : null
    }

    const colonIndex = line.indexOf(':')
    if (colonIndex !== -1) {
      const beforeColon = line.substring(0, colonIndex)
      const afterColon = line.substring(colonIndex)
      return (
        <span key={lineIndex}>
          <strong>{beforeColon}</strong>{afterColon}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      )
    }

    return (
      <span key={lineIndex}>
        {line}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    )
  })
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-[10px] font-semibold tracking-[0.3em] text-slate-500 uppercase border-b border-slate-200 pb-1 mb-3">
      {children}
    </h2>
  )
}

function ResumeDocument({ resumeData }) {
  const { personalInfo, summary, experiences, technicalSkills, education, certifications } = resumeData

  return (
    <div
      className="resume-document bg-white px-10 py-8 max-w-3xl mx-auto text-slate-900"
      style={{ minHeight: '11in' }}
    >
      {/* Header */}
      <header className="pb-4 mb-6">
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1">
            {personalInfo.name && (
              <h1 className="text-3xl font-semibold tracking-tight">
                {personalInfo.name}
              </h1>
            )}
            {personalInfo.position && (
              <p className="mt-1 text-[13px] font-semibold text-slate-700 tracking-wide">
                {personalInfo.position}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end text-[11px] text-slate-600 leading-relaxed">
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {personalInfo.account && <span>{personalInfo.account}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
          </div>
        </div>
      </header>

      {/* Summary */}
      {summary && summary.trim() && (
        <section className="mb-5">
          <SectionTitle>Summary</SectionTitle>
          <p className="text-[12px] leading-relaxed whitespace-pre-wrap">
            {summary.split('\n').map((line, lineIndex, arr) => (
              <span key={lineIndex}>
                {formatBoldText(line)}
                {lineIndex < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        </section>
      )}
      
      {/* Technical Skills */}
      {technicalSkills && technicalSkills.trim() && (
        <section className="mb-5">
          <SectionTitle>Technical Skills</SectionTitle>
          <p className="text-[12px] leading-relaxed flex flex-col gap-[6px]">
            {formatTechnicalSkills(technicalSkills)}
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences && experiences.some(exp => exp.company || exp.title) && (
        <section className="mb-5">
          <SectionTitle>Professional Experience</SectionTitle>
          <div className="space-y-4">
            {experiences.map((exp, index) => {
              if (!exp.company && !exp.title) return null
              const hasBullets = Array.isArray(exp.bullets) && exp.bullets.some(b => b && b.trim())

              return (
                <article key={index} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {exp.title && (
                        <h3 className="text-[13px] font-semibold text-slate-900 leading-snug">
                          {exp.title}
                        </h3>
                      )}
                      {exp.company && (
                        <p className="text-[12px] text-slate-700 mt-0.5">
                          {exp.company}
                        </p>
                      )}
                    </div>
                    {(exp.start || exp.end) && (
                      <p className="text-[11px] text-slate-600 whitespace-nowrap">
                        {exp.start}
                        {exp.start && exp.end ? ' – ' : ''}
                        {exp.end}
                      </p>
                    )}
                  </div>

                  {hasBullets && (
                    <ul className="mt-2 list-disc list-outside pl-5 space-y-1.5">
                      {exp.bullets
                        .filter(bullet => bullet && bullet.trim()) 
                        .map((bullet, bulletIndex) => (
                          <li
                            key={bulletIndex}
                            className="text-[12px] leading-relaxed text-slate-800"
                          >
                            {formatBoldText(bullet)}
                          </li>
                        ))}
                    </ul>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.some(edu => edu.university || edu.major) && (
        <section className="mb-5">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-3">
            {education.map((edu, index) => {
              if (!edu.university && !edu.major) return null

              return (
                <article key={index} className="flex justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {edu.university && (
                      <h3 className="text-[13px] font-semibold text-slate-900 leading-snug">
                        {edu.university}
                      </h3>
                    )}
                    {edu.major && (
                      <p className="text-[12px] text-slate-700 mt-0.5">
                        {edu.major}
                      </p>
                    )}
                  </div>
                  {(edu.startYear || edu.graduateYear) && (
                    <p className="text-[11px] text-slate-600 whitespace-nowrap">
                      {edu.startYear}
                      {edu.startYear && edu.graduateYear ? ' – ' : ''}
                      {edu.graduateYear}
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Licenses & Certifications */}
      {certifications &&
        certifications.length > 0 &&
        certifications.some(cert => cert.major) && (
          <section className="mb-2">
            <SectionTitle>Licenses & Certifications</SectionTitle>
            <div className="space-y-2">
              {certifications.map((cert, index) => {
                if (!cert.major) return null

                return (
                  <article key={index} className="flex justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-semibold text-slate-900 leading-snug">
                        {cert.major}
                      </h3>
                    </div>
                    {cert.issueDate && (
                      <p className="text-[11px] text-slate-600 whitespace-nowrap">
                        {cert.issueDate}
                      </p>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        )}
    </div>
  )
}

export default ResumeDocument