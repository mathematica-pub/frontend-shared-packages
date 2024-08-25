export interface ImageDownloadOptions {
  backgroundColor: string;
  containerNode: HTMLElement;
  fileName: string;
  filter: (domNode: HTMLElement) => boolean;
  /**
   * Disables external fonts from being read in
   * Supply with custom css fallback; or set to undefined to read external fonts
   * (will oftentimes get security errors)
   */
  fontEmbedCSS: string;
  imageType: string;
  quality: number;
}
