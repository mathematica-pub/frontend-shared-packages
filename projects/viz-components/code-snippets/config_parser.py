from copy import copy
from type_definitions import Config, Field


def some_configs_unprocessed(configs: 'dict[str, Config]') -> bool:
    for config in configs:
        if not configs[config].alreadyParsed:
            return True
    return False


def parse_configs(configs: 'dict[str, Config]'):
    for config in configs:
        if config_skip_parse(configs, config):
            continue
        if configs[config].extends:
            extendName = configs[config].extends
            copy_over_fields(
                fromDict=configs[extendName].values, toDict=configs[config].values, overwrite=False)
        copy_over_fields(fromDict=configs[config].initializations,
                         toDict=configs[config].values, overwrite=True)
        configs[config].alreadyParsed = True


def config_skip_parse(configs: 'dict[str, Config]', config: str) -> bool:
    if configs[config].alreadyParsed:
        return True
    extendsName = configs[config].extends
    # general concept: parse one level at a time, move down through the chain
    if not extendsName and not configs[config].alreadyParsed:
        return False
    if not configs[extendsName].alreadyParsed:
        return True
    return False


def copy_over_fields(fromDict: 'dict[str, Field]', toDict: 'dict[str, Field]', overwrite: bool):
    for field in fromDict:
        if field in toDict and not overwrite:
            toDict[field].comments = toDict[field].comments + \
                fromDict[field].comments
            continue
        if field in toDict:
            fromDict[field].comments = fromDict[field].comments + \
                toDict[field].comments
        toDict[field] = copy(fromDict[field])
