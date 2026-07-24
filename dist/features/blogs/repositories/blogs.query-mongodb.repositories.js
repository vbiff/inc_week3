"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const mapper_blogs_output_1 = require("../mappers/mapper-blogs-output");
const mapper_output_1 = require("../../../core/mappers/mapper-output");
const inversify_1 = require("inversify");
const blog_entity_1 = require("../domain/blog_entity");
let BlogsQueryRepository = class BlogsQueryRepository {
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = query;
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm, $options: "i" };
            }
            const items = yield blog_entity_1.BlogModel.find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize);
            const totalCount = yield blog_entity_1.BlogModel.countDocuments(filter);
            const mappedItems = items.map((item) => (0, mapper_blogs_output_1.mapBlogs)(item));
            return (0, mapper_output_1.mapperOutput)(mappedItems, {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
            });
        });
    }
    findByObjectId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blog_entity_1.BlogModel.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!blog)
                return null;
            return (0, mapper_blogs_output_1.mapBlogs)(blog);
        });
    }
};
exports.BlogsQueryRepository = BlogsQueryRepository;
exports.BlogsQueryRepository = BlogsQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], BlogsQueryRepository);
