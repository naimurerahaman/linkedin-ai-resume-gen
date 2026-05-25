'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react'
import {
  ResumeData,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  CertificationItem,
  VolunteerItem,
} from '@/types/resume'

interface Props {
  data: ResumeData
  onChange: (updated: ResumeData) => void
}

export function EditPanel({ data, onChange }: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>({
    contact: true,
    summary: true,
    experience: true,
    education: false,
    skills: false,
    projects: false,
    certifications: false,
    volunteer: false,
    languages: false,
  })
  const [newSkill, setNewSkill] = useState('')
  const [newLang, setNewLang] = useState('')

  function toggle(key: string) {
    setOpen((s) => ({ ...s, [key]: !s[key] }))
  }

  function patch<K extends keyof ResumeData>(key: K, value: ResumeData[K]) {
    onChange({ ...data, [key]: value })
  }

  function patchContact(field: keyof ResumeData['contact'], value: string) {
    onChange({ ...data, contact: { ...data.contact, [field]: value } })
  }

  // ── Experience ──────────────────────────────────────────
  function patchExp(i: number, field: keyof ExperienceItem, value: string | string[]) {
    const arr = [...data.experience]
    arr[i] = { ...arr[i], [field]: value }
    patch('experience', arr)
  }

  function patchBullet(ei: number, bi: number, value: string) {
    const bullets = [...data.experience[ei].bullets]
    bullets[bi] = value
    patchExp(ei, 'bullets', bullets)
  }

  // ── Education ──────────────────────────────────────────
  function patchEdu(i: number, field: keyof EducationItem, value: string) {
    const arr = [...data.education]
    arr[i] = { ...arr[i], [field]: value }
    patch('education', arr)
  }

  // ── Projects ──────────────────────────────────────────
  function patchProject(i: number, field: keyof ProjectItem, value: string | string[]) {
    const arr = [...data.projects]
    arr[i] = { ...arr[i], [field]: value }
    patch('projects', arr)
  }

  // ── Certifications ────────────────────────────────────
  function patchCert(i: number, field: keyof CertificationItem, value: string) {
    const arr = [...data.certifications]
    arr[i] = { ...arr[i], [field]: value }
    patch('certifications', arr)
  }

  // ── Volunteer ─────────────────────────────────────────
  function patchVol(i: number, field: keyof VolunteerItem, value: string) {
    const arr = [...data.volunteer]
    arr[i] = { ...arr[i], [field]: value }
    patch('volunteer', arr)
  }

  // ── Skills / Languages ───────────────────────────────
  function addSkill() {
    if (!newSkill.trim()) return
    patch('skills', [...data.skills, newSkill.trim()])
    setNewSkill('')
  }

  function addLang() {
    if (!newLang.trim()) return
    patch('languages', [...data.languages, newLang.trim()])
    setNewLang('')
  }

  return (
    <div className="space-y-1.5">
      {/* CONTACT */}
      <Accordion title="Contact" open={open.contact} onToggle={() => toggle('contact')}>
        <div className="space-y-2">
          <Row label="Name">
            <Input value={data.contact.name} onChange={(v) => patchContact('name', v)} />
          </Row>
          <Row label="Email">
            <Input value={data.contact.email} onChange={(v) => patchContact('email', v)} />
          </Row>
          <Row label="Phone">
            <Input value={data.contact.phone} onChange={(v) => patchContact('phone', v)} />
          </Row>
          <Row label="Location">
            <Input value={data.contact.location} onChange={(v) => patchContact('location', v)} />
          </Row>
          <Row label="LinkedIn">
            <Input
              value={data.contact.linkedin}
              onChange={(v) => patchContact('linkedin', v)}
              placeholder="https://linkedin.com/in/..."
            />
          </Row>
          <Row label="Website">
            <Input
              value={data.contact.website}
              onChange={(v) => patchContact('website', v)}
              placeholder="https://..."
            />
          </Row>
        </div>
      </Accordion>

      {/* SUMMARY */}
      <Accordion title="Summary" open={open.summary} onToggle={() => toggle('summary')}>
        <textarea
          value={data.summary}
          onChange={(e) => patch('summary', e.target.value)}
          rows={4}
          className="w-full text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-blue-400 focus:bg-white resize-none"
        />
      </Accordion>

      {/* EXPERIENCE */}
      <Accordion title="Experience" open={open.experience} onToggle={() => toggle('experience')}>
        <div className="space-y-3">
          {data.experience.map((exp, ei) => (
            <div key={ei} className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50/50">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  Entry {ei + 1}
                </span>
                <button
                  onClick={() => patch('experience', data.experience.filter((_, j) => j !== ei))}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <Row label="Title">
                <Input value={exp.title} onChange={(v) => patchExp(ei, 'title', v)} />
              </Row>
              <Row label="Company">
                <Input value={exp.company} onChange={(v) => patchExp(ei, 'company', v)} />
              </Row>
              <Row label="Dates">
                <Input
                  value={exp.dates}
                  onChange={(v) => patchExp(ei, 'dates', v)}
                  placeholder="Jan 2020 – Present"
                />
              </Row>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-wide text-gray-400 block mb-1">
                  Bullets
                </label>
                <div className="space-y-1">
                  {exp.bullets.map((b, bi) => (
                    <div key={bi} className="flex gap-1 items-center">
                      <input
                        value={b}
                        onChange={(e) => patchBullet(ei, bi, e.target.value)}
                        className="flex-1 text-sm bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-blue-400"
                      />
                      <button
                        onClick={() =>
                          patchExp(ei, 'bullets', exp.bullets.filter((_, j) => j !== bi))
                        }
                        className="text-gray-300 hover:text-red-400 shrink-0 transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => patchExp(ei, 'bullets', [...exp.bullets, ''])}
                  className="mt-1.5 text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <Plus className="size-3" /> Add bullet
                </button>
              </div>
            </div>
          ))}
          <AddButton
            onClick={() =>
              patch('experience', [
                ...data.experience,
                { title: '', company: '', dates: '', bullets: [''] },
              ])
            }
            label="Add experience"
          />
        </div>
      </Accordion>

      {/* EDUCATION */}
      <Accordion title="Education" open={open.education} onToggle={() => toggle('education')}>
        <div className="space-y-3">
          {data.education.map((edu, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50/50">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  Entry {i + 1}
                </span>
                <button
                  onClick={() => patch('education', data.education.filter((_, j) => j !== i))}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <Row label="Degree">
                <Input value={edu.degree} onChange={(v) => patchEdu(i, 'degree', v)} />
              </Row>
              <Row label="School">
                <Input value={edu.school} onChange={(v) => patchEdu(i, 'school', v)} />
              </Row>
              <Row label="Dates">
                <Input value={edu.dates} onChange={(v) => patchEdu(i, 'dates', v)} />
              </Row>
              <Row label="Notes">
                <Input
                  value={edu.notes}
                  onChange={(v) => patchEdu(i, 'notes', v)}
                  placeholder="GPA, honors, etc."
                />
              </Row>
            </div>
          ))}
          <AddButton
            onClick={() =>
              patch('education', [
                ...data.education,
                { degree: '', school: '', dates: '', notes: '' },
              ])
            }
            label="Add education"
          />
        </div>
      </Accordion>

      {/* SKILLS */}
      <Accordion title="Skills" open={open.skills} onToggle={() => toggle('skills')}>
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
            {data.skills.map((skill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full"
              >
                {skill}
                <button
                  onClick={() => patch('skills', data.skills.filter((_, j) => j !== i))}
                  className="text-blue-300 hover:text-red-400 transition-colors"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Add a skill, press Enter"
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-blue-400 focus:bg-white"
            />
            <button
              onClick={addSkill}
              className="px-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
      </Accordion>

      {/* PROJECTS */}
      <Accordion title="Projects" open={open.projects} onToggle={() => toggle('projects')}>
        <div className="space-y-3">
          {data.projects.map((proj, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50/50">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  Project {i + 1}
                </span>
                <button
                  onClick={() => patch('projects', data.projects.filter((_, j) => j !== i))}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <Row label="Name">
                <Input value={proj.name} onChange={(v) => patchProject(i, 'name', v)} />
              </Row>
              <Row label="Description">
                <textarea
                  value={proj.description}
                  onChange={(e) => patchProject(i, 'description', e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-blue-400 focus:bg-white resize-none"
                />
              </Row>
              <Row label="Tech (comma-separated)">
                <Input
                  value={proj.tech.join(', ')}
                  onChange={(v) =>
                    patchProject(
                      i,
                      'tech',
                      v.split(',').map((t) => t.trim()).filter(Boolean)
                    )
                  }
                  placeholder="React, TypeScript, ..."
                />
              </Row>
              <Row label="Link">
                <Input
                  value={proj.link}
                  onChange={(v) => patchProject(i, 'link', v)}
                  placeholder="https://..."
                />
              </Row>
            </div>
          ))}
          <AddButton
            onClick={() =>
              patch('projects', [
                ...data.projects,
                { name: '', description: '', tech: [], link: '' },
              ])
            }
            label="Add project"
          />
        </div>
      </Accordion>

      {/* CERTIFICATIONS */}
      <Accordion
        title="Certifications"
        open={open.certifications}
        onToggle={() => toggle('certifications')}
      >
        <div className="space-y-3">
          {data.certifications.map((cert, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50/50">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  Cert {i + 1}
                </span>
                <button
                  onClick={() =>
                    patch('certifications', data.certifications.filter((_, j) => j !== i))
                  }
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <Row label="Name">
                <Input value={cert.name} onChange={(v) => patchCert(i, 'name', v)} />
              </Row>
              <Row label="Issuer">
                <Input value={cert.issuer} onChange={(v) => patchCert(i, 'issuer', v)} />
              </Row>
              <Row label="Date">
                <Input value={cert.date} onChange={(v) => patchCert(i, 'date', v)} />
              </Row>
            </div>
          ))}
          <AddButton
            onClick={() =>
              patch('certifications', [...data.certifications, { name: '', issuer: '', date: '' }])
            }
            label="Add certification"
          />
        </div>
      </Accordion>

      {/* VOLUNTEER */}
      <Accordion title="Volunteer" open={open.volunteer} onToggle={() => toggle('volunteer')}>
        <div className="space-y-3">
          {data.volunteer.map((vol, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50/50">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  Entry {i + 1}
                </span>
                <button
                  onClick={() => patch('volunteer', data.volunteer.filter((_, j) => j !== i))}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <Row label="Role">
                <Input value={vol.role} onChange={(v) => patchVol(i, 'role', v)} />
              </Row>
              <Row label="Organization">
                <Input value={vol.org} onChange={(v) => patchVol(i, 'org', v)} />
              </Row>
              <Row label="Dates">
                <Input value={vol.dates} onChange={(v) => patchVol(i, 'dates', v)} />
              </Row>
              <Row label="Description">
                <textarea
                  value={vol.description}
                  onChange={(e) => patchVol(i, 'description', e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-blue-400 focus:bg-white resize-none"
                />
              </Row>
            </div>
          ))}
          <AddButton
            onClick={() =>
              patch('volunteer', [
                ...data.volunteer,
                { role: '', org: '', dates: '', description: '' },
              ])
            }
            label="Add entry"
          />
        </div>
      </Accordion>

      {/* LANGUAGES */}
      <Accordion title="Languages" open={open.languages} onToggle={() => toggle('languages')}>
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
            {data.languages.map((lang, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
              >
                {lang}
                <button
                  onClick={() => patch('languages', data.languages.filter((_, j) => j !== i))}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            <input
              value={newLang}
              onChange={(e) => setNewLang(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addLang()}
              placeholder="Add a language, press Enter"
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-blue-400 focus:bg-white"
            />
            <button
              onClick={addLang}
              className="px-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
      </Accordion>
    </div>
  )
}

// ── Shared sub-components ────────────────────────────────────────────────────

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</span>
        {open ? (
          <ChevronUp className="size-3.5 text-gray-400" />
        ) : (
          <ChevronDown className="size-3.5 text-gray-400" />
        )}
      </button>
      {open && <div className="p-3">{children}</div>}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-medium uppercase tracking-wide text-gray-400 block mb-0.5">
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-blue-400 focus:bg-white"
    />
  )
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-1"
    >
      <Plus className="size-3" /> {label}
    </button>
  )
}
