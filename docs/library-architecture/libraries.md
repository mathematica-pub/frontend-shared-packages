# Libraries

Frontend Shared Packages is currently structured as a set of libraries and applications within an
Angular workspace.

Each library is set up to have a single entry point, and we modularize the library's `public-api.ts`
file by using `index.ts` files in each top-level feature of each library, and then importing those
`index.ts` files into the `public-api.ts` file.

We should export any class, interface, etc. that we expect users may need, including those that they
may want to use as types/interfaces in their code. (We assume that users will not ever need to
interact directly with builder classes on sub-configs.)

Things that we expect users to use beyond as a type (i.e. that they will call, new, etc) should have
the library's prefix at the front of their names, i.e. VicBarsConfigBuilder. We don't add the prefix
for things that may be used by the user for typing, i.e. `BarsLabelsOptions`.
