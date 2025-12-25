import { db } from "../../db/in-memory.db";
import { PostView } from "../dto/output-dto/posts-view";
import { PostInputDTO } from "../dto/input-dto/post-input-dto";

export const postsRepository = {
  findAll(): PostView[] {
    return db.posts;
  },

  findById(id: string): PostView | null {
    return db.posts.find((post) => post.id === id) ?? null;
  },

  createPost(inputPost: PostInputDTO): PostView {
    const blog = db.blogs.find((blog) => blog.id === inputPost.blogId);
    if (!blog) {
      throw new Error("blog not found");
    }
    const newPost = {
      ...inputPost,
      id: new Date().toISOString(),
      blogName: blog.name,
      createdAt: new Date().toISOString(),
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
