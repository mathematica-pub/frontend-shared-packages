var copyfiles = require('copyfiles')
var fs = require('fs')

var baseDestUrl = "../../dist/viz-components/schematics/extend/raw-html";
var baseSourceUrl = "src/lib"
var components = ["bars", "chart", "html-tooltip", "lines", "map", "x-axis", "xy-chart-background", "xy-chart-space", "y-axis"];
for(let component of components) {
    const componentHtml = `${component}.component.html`
    copyfiles([`${baseSourceUrl}/${component}/${componentHtml}`, 
                `${baseDestUrl}/${component}`], true, (e) => {
                    if(e) {
                        console.log(e);
                        return;
                    } else {
                        fs.rename(`${baseDestUrl}/${component}/${componentHtml}`, 
                            `${baseDestUrl}/${component}/__name@dasherize__.component.html.template`, 
                            (e) => { if (e) console.log(e) });
                    }
                });
}

copyfiles(['schematics/collection.json', 'schematics/*/schema.json', 'schematics/*/files/**', '../../dist/viz-components'], (e) =>
    { if (e) console.log(e) });


   