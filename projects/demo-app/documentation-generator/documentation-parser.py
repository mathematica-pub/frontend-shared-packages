from os import walk, popen, path, write
import re

documentationInputDirectory = '../../../documentation/components'
documentationOutputDirectory = '../src/assets/documentation'
fileList = next(walk(documentationInputDirectory), (None, None, []))[2] 

outputFileList = []
for file in fileList: 
    newFileName = path.join(documentationOutputDirectory, file.replace(".html", "Documentation.html")).replace("\\", "/")
    popen(f'cp {path.join(documentationInputDirectory, file)} {newFileName}')
    outputFileList.append(newFileName)

print(*outputFileList, sep = "\n")

def handleMatch(match: re.Match): 
    dasherizedName = re.sub(r'(?<!^)(?=[A-Z])', '-', match.group(2)).lower()
    return f"href=\"{dasherizedName}"

for file in outputFileList: 
    openedFile = open(file, "r")
    text = openedFile.read()
    openedFile.close()
    componentName = file.replace(documentationOutputDirectory, "").replace("/", "").replace("ComponentDocumentation.html", "")
    componentName = re.sub(r'(?<!^)(?=[A-Z])', '-', componentName).lower()
    text = re.search(r"(<!-- START CONTENT -->)(.|\n)*(<!-- END CONTENT -->)", text).group()
    text = re.sub(r"(<script)(.|\n)*(</script>)", "", text)
    text = text.replace("href=\"#", f"href=\"{componentName}#")
    text = re.sub(r"(href=\"../classes/)(.*)(.html)", handleMatch, text)
    text = re.sub(r"(href=\"../components/)(.*)(.html)", handleMatch, text)
    openFileForWriting = open(file, "w")
    openFileForWriting.write(text)
