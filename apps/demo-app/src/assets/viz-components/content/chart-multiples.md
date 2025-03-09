# Chart Multiples

Viz Components provides an optional `multiples` data dimension on each Primary Marks component that
allows you to create multiple charts with the same x and y domains, but different data. This is
useful for creating small multiples, where each chart represents a different subset of the data,
such as a different category or time period.

Chart multiples need another level of specifications in order to determine properties such as chart
layout and tooltip behavior. Because these decisions are likely to be highly contingent on the
context in which the library is used, Viz Components does not handle these decisions under the hood
and instead asks users to handle them in the code of the consuming component.

This page helps you understand both how to use the `multiples` data dimension and how to set up your
consuming component to achieve your desired layout and tooltip behavior.

## Overview

```custom-angular
small multiples bars example
```
