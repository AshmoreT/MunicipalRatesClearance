import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referenceNumber: text("reference_number").notNull().unique(),
  
  // Personal Information
  fullName: text("full_name").notNull(),
  idNumber: text("id_number").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email"),
  
  // Property Information
  propertyAddress: text("property_address").notNull(),
  standNumber: text("stand_number").notNull(),
  propertyType: text("property_type").notNull(), // residential, commercial, industrial
  reason: text("reason").notNull(),
  documents: text("documents").array().default(sql`ARRAY[]::text[]`), // <-- Added
  uploadedDocuments: text("uploaded_documents").array().default(sql`ARRAY[]::text[]`), // <-- Added
  // Application Status
  status: text("status").notNull().default("submitted"), // submitted, under_review, approved, rejected
  
  // Timestamps
  submittedDate: timestamp("submitted_date").notNull().defaultNow(),
  reviewDate: timestamp("review_date"),
  completedDate: timestamp("completed_date"),
  
  // Admin notes
  adminNotes: text("admin_notes"),
  reviewedBy: text("reviewed_by"),
});

export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(applications).pick({
  fullName: true,
  idNumber: true,
  phoneNumber: true,
  email: true,
  propertyAddress: true,
  standNumber: true,
  propertyType: true,
  reason: true,
  documents: true, // <-- Added
  uploadedDocuments: true, // <-- Added
});

export const insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true,
  fullName: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;
