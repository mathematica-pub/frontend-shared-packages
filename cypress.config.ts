import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
      options: {
        projectConfig: {
          root: '',
          sourceRoot: 'projects/demo-app',
          buildOptions: {
            index: 'projects/demo-app/src/index.html',
            main: 'projects/demo-app/src/main.ts',
            polyfills: 'projects/demo-app/src/polyfills.ts',
            tsConfig: 'projects/demo-app/tsconfig.app.json',
            inlineStyleLanguage: 'scss',
            styles: ['projects/demo-app/src/styles/styles.scss'],
          },
        },
      },
    },
    specPattern: '**/*.cy.ts',
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
