export enum Section {
  Docs = 'documentation',
  Content = 'content',
}

export interface State {
  section: Section;
  contentPath: string;
}
