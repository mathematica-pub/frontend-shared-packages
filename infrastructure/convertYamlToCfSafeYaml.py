from typing import OrderedDict
import ruamel.yaml
import sys
from ruamel.yaml.nodes import (SequenceNode, MappingNode)
from ruamel.yaml.error import MarkedYAMLError
from ruamel.yaml.compat import _F


def flatten_mapping(self, node):
    """
    This implements the merge key feature http://yaml.org/type/merge.html
    by inserting keys from the merge dict/list of dicts if not yet
    available in this node
    """
    merge = []
    index = 0
    while index < len(node.value):
        key_node, value_node = node.value[index]
        if key_node.tag == 'tag:yaml.org,2002:merge':
            if merge:  # double << key
                if self.allow_duplicate_keys:
                    del node.value[index]
                    index += 1
                    continue
            del node.value[index]
            if isinstance(value_node, MappingNode):
                self.flatten_mapping(value_node)
                merge.extend(value_node.value)
            elif isinstance(value_node, SequenceNode):
                submerge = []
                for subnode in value_node.value:
                    if not isinstance(subnode, MappingNode):
                        raise MarkedYAMLError(
                            'while constructing a mapping',
                            node.start_mark,
                            _F(
                                'expected a mapping for merging, but found {subnode_id!s}',
                                subnode_id=subnode.id,
                            ),
                            subnode.start_mark,
                        )
                    self.flatten_mapping(subnode)
                    submerge.append(subnode.value)
                submerge.reverse()
                for value in submerge:
                    merge.extend(value)
            else:
                raise MarkedYAMLError(
                    'while constructing a mapping',
                    node.start_mark,
                    _F(
                        'expected a mapping or list of mappings for merging, '
                        'but found {value_node_id!s}',
                        value_node_id=value_node.id,
                    ),
                    value_node.start_mark,
                )
        elif key_node.tag == 'tag:yaml.org,2002:value':
            key_node.tag = 'tag:yaml.org,2002:str'
            index += 1
        else:
            index += 1
    if bool(merge):
        node.merge = merge  # separate merge keys to be able to update without duplicate
        node.value = merge + node.value


n = len(sys.argv)

# grab filename
if n != 2:
    print("must give exactly one file to convert")
    sys.exit(1)

filename = sys.argv[1]

# Leave cloudformation functions alone


class NonAliasingRTRepresenter(ruamel.yaml.RoundTripRepresenter):
    def ignore_aliases(self, data):
        return True

    def represent_scalar(self, tag, value, style=None, anchor=None):
        return super().represent_scalar(tag, value, style)

# remove define blocks anywhere they occur


yaml = ruamel.yaml.YAML()
yaml.Representer = NonAliasingRTRepresenter
yaml.Constructor.flatten_mapping = flatten_mapping
yaml.allow_duplicate_keys = True
yaml.default_flow_style = False

with open(filename, 'r') as file:
    loaded_yaml = yaml.load(file)


def recursively_remove_defines(data):
    if 'define' in data:
        data.pop('define')
    for key, value in data.items():
        if type(value) == ruamel.yaml.comments.CommentedMap:
            recursively_remove_defines(value)


recursively_remove_defines(loaded_yaml)
with open(f'safe-{filename}', 'w') as file:
    yaml.dump(loaded_yaml, file)

# Flatten mapping merges are all messed up, time to fix
