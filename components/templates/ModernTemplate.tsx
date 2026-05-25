import { ResumeData } from '@/types/resume'

interface Props {
  data: ResumeData
}

export function ModernTemplate({ data }: Props) {
  const { contact, summary, experience, education, skills, projects, certifications, volunteer, languages } = data

  return (
    <div className="bg-white text-gray-900 flex w-full text-[12px] leading-relaxed min-h-full">
      {/* Sidebar */}
      <div className="w-[30%] bg-slate-800 text-slate-100 p-5 flex flex-col gap-5 shrink-0">
        <div>
          <h1 className="text-[20px] font-bold leading-tight text-white">{contact.name}</h1>
          {experience.length > 0 && (
            <p className="text-slate-300 text-[11px] mt-1">{experience[0].title}</p>
          )}
        </div>

        <SideSection title="Contact">
          <div className="space-y-1 text-[11px] text-slate-300">
            {contact.email && <p className="break-all">{contact.email}</p>}
            {contact.phone && <p>{contact.phone}</p>}
            {contact.location && <p>{contact.location}</p>}
            {contact.linkedin && (
              <p className="break-all">{contact.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</p>
            )}
            {contact.website && (
              <p className="break-all">{contact.website.replace(/^https?:\/\/(www\.)?/, '')}</p>
            )}
          </div>
        </SideSection>

        {skills.length > 0 && (
          <SideSection title="Skills">
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-slate-700 text-slate-200 text-[10px] px-2 py-0.5 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </SideSection>
        )}

        {certifications.length > 0 && (
          <SideSection title="Certifications">
            <div className="space-y-1.5">
              {certifications.map((cert, i) => (
                <div key={i}>
                  <p className="text-slate-200 font-medium text-[11px]">{cert.name}</p>
                  <p className="text-slate-400 text-[10px]">{cert.issuer} · {cert.date}</p>
                </div>
              ))}
            </div>
          </SideSection>
        )}

        {languages.length > 0 && (
          <SideSection title="Languages">
            <div className="space-y-0.5">
              {languages.map((lang, i) => (
                <p key={i} className="text-slate-300 text-[11px]">{lang}</p>
              ))}
            </div>
          </SideSection>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        {summary && (
          <MainSection title="About">
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </MainSection>
        )}

        {experience.length > 0 && (
          <MainSection title="Experience">
            <div className="space-y-3">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-semibold text-gray-900">{exp.title}</span>
                      <span className="text-gray-500"> · {exp.company}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-3">{exp.dates}</span>
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="text-gray-700 pl-3 relative before:content-['›'] before:absolute before:left-0 before:text-slate-500">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {education.length > 0 && (
          <MainSection title="Education">
            <div className="space-y-1.5">
              {education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-gray-900">{edu.degree}</span>
                    <span className="text-gray-500"> · {edu.school}</span>
                    {edu.notes && <span className="text-gray-400"> · {edu.notes}</span>}
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-3">{edu.dates}</span>
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {projects.length > 0 && (
          <MainSection title="Projects">
            <div className="space-y-2">
              {projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-gray-900">{proj.name}</span>
                    {proj.tech.length > 0 && (
                      <span className="text-[10px] text-gray-400">({proj.tech.join(', ')})</span>
                    )}
                  </div>
                  <p className="text-gray-700 mt-0.5">{proj.description}</p>
                  {proj.link && (
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {volunteer.length > 0 && (
          <MainSection title="Volunteer">
            <div className="space-y-2">
              {volunteer.map((vol, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-semibold text-gray-900">{vol.role}</span>
                      <span className="text-gray-500"> · {vol.org}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-3">{vol.dates}</span>
                  </div>
                  <p className="text-gray-700 mt-0.5">{vol.description}</p>
                </div>
              ))}
            </div>
          </MainSection>
        )}
      </div>
    </div>
  )
}

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5">
        {title}
      </h2>
      {children}
    </div>
  )
}

function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 mb-2 pb-1 border-b border-slate-200">
        {title}
      </h2>
      {children}
    </div>
  )
}
