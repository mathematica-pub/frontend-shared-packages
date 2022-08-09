## Code Snippets Limitations

1. All configs need to be declared with a constructor of the form:

```
constructor(init?: Partial<ClassName>) {
    ...constructor things go here, if any
    Object.assign(this, init)
}
```

This enables users to initialize as many or as few fields within a class as they want. The `Object.assign()` call can happen anywhere (the parser just looks for the closing brace), but should happen at the end (so all user-supplied input overwrites defaults).

2. The parser requires configs to have a constructor. Any classes without constructors need to go below config classes and code snippets that make no sense get generated for them (area for future improvement). This is because the parser expects all classes in `.model.ts` files to be configs where it encounters, in order, the following text: 

- class {className}
- optional: extends {extendsName}
- optional: new-line delimited values
- constructor
- optional: new-line delimited initializations
- end brace

## Generating Code Snippets

`python code_snippet_generator.py`

Output is: `.vscode/vizcolib-configs.code-snippets`