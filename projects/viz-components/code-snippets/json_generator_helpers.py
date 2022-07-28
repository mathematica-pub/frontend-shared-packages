from type_definitions import Config, startBrace, endBrace, Field


def generate_single_code_snippet(config: Config):
    configDict = {}
    configDict["scope"] = "typescript, javascript"
    configDict["prefix"] = f'[Full{config.name}]'
    body = []
    body.append(startBrace)
    for fieldName in config.values:
        fieldInfo: Field = config.values[fieldName]
        body.append(construct_string_from_field(fieldName, fieldInfo))
    body.append(endBrace)
    configDict["body"] = body
    return configDict


def construct_string_from_field(fieldName: str, fieldInfo: Field) -> str:
    finalString = f'\t{fieldName}'
    if fieldInfo.value:
        finalString = f'{finalString} ={fieldInfo.value}'
    elif fieldInfo.type:
        finalString = f'{finalString}:{fieldInfo.type}'
    return finalString
