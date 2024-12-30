# Styles in app-dev-kit

This library exports styles intended to be consumed in applications or other libraries.

At the same time, the library also has SCSS variables, functions, placeholders, etc. that are
intended to be used by features in this library. In many cases these are not mutually exclusive.

Styles intended to be consumed by apps/libs outside of this lib should be located in `src/styles`.
Styles intended for internal use should be in `src/core/scss.` Styles may be imported from
`src/core/scss` to `src/styles` for export.

Within `src/styles`, values that are used to set up CSS vars should be located in `/theming`. We
then provide functionality for a user to load those CSS variables in their own application though
mixins in `src/styles/themes.scss`;

## Consuming styles in your app

Add the exported styles to your angular.json's stylePreprocessorOptions.

```ts
"stylePreprocessorOptions": {
  "includePaths": [
    "node_modules/@hsi/app-dev-kit/styles"
  ]
}
```

### Theming variables

The ADK provides a set of color variables and typography properties as CSS variables that can be
added to your app. We recommend adding these in your global styles file, usually styles.scss, by
using the adk's `create-theme` mixin.

```scss
@use '@hsi/app-dev-kit' as hsi-adk;

html {
  @include hsi-adk.create-theme();
}
```

This will create a number of CSS variables for color and typography at the html level of your
application. If you run your application, you can see the variables it creates in DevTools.

It provides two color palettes, `primary` and `muted-primary` that correspond to the (Material 3
specifications for color palettes)[https://m3.material.io/styles/color/system/how-the-system-works].
Additionally, it provides Sans, Serif, and Mono fonts, as well as several variables to describe
font-weight and line-height.

You can easily override these variables for your application by providing your own version of their
values.

For example, to provide your own fonts, you could do the following:

```scss
@use '@hsi/app-dev-kit/lib/styles' as hsi-adk;

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

The ADK also provides a mixin to apply a minimal and sensible CSS reset to your application. This
can be applied in you global stylesheet.

```scss
@use '@hsi/app-dev-kit/lib/styles' as hsi-adk;

@include hsi-adk.css-reset();
```

This will set the base font on body to be `--hsi-adk-font-sans`, and the `color` to black. (If you
have provided your own font for `--hsi-adk-font-sans`, the reset will use that automatically.)

You can change this by providing a font and color to the mixin, as shown below.

```scss
@include hsi-adk.css-reset('Georgia', #111);
```

### Typography styles

The ADK provides a set of Sass mixins that correspond to (Material 3 typography
styles)[https://m3.material.io/styles/typography/type-scale-tokens].

The mixins available in `_typography.scss` are:

- display-large
- display-medium
- display-small
- headline-large
- headline-medium
- headline-small
- title-large
- title-medium
- body-large
- body-medium
- body-small
- body-xs
- body-2xs
- label-large
- label-large-prominent
- label-large-caps
- label-large-caps-prominent
- label-large
- label-medium
- label-medium-prominent
- label-medium-caps
- label-medium-caps-prominent
- label-small
- label-small-prominent
- label-small-caps
- label-small-caps-prominent
- label-xs
- label-xs-prominent
- label-xs-caps
- label-xs-caps-prominent
- label-2xs
- label-2xs-prominent
- label-2xs-caps
- label-2xs-caps-prominent

These can be used in a consuming application in the following way:

```scss
@use '@hsi/app-dev-kit/lib/styles' as hsi-adk;

.my-element {
  @include hsi-adk.label-large;
}
```
