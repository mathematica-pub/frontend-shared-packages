import { Injectable } from '@angular/core';
import { Root } from 'hast';
import { fromParse5 } from 'hast-util-from-parse5';
import { MarkedExtension } from 'marked';
import markedShiki from 'marked-shiki';
import { parse } from 'parse5';
import {
  BundledLanguage,
  BundledTheme,
  createHighlighter,
  HighlighterGeneric,
} from 'shiki';
import { visit } from 'unist-util-visit';

export const defaultHighlighterLangs = [
  'json',
  'ts',
  'js',
  'html',
  'css',
  'scss',
  'yaml',
  'angular-html',
  'angular-ts',
  'mermaid',
  'bash',
];

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

export interface HighlighterOptions {
  highlightCode?: true;
  theme: ShikiTheme;
}

@Injectable({
  providedIn: 'root',
})
export class ShikiHighlighterService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private highlighterPromise: Promise<
    HighlighterGeneric<BundledLanguage, BundledTheme>
  > | null = null;

  /**
   * Initialize the highlighter. This should only be called one in an application.
   *
   * @param themes an array of any Shiki themes you may want to use in the app. You can control which theme is used where by passing the theme name to the `getMarkedExtension` method.
   *
   * @returns void
   */
  async initialize(
    themes: ShikiTheme[],
    langs: string[] = defaultHighlighterLangs
  ): Promise<void> {
    if (!this.highlighterPromise) {
      this.highlighterPromise = createHighlighter({
        langs,
        themes: themes.length ? themes : ['nord'],
      });
    }
    await this.highlighterPromise;
  }

  private async getHighlighter(): Promise<
    HighlighterGeneric<BundledLanguage, BundledTheme>
  > {
    if (!this.highlighterPromise) {
      throw new Error(
        'Highlighter is not initialized. Call initialize() first.'
      );
    }
    return this.highlighterPromise;
  }

  getMarkedExtension = (theme?: ShikiTheme): MarkedExtension => {
    return markedShiki({
      highlight: async (code, lang, props) => {
        if (lang === 'mermaid') {
          return `<pre class="mermaid">${code}</pre>`;
        }

        const highlighter = await this.getHighlighter();
        return highlighter.codeToHtml(
          code,
          Object.assign({
            lang,
            theme: theme || 'nord',
            // required by `transformerMeta*`
            meta: { __raw: props.join(' ') },
          })
        );
      },
    });
  };

  getRehypeExtension = (theme: ShikiTheme): ((tree: Root) => Promise<void>) => {
    return async (tree: Root) => {
      const highlighter = await this.getHighlighter();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return visit(tree, 'element', (node: any) => {
        if (
          node.tagName === 'pre' &&
          Array.isArray(node.children) &&
          node.children.length === 1 &&
          node.children[0].tagName === 'code' &&
          typeof node.children[0].properties === 'object' &&
          node.children[0].properties !== null &&
          Array.isArray(node.children[0].properties.className) &&
          typeof node.children[0].properties.className[0] === 'string' &&
          node.children[0].properties.className[0].startsWith('language-')
        ) {
          const [langClass] = node.children[0].properties.className;
          const lang = langClass.replace('language-', '');

          if (highlighter.getLoadedLanguages().includes(lang)) {
            const code = node.children[0].children[0].value;
            const highlighted = highlighter.codeToHtml(
              code,
              Object.assign({
                lang,
                theme: theme || 'nord',
              })
            );
            const parsed = parse(highlighted);
            const hastTree = fromParse5(parsed);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const content = (hastTree as any).children[0].children[1]
              .children[0];

            content.children[0].properties.class = [
              'shiki',
              'shiki-' + lang,
              langClass,
            ];

            node.properties = content.properties;
            node.children = content.children;
          }
        }
      });
    };
  };
}
