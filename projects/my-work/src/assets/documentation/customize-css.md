# Customizing CSS for Your Work

You will likely want to set up custom CSS for your work, including styles that you can apply to
multiple components.

## Project-specific stylesheets

If you want to create styles that you can use in multiple components, the recommended way to do that
is to create a new `.scss` stylesheet in the top level directory for your project that will contain
these styles, and then include that stylesheet in the `stylesUrl` array in each of your components.

```
├── projects
│   ├── my-work
│   │   ├── app
│   │   │   ├── content
│   │   │   │   ├── examples
│   │   │   │   ├── my-project-line-chart
│   │   │   │   │   ├── my-project-line-chart.component.html
│   │   │   │   │   ├── my-project-line-chart.component.scss
│   │   │   │   │   ├── my-project-line-chart.component.spec.ts
│   │   │   │   │   ├── my-project-line-chart.component.ts
│   │   │   │   ├── my-project-component.html
│   │   │   │   ├── my-project-component.scss
│   │   │   │   ├── my-project-component.spec.ts
│   │   │   │   ├── my-project.component.ts
│   │   │   │   ├── my-project-charts.scss

```

```ts
@Component({
  selector: 'app-my-project-line-chart',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './my-project-line-chart.html',
  styleUrls: [
    '../my-project-charts.scss',
    './my-project-line-chart.scss',
  ],
})
```

## Adding fonts

To use a specific font for your work, you can import the font via the
[CSS @import at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@import) at the top of any
stylesheet.

```scss
// google font, your link will have more specifics
@import url('https://fonts.googleapis.com/css2?family=Bitter');
// adobe fonts
@import url('https://use.typekit.net/ybk8bde.css');

.chart-container {
  font-family: 'Bitter', serif;

  .vic-x .tick text {
    font-size: 11px;
    font-family: ff-cake-mono, sans-serif; // from adobe fonts
  }

  .vic-y .tick text {
    font-family: ff-cake-mono, sans-serif; // from adobe fonts
  }
}
```
