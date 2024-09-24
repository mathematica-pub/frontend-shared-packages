import { Injectable } from '@angular/core';
import { Root } from 'hast';
import { fromParse5 } from 'hast-util-from-parse5';
import { parse } from 'parse5';
import { createHighlighter } from 'shiki/index.mjs';
import { BundledLanguage } from 'shiki/langs';
import { BundledTheme } from 'shiki/themes';
import { HighlighterGeneric } from 'shiki/types.mjs';
import { visit } from 'unist-util-visit';
import { AdkShikiHighlighterOptions } from './markdown-parser';

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

const MISSING_HIGHLIGHTER = `Please provide a \`shiki\` highlighter instance via \`options\`.`;

@Injectable({
  providedIn: 'root',
})
export class AdkShikiHighlighter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private highlighterPromise: Promise<
    HighlighterGeneric<BundledLanguage, BundledTheme>
  > | null = null;

  /**
   * Initialize the highlighter. This should only be called one in an application.
   *
   * @param themes an array of any Shiki themes you may want to use anywhere in the app. You can control which theme for your particular parsing by passing the theme name to the actual parsing function.
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
        themes: themes.length ? themes : [ShikiTheme.GitHubLight],
      });
    }
    await this.highlighterPromise;
  }

  async getHighlighter(): Promise<
    HighlighterGeneric<BundledLanguage, BundledTheme>
  > {
    if (!this.highlighterPromise) {
      throw new Error(
        'Highlighter is not initialized. Please call initialize() once in your application first.'
      );
    }
    return this.highlighterPromise;
  }

  remarkHighlight(options: AdkShikiHighlighterOptions): (tree: Root) => void {
    const highlighter = options.highlighter;
    if (!options.highlighter) {
      throw new Error(MISSING_HIGHLIGHTER);
    }
    const loadedLanguages = highlighter.getLoadedLanguages();
    const ignoreUnknownLanguage =
      options.ignoreUnknownLanguage === undefined
        ? true
        : options.ignoreUnknownLanguage;

    const visitor = (node) => {
      if (!loadedLanguages.includes(node.lang)) {
        if (ignoreUnknownLanguage) {
          node.lang = null;
        } else {
          return;
        }
      }

      const highlighted = highlighter.codeToHtml(node.value, {
        lang: node.lang,
        theme: options.theme,
      });

      node.type = 'html';
      node.value = highlighted;
    };

    const transformer = (tree: Root) => {
      visit(tree, 'code', visitor);
    };

    return transformer;
  }

  rehypeHighlight(options: AdkShikiHighlighterOptions): (tree: Root) => void {
    const highlighter = options.highlighter;
    if (!options.highlighter) {
      throw new Error(MISSING_HIGHLIGHTER);
    }

    const visitor = (node, _index, parent) => {
      if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
        return;
      }

      const [langClass] = node.properties.className;
      const lang = langClass.replace('language-', '');

      if (highlighter.getLoadedLanguages().includes(lang)) {
        const code = node.children[0]?.value;
        if (!code) {
          return;
        }
        const highlighted = highlighter.codeToHtml(code, {
          lang,
          theme: options.theme,
        });
        const parsed = parse(highlighted);
        const hastTree = fromParse5(parsed);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const content = (hastTree as any).children[0].children[1].children[0]
          .children[0];

        content.properties.class = ['shiki', 'shiki-' + lang, langClass];

        node.properties = content.properties;
        node.children = content.children;
      }
    };

    const transformer = (tree: Root) => {
      visit(tree, 'element', visitor);
    };

    return transformer;
  }

  getLanguage(node): string {
    const dataLanguage = node.properties.dataLanguage;

    if (dataLanguage != null) {
      return dataLanguage;
    }

    const className = node.properties.className || [];

    for (const classListItem of className) {
      if (classListItem.slice(0, 9) === 'language-') {
        return classListItem.slice(9).toLowerCase();
      }
    }

    return null;
  }
}
