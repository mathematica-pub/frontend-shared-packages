# spec

desired functionality seen in useCase.ts
requires that all config constructors can take

- all configs become Full[ConfigName] as snippets
- list of configs is available in documentation (somewhere)

Presumed code (python):

- load in all config files (we'll just be reading them as plain text files, and outputting a json)
- if a config extends another config, go to it and do the below process
- for each line in a config class, copy into the snippets. Once constructor is reached, overwrite any values necessary
- if a field is unassigned (no '=' in the line) at the end, either a) comment it out, or b) denote is as "optional typename" and make it tabbable
