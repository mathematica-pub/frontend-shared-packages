import re
from type_definitions import Config, startBrace, endBrace, Field


def generate_single_code_snippet(config: Config):
    configDict = {}
    configDict["scope"] = "typescript, javascript"
    configDict["prefix"] = [f'Full{config.name}']
    body = []
    body.append(startBrace)
    for fieldName in config.values:
        fieldInfo: Field = config.values[fieldName]
        for comment in fieldInfo.comments:
            body.append(f'\t{comment}')
        body.append(construct_string_from_field(fieldName, fieldInfo))
    body.append(endBrace)
    configDict["body"] = body
    return configDict


def construct_string_from_field(fieldName: str, fieldInfo: Field) -> str:
    # remove any ? from fieldname
    fieldName = fieldName.replace("?", "")
    if fieldInfo.value:
        commentedOut = fieldName.find(".") != -1
        stringBeginning = f'\t'
        if commentedOut:
            stringBeginning = f'\t//'
        return f'{stringBeginning}{fieldName}:{replace_semicolons(fieldInfo.value)}'
    elif fieldInfo.type:
        return f'\t// {fieldName}:{replace_semicolons(fieldInfo.type)}'
    return f'\t{fieldName}'


def replace_semicolons(string: str):
    return re.sub(r"[;]", ",", string)
