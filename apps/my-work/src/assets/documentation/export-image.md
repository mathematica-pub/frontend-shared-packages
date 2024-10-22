# Exporting Your Work as an Image

The HSI Static Charts application is set up to enable easy exporting of work that you create to an
image file.

## Using the `ExportContent` component

To transform some content you have created in this application into an image, you can wrap that
content in your `.html` file with the `ExportContentComponent`.

```html
@if (barsData$ | async; as barData) {
<app-export-content
  ><app-energy-intensity-bar [data]="barData"></app-energy-intensity-bar>
</app-export-content>
}
```

You will need to import the `ExportContentComponent` in the imports array of your component.

```ts
@Component({
  selector: 'app-energy-intensity',
  standalone: true,
  imports: [CommonModule, ExportContentComponent, EnergyIntensityBarComponent],
  templateUrl: './energy-intensity.component.html',
  styleUrls: ['./energy-intensity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

## `ExportContent` component options

The `ExportContent` component has a number of Angular `@Input` properties that allow you to
configure the exported image.

```html
@if (barsData$ | async; as barData) {
<app-export-content
  [addTimeStamp]="true"
  fileName="MyBarChart_Nov2024"
  fileType="jpeg"
  [height]="640"
  [imagePadding]="16"
  [width]="920"
  ><app-energy-intensity-bar [data]="barData"></app-energy-intensity-bar>
</app-export-content>
}
```

### addTimeStamp

`addTimeStamp: boolean = false`

---

Setting `addTimeStamp` to true appends a time stamp to the end of your exported file name in the
form of `-YYYYMMDD-HHmmss`.

Default value is `false`.

For example, if your fileName is `MyExportedFile`, the file name after adding a time stamp would be
like `MyExportedFile-20240901-090127` if the file was created on September 1, 2024 at 9:01:27 am.

### fileName

`fileName: string`

---

If provided, this string will be the name of the exported file before any time stamp or file
extension is added.

`fileName` should _not_ include the file extension (e.g. `.jpeg`) for the file.

If file name is not provided, the exported file will take the name `image-N` where N is unique
number to identify this instance of the `ExportContent` component.

The name of the file that will be exported, minus a time stamp if one is used, is displayed next to
the download button.

### fileType

`fileType: 'jpeg' | 'png' | 'svg' = 'jpeg'`

---

Determines the type of image to be output.

Default value is `jpeg`.

### height

`height: number`

---

Sets an explicit height, in pixels, of the exported image. The height is exclusive of any padding
created through `imagePadding`.

### imagePadding

`imagePadding: number = 8`

---

Sets the amount of padding, in pixels, around your injected content in the image download.

Default value is 8.

The space between the dashed export content border and the content that you see on screen will be
replicated in the exported image file. (The dashed border will not appear in the exported image.)

### width

`width: number`

---

Sets an explicit width, in pixels, of the exported image. The width is exclusive of any padding
created through `imagePadding`.
