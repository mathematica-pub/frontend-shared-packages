# Viz Components Demo App

## Adding manual documentation for a Data Marks Component

We provide substantial, manually created "user guides" that help users understand how to create
their charts. Currently these user guides are under "Composing Charts" in the sidebar.

To add a user guide, add the name of the user guide (i.e. "bars", "lines") to the array in
`core/constants/examples.ts`.

Then use that same name as the path slug and add the user guide to `app-routing.module.ts`,
following the established pattern.
