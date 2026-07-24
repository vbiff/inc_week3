"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = exports.BlogSchema = exports.BlogEntity = void 0;
const mongoose_1 = require("mongoose");
class BlogEntity {
    constructor(name, description, websiteUrl, createdAt, isMembership) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.createdAt = createdAt;
        this.isMembership = isMembership;
    }
    // Creation defaults live here, not in the service — the service just
    // forwards the input DTO to the repository.
    static createBlog(dto) {
        return new BlogEntity(dto.name, dto.description, dto.websiteUrl, new Date().toISOString(), false);
    }
    updateBlog(dto) {
        this.name = dto.name;
        this.description = dto.description;
        this.websiteUrl = dto.websiteUrl;
    }
}
exports.BlogEntity = BlogEntity;
exports.BlogSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
});
// loadClass binds BlogEntity's prototype methods (updateBlog) onto every
// hydrated document, so `document.updateBlog(dto)` becomes callable
// directly. Statics (createBlog) stay a plain class method for now —
// exposing them as Model statics needs an extra custom Model<> interface,
// which we intentionally skip on this first pass to keep the pattern simple.
exports.BlogSchema.loadClass(BlogEntity);
exports.BlogModel = (0, mongoose_1.model)("Blog", exports.BlogSchema);
