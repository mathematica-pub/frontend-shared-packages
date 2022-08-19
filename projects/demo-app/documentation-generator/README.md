# concept 

- write parser that generates a bunch of files (for now, just all the components)
parser essentially just does some regex: 

1. remove everything in the string before "<!-- START CONTENT -->"
2. remove everything in the string after "<!-- END CONTENT -->"
3. all of form `href="#` is replaced by `href="FileNameMinusComponent#`
4. any links that read `href="../classes/OtherThing.html"` is replaced by `href="OtherThing"`
5. tabs haven't been handled yet, so output should just be: 
`class="tab-pane fade` replaced by `class="tab-pane fade active in"`

- documentation service then (MVP) creates a separate observable reading in each component's documentation, and has a function that takes as arg a string, returns the correct observable 

- every component has a component-documentation child component that takes as input the name of the observable to grab (e.g. Bars => barsDocumentation$) and displays it 