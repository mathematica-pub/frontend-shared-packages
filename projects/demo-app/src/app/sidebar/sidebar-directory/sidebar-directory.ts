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

export interface SidebarDirectory extends DirectoryItemBase {
  type: DirectoryItem.Directory;
  contents: SidebarItem[];
}

export interface DocsFile extends DirectoryItemBase {
  type: DirectoryItem.File;
  contents: string;
}

export type SidebarItem = SidebarDirectory | DocsFile;
