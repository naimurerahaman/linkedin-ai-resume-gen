import { ResumeData } from '@/types/resume'

interface Props {
  data: ResumeData
}

export function MinimalTemplate({ data }: Props) {
  const { contact, summary, experience, education, skills, projects, certifications, volunteer, languages } = data

  return (
    <div className="bg-white text-gray-900 p-10 w-full font-sans text-[12.5px] leading-relaxed">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[28px] font-light tracking-tight text-gray-900 leading-none">
          {contact.name}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[11px] text-gray-500">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && (
            <span>{contact.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
          )}
          {contact.website && (
            <span>{contact.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
          )}
        </div>
      </div>

      {summary && (
        <Section title="Summary">
          <p className="text-gray-600 leading-relaxed max-w-2xl">{summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-medium text-gray-900">{exp.title}</span>
                    <span className="text-gray-500 ml-2">{exp.company}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0 ml-4">{exp.dates}</span>
                </div>
                <ul className="mt-1.5 space-y-0.5">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-gray-600 pl-3 relative before:content-['-'] before:absolute before:left-0 before:text-gray-400">
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
          <div className="space-y-1.5">
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <span className="font-medium text-gray-900">{edu.degree}</span>
                  <span className="text-gray-500 ml-2">{edu.school}</span>
                  {edu.notes && <span className="text-gray-400 ml-2">{edu.notes}</span>}
                </div>
                <span className="text-[11px] text-gray-400 shrink-0 ml-4">{edu.dates}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <p className="text-gray-600">{skills.join(', ')}</p>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-2.5">
            {projects.map((proj, i) => (
              <div key={i}>
                <div className="flex items-baseline gap-3">
                  <span className="font-medium text-gray-900">{proj.name}</span>
                  {proj.tech.length > 0 && (
                    <span className="text-[11px] text-gray-400">{proj.tech.join(' · ')}</span>
                  )}
                  {proj.link && (
                    <span className="text-[11px] text-gray-400">
                      {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-0.5">{proj.description}</p>
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
                  <span className="font-medium text-gray-900">{cert.name}</span>
                  <span className="text-gray-500 ml-2">{cert.issuer}</span>
                </div>
                <span className="text-[11px] text-gray-400 shrink-0 ml-4">{cert.date}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {volunteer.length > 0 && (
        <Section title="Volunteer">
          <div className="space-y-2.5">
            {volunteer.map((vol, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-medium text-gray-900">{vol.role}</span>
                    <span className="text-gray-500 ml-2">{vol.org}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0 ml-4">{vol.dates}</span>
                </div>
                <p className="text-gray-600 mt-0.5">{vol.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {languages.length > 0 && (
        <Section title="Languages">
          <p className="text-gray-600">{languages.join(', ')}</p>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-[9px] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}
