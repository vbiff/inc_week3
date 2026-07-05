import { JwtService } from "./features/auth/adapters/jwt-service";
import { Argon2Service } from "./features/auth/adapters/argon2-service";
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
import { UserService } from "./features/users/application/command-services/user-service";
import { BlogsService } from "./features/blogs/application/command-services/blogs-services";
import { PostsService } from "./features/posts/application/command-services/posts-services";
import { CommentService } from "./features/comments/application/command-service/comment-service";
import { AuthService } from "./features/auth/application/command-services/auth-service";

const objects: any[] = [];
// Adapters
const jwtService = new JwtService();
objects.push(jwtService);
const argon2Service = new Argon2Service();
objects.push(argon2Service);
//export const bcryptService = new BcryptService();
const nodemailerService = new NodemailerService();
objects.push(nodemailerService);
// Repositories

const userRepository = new UserRepository();
objects.push(userRepository);
const userQueryRepository = new UserQueryRepository();
objects.push(userQueryRepository);
const blogsRepository = new BlogsRepository();
objects.push(blogsRepository);
const blogsQueryRepository = new BlogsQueryRepository();
objects.push(blogsQueryRepository);
const postsRepository = new PostsRepository();
objects.push(postsRepository);
const postsQueryRepository = new PostsQueryRepository();
objects.push(postsQueryRepository);
const commentsRepository = new CommentsRepository();
objects.push(commentsRepository);
const commentsQueryRepository = new CommentsQueryRepository();
objects.push(commentsQueryRepository);
const deviceRepository = new DeviceRepository();
objects.push(deviceRepository);
//export const authRepository = new AuthRepository();

// Services
const userService = new UserService(userRepository, argon2Service);
objects.push(userService);
const blogsService = new BlogsService(blogsRepository);
objects.push(blogsService);
const postsService = new PostsService(postsRepository);
objects.push(postsService);
const commentService = new CommentService(commentsRepository);
objects.push(commentService);
const authService = new AuthService(
  userRepository,
  jwtService,
  argon2Service,
  nodemailerService,
  deviceRepository,
  userService,
);
objects.push(authService);

export const ioc = {
  getInstance<T>(ClassType: any) {
    const targetInstance = objects.find(
      (object) => object instanceof ClassType,
    );

    return targetInstance as T;
  },
};
