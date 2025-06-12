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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var mongodb_1 = require("mongodb");
var fs_1 = require("fs");
var path_1 = require("path");
var dotenv_1 = require("dotenv");
// Load environment variables
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
var DB_NAME = process.env.DB_NAME || 'bartender-service';
function importData() {
    return __awaiter(this, void 0, void 0, function () {
        var client, db, importTasks, _i, importTasks_1, task, sourcePath, data, collection, existingDocs, existingMap, imported, updated, skipped, _a, data_1, doc, docId, existingDoc, existingTimestamp, newTimestamp, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, mongodb_1.MongoClient.connect(MONGODB_URI)];
                case 1:
                    client = _b.sent();
                    db = client.db(DB_NAME);
                    console.log('Connected to MongoDB');
                    importTasks = [
                        {
                            collectionName: 'staff',
                            sourceFile: 'test.staff.json',
                            timestampField: 'updatedAt',
                        },
                        {
                            collectionName: 'images',
                            sourceFile: 'test.images.json',
                            timestampField: 'uploadedAt',
                        },
                        {
                            collectionName: 'drinks',
                            sourceFile: 'test.drinks.json',
                            timestampField: 'updatedAt',
                        },
                        {
                            collectionName: 'cocktails',
                            sourceFile: 'test.cocktails.json',
                            timestampField: 'updatedAt',
                        },
                    ];
                    _i = 0, importTasks_1 = importTasks;
                    _b.label = 2;
                case 2:
                    if (!(_i < importTasks_1.length)) return [3 /*break*/, 13];
                    task = importTasks_1[_i];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 11, , 12]);
                    console.log("\nProcessing ".concat(task.collectionName, "..."));
                    sourcePath = path_1.default.join(__dirname, '../../data', task.sourceFile);
                    data = JSON.parse(fs_1.default.readFileSync(sourcePath, 'utf-8'));
                    if (!Array.isArray(data)) {
                        console.error("Invalid data format in ".concat(task.sourceFile));
                        return [3 /*break*/, 12];
                    }
                    collection = db.collection(task.collectionName);
                    return [4 /*yield*/, collection.find({}).toArray()];
                case 4:
                    existingDocs = _b.sent();
                    existingMap = new Map(existingDocs.map(function (doc) { return [doc._id.toString(), doc]; }));
                    imported = 0;
                    updated = 0;
                    skipped = 0;
                    _a = 0, data_1 = data;
                    _b.label = 5;
                case 5:
                    if (!(_a < data_1.length)) return [3 /*break*/, 10];
                    doc = data_1[_a];
                    docId = doc._id.toString();
                    existingDoc = existingMap.get(docId);
                    if (existingDoc && task.timestampField) {
                        existingTimestamp = new Date(existingDoc[task.timestampField]).getTime();
                        newTimestamp = new Date(doc[task.timestampField]).getTime();
                        if (newTimestamp <= existingTimestamp) {
                            skipped++;
                            return [3 /*break*/, 9];
                        }
                    }
                    // Convert string _id to ObjectId
                    doc._id = new mongodb_1.ObjectId(doc._id);
                    if (!existingDoc) return [3 /*break*/, 7];
                    return [4 /*yield*/, collection.replaceOne({ _id: doc._id }, doc)];
                case 6:
                    _b.sent();
                    updated++;
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, collection.insertOne(doc)];
                case 8:
                    _b.sent();
                    imported++;
                    _b.label = 9;
                case 9:
                    _a++;
                    return [3 /*break*/, 5];
                case 10:
                    console.log("Results for ".concat(task.collectionName, ":"));
                    console.log("- Imported: ".concat(imported));
                    console.log("- Updated: ".concat(updated));
                    console.log("- Skipped: ".concat(skipped));
                    return [3 /*break*/, 12];
                case 11:
                    error_1 = _b.sent();
                    console.error("Error processing ".concat(task.collectionName, ":"), error_1);
                    return [3 /*break*/, 12];
                case 12:
                    _i++;
                    return [3 /*break*/, 2];
                case 13: return [4 /*yield*/, client.close()];
                case 14:
                    _b.sent();
                    console.log('\nImport completed');
                    return [2 /*return*/];
            }
        });
    });
}
importData().catch(console.error);
