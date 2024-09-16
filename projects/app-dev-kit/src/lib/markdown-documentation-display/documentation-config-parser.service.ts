import { Injectable } from '@angular/core';

export interface AdkNestedObject {
  [key: string]: string | AdkNestedObject;
}

export interface NavigationSiblings {
  previous: string | undefined;
  next: string | undefined;
}

@Injectable()
export class AdkDocumentationConfigParser {
  basePath: string;

  constructor() {}

  /**
   * Them method takes a path from the application and a configuration object, and returns a path to a file that will be fetched.
   *
   * This assumes that the pathFromApp matches a path through the keys of the Nested Object.
   *
   * If the path is 'viz-components/content/items/bars', the config object might look like this:
   * viz-components: {
   *   content: {
   *     items: {
   *       bars: 'bars.md'
   *     }
   *   }
   * }
   *
   * @param pathFromApp a string representing the path from the application, for example 'viz-components/content/items/bars'
   * @param config a nested object representing the configuration
   * @returns a string representing the file path
   */
  getPathToFile(
    pathFromApp: string,
    config: AdkNestedObject,
    basePath: string
  ): string {
    const pathParts = pathFromApp.split('/');
    const fileName = this.getFileNameFromPath(pathParts, config);
    const pathToFile = basePath ? `${basePath}/${fileName}` : fileName;
    return pathToFile;
  }

  /**
   *
   * @param pathParts a string array of path parts, for example ['viz-components', 'content', 'items', 'bars]
   * @param config a nested object representing the configuration
   * @returns a string representing the file name
   */
  private getFileNameFromPath(
    pathParts: string[],
    config: string | AdkNestedObject
  ): string {
    console.log(pathParts, config);
    const fileName = pathParts.reduce((acc, part) => {
      const level = acc[part];
      acc = level;
      return acc;
    }, config);
    return fileName as string;
  }

  findPreviousAndNextByPath(
    obj: AdkNestedObject,
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

  flattenObjectWithPath(obj: AdkNestedObject, prefix: string = ''): string[] {
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
