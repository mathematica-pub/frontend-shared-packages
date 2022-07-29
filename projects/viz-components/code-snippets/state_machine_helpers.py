import re
from type_definitions import *


def get_class_name(line: str) -> str:
    if line.find("class"):
        return next_word("class", line.strip().split())
    return ""


def next_word(target, source):
    for i, w in enumerate(source):
        if w == target:
            return source[i+1]


def get_extends_name(line: str) -> str:
    if line.find("extends"):
        return next_word("extends", line.strip().split())
    return ""


def line_is_comment(line: str) -> bool:
    return (line.startswith("//") or
            line.startswith("/*") or
            line.startswith("*") or
            line.startswith("*/"))


def add_key_value_pair(dictionary: dict, line: str):
    # split based on regex
    splitLine = line.strip()
    nameSplitLine = re.split("[=:](?!>)", splitLine, 1)
    colonSplitLine = re.split("[:](?!>)", splitLine, 1)
    equalsSplitLine = re.split("[=](?!>)", splitLine, 1)
    firstOccurenceColon = line.find(":")
    firstOccurenceEquals = line.find("=")

    # check for valid KVP
    if len(nameSplitLine) == 1:
        return

    # for first thing, just remove any "this."
    name: str = nameSplitLine[0]
    name = name.replace("this.", "", 1)

    type = ""
    value = ""
    if (firstOccurenceColon != -1 and
        (firstOccurenceEquals == -1 or firstOccurenceColon < firstOccurenceEquals) and
            len(colonSplitLine) == 2):
        type = re.split("[=](?!>)", colonSplitLine[1], 1)[0]
    if len(equalsSplitLine) == 2:
        value = equalsSplitLine[1]

    name = name.strip()
    dictionary[name] = Field(type, value)
    return


def merge(dict1: dict, dict2: dict):
    return {**dict1, **dict2}


def generate_configs_from_lines(lines) -> dict:
    # classic state machine - read files one at a time & parse
    state = State.NOT_PARSING
    configs = {}
    currentConfig = None
    for line in lines:
        if state == State.NOT_PARSING:
            if line.find("export") != -1:
                state = State.NAME
                currentConfig = None
                currentConfig = Config()
        if state == State.NAME:
            name = get_class_name(line)
            if name:
                currentConfig.name = name
                state = State.EXTENDS
        if state == State.EXTENDS:
            extends = get_extends_name(line)
            if extends:
                currentConfig.extends = extends
                state = State.VALUES
            elif not extends and line.find(startBrace):
                state = State.VALUES
        elif state == State.VALUES:
            if line_is_comment(line):
                # TODO: add comment handling!
                continue
            if line.find("constructor") != -1:
                state = State.INITIALIZATIONS
                continue
            add_key_value_pair(currentConfig.values, line)
        elif state == State.INITIALIZATIONS:
            if line_is_comment(line):
                continue
            if line.find(endBrace) != -1:
                configs[currentConfig.name] = currentConfig
                state = State.NOT_PARSING
                continue
            add_key_value_pair(currentConfig.initializations, line)
    return configs
