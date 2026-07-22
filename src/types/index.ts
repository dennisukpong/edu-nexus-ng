export interface Job {
  id: string;
  title: string;
  school: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  category: string;
  salary: string;
  postedAt: string;
  logo?: string;
  featured: boolean;
  description: string;
  requirements: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  school: string;
  avatar: string;
  text: string;
  rating: number;
}

export interface Stat {
  value: string;
  label: string;
  icon: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}