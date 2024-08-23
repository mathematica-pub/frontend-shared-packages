export enum Section {
  Overview = 'overview',
  Content = 'content',
}

export interface State {
  section: Section;
  contentPath: string;
}
