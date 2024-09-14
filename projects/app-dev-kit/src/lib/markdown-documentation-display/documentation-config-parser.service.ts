import { Injectable } from '@angular/core';
import { AdkDocsConfig, AdkFilesItem } from './documentation-display.service';

interface NestedObject {
  [key: string]: string | NestedObject;
}

interface NavigationSiblings {
  previous: string | undefined;
  next: string | undefined;
}

@Injectable()
export class AdkDocumentationConfigParser {
  basePath: string;

  constructor() {}

  /**
   * Sets a base path for all files whose paths will be determined by this parser.
   *
   * If all of your files are in a specific folder, you can set that folder as the base path.
   *
   * @param path A base path that will be prepended to the file names.
   *
   */
  setBasePath(path: string): void {
    this.basePath = path;
  }

  getPathToFile(contentPath: string, config: AdkDocsConfig): string {
    const pathParts = contentPath.split('/');
    const fileName = this.getFileNameFromConfig(config.items, pathParts);
    return this.basePath ? `${this.basePath}${fileName}` : fileName;
  }

  private getFileNameFromConfig(
    config: AdkFilesItem,
    pathParts: string[]
  ): string {
    const fileName = pathParts.reduce((acc, part) => {
      const level = acc[part];
      acc = level;
      return acc;
    }, config);
    return fileName as string;
  }

  findPreviousAndNextByPath(
    obj: NestedObject,
    targetPath: string
  ): NavigationSiblings {
    const flatPaths = this.flattenObjectWithPath(obj);
    const index = flatPaths.indexOf(targetPath);

    if (index === -1) {
      return { previous: undefined, next: undefined };
    }

    return {
      previous: index > 0 ? flatPaths[index - 1] : undefined,
      next: index < flatPaths.length - 1 ? flatPaths[index + 1] : undefined,
    };
  }

  flattenObjectWithPath(obj: NestedObject, prefix: string = ''): string[] {
    let result: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      const newPath = prefix ? `${prefix}/${key}` : key;
      if (typeof value === 'object' && value !== null) {
        result = result.concat(this.flattenObjectWithPath(value, newPath));
      } else {
        result.push(newPath);
      }
    }
    return result;
  }
}
