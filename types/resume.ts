export type Template = 'classic' | 'modern' | 'minimal'

export interface ContactInfo {
  name: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
}

export interface ExperienceItem {
  title: string
  company: string
  dates: string
  bullets: string[]
}

export interface EducationItem {
  degree: string
  school: string
  dates: string
  notes: string
}

export interface ProjectItem {
  name: string
  description: string
  tech: string[]
  link: string
}

export interface CertificationItem {
  name: string
  issuer: string
  date: string
}

export interface VolunteerItem {
  role: string
  org: string
  dates: string
  description: string
}

export interface ResumeData {
  contact: ContactInfo
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: string[]
  projects: ProjectItem[]
  certifications: CertificationItem[]
  volunteer: VolunteerItem[]
  languages: string[]
}

export interface GenerateRequest {
  profileText: string
  jobDescription?: string
  template: Template
}

export interface GenerateResponse {
  resume: ResumeData
  email?: string
}
