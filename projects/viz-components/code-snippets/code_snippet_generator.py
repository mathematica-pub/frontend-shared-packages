# overall goal: input config files  -> output a code snippet json
import json
import os
from sys import stdout

from config_parser import parse_configs, some_configs_unprocessed
from json_generator_helpers import generate_single_code_snippet
from state_machine_helpers import generate_configs_from_lines, merge
from type_definitions import *


def runner(event, context):
    fileList = load_files()
    configs = create_configs(fileList)
    create_code_snippets_from_configs(configs)


def load_files():
    fileList = []
    for root, dirs, files in os.walk("projects/viz-components/src/lib"):
        for file in files:
            if file.endswith(".config.ts"):
                fileName = os.path.join(root, file).replace("\\", "/")
                fileList.append(fileName)
                print(fileName)
    return fileList


def create_configs(fileList):
    configs = {}
    for file in fileList:
        openedFile = open(file)
        lines = openedFile.readlines()
        configs = merge(configs, generate_configs_from_lines(lines))
    while some_configs_unprocessed(configs):
        parse_configs(configs)
    return configs


def create_code_snippets_from_configs(configs):
    finalJson = {}
    for config in configs:
        currentConfig = configs[config]
        finalJson[f"Vic{currentConfig.name}"] = generate_single_code_snippet(
            currentConfig
        )

    with open(".vscode/vizcolib-configs.code-snippets", "w", encoding="utf-8") as file:
        json.dump(finalJson, file, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    runner({}, {})
