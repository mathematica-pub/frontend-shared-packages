export enum Library {
  SharedPackages = 'shared-packages',
  AppDevKit = 'app-dev-kit',
  UiComponents = 'ui-components',
  VizComponents = 'viz-components',
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
