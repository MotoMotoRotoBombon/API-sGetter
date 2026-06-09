CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"country_code" varchar(2) NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"timezone" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "city_news" (
	"id" serial PRIMARY KEY NOT NULL,
	"city_id" integer NOT NULL,
	"title" varchar(500) NOT NULL,
	"url" text NOT NULL,
	"source" varchar(200) NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "city_weather" (
	"id" serial PRIMARY KEY NOT NULL,
	"city_id" integer NOT NULL,
	"temperature" double precision NOT NULL,
	"description" varchar(200) NOT NULL,
	"humidity" integer NOT NULL,
	"wind_speed" double precision NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "city_news" ADD CONSTRAINT "city_news_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "city_weather" ADD CONSTRAINT "city_weather_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cities_name_country_idx" ON "cities" USING btree ("name","country_code");--> statement-breakpoint
CREATE INDEX "cities_name_idx" ON "cities" USING btree ("name");--> statement-breakpoint
CREATE INDEX "city_news_city_id_idx" ON "city_news" USING btree ("city_id");--> statement-breakpoint
CREATE INDEX "city_news_fetched_at_idx" ON "city_news" USING btree ("fetched_at");--> statement-breakpoint
CREATE INDEX "city_weather_city_id_idx" ON "city_weather" USING btree ("city_id");--> statement-breakpoint
CREATE INDEX "city_weather_fetched_at_idx" ON "city_weather" USING btree ("fetched_at");