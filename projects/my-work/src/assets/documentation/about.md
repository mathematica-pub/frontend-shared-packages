### About this App

This application is a workspace for Mathematica designers and developers to use to quickly create
data visualizations that do not need to be embedded in a hosted application. The app was developed
with the production of static charts in mind, but we look forward to seeing the different ways it is
useful.

The app provides users with an Angular application designed to make it easy for users to add data to
the application and write code to make charts from that data. Users can aggregate their work over
time, and without writing code, add their charts to a directory structure in the side bar of the
app, essentially building up a collection of their work that they can return to over time.

#### Quick Start Guide

The following is a minimal set of steps to take to start creating data visualizations with this
application.

###### Getting Set Up

1. The application requires [Node.js](https://nodejs.org/en). If you don't already have Node
   installed, install it via the Mathematica Software Center.

2. Clone the [Frontend Shared Packages](https://github.com/mathematica-org/frontend-shared-packages)
   repo to their desktop.

3. Run `npm ci` from the command line to install required dependencies.

4. (Optional) From the VSCode extensions palatte on the left side of the screen, install the Angular
   Schematics extension.

5. Create a new branch off of `main` for your work. You can use the following command:
   `git checkout -b my-branch-name`.

###### Preparing to Make Your Chart

1. Serve the app by running `npm run start:my-work` from the command line.

2. Navigate to the following directory in VSCode: `projects/my-work/src/assets/content`. Add your
   data file to `content/data` within that directory. Data can be either a `.csv` or `.json` file.

3. Navigate to the `projects/my-work/src/app/content` directory. Create a new Angular component
   there where you will make your charts. Keep in mind that the name of your component (minus the
   word "Component") will appear in the left sidebar of the app to allow you to navigate to your
   file.

   An easy way to make a new component in that directory if you installed the Angular Schematics
   extension is to right-click on the directory you'd like to place the component in, choose Angular
   Schematics: Generate a file, and use the menus from there.

4. Now go back to `projects/my-work/src/assets/content`. In the `content.yaml` file there, add an
   entry for the component you just created under items. The name should be lowercased and use
   hyphens to separate words.

   If you want your "file" (i.e. component) to appear inside a collapsable directory in the side
   panel, you can add that additional structure in the `content.yaml`. You will also need to create
   a folder with the same name to enclose the component in its directory.

content.yaml originally

```yaml
---
title: 'My Work'
items:
  examples:
    - energy-intensity
```

content.yaml after adding a file name for visualization work (note: no need to add a value after the
colon, just leave it blank)

```yaml
---
title: 'My Work'
items:
  static-equity-charts:
  examples:
    - energy-intensity
```

content.yaml after adding a file name inside a directory

```yaml
---
title: 'My Work'
items:
  static-equity-work:
    - nov-report-charts
  examples:
    - energy-intensity
```

5. Quit (ctrl-c) and restart the build (`npm run start:my-work`) from the command line. (This needs
   to be done after modifying the `content.yaml`) You should now see the changes you just made
   reflected in the left sidebar. If you click on the file name, you should your component appear in
   the main space of the app.

###### Writing Your Component Code and Exporting an Image

1. To access your data, create a property in your class that is the path to your data, starting at
   the `assets` directory. Your code make look something like this:

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

4. If you would like your chart to be exportable as an image file (jpeg, png, or svg), you will need
   to use the `ExportContentComponent` in your component's html.

   Add `ExportContentComponent` to the `imports` array of your component.

```ts
@Component({
  selector: 'app-nov-report-charts',
  standalone: true,
  imports: [CommonModule, ExportContentComponent]
```

In your `.html` file, enclose all content that you want to export as an image inside the opening and
closing tags of the `ExportContentComponent`. You can provide a `fileName` to the component that
will be the name of the exported file.

```html
<app-export-content fileName="NovReportChart_20241104">
  <div class="my-chart-container"> ... </div>
</app-export-content>
```

Upon saving all of your files, you should be able to see your content inside a dashed rectangle on
the screen with the file name and a download button above the top right corner of the container.

5. Press the download button to export your chart as an image.
