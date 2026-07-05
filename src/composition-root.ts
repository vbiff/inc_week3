import "reflect-metadata";
import { Container } from "inversify";
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

export const container = new Container();

// Adapters
container.bind(JwtService).toSelf().inSingletonScope();
container.bind(Argon2Service).toSelf().inSingletonScope();
container.bind(NodemailerService).toSelf().inSingletonScope();

// Repositories
container.bind(UserRepository).toSelf().inSingletonScope();
container.bind(UserQueryRepository).toSelf().inSingletonScope();
container.bind(BlogsRepository).toSelf().inSingletonScope();
container.bind(BlogsQueryRepository).toSelf().inSingletonScope();
container.bind(PostsRepository).toSelf().inSingletonScope();
container.bind(PostsQueryRepository).toSelf().inSingletonScope();
container.bind(CommentsRepository).toSelf().inSingletonScope();
container.bind(CommentsQueryRepository).toSelf().inSingletonScope();
container.bind(DeviceRepository).toSelf().inSingletonScope();

// Services
container.bind(UserService).toSelf().inSingletonScope();
container.bind(BlogsService).toSelf().inSingletonScope();
container.bind(PostsService).toSelf().inSingletonScope();
container.bind(CommentService).toSelf().inSingletonScope();
container.bind(AuthService).toSelf().inSingletonScope();
