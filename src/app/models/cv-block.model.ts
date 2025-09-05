export interface PersonalInfo {
    name: string;
    title: string;
    email: string;
    phone: string;
    summary: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    avatar: string;
    id: string;
}

export interface Experience {
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    id: string;
}

export interface Education {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
    description: string;
    id: string;
}

export interface Skill {
    category: string;
    level: string;
    items: string[];
    description: string;
    id: string;
}

export interface Project {
    title: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
    startDate: string;
    endDate?: string;
    id: string;
}

export interface Award {
    title: string;
    issuer: string;
    dateReceived: string;
    expiryDate?: string;
    description: string;
    verificationUrl?: string;
    id: string;
}

export interface Language {
    language: string;
    level: string;
    certification?: string;
    score?: string;
    description: string;
    id: string;
}

export interface Interest {
    category: string;
    items: string[];
    description: string;
    id: string;
}

export interface Course {
    title: string;
    provider: string;
    duration: string;
    completionDate: string;
    certificateUrl?: string;
    description: string;
    id: string;
}

export interface Organization {
    name: string;
    role: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    id: string;
}

export interface Publication {
    title: string;
    authors: string[];
    venue: string;
    date: string;
    doi?: string;
    url?: string;
    description: string;
    id: string;
}

export interface Reference {
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    relationship: string;
    id: string;
}

export interface Certification {
    title: string;
    issuer: string;
    dateReceived: string;
    expiryDate?: string;
    description: string;
    verificationUrl?: string;
    id: string;
}

export interface Declaration {
    statement: string;
    place: string;
    date: string;
    signature: string;
    id: string;
}

export interface CustomSection {
    title: string;
    subtitle?: string;
    content: string;
    url?: string;
    id: string;
}

export interface CVBlock {
    personalInfo: PersonalInfo | null;
    experience: Experience[] | null;
    education: Education[] | null;
    certifications: Certification[] | null;
    skills: Skill[] | null ;
    projects: Project[] | null ;
    awards: Award[] | null ;
    languages: Language[] | null ;
    interests: Interest[] | null ;
    courses: Course[] | null ;
    organizations: Organization[] | null ;
    publications: Publication[] | null ;
    references: Reference[] | null ;
    declaration: Declaration | null ;
    customSections: CustomSection[] | null ;
}

export interface CVBlockForRendering {
    type: string;
    title: string;
    description: string;
    icon: string;
    data?: any;
}