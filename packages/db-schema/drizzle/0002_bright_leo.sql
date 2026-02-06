-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_key" UNIQUE("username"),
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"category_id" integer,
	"description" text,
	"duration_minutes" integer,
	"bpm" integer,
	"mp3_url" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "exercises_name_key" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
*/
