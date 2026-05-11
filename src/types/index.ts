export interface Product {
  name: string
  category: string
  rating: number
  image: string
  tags: string[]
  featured: boolean
  desc: string
  origin: string
  certifications: string[]
  benefits: string[]
  shelfLife: string
  storage: string
  usage: string
}

export interface Article {
  title: string
  desc: string
  category: string
  date: string
  readTime: string
  featured: boolean
  author: string
  publisher: string
  journal: string
  doi?: string
  publishDate: string
  heroImage?: string
  authorImage?: string
  tags: string[]
  fullContent: string
}

export interface FAQ {
  q: string
  a: string
}

export interface NavLink {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export interface Stat {
  icon: React.ComponentType<{ className?: string }>
  value: string
  label: string
}

export interface ContactInfo {
  phone: string
  email: string[]
  workingHours: string[]
  branches: Branch[]
}

export interface Branch {
  name: string
  address: string
  mapUrl: string
}

export interface QualityStandard {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
}

export interface CoreValue {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  points: string[]
}

export interface Goal {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
}
