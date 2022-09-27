from os import popen, path
import re
import yaml
from typing import List


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

    filesToParse = copy_files_from_dict(
        outputDirectory, documentationStructure, inputDirectory, [])
    print(*filesToParse, sep="\n")

    for file in filesToParse:
        parse_file(file, outputDirectory)


def copy_files_from_dict(partialPath: str, dict: dict, inputDirectory: str, filesToParse: List[str]):
    """
    Recursive fxn:
    Base case: dict is a single key value pair, value is of type string
        - copy over path + value from input string to output path + key
    Otherwise: build up path 
    """
    for key in dict.keys():
        if isinstance(dict[key], str):
            outputFileName = path.join(
                partialPath, f'{key}.html').replace("\\", "/")
            inputFileName = path.join(
                inputDirectory, dict[key]).replace("\\", "/")
            popen(f'cp {inputFileName} {outputFileName}')
            filesToParse.append(outputFileName)
        else:
            newPath = path.join(partialPath, key).replace("/", "\\")
            popen(f'mkdir {newPath}').read()
            filesToParse = copy_files_from_dict(
                newPath, dict[key], inputDirectory, filesToParse)
    return filesToParse


if __name__ == "__main__":
    runner(inputDirectory='../../../documentation',
           outputDirectory='../src/assets/documentation')
