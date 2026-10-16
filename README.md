# AIGC 传媒提案系统

内部 Web 系统。产品规则见 [docs/planning/README.md](docs/planning/README.md)。

当前仓库是基础框架：Next.js 页面、健康检查、配置读取、Prisma 空 schema、Docker Compose 和 Nginx 示例。登录、提案编辑、豆包调用、报价和任务还没有实现。

## 环境

已确认的规划使用 Node.js 24 LTS。本框架在当前环境的 Node.js 22 上安装、构建并通过测试，`package.json` 要求 Node.js 22 或更高。

复制环境变量示例后再填写本地值：

```bash
cp .env.example .env
```

`.env` 已从 Git 忽略。不要把真实密钥写进仓库。`.env.example` 里的密钥和上传上限保持为空。

## 安装

```bash
npm install
```

## 启动

```bash
npm run dev
```

开发服务器默认在 http://localhost:3000 。健康检查在 http://localhost:3000/api/health 。

队列进程目前只检查配置，不连接外部服务：

```bash
npm run worker
```

依赖服务的定义在 `docker-compose.yml`。当前这台机器没有 Docker，因此这里没有启动容器。有 Docker 后可以执行：

```bash
docker compose up
```

Nginx 示例监听 8080，并把请求转到 web。仓库里没有 TLS 证书。`UPLOAD_MAX_BYTES` 未配置时，Nginx 把请求体上限设为 1 字节，用来拒绝上传，这不是业务上的文件大小规则。

## 检查与测试

```bash
npm run lint
npm run typecheck
npm run test
npm run format:check
```

`format:check` 不改写 `docs/planning/`。那些文档保持已确认的表述，不按表格宽度重排。

`.gitignore` 忽略 `.env` 和 `.env.*`，只保留 `.env.example`。不要把真实密钥写进 Compose 以外的文件。`docker-compose.yml` 里的 `proposal` 和 `minio-local-only` 只用于本机容器，不是生产口令。

## 构建

```bash
npm run build
npm run start
```

`npm run db:generate` 会生成 Prisma Client。schema 里还没有业务表，生成前需要在 `.env` 中提供 `DATABASE_URL`。
