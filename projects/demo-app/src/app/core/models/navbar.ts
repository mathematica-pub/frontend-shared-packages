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

export interface NavbarDirectory extends DirectoryItemBase {
  type: DirectoryItem.Directory;
  contents: NavbarItem[];
}

export interface NavbarFile extends DirectoryItemBase {
  type: DirectoryItem.File;
  contents: string;
}

export type NavbarItem = NavbarDirectory | NavbarFile;
