# Code Snippets rules

1. all configs need to be declared with a constructor of the form

```
constructor(init?: Partial<ClassName>) {
    ...constructor things go here, if any
    Object.assign(this, init)
}
```

2. Configs all need a constructor, and any classes without constructors need to go below config classes (this is actually just...could cause some bugs/area for future improvement, I think).
