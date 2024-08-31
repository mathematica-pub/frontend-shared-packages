import markedShiki from 'marked-shiki';
import { createHighlighter } from 'shiki';

export const defaultHighlighterOptions = {
  langs: [
    'json',
    'ts',
    'tsx',
    'js',
    'jsx',
    'html',
    'css',
    'yaml',
    'angular-html',
    'angular-ts',
    'mermaid',
  ],
};

export enum ShikiTheme {
  Andromeeda = 'andromeeda',
  AuroraX = 'aurora-x',
  AyuDark = 'ayu-dark',
  CatppuccinFrappe = 'catppuccin-frappe',
  CatppuccinLatte = 'catppuccin-latte',
  CatppuccinMacchiato = 'catppuccin-macchiato',
  CatppuccinMocha = 'catppuccin-mocha',
  DarkPlus = 'dark-plus',
  DraculaTheme = 'dracula',
  DraculaThemeSoft = 'dracula-soft',
  EverforestDark = 'everforest-dark',
  EverforestLight = 'everforest-light',
  GitHubDark = 'github-dark',
  GitHubDarkDefault = 'github-dark-default',
  GitHubDarkDimmed = 'github-dark-dimmed',
  GitHubDarkHighContrast = 'github-dark-high-contrast',
  GitHubLight = 'github-light',
  GitHubLightDefault = 'github-light-default',
  GitHubLightHighContrast = 'github-light-high-contrast',
  Houston = 'houston',
  LaserWave = 'laserwave',
  LightPlus = 'light-plus',
  MaterialTheme = 'material-theme',
  MaterialThemeDarker = 'material-theme-darker',
  MaterialThemeLighter = 'material-theme-lighter',
  MaterialThemeOcean = 'material-theme-ocean',
  MaterialThemePalenight = 'material-theme-palenight',
  MinDark = 'min-dark',
  MinLight = 'min-light',
  Monokai = 'monokai',
  NightOwl = 'night-owl',
  Nord = 'nord',
  OneDarkPro = 'one-dark-pro',
  OneLight = 'one-light',
  Plastic = 'plastic',
  Poimandres = 'poimandres',
  Red = 'red',
  RosePine = 'rose-pine',
  RosePineDawn = 'rose-pine-dawn',
  RosePineMoon = 'rose-pine-moon',
  SlackDark = 'slack-dark',
  SlackOchin = 'slack-ochin',
  SnazzyLight = 'snazzy-light',
  SolarizedDark = 'solarized-dark',
  SolarizedLight = 'solarized-light',
  Synthwave84 = 'synthwave-84',
  TokyoNight = 'tokyo-night',
  Vesper = 'vesper',
  VitesseBlack = 'vitesse-black',
  VitesseDark = 'vitesse-dark',
  VitesseLight = 'vitesse-light',
}

export class ShikiHighlighter {
  theme: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  highlighter: any;

  constructor(theme?: string) {
    this.highlighter = createHighlighter({
      langs: defaultHighlighterOptions.langs,
      themes: theme ? [theme] : ['nord'],
    });
    this.theme = theme;
  }

  getHighlightExtension() {
    return markedShiki({
      highlight: async (code, lang, props) => {
        if (lang === 'mermaid') {
          return `<pre class="mermaid">${code}</pre>`;
        }

        const { codeToHtml } = await this.highlighter;
        return codeToHtml(
          code,
          Object.assign({
            lang,
            theme: this.theme || 'nord',
            // required by `transformerMeta*`
            meta: { __raw: props.join(' ') },
          })
        );
      },
    });
  }
}
