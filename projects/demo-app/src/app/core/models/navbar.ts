export type NestedStringObject = {
  [key: string]: string | NestedStringObject;
};

export enum DirItem {
  Folder = 'folder',
  File = 'file',
}

interface NavbarItemBase {
  type: DirItem;
  name: string;
  contents: string | NavbarItem[];
}

export interface NavbarFolder extends NavbarItemBase {
  type: DirItem.Folder;
  contents: NavbarItem[];
}

export interface NavbarFile extends NavbarItemBase {
  type: DirItem.File;
  contents: string;
}

export type NavbarItem = NavbarFolder | NavbarFile;
