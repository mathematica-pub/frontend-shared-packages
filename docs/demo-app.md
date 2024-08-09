# Viz Components Demo App

## Adding manual documentation for a Data Marks Component

In addition to our automated documentation, we want to provide substantial, manually created "user
guides" that help users understand how to create their charts. Currently these user guides are under
"Composing Charts" in the navbar.

To add a user guide (fka examples), add the name of the user guide (i.e. "bars", "lines") to the
array in `core/constants/examples.ts`.

Then use that same name as the path slug and add the user guide to `app-routing.module.ts`,
following the established pattern.
