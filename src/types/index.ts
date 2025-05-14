export interface SocialPlatform {
  name: string;
  icon: string;
  username?: string;
  isSelected: boolean;
}

export interface SearchResult {
  title: string;
  link: string;
  description: string;
  image?: string;
  favicon: string;
  source: string;
  date?: string;
} 