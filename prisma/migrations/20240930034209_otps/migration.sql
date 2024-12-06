-- CreateTable
CREATE TABLE "article_tags" (
    "article_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    PRIMARY KEY ("article_id", "tag_id"),
    CONSTRAINT "article_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "article_tags_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "article_views" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "article_id" INTEGER NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    CONSTRAINT "article_views_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "articles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER,
    "image" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "published_at" DATETIME,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    CONSTRAINT "articles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "articles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "cache" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "expiration" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "cache_locks" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "expiration" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "failed_jobs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "connection" TEXT NOT NULL,
    "queue" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "exception" TEXT NOT NULL,
    "failed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "job_batches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "total_jobs" INTEGER NOT NULL,
    "pending_jobs" INTEGER NOT NULL,
    "failed_jobs" INTEGER NOT NULL,
    "failed_job_ids" TEXT NOT NULL,
    "options" TEXT,
    "cancelled_at" INTEGER,
    "created_at" INTEGER NOT NULL,
    "finished_at" INTEGER
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "queue" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL,
    "reserved_at" INTEGER,
    "available_at" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "article_id" INTEGER NOT NULL,
    "file_path" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    CONSTRAINT "media_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "migration" TEXT NOT NULL,
    "batch" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "model_has_permissions" (
    "permission_id" INTEGER NOT NULL,
    "model_type" TEXT NOT NULL,
    "model_id" INTEGER NOT NULL,

    PRIMARY KEY ("permission_id", "model_id", "model_type"),
    CONSTRAINT "model_has_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "model_has_roles" (
    "role_id" INTEGER NOT NULL,
    "model_type" TEXT NOT NULL,
    "model_id" INTEGER NOT NULL,

    PRIMARY KEY ("role_id", "model_id", "model_type"),
    CONSTRAINT "model_has_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "created_at" DATETIME
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "guard_name" TEXT NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "role_has_permissions" (
    "permission_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    PRIMARY KEY ("permission_id", "role_id"),
    CONSTRAINT "role_has_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "role_has_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "guard_name" TEXT NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" INTEGER,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "payload" TEXT NOT NULL,
    "last_activity" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified_at" DATETIME,
    "password" TEXT NOT NULL,
    "remember_token" TEXT,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "user_accounts" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified_at" DATETIME,
    "phone" TEXT,
    "nik" TEXT,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "remember_token" TEXT,
    "created_at" DATETIME,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "otps" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    CONSTRAINT "otps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_accounts" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_unique" ON "articles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_unique" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" ON "failed_jobs"("uuid");

-- CreateIndex
CREATE INDEX "jobs_queue_index" ON "jobs"("queue");

-- CreateIndex
CREATE INDEX "model_has_permissions_model_id_model_type_index" ON "model_has_permissions"("model_id", "model_type");

-- CreateIndex
CREATE INDEX "model_has_roles_model_id_model_type_index" ON "model_has_roles"("model_id", "model_type");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_guard_name_unique" ON "permissions"("name", "guard_name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_guard_name_unique" ON "roles"("name", "guard_name");

-- CreateIndex
CREATE INDEX "sessions_last_activity_index" ON "sessions"("last_activity");

-- CreateIndex
CREATE INDEX "sessions_user_id_index" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_unique" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_email_unique" ON "user_accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_nik_unique" ON "user_accounts"("nik");
