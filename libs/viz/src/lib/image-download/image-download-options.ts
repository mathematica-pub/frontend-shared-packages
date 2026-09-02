export interface ImageDownloadOptions {
  backgroundColor: string;
  containerNode: HTMLElement;
  fileName: string;
  filter: (domNode: HTMLElement) => boolean;
  imageType: string;
  quality: number;
}
