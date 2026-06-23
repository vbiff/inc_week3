import { JwtService } from "./features/auth/adapters/jwt-service";
import { Argon2Service } from "./features/auth/adapters/argon2-service";
import { BcryptService } from "./features/auth/adapters/bcrypt-service";
import { NodemailerService } from "./features/auth/adapters/email-service/nodemailer-service";

import { UserRepository } from "./features/users/repositories/user-repository-mongodb";
import { UserQueryRepository } from "./features/users/repositories/user-query-repository-mongodb";
import { BlogsRepository } from "./features/blogs/repositories/blogs.mongodb.repositories";
import { BlogsQueryRepository } from "./features/blogs/repositories/blogs.query-mongodb.repositories";
import { PostsRepository } from "./features/posts/repositories/posts.mongodb.repositories";
import { PostsQueryRepository } from "./features/posts/repositories/posts.mongodb-query-repository";
import { CommentsRepository } from "./features/comments/repositories/commentsRepository";
import { CommentsQueryRepository } from "./features/comments/repositories/commentsQueryRepository";
import { DeviceRepository } from "./features/security/repository/device-repository";
import { AuthRepository } from "./features/auth/repositories/auth-repository";

import { UserService } from "./features/users/application/command-services/user-service";
import { BlogsService } from "./features/blogs/application/command-services/blogs-services";
import { PostsService } from "./features/posts/application/command-services/posts-services";
import { CommentService } from "./features/comments/application/command-service/comment-service";
import { AuthService } from "./features/auth/application/command-services/auth-service";

// Adapters
export const jwtService = new JwtService();
export const argon2Service = new Argon2Service();
export const bcryptService = new BcryptService();
export const nodemailerService = new NodemailerService();

// Repositories
export const userRepository = new UserRepository();
export const userQueryRepository = new UserQueryRepository();
export const blogsRepository = new BlogsRepository();
export const blogsQueryRepository = new BlogsQueryRepository();
export const postsRepository = new PostsRepository();
export const postsQueryRepository = new PostsQueryRepository();
export const commentsRepository = new CommentsRepository();
export const commentsQueryRepository = new CommentsQueryRepository();
export const deviceRepository = new DeviceRepository();
export const authRepository = new AuthRepository();

// Services
export const userService = new UserService(userRepository, argon2Service);
export const blogsService = new BlogsService(blogsRepository);
export const postsService = new PostsService(postsRepository);
export const commentService = new CommentService(commentsRepository);
export const authService = new AuthService(
  userRepository,
  jwtService,
  argon2Service,
  nodemailerService,
  deviceRepository,
  userService,
);
