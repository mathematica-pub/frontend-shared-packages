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
