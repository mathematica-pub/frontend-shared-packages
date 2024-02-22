import re
from os import path, popen
from pathlib import Path
from shutil import copy
from typing import Dict

import yaml


class DocumentationParser:
    def __init__(self, inputDirectory, outputDirectory):
        self.inputDirectory = inputDirectory
        self.outputDirectory = outputDirectory
        self.missingKeys = []

    def handleMatch(self, match: re.Match):
        if match.group(2) in self.filesToParse:
            routerLink = (
                self.filesToParse[match.group(2)]
                .replace("all/", "")
                .replace(self.outputDirectory, "")
                .replace(".html", "")
            )
            return f'href="documentation{routerLink}'
        else:
            if match.group(2) not in self.missingKeys:
                self.missingKeys.append(match.group(2))
        return ""

    def parse_file(self, fullFilePath: str):
        openedFile = open(fullFilePath, "r")
        text = openedFile.read()
        openedFile.close()
        text = re.search(
            r"(<!-- START CONTENT -->)(.|\n)*(<!-- END CONTENT -->)", text
        ).group()
        text = re.sub(r"(<script)(.|\n)*(</script>)", "", text)
        text = text.replace(
            'href="#',
            f"href=\"documentation/{fullFilePath.replace(self.outputDirectory, '.').replace('.html', '')}#",
        )
        text = re.sub(
            r"(href=\"../)(classes.*html|components.*html|directives.*html|interfaces.*html)",
            self.handleMatch,
            text,
        )
        openFileForWriting = open(fullFilePath, "w")
        openFileForWriting.write(text)

    def parse_directory(self):
        yamlLocation = path.join(self.outputDirectory, "documentation-structure.yaml")
        with open(yamlLocation, "r") as stream:
            try:
                documentationStructure = yaml.safe_load(stream)
            except yaml.YAMLError as err:
                print(err)

        self.filesToParse = self.copy_files_from_dict(
            self.outputDirectory, documentationStructure, self.inputDirectory, {}
        )

        for fileKey in self.filesToParse.keys():
            print(self.filesToParse[fileKey])
            self.parse_file(self.filesToParse[fileKey])
        print("MISSING FILES - LINKED IN DOCUMENTATION")
        print(*self.missingKeys, sep="\n")

    def copy_files_from_dict(
        self,
        partialPath: str,
        dict: dict,
        inputDirectory: str,
        filesToParse: Dict[str, str],
    ):
        """
        Recursive fxn:
        Base case: dict is a single key value pair, value is of type string
            - copy over path + value from input string to output path + key
        Otherwise: build up path
        """
        for key in dict.keys():
            if isinstance(dict[key], str):
                outputFileName = path.join(partialPath, f"{key}.html").replace(
                    "\\", "/"
                )
                inputFileName = path.join(inputDirectory, dict[key]).replace("\\", "/")
                from_file = Path(inputFileName)
                to_file = Path(outputFileName)
                copy(from_file, to_file)
                filesToParse[dict[key]] = outputFileName
            else:
                newPath = path.join(partialPath, key).replace("/", "\\")
                filesToParse = self.copy_files_from_dict(
                    newPath, dict[key], inputDirectory, filesToParse
                )
        return filesToParse


if __name__ == "__main__":
    parser = DocumentationParser(
        inputDirectory="./documentation",
        outputDirectory="./projects/demo-app/src/assets/documentation",
    )
    parser.parse_directory()
