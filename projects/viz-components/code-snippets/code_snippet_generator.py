# overall goal: input config files  -> output a code snippet json
import json
import os
from sys import stdout
from type_definitions import *
from state_machine_helpers import generate_configs_from_lines, merge
from config_parser import some_configs_unprocessed, parse_configs
from json_generator_helpers import generate_single_code_snippet

# 1. load in all config files
fileList = []
for root, dirs, files in os.walk('../src/lib'):
    for file in files:
        if file.endswith(".model.ts"):
            fileName = os.path.join(root, file).replace("\\", "/")
            fileList.append(fileName)
            print(fileName)

configs = {}

# 2. perform parsing of each file via a state machine
for file in fileList:
    openedFile = open(file)
    lines = openedFile.readlines()
    configs = merge(configs, generate_configs_from_lines(lines))

# 3. Calculate output (parse initializations & extends)
# At the end of this step, values field in each config object is ready for dumping
while(some_configs_unprocessed(configs)):
    parse_configs(configs)

# 4. Dump output to a code snippet json file
finalJson = {}
for config in configs:
    currentConfig = configs[config]
    finalJson[f'Full{currentConfig.name}'] = generate_single_code_snippet(
        currentConfig)

with open('../../../.vscode/vizcolib-configs.code-snippets', 'w', encoding='utf-8') as file:
    json.dump(finalJson, file, ensure_ascii=False, indent=4)
