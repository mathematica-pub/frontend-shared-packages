# Baseline Styles

This library exports a set of baseline styles intended to be used in applications. These styles are
intended to serve as a starting point for applications, providing a sensible set of defaults for
typography, color, and layout. They are designed to be easily overridden and customized to fit the
needs of your application.

## Quick Start Guide

You will need to modify your application's `angular.json` file to include the Baseline Styles, and
then call mixins in your stylesheet to apply the styles.

### Modify angular.json

Add the Baseline Styles to the app's angular.json's stylePreprocessorOptions.

```json
"stylePreprocessorOptions": {
  "includePaths": [
    "node_modules/@mathstack/app-kit/baseline-styles"
  ]
}
```

### Import Baseline Styles in .scss stylesheets

To use any of the Baseline Styles features, import the Baseline Styles into `.scss` file(s). You can
do so by using the following `@use` rule`.

```scss
@use '@mathstack/app-kit' as hsi-adk;
```

Note that you may namespace the import (here: `hsi-adk`) as you see fit.

You will need to use this `@use` rule in any `.scss` file that you want to use any of the Baseline
Styles features.

### Add Recommended Mixins

We recommend that you add the following mixins to your global stylesheet:

```scss
@use '@mathstack/app-kit' as hsi-adk;

// Recommended: CSS Reset
@include hsi-adk.css-reset();

// Recommended: Create a theme
html {
  @include hsi-adk.create-theme();
}
```

## Features

The Baseline Styles library provides the following features:

**Mixins**

- `create-theme`: Create a theme for your application
- `css-reset`: Apply a minimal and sensible CSS reset to your application
- various typography mixins (e.g. `label-large`, `headline-small`, etc.): Apply typography styles to
  elements
- `map-scss-vars-into-css-vars`: Convert a map of SCSS variables into CSS variables

**Functions**

- `grid`: Generate spacing in 0.25rem increments

### Creating a Theme

Baseline Styles provides a set of colors and typography properties as CSS variables that can be
added to your app. We recommend adding these in your global styles file, usually styles.scss. In
that file, you can use the `create-theme` mixin.

```scss
@use '@mathstack/app-kit' as hsi-adk;

html {
  @include hsi-adk.create-theme();
  // Override theme variables here
}
```

This will create a number of CSS variables on the DOM element that you specify (here: `<html>`). If
you run your application, you can see the variables it creates in "Styles" panel in DevTools. You
can reference these CSS variables in your application's stylesheets.

Components in other `frontend-shared-packages` libraries, such as `ui`, will use these CSS
variables, if they are defined, to provide default styles. Therefore, it is recommended to always
create a theme in your application, and override the values of these variables as needed.

#### Color palettes

The `create-theme` mixin provides two color palettes, `primary` and `muted-primary` that correspond
to the
[Material 3 specifications for color palettes](https://m3.material.io/styles/color/system/how-the-system-works),
which uses values from 0 to 100, where the 0 value is always black and the 100 value is always
white. The `primary` palette is intended as an accent color, while the `muted-primary` palette is
intended for backgrounds and other muted elements.

The structure of a color palette is as follows (ex: `primary` palette):

```scss
--hsi-adk-color-primary-0: #000000;
--hsi-adk-color-primary-5: #000c38;
--hsi-adk-color-primary-10: #001550;
--hsi-adk-color-primary-15: #001e68;
--hsi-adk-color-primary-20: #002780;
--hsi-adk-color-primary-25: #003099;
--hsi-adk-color-primary-30: #003ab3;
--hsi-adk-color-primary-35: #0043ce;
--hsi-adk-color-primary-40: #1550e1;
--hsi-adk-color-primary-50: #3d6bfb;
--hsi-adk-color-primary-60: #6889ff;
--hsi-adk-color-primary-70: #90a7ff;
--hsi-adk-color-primary-80: #b6c4ff;
--hsi-adk-color-primary-90: #dce1ff;
--hsi-adk-color-primary-95: #eff0ff;
--hsi-adk-color-primary-98: #faf8ff;
--hsi-adk-color-primary-99: #fefbff;
--hsi-adk-color-primary-100: #ffffff;
```

To generate palettes for your application, designers can use the
[Material Theme Builder plugin for Figma](https://m3.material.io/styles/color/resources#10e71f6f-7fce-4b02-a3f6-347af8643097).
We recommend using the Primary palette from the generator for the `primary` palette and either the
Neutral or Neutral Variant palettes for the `muted-primary` palette.

#### Typography

Baseline Styles provides CSS variables and value for Sans, Serif, and Mono fonts, as well as several
variables to describe font-weight and line-height. The default font for all three variants is
[Noto](https://fonts.google.com/noto).

The variables that `create-theme` creates when it is called are the following:

```scss
--hsi-adk-font-sans: Noto Sans, sans-serif;
--hsi-adk-font-serif: Noto Serif, serif;
--hsi-adk-font-mono: Noto Sans Mono, monospace;
--hsi-adk-font-weight-light: 100;
--hsi-adk-font-weight-regular: 400;
--hsi-adk-font-weight-medium: 500;
--hsi-adk-font-weight-semibold: 600;
--hsi-adk-font-weight-bold: 700;
--hsi-adk-font-line-height-0: 1;
--hsi-adk-font-line-height-1: 1.125;
--hsi-adk-font-line-height-2: 1.25;
--hsi-adk-font-line-height-3: 1.5;
--hsi-adk-font-line-height-4: 1.75;
--hsi-adk-font-line-height-5: 2;
```

#### Overriding theme variables

You can override the theme variables by specifying new values for them anywhere in your
application's stylesheets.

For example, to specify different fonts for the entire application, you could do the following:

```scss
@use '@mathstack/app-kit' as hsi-adk;

html {
  @include hsi-adk.create-theme();
  --hsi-adk-font-sans: 'Fira Sans';
  --hsi-adk-font-serif: 'PT Serif';
  --hsi-adk-font-mono: 'Fira Mono';
}
```

(This above code assumes you have imported those fonts into your repo from a source like Google
fonts or have loaded them locally.)

### CSS Reset

CSS Reset is a mixin to apply a minimal and sensible CSS reset to your application. This can be
applied in your global stylesheet.

```scss
@use '@mathstack/app-kit' as hsi-adk;

@include hsi-adk.css-reset();
```

#### Font and color

By default, the reset will set the `font-family` property on `<body>` to be
`var(--hsi-adk-font-sans)`. If `--hsi-adk-font-sans` is not defined, it will default to a sans-serif
fallback font.

By default, the `color` property on `<body>` will be set to `#000`.

You can change this by providing a font and color to the mixin, as shown below.

```scss
@include hsi-adk.css-reset('Georgia', #111);
```

### Typography Styles

Baseline Styles provides a set of Sass mixins that correspond to
[Material 3 typography styles](https://m3.material.io/styles/typography/type-scale-tokens), with a
few additions to support denser displays of information.

These can be used in an application in the following way:

```scss
@use '@mathstack/app-kit' as hsi-adk;

.my-element {
  @include hsi-adk.label-large;
}
```

The available mixins are the following, shown here in Noto Sans:

<div class="mixin-display">
<p class="display-large">display-large</p>
<p class="display-medium">display-medium</p>
<p class="display-small">display-small</p>
<p class="headline-large">headline-large</p>
<p class="headline-medium">headline-medium</p>
<p class="headline-small">headline-small</p>
<p class="title-large">title-large</p>
<p class="title-medium">title-medium</p>
<p class="title-small">title-small</p>
<p class="body-large">body-large</p>
<p class="body-medium">body-medium</p>
<p class="body-small">body-small</p>
<p class="body-xs">body-xs</p>
<p class="body-2xs">body-2xs</p>
<p class="label-large">label-large</p>
<p class="label-large-prominent">label-large-prominent</p>
<p class="label-large-caps">label-large-caps</p>
<p class="label-large-caps-prominent">label-large-caps-prominent</p>
<p class="label-medium">label-medium</p>
<p class="label-medium-prominent">label-medium-prominent</p>
<p class="label-medium-caps">label-medium-caps</p>
<p class="label-medium-caps-prominent">label-medium-caps-prominent</p>
<p class="label-small">label-small</p>
<p class="label-small-prominent">label-small-prominent</p>
<p class="label-small-caps">label-small-caps</p>
<p class="label-small-caps-prominent">label-small-caps-prominent</p>
<p class="label-xs">label-xs</p>
<p class="label-xs-prominent">label-xs-prominent</p>
<p class="label-xs-caps">label-xs-caps</p>
<p class="label-xs-caps-prominent">label-xs-caps-prominent</p>
<p class="label-2xs">label-2xs</p>
<p class="label-2xs-prominent">label-2xs-prominent</p>
<p class="label-2xs-caps">label-2xs-caps</p>
<p class="label-2xs-caps-prominent">label-2xs-caps-prominent</p>
</div>

### Grid

Baseline Styles provides a Sass `grid` function that can be used to generate spacing in 0.25rem
increments.

The `grid` function takes a single argument, which is the number of 0.25rem increments to generate.

```scss
@use '@mathstack/app-kit' as hsi-adk;

.my-element {
  margin: hsi-adk.grid(2);
}
```

### Map SCSS Variables into CSS Variables

Baseline Styles provides a mixin to convert a map of SCSS variables into CSS variables.

The mixin takes two arguments: a map of SCSS variables and a prefix to apply to the CSS variables.

```scss
@use '@mathstack/app-kit' as hsi-adk;

$my-map: (
  my-color: (
    primary: #000,
    secondary: #fff,
  )
  my-background: (
    primary: #fff,
    secondary: #000,
  ),
);

@include hsi-adk.map-scss-vars-into-css-vars($my-map, 'my-prefix');
```

This will create the following CSS variables:

```scss
--my-prefix-my-color-primary: #000;
--my-prefix-my-color-secondary: #fff;
--my-prefix-my-background-primary: #fff;
--my-prefix-my-background-secondary: #000;
```
