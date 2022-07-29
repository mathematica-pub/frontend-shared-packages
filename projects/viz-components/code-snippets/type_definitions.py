from enum import Enum


class Config:
    def __init__(self, name="", extends="", values=None, initializations=None):
        self.name = name
        self.extends = extends
        # progressively modified dictionary
        self.values = values if values is not None else {}
        self.initializations = initializations if initializations is not None else {}
        self.alreadyParsed = False


class Field:
    def __init__(self, type="", value=""):
        self.type = type
        self.value = value


class State(Enum):
    NOT_PARSING = 0
    NAME = 1
    EXTENDS = 2
    VALUES = 3
    INITIALIZATIONS = 4
    COMMENTS = 5


startBrace = '{'
endBrace = '}'
