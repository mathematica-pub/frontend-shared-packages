# Frontend Shared Packages Demo App

The FSP Demo App is intended as a resource for users of our frontend shared packages where they can
learn how to use our libraries and how they work.

The Demo App uses a modular structure that allows us to create resources for each library we add to
the monorepo. Each library can be added to the sidebar, and its content appears in the main window
upon user selection.

## Documentation Structure

Each library that is added will have the possibility of adding two different types of resources:

1. We have a section that displays html files that we generate with Compodoc, which parses our
   source code to create the HTML files. We refer to this as "Automated Documentation".
2. Another section, known as "Content", contains manually created components designed to provide
   users with a guided and/or in-depth understanding of the various parts of the library.

### File Organization

#### Compodoc

Compodoc files (for all libraries) and the script used to process those files live in a top-level
`./compdoc` folder in the repo.

```
├── .vscode
├── compodoc
│   ├── docs
│   │   ├── ui-components[^*]
│   │   ├── viz-components[^*]
│   ├── compodoc-docs-processor.ts
├── cypress
```

[^*]: these items are gitignored

#### Automated Documentation (Parsed Compodoc files)

Our Compodoc processing script moves files that Compodoc generates to a folder where they can be
fetched by the DemoApp.

It also organizes them according to a user-provided `documentation-directory.yaml` file that
provides the structure of the directory that they will appear in in the left sidebar, and parses
their HTML to replace links to work with our application routing.

The parsed documentation is located in
`./projects/demo-app/src/assets/${libName}/automated-documentation`. The
`documentation-directory.yaml` file is also there.

Within the demo app `app` application code, components/files related to displaying these files are
in `app/automated-documentation`.

#### Content

All other content for the demo app is referred to as "content."

Any files that need to be fetched into the site (via an http call) are located in
`./projects/demo-app/src/assets/${libName}/content`. This includes on `content-directory.yaml` file
per library.

Within the demo app `app` application code, components/files related to displaying these files are
in `app/content`.

```
├── projects
│   ├── demo-app
│   │   ├── src
│   │   │   ├── app
│   │   │   ├── assets
│   │   │   │   ├── {lib-name}
│   │   │   │   │   │   ├── automated-documentation
│   │   │   │   │   │   │   ├── documentation-directory.yaml
│   │   │   │   │   │   │   ├── [various-folders-for-html-files]*
│   │   │   │   │   │   ├── content
│   │   │   │   │   │   │   ├── overview.md
│   │   │   │   │   │   │   ├── content-directory.yaml
```
