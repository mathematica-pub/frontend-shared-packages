from os import walk, popen, path, write
import re
import yaml
from bidict import bidict


def handleMatch(match: re.Match):
    dasherizedName = re.sub(
        r'(?<!^)(?=[A-Z])', '-', match.group(2)).lower()
    return f"href=\"{dasherizedName}"


def parse_file(fileName, outputDirectory):
    fullFilePath = path.join(outputDirectory, fileName)
    openedFile = open(fullFilePath, "r")
    text = openedFile.read()
    openedFile.close()
    text = re.search(
        r"(<!-- START CONTENT -->)(.|\n)*(<!-- END CONTENT -->)", text).group()
    text = re.sub(r"(<script)(.|\n)*(</script>)", "", text)
    text = text.replace(
        "href=\"#", f"href=\"documentation/{fileName.replace('.html', '')}#")
    text = re.sub(r"(href=\"../classes/)(.*)(.html)", handleMatch, text)
    text = re.sub(r"(href=\"../components/)(.*)(.html)", handleMatch, text)
    openFileForWriting = open(fullFilePath, "w")
    openFileForWriting.write(text)


def runner(inputDirectory, outputDirectory):
    yamlLocation = path.join(outputDirectory, "documentation-structure.yaml")
    with open(yamlLocation, "r") as stream:
        try:
            documentationStructure = yaml.safe_load(stream)
        except yaml.YAMLError as err:
            print(err)
    inputFileMap = bidict()
    for directory in documentationStructure.keys():
        fullOutputDirectory = path.join(
            outputDirectory, directory).replace("/", "\\")
        popen(f'mkdir {fullOutputDirectory}').read()
        for file in documentationStructure[directory].keys():
            outputFileName = path.join(
                fullOutputDirectory, f'{file}.html').replace("\\", "/")
            inputFileName = path.join(
                inputDirectory, documentationStructure[directory][file]).replace("\\", "/")
            popen(f'cp {inputFileName} {outputFileName}')
            inputFileMap[documentationStructure[directory]
                         [file]] = f'{directory}/{file}.html'

    print(*inputFileMap.inverse.keys(), sep="\n")

    for file in inputFileMap.inverse.keys():
        parse_file(file, outputDirectory)


if __name__ == "__main__":
    runner(inputDirectory='../../../documentation',
           outputDirectory='../src/assets/documentation')
