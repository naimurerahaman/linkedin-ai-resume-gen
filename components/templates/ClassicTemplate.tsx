import { ResumeData } from '@/types/resume'

interface Props {
  data: ResumeData
}

export function ClassicTemplate({ data }: Props) {
  const { contact, summary, experience, education, skills, projects, certifications, volunteer, languages } = data

  return (
    <div className="bg-white text-gray-900 p-8 w-full font-serif text-[13px] leading-relaxed">
      {/* Header */}
      <div className="text-center pb-3 mb-4 border-b-2 border-gray-900">
        <h1 className="text-[26px] font-bold uppercase tracking-widest leading-tight">
          {contact.name}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1.5 text-[11px] text-gray-600">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <><span>·</span><span>{contact.phone}</span></>}
          {contact.location && <><span>·</span><span>{contact.location}</span></>}
          {contact.linkedin && (
            <><span>·</span>
            <span className="text-blue-700 print:text-gray-700">
              {contact.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
            </span></>
          )}
          {contact.website && (
            <><span>·</span>
            <span className="text-blue-700 print:text-gray-700">
              {contact.website.replace(/^https?:\/\/(www\.)?/, '')}
            </span></>
          )}
        </div>
      </div>

      {summary && (
        <Section title="Professional Summary">
          <p className="leading-relaxed">{summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          <div className="space-y-3">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold">{exp.title}</span>
                    <span className="text-gray-600"> — {exp.company}</span>
                  </div>
                  <span className="text-[11px] text-gray-500 shrink-0 ml-4">{exp.dates}</span>
                </div>
                <ul className="mt-1 space-y-0.5">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="pl-4 relative before:content-['•'] before:absolute before:left-1">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          <div className="space-y-1">
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold">{edu.degree}</span>
                  <span className="text-gray-600"> — {edu.school}</span>
                  {edu.notes && <span className="text-gray-500"> · {edu.notes}</span>}
                </div>
                <span className="text-[11px] text-gray-500 shrink-0 ml-4">{edu.dates}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <p>{skills.join(' · ')}</p>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-2">
            {projects.map((proj, i) => (
              <div key={i}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold">{proj.name}</span>
                  {proj.tech.length > 0 && (
                    <span className="text-[11px] text-gray-500">({proj.tech.join(', ')})</span>
                  )}
                  {proj.link && (
                    <span className="text-[11px] text-blue-700 print:text-gray-700">
                      {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-gray-700">{proj.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications">
          <div className="space-y-1">
            {certifications.map((cert, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold">{cert.name}</span>
                  <span className="text-gray-600"> — {cert.issuer}</span>
                </div>
                <span className="text-[11px] text-gray-500 shrink-0 ml-4">{cert.date}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {volunteer.length > 0 && (
        <Section title="Volunteer Work">
          <div className="space-y-2">
            {volunteer.map((vol, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold">{vol.role}</span>
                    <span className="text-gray-600"> — {vol.org}</span>
                  </div>
                  <span className="text-[11px] text-gray-500 shrink-0 ml-4">{vol.dates}</span>
                </div>
                <p className="mt-0.5 text-gray-700">{vol.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {languages.length > 0 && (
        <Section title="Languages">
          <p>{languages.join(' · ')}</p>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600 border-b border-gray-300 pb-0.5 mb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}
