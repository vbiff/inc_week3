import { db } from "../../db/in-memory.db";
import { Post } from "../types/posts";
import { PostInputDTO } from "../dto/post-input-dto";

export const postsRepository = {
  findAll(): Post[] {
    return db.posts;
  },

  findById(id: string): Post | null {
    return db.posts.find((post) => post.id === id) ?? null;
  },

  createPost(inputPost: PostInputDTO): Post {
    const blog = db.blogs.find((blog) => blog.id === inputPost.blogId);
    if (!blog) {
      throw new Error("blog not found");
    }
    const newPost = {
      ...inputPost,
      id: new Date().toISOString(),
      blogName: blog.name,
    };
    db.posts.push(newPost);
    return newPost;
  },

  updatePost(dto: PostInputDTO, id: string) {
    const post = db.posts.find((post) => post.id === id);
    if (!post) {
      throw new Error("blog does not exist");
    }
    const blog = db.blogs.find((blog) => blog.id === dto.blogId);
    if (!blog) {
      throw new Error("blog not found");
    }

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = blog.name;

    return;
  },

  deletePost(id: string) {
    const postIndex = db.posts.findIndex((m) => m.id === id);
    if (postIndex === -1) {
      throw new Error("blog not found");
    }
    db.posts.splice(postIndex, 1);
    return;
  },
};
