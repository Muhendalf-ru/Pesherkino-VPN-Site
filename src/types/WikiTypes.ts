// Интерфейсы для Wiki
export interface WikiSection {
  id: string;
  title: string;
  content: string;
  subsections?: WikiSection[];
}

export interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  subsectionId?: string;
  subsectionTitle?: string;
  matchedText: string;
  context: string;
  type: 'section' | 'subsection' | 'content';
}
