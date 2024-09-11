import { Library, Section } from '../services/router-state/state';

export const getContentConfigForLib = (lib: Library): string => {
  return `${lib}/${Section.Content}/content-directory.yaml`;
};

export const getDocumentationConfigForLib = (lib: Library): string => {
  return `${lib}/${Section.Documentation}/documentation-directory.yaml`;
};
