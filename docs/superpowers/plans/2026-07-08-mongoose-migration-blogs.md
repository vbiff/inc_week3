# Mongoose Migration (Blogs entity) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перевести фичу `blogs` с нативного MongoDB-драйвера на Mongoose целиком (schema → model → domain-класс через `loadClass()` → репозитории → сервис → тестовая очистка), чтобы получить один полностью рабочий образец, который потом один в один повторяется для posts/comments/users/security/auth.

**Architecture:** Один Mongoose `Schema`, домен-класс `BlogEntity` с бизнес-методами (`static createBlog`, `updateBlog`), привязанный к схеме через `schema.loadClass()`, и `Model<BlogEntity>` поверх схемы. Репозитории (`BlogsRepository`, `BlogsQueryRepository`) перестают знать про `Collection` из `mongodb` и работают только с `BlogModel`. Остальные фичи (posts/comments/users/...) в этом плане НЕ трогаются и продолжают работать через нативный драйвер — оба клиента (`MongoClient` и `mongoose`) подключены к одной и той же базе `blogger` параллельно, пока миграция не пройдёт по всем фичам.

**Tech Stack:** Express 5, TypeScript, MongoDB (Atlas), Mongoose ^9.7.3, Inversify (DI), Jest + Supertest (e2e).

## Global Constraints

- Комментарии только на English, только там, где неочевидно WHY (не WHAT) — из `~/.claude/CLAUDE.md`.
- Никаких `any` — конкретные типы везде.
- Файлы < 300 строк, функции < 30 строк.
- Early return вместо вложенных if/else.
- Naming: файлы kebab-case (существующий файл `blog_entity.ts` с подчёркиванием не переименовываем — он уже создан и добавлен в git), типы/классы PascalCase, переменные camelCase.
- Сервисы возвращают `Result<T>` / простые значения как сейчас — паттерн `BlogsService` не меняем, только упрощаем.
- Conventional commits, на английском.
- Никогда не коммитить `console.log`/`TODO`/закомментированный код.

---

## Почему нельзя просто взять и переписать один файл

Сейчас `db/mongo.db.ts` закомментировал **вообще все** экспорты нативного драйвера (`client`, `usersCollection`, `postsCollection`, `blogCollection`, `commentsCollection`, `devicesCollection`, `refreshTokensCollection`, `rateLimitCollection`), а на Mongoose переведена только сама функция подключения. Но 11 файлов в других фичах (posts, comments, users, security, auth, rate-limit-middleware) всё ещё импортируют эти коллекции. Поэтому первый шаг — не про blogs, а про то, чтобы вернуть остальным фичам то, что им нужно, и только потом выкинуть из этого списка `blogCollection`, потому что именно её забирает Mongoose.

Второй скрытый баг: URI в `.env` не содержит имя базы (`mongodb+srv://...cluster0.rkpcfuv.mongodb.net/?appName=Cluster0` — без `/blogger` перед `?`). Нативный драйвер получал имя базы явно через `client.db("blogger")`. Mongoose получает имя базы либо из пути в URI, либо из опции `dbName` — если не передать её явно, Mongoose тихо подключится к базе `test`, а не `blogger`. Тогда блоги будут писаться в одну базу, а посты/пользователи — в другую, и всё будет "работать", но данные разъедутся по разным базам. Поэтому `mongoose.connect()` обязательно должен получить `{ dbName: "blogger" }`.

---

### Task 1: Вернуть нативный драйвер остальным фичам и явно указать Mongoose базу

**Files:**
- Modify: `src/db/mongo.db.ts`

**Interfaces:**
- Produces: `client` (MongoClient), `usersCollection`, `postsCollection`, `commentsCollection`, `devicesCollection`, `refreshTokensCollection`, `rateLimitCollection` — как и было раньше, для остальных фич. `blogCollection` больше НЕ экспортируется — он был единственным потребителем `blogCreateDto` в этом файле.

- [ ] **Step 1: Переписать `src/db/mongo.db.ts` целиком**

```ts
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { PostCreateDto } from "../features/posts/application/command-services/dto/post-create-dto";
import { CommentCreateDto } from "../features/comments/application/command-service/dto/comment-create-dto";
import { AppConfig } from "../core/config/config";
import { UserCreateDto } from "../features/users/application/command-services/dto/user-create-dto";
import { RefreshTokenDTO } from "../features/auth/application/command-services/dto/refresh-token-dto";
import { DeviceDTO } from "../features/security/application/dto/device-dto";
import mongoose from "mongoose";

dotenv.config();

const mongoUri = AppConfig.MONGO_URL || "mongodb://localhost:27017";
// Both native driver and mongoose must point at the same logical database
// while the migration is in progress across features.
const dbName = "blogger";

export const client = new MongoClient(mongoUri);

export const usersCollection = client
  .db(dbName)
  .collection<UserCreateDto>("users");
export const postsCollection = client
  .db(dbName)
  .collection<PostCreateDto>("posts");
export const commentsCollection = client
  .db(dbName)
  .collection<CommentCreateDto>("comments");
export const refreshTokensCollection = client
  .db(dbName)
  .collection<RefreshTokenDTO>("refreshTokens");
export const devicesCollection = client
  .db(dbName)
  .collection<DeviceDTO>("devices");
export const rateLimitCollection = client
  .db(dbName)
  .collection<{ ip: string; url: string; date: Date }>("rateLimit");

export async function runDb(): Promise<void> {
  try {
    await client.connect();
    // dbName here is required — the connection string has no path segment,
    // so mongoose would otherwise silently default to the "test" database.
    await mongoose.connect(mongoUri, { dbName });
    console.log("Database Connected " + mongoUri);
  } catch {
    console.log("Can't connect to mongodb");
    await mongoose.disconnect();
    await client.close();
  }
}
```

- [ ] **Step 2: Убедиться, что весь проект снова компилируется**

Run: `npx tsc --noEmit`
Expected: без ошибок про `blogCollection` (там, где он ещё используется в blogs-репозиториях — это ожидаемо, их чиним в Task 2-3).

- [ ] **Step 3: Commit**

```bash
git add src/db/mongo.db.ts
git commit -m "fix: restore native driver collections for non-migrated features, pin mongoose dbName"
```

---

### Task 2: Domain-класс `BlogEntity` + Mongoose-схема + модель

**Files:**
- Modify: `src/features/blogs/domain/blog_entity.ts` (уже существует как заглушка `// place for schema loadClass()` — сейчас заполняем)

**Interfaces:**
- Consumes: `BlogInputDto` из `src/features/blogs/application/queries/dto/input-dto/blog_input_dto.ts` (`{ name, description, websiteUrl }`).
- Produces: `BlogEntity` (класс с полями `name, description, websiteUrl, createdAt, isMembership` и методами `static createBlog(dto): BlogEntity`, `updateBlog(dto): void`), `BlogDocument` (тип `HydratedDocument<BlogEntity>`), `BlogModel` (Mongoose `Model<BlogEntity>`, коллекция `"blogs"` внутри базы `blogger`).

- [ ] **Step 1: Написать схему и модель поверх домен-класса**

```ts
import { HydratedDocument, Model, model, Schema } from "mongoose";
import { BlogInputDto } from "../application/queries/dto/input-dto/blog_input_dto";

export class BlogEntity {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  // Creation defaults live here, not in the service — the service just
  // forwards the input DTO to the repository.
  static createBlog(dto: BlogInputDto): BlogEntity {
    const blog = new BlogEntity();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.createdAt = new Date().toISOString();
    blog.isMembership = false;
    return blog;
  }

  updateBlog(dto: BlogInputDto): void {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }
}

export const BlogSchema = new Schema<BlogEntity>({
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
BlogSchema.loadClass(BlogEntity);

export type BlogDocument = HydratedDocument<BlogEntity>;

export const BlogModel: Model<BlogEntity> = model<BlogEntity>(
  "Blog",
  BlogSchema,
);
```

- [ ] **Step 2: Проверить типы**

Run: `npx tsc --noEmit`
Expected: без новых ошибок в `src/features/blogs/domain/blog_entity.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/features/blogs/domain/blog_entity.ts
git commit -m "feat: add Mongoose schema, model and domain class for Blog"
```

---

### Task 3: Переписать `BlogsRepository` (запись) на `BlogModel`

**Files:**
- Modify: `src/features/blogs/repositories/blogs.mongodb.repositories.ts`

**Interfaces:**
- Consumes: `BlogEntity`, `BlogModel` из Task 2.
- Produces: тот же публичный контракт, что и раньше — `createBlog(dto: BlogInputDto): Promise<string>`, `updateBlog(dto, id): Promise<void | null>`, `deleteBlog(id): Promise<boolean>`. Сигнатура `createBlog` теперь принимает `BlogInputDto` вместо уже собранного `blogCreateDto` — это меняет и Task 5 (сервис).

- [ ] **Step 1: Заменить содержимое файла**

```ts
import { BlogInputDto } from "../application/queries/dto/input-dto/blog_input_dto";
import { BlogEntity, BlogModel } from "../domain/blog_entity";
import { injectable } from "inversify";

@injectable()
export class BlogsRepository {
  async createBlog(inputBlog: BlogInputDto): Promise<string> {
    const blog = BlogEntity.createBlog(inputBlog);
    const created = await BlogModel.create(blog);
    return created._id.toString();
  }

  async updateBlog(dto: BlogInputDto, id: string): Promise<void | null> {
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return null;
    }
    blog.updateBlog(dto);
    await blog.save();
    return;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await BlogModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
```

- [ ] **Step 2: Прогнать e2e-тесты blogs (пока упадут на чтении — это ожидаемо, чиним в Task 4)**

Run: `npx jest __tests__/blogs.e2e.test.ts`
Expected: `Should create a blog` и `Should delete blog by id` — есть шанс что пройдут; `Should get all blogs` / `Should get a blog by id` / `Should update blog with valid id` ещё упадут, потому что `BlogsQueryRepository` и `blogs-services.ts` не обновлены.

- [ ] **Step 3: Commit**

```bash
git add src/features/blogs/repositories/blogs.mongodb.repositories.ts
git commit -m "refactor: rewrite BlogsRepository on top of Mongoose BlogModel"
```

---

### Task 4: Переписать `BlogsQueryRepository` (чтение) и `mapBlogs`

**Files:**
- Modify: `src/features/blogs/repositories/blogs.query-mongodb.repositories.ts`
- Modify: `src/features/blogs/mappers/mapper-blogs-output.ts`

**Interfaces:**
- Consumes: `BlogEntity`, `BlogDocument`, `BlogModel` из Task 2.
- Produces: тот же контракт — `findAll(query): Promise<OutputDtoBlogs>`, `findByObjectId(id): Promise<BlogView | null>`; `mapBlogs(doc: BlogDocument): BlogView`.

- [ ] **Step 1: Обновить mapper под Mongoose-документ**

```ts
import { BlogView } from "../application/queries/dto/output-dto/blog-view";
import { BlogDocument } from "../domain/blog_entity";

export function mapBlogs(blog: BlogDocument): BlogView {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
}
```

- [ ] **Step 2: Переписать query-репозиторий**

```ts
import { FilterQuery } from "mongoose";
import { PaginationAndSortingReq } from "../../../core/types/pagination-and-sorting-req";
import { BlogView } from "../application/queries/dto/output-dto/blog-view";
import { mapBlogs } from "../mappers/mapper-blogs-output";
import { mapperOutput } from "../../../core/mappers/mapper-output";
import { OutputDtoBlogs } from "../application/queries/dto/output-dto/output-dto-blogs";
import { BlogEntity, BlogModel } from "../domain/blog_entity";
import { injectable } from "inversify";

@injectable()
export class BlogsQueryRepository {
  async findAll(query: PaginationAndSortingReq): Promise<OutputDtoBlogs> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query;
    const skip: number = (pageNumber - 1) * pageSize;
    const filter: FilterQuery<BlogEntity> = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }

    const items = await BlogModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await BlogModel.countDocuments(filter);

    const mappedItems: BlogView[] = items.map((item) => mapBlogs(item));

    return mapperOutput(mappedItems, {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
    });
  }

  async findByObjectId(id: string): Promise<BlogView | null> {
    const blog = await BlogModel.findById(id);
    if (!blog) return null;
    return mapBlogs(blog);
  }
}
```

Примечание: старый код оборачивал единственное условие поиска в `filter.$or = [...]` — это было избыточно (`$or` с одним элементом равносилен самому элементу), поэтому здесь фильтр по имени задаётся напрямую.

- [ ] **Step 3: Прогнать e2e-тесты blogs**

Run: `npx jest __tests__/blogs.e2e.test.ts`
Expected: `Should get all blogs`, `Should get a blog by id` — PASS. `Should update blog with valid id` ещё может падать, если `blogs-services.ts` не обновлён (Task 5).

- [ ] **Step 4: Commit**

```bash
git add src/features/blogs/repositories/blogs.query-mongodb.repositories.ts src/features/blogs/mappers/mapper-blogs-output.ts
git commit -m "refactor: rewrite BlogsQueryRepository and mapBlogs on top of Mongoose"
```

---

### Task 5: Упростить `BlogsService.createBlog`

**Files:**
- Modify: `src/features/blogs/application/command-services/blogs-services.ts:11-18`

**Interfaces:**
- Consumes: `BlogsRepository.createBlog(dto: BlogInputDto)` — сигнатура поменялась в Task 3 (раньше принимала уже собранный объект).

- [ ] **Step 1: Убрать сборку `createdAt`/`isMembership` из сервиса — это теперь дело `BlogEntity.createBlog`**

```ts
async createBlog(inputBlog: BlogInputDto): Promise<string | null> {
  return await this.blogsRepository.createBlog(inputBlog);
}
```

- [ ] **Step 2: Прогнать полный e2e-набор по blogs**

Run: `npx jest __tests__/blogs.e2e.test.ts`
Expected: все 7 тестов PASS.

- [ ] **Step 3: Commit**

```bash
git add src/features/blogs/application/command-services/blogs-services.ts
git commit -m "refactor: move blog creation defaults into BlogEntity, simplify BlogsService"
```

---

### Task 6: Перевести очистку блогов в `testing.router.ts` на Mongoose

**Files:**
- Modify: `src/testing/routers/testing.router.ts`

**Interfaces:**
- Consumes: `BlogModel` из `src/features/blogs/domain/blog_entity.ts`.

- [ ] **Step 1: Заменить строку очистки блогов**

Было:
```ts
import { client } from "../../db/mongo.db";
import { BlogView } from "../../features/blogs/application/queries/dto/output-dto/blog-view";
...
await client.db("blogger").collection<BlogView>("blogs").deleteMany({});
```

Стало (остальные `client.db("blogger")...` строки для posts/users/comments/devices/rateLimit не трогаем — они всё ещё на нативном драйвере):
```ts
import { client } from "../../db/mongo.db";
import { PostView } from "../../features/posts/application/queries/dto/output-dto/posts-view";
import { UserView } from "../../features/users/application/queries/dto/output-dto/user-view";
import { CommentCreateDto } from "../../features/comments/application/command-service/dto/comment-create-dto";
import { DeviceDTO } from "../../features/security/application/dto/device-dto";
import { BlogModel } from "../../features/blogs/domain/blog_entity";
...
testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await BlogModel.deleteMany({});
  await client.db("blogger").collection<PostView>("posts").deleteMany({});
  await client.db("blogger").collection<UserView>("users").deleteMany({});
  await client
    .db("blogger")
    .collection<CommentCreateDto>("comments")
    .deleteMany({});
  await client.db("blogger").collection<DeviceDTO>("devices").deleteMany({});
  await client
    .db("blogger")
    .collection<{ ip: string; url: string; date: Date }>("rateLimit")
    .deleteMany({});
  res.sendStatus(HttpStatuses.NO_CONTENT_204);
});
```

(Убираем неиспользуемый импорт `BlogView` из этого файла — он был нужен только для `.collection<BlogView>("blogs")`.)

- [ ] **Step 2: Прогнать весь набор тестов**

Run: `npx jest`
Expected: `8 passed, 8 total` — как и было до миграции, но blogs теперь целиком на Mongoose.

- [ ] **Step 3: Commit**

```bash
git add src/testing/routers/testing.router.ts
git commit -m "refactor: clean up blogs collection via Mongoose in testing router"
```

---

## Self-Review

**1. Спека покрыта:** DB-подключение (Task 1) → схема/модель/домен-класс (Task 2) → запись (Task 3) → чтение (Task 4) → сервис (Task 5) → тестовая очистка (Task 6) → полный regression run. Больше в фиче blogs нативный драйвер нигде не используется — я перепроверил все места импорта `blogCollection` (`blogs.mongodb.repositories.ts`, `blogs.query-mongodb.repositories.ts`) и `mapBlogs`/`blogCreateDto` — все они переписаны.

**2. Плейсхолдеры:** не встретил — каждый шаг содержит финальный код файла целиком, не фрагмент "допиши сам".

**3. Согласованность типов:** `BlogInputDto` → `BlogEntity.createBlog` → `BlogModel.create` → `BlogDocument`/`mapBlogs` — имена и сигнатуры не расходятся между тасками.

---

## Что дальше (повторение — сюда план сознательно не лезет)

Как только `npx jest` зелёный на этом плане — у вас есть рабочий рецепт из 6 шагов. Дальше он **буквально повторяется** для каждой следующей сущности:

1. Posts (домен-класс `PostEntity`, `PostModel`, репозитории, сервис) — заодно уйдёт последняя нативная коллекция `postsCollection`.
2. Comments (`CommentEntity`, `CommentModel`).
3. Users (`UserEntity`, `UserModel`) — тут появится первый нюанс: пароль/хэш, но сама механика identична.
4. Security/devices (`DeviceEntity`, `DeviceModel`).
5. Auth/refresh-tokens (`RefreshTokenEntity`, `RefreshTokenModel`) и rate-limit коллекция.
6. Финальный шаг всей миграции: как только `blogCollection` окажется единственной оставшейся зависимостью от `client` — можно убрать `MongoClient` и весь код из `mongo.db.ts` целиком, оставив только `mongoose.connect()`.

Каждый следующий раз держите этот файл открытым как образец — задача специально сделана "избыточно подробной", чтобы паттерн улёгся в память через повторение, как вы и просили.
