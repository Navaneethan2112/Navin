import { type User, type InsertUser, type Contact, type InsertContact, type Campaign, type InsertCampaign, type Template, type InsertTemplate, type WhatsAppTemplate, type InsertWhatsAppTemplate, users, contacts, campaigns, templates, whatsappTemplates } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByAuth0Id(auth0Id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  getCampaignsByUserId(userId: string): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  
  getTemplatesByUserId(userId: string): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // WhatsApp Templates - user-specific
  getWhatsAppTemplatesByUserId(userId: string): Promise<WhatsAppTemplate[]>;
  createWhatsAppTemplate(template: InsertWhatsAppTemplate): Promise<WhatsAppTemplate>;
  updateWhatsAppTemplate(id: string, updates: Partial<WhatsAppTemplate>): Promise<WhatsAppTemplate | undefined>;
  getWhatsAppTemplate(id: string): Promise<WhatsAppTemplate | undefined>;
  
  getDashboardStats(userId: string): Promise<{
    messagesSent: number;
    responseRate: string;
    activeContacts: number;
    conversionRate: string;
  }>;
}

// PostgreSQL Database Storage Implementation - replaces MemStorage for persistent data
export class DatabaseStorage implements IStorage {
  constructor() {
    // Database connection handled by db.ts
    // No need to initialize demo data - stored in PostgreSQL
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByAuth0Id(auth0Id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.auth0Id, auth0Id));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return db.select().from(contacts);
  }

  async getCampaignsByUserId(userId: string): Promise<Campaign[]> {
    return db.select().from(campaigns).where(eq(campaigns.userId, userId));
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db.insert(campaigns).values(insertCampaign).returning();
    return campaign;
  }

  async getTemplatesByUserId(userId: string): Promise<Template[]> {
    return db.select().from(templates).where(eq(templates.userId, userId));
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const [template] = await db.insert(templates).values(insertTemplate).returning();
    return template;
  }

  async getDashboardStats(userId: string): Promise<{
    messagesSent: number;
    responseRate: string;
    activeContacts: number;
    conversionRate: string;
  }> {
    // Return demo stats
    return {
      messagesSent: 12458,
      responseRate: '68.5%',
      activeContacts: 8924,
      conversionRate: '24.8%',
    };
  }

  // WhatsApp Template Methods
  async getWhatsAppTemplatesByUserId(userId: string): Promise<WhatsAppTemplate[]> {
    return db.select().from(whatsappTemplates).where(eq(whatsappTemplates.userId, userId));
  }

  async createWhatsAppTemplate(insertTemplate: InsertWhatsAppTemplate): Promise<WhatsAppTemplate> {
    const [template] = await db.insert(whatsappTemplates).values(insertTemplate).returning();
    return template;
  }

  async updateWhatsAppTemplate(id: string, updates: Partial<WhatsAppTemplate>): Promise<WhatsAppTemplate | undefined> {
    const [template] = await db
      .update(whatsappTemplates)
      .set({ ...updates, lastStatusCheck: new Date() })
      .where(eq(whatsappTemplates.id, id))
      .returning();
    return template || undefined;
  }

  async getWhatsAppTemplate(id: string): Promise<WhatsAppTemplate | undefined> {
    const [template] = await db.select().from(whatsappTemplates).where(eq(whatsappTemplates.id, id));
    return template || undefined;
  }
}

export const storage = new DatabaseStorage();
