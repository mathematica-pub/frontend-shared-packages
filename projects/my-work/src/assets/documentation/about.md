# About this App

This application is a workspace for Mathematica designers and developers to use to quickly create
data visualizations that do not need to be embedded in a hosted application. The app was developed
with the production of static charts in mind, but we look forward to seeing the different ways it is
useful and growing the app to meet user needs.

The app is designed to make it easy for users to add data to the application and create Angular
components to make charts from that data. Users can aggregate their work over time, and without
writing code, add their charts to a directory structure in the side bar of the app, building up a
collection of their work that they can return to over time.

## Quick Start Guide

The following is a minimal set of steps to take to start creating data visualizations with this
application.

### Getting set up

1. The application requires [Node.js](https://nodejs.org/en). If you don't already have Node
   installed, install it via the Mathematica Software Center.

2. Clone the [Frontend Shared Packages](https://github.com/mathematica-org/frontend-shared-packages)
   repo to your desktop.

3. Run `npm ci` from the command line to install required dependencies.

4. (Optional) From the VSCode extensions palette on the left side of the screen, install the Angular
   Schematics extension.

5. Create a new branch off of `main` for your work. You can use the following command:
   `git checkout -b my-branch-name`. You can always change your branch name, but it is recommended
   to chose a name that fits a branch that you will continue to come back to and work off of, and
   perhaps merge into -- for example, `git checkout -b chris-work`.

### Preparing to make your chart

1. Serve the app by running `npm run start:my-work` from the command line.

2. Navigate to the following directory in VSCode: `projects/my-work/src/assets/content`.

   ```
   ├── projects
   │   ├── my-work
   │   │   ├── app
   │   │   ├── assets
   │   │   │   ├── content
   │   │   │   │   ├── data
   │   │   │   │   ├── example-data
   │   │   │   │   ├── content.yaml

   ```

   Add your data file to `content/data` within that directory. Data can be either a `.csv` or
   `.json` file. You could also choose to use any of the existing example data located in
   `content/example-data` as dummy data.

   ```
   ├── projects
   │   ├── my-work
   │   │   ├── app
   │   │   ├── assets
   │   │   │   ├── content
   │   │   │   │   ├── data
   │   │   │   │   │   ├── nov-report-data.csv
   │   │   │   │   ├── example-data
   │   │   │   │   ├── content.yaml

   ```

3. Navigate to the `projects/my-work/src/app/content` directory. Create a new Angular component
   there where you will make your charts. Keep in mind that the name of your component (minus the
   word "Component") will appear in the left sidebar of the app to allow you to navigate to your
   file.

   ```
   ├── projects
   │   ├── my-work
   │   │   ├── app
   │   │   │   ├── content
   │   │   │   │   ├── examples
   │   │   │   │   ├── my-project.html
   │   │   │   │   ├── my-project.scss
   │   │   │   │   ├── my-project.spec.ts
   │   │   │   │   ├── my-project.component.ts

   ```

   An easy way to make a new component in that directory, if you installed the Angular Schematics
   extension, is to right-click on the directory you'd like to place the component in, choose
   Angular Schematics: Generate a file, and use the menus from there.

4. Now go back to `projects/my-work/src/assets/content` from step 2. In the `content.yaml` file
   there, add an entry for the component you just created under items. The name should be lowercased
   and use hyphens to separate words/be kebab-cased.

   If you want your "file" (i.e. component) to appear inside a collapsible directory in the side
   panel, you can add that additional structure in the `content.yaml`. You will also need to create
   a folder with the same name to enclose the component in its directory.

   <p class="code-caption"><code>content.yaml</code> originally</p>

   ```yaml
   ---
   title: 'My Work'
   items:
     examples:
       - energy-intensity
   ```

   <p class="code-caption"><code>content.yaml</code> after adding a file name for visualization work</p>
   <p class="code-caption">(note: no need to add a value after the colon, just leave it blank)</p>

   ```yaml
   ---
   title: 'My Work'
   items:
     my-project:
     examples:
       - energy-intensity
   ```

   <p class="code-caption"><code>content.yaml</code> after adding a file name inside a directory</p>

   ```yaml
   ---
   title: 'My Work'
   items:
     my-project:
       - nov-report-charts
     examples:
       - energy-intensity
   ```

   ```
   ├── projects
   │   ├── my-work
   │   │   ├── app
   │   │   │   ├── content
   │   │   │   │   ├── examples
   │   │   │   │   ├── my-project
   │   │   │   │   │   ├── nov-report-charts.component.html
   │   │   │   │   │   ├── nov-report-charts.component.scss
   │   │   │   │   │   ├── nov-report-charts.component.spec.ts
   │   │   │   │   │   ├── nov-report-charts.component.ts

   ```

5. Quit (ctrl-c) and restart the build (`npm run start:my-work`) from the command line. (This needs
   to be done after modifying the `content.yaml`.) You should now see the changes you just made
   reflected in the left sidebar. If you click on the file name, you should your component appear in
   the main space of the app.

### Bringing data into your component

1. To access your data, create a property in your class that is the path to your data, starting at
   the `assets` directory. Your code may look something like this.

   ```ts
   export class NovReportChartsComponent implements OnInit {
   dataPath = '/assets/content/data/nov-report-data.csv';
   ```

2. Import the global `DataService` through your component's `constructor`:

   ```ts
   constructor(private dataService: DataService) {}
   ```

3. In a method that will get called in your component, call the `getDataFile` method on
   `DataService` with your data path as an argument. This will return your data as an
   `Observable<any>` and you can use it in your component.

   ```ts
   const data$ = this.dataService.getDataFile(this.dataPath);
   ```

### Exporting an image of your work

1. If you would like your chart to be exportable as an image file (jpeg, png, or svg), you will need
   to use the `ExportContentComponent` in your component's html.

   Add `ExportContentComponent` to the `imports` array of your component.

   ```ts
   @Component({
   selector: 'app-nov-report-charts',
   standalone: true,
   imports: [CommonModule, ExportContentComponent]
   ```

   In your `.html` file, enclose all content that you want to export as an image inside the opening
   and closing tags of the `ExportContentComponent`. You can provide a `fileName` to the component
   that will be the name of the exported file.

   ```html
   <app-export-content fileName="NovReportChart_20241104">
     <div class="my-chart-container">Some placeholder content</div>
   </app-export-content>
   ```

   Upon saving all of your files, you should be able to see your content inside a dashed rectangle
   on the screen with the file name and a download button above the top right corner of the
   container.

2. Press the download button to export your chart as an image.
