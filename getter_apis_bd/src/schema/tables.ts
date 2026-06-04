import {
  pgTable,
  serial,
  varchar,
  doublePrecision,
  text,
  timestamp,
  integer,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  countryCode: varchar('country_code', { length: 2 }).notNull(),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  timezone: varchar('timezone', { length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('cities_name_country_idx').on(table.name, table.countryCode),
  index('cities_name_idx').on(table.name),
]);

export const cityWeather = pgTable('city_weather', {
  id: serial('id').primaryKey(),
  cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
  temperature: doublePrecision('temperature').notNull(),
  description: varchar('description', { length: 200 }).notNull(),
  humidity: integer('humidity').notNull(),
  windSpeed: doublePrecision('wind_speed').notNull(),
  fetchedAt: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('city_weather_city_id_idx').on(table.cityId),
  index('city_weather_fetched_at_idx').on(table.fetchedAt),
]);

export const cityNews = pgTable('city_news', {
  id: serial('id').primaryKey(),
  cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }).notNull(),
  url: text('url').notNull(),
  source: varchar('source', { length: 200 }).notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }).notNull(),
  fetchedAt: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('city_news_city_id_idx').on(table.cityId),
  index('city_news_fetched_at_idx').on(table.fetchedAt),
]);