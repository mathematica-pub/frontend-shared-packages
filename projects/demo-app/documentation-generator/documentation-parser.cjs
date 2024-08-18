"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var fs_1 = require("fs");
var yaml_1 = require("yaml");
var DocumentationParser = /** @class */ (function () {
    function DocumentationParser(lib) {
        this.lib = lib;
        this.inputDirectory = "./compodoc-docs/".concat(this.lib);
        this.outputDirectory = "./projects/demo-app/src/assets/documentation/".concat(this.lib);
        this.routerPath = "documentation/".concat(this.lib);
        this.missingKeys = [];
    }
    DocumentationParser.prototype.parseDirectory = function () {
        var documentationStructure = this.getDocumentationStructure();
        this.copiedFiles = this.copyFilesToOutputDirAndGetRecord(this.outputDirectory, this.inputDirectory, documentationStructure);
        if (this.missingKeys.length > 0) {
            console.log('MISSING FILES - LINKED IN DOCUMENTATION');
            console.log(this.missingKeys.join('\n'));
        }
    };
    DocumentationParser.prototype.getDocumentationStructure = function () {
        var yamlLocation = "".concat(this.outputDirectory, "/documentation-structure.yaml");
        var documentationStructure;
        try {
            var fileContents = fs.readFileSync(yamlLocation, 'utf8');
            documentationStructure = (0, yaml_1.parse)(fileContents);
        }
        catch (err) {
            console.error(err);
        }
        return documentationStructure;
    };
    DocumentationParser.prototype.copyFilesToOutputDirAndGetRecord = function (baseOutputDirPath, baseInputDirPath, config, copiedFiles) {
        var _this = this;
        if (copiedFiles === void 0) { copiedFiles = {}; }
        Object.entries(config).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (typeof value === 'string') {
                if (!(0, fs_1.existsSync)(baseOutputDirPath)) {
                    (0, fs_1.mkdirSync)(baseOutputDirPath, { recursive: true });
                }
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var source, destination, text, pathForDoc, parsed, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                source = "".concat(baseInputDirPath, "/").concat(value);
                                destination = "".concat(baseOutputDirPath, "/").concat(key);
                                return [4 /*yield*/, fs.promises.readFile(source, 'utf-8')];
                            case 1:
                                text = _a.sent();
                                pathForDoc = "".concat(this.routerPath).concat(destination.split(this.lib)[1]);
                                parsed = this.getParsedFile(text, pathForDoc);
                                fs.promises.writeFile("".concat(destination, ".html"), parsed, 'utf8');
                                console.log(pathForDoc, 'copied successfully!');
                                return [3 /*break*/, 3];
                            case 2:
                                err_1 = _a.sent();
                                console.error('Error copying file:', err_1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })();
            }
            else {
                var newPath = "".concat(baseOutputDirPath, "/").concat(key);
                copiedFiles = _this.copyFilesToOutputDirAndGetRecord(newPath, baseInputDirPath, config[key], copiedFiles);
            }
        });
        return copiedFiles;
    };
    DocumentationParser.prototype.getParsedFile = function (text, path) {
        var _this = this;
        var match = text.match(/<!-- START CONTENT -->([\s\S]*?)<!-- END CONTENT -->/);
        var content = match ? match[0] : '';
        content = content.replace(/(<script)(.|\n)*(<\/script>)/, '');
        // modifies href in tabs generated by compodoc to match routing pattern in site
        content = content.replace(/href="#/g, "href=\"".concat(path, "#"));
        content = content.replace(/(href="..\/)(classes.*html|components.*html|directives.*html|interfaces.*html|injectables.*html)/g, function (match, p1, p2) { return _this.handleMatch([match, p1, p2]); });
        return content;
    };
    DocumentationParser.prototype.handleMatch = function (match) {
        if (this.copiedFiles[match[2]]) {
            var routerLink = this.copiedFiles[match[2]]
                .replace('all/', '')
                .replace(this.outputDirectory, '')
                .replace('.html', '');
            console.log(this.routerPath);
            return "href=\"documentation".concat(routerLink);
        }
        else {
            if (!this.missingKeys.includes(match[2])) {
                this.missingKeys.push(match[2]);
            }
        }
        return '';
    };
    return DocumentationParser;
}());
// function getArgs() {
//   const args = process.argv.slice(2);
//   const argsObj = {};
//   for (let i = 0; i < args.length; i += 2) {
//     const key = args[i].replace('--', '');
//     const value = args[i + 1];
//     argsObj[key] = value;
//   }
//   return argsObj;
// }
// const args = getArgs();
var documentationParser = new DocumentationParser('viz-components');
documentationParser.parseDirectory();
