import { AdkDocsConfig, AdkFilesItem } from './documentation-display.service';

export class AdkDocumentationConfigParser {
  docsPath: string;

  constructor(docsPath: string) {
    this.docsPath = docsPath;
  }

  getPathToFile(contentPath: string, config: AdkDocsConfig): string {
    const pathParts = contentPath.split('/');
    const fileName = this.getFileNameFromConfig(config.items, pathParts);
    return `${this.docsPath}${fileName}`;
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
}
