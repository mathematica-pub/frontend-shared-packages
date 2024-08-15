export type NestedStringObject = {
  [key: string]: string | NestedStringObject;
};

export enum DirectoryItem {
  Directory = 'directory',
  File = 'file',
}

interface DirectoryItemBase {
  name: string;
}

export interface DocsDirectory extends DirectoryItemBase {
  type: DirectoryItem.Directory;
  contents: DocsItem[];
}

export interface DocsFile extends DirectoryItemBase {
  type: DirectoryItem.File;
  contents: string;
}

export type DocsItem = DocsDirectory | DocsFile;
