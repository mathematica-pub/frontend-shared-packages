export type NestedStringObject = {
  [key: string]: string | NestedStringObject;
};

export interface NavbarItem {
  contents: string | NavbarItem[];
  isFile: boolean;
  name: string;
}
