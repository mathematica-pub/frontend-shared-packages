export interface ImageDownloadOptions {
  backgroundColor: string;
  containerNode: HTMLElement;
  fileName: string;
  filter: (domNode: Element) => boolean;
  imageType: string;
  quality: number;
}
