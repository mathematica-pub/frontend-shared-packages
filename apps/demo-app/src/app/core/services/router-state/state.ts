export enum Library {
  SharedPackages = 'shared-packages',
  AppDevKit = 'app-kit',
  UiComponents = 'ui',
  VizComponents = 'viz',
}

export enum Section {
  Overview = 'overview',
  Content = 'content',
  Documentation = 'documentation',
}

export interface State {
  lib: Library;
  section: Section;
  contentPath: string;
}
