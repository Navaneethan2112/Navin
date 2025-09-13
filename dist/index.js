var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  campaigns: () => campaigns,
  contacts: () => contacts,
  insertCampaignSchema: () => insertCampaignSchema,
  insertContactSchema: () => insertContactSchema,
  insertTemplateSchema: () => insertTemplateSchema,
  insertUserSchema: () => insertUserSchema,
  insertWhatsAppTemplateSchema: () => insertWhatsAppTemplateSchema,
  templates: () => templates,
  users: () => users,
  whatsappTemplates: () => whatsappTemplates
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  auth0Id: text("auth0_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  plan: text("plan").notNull().default("starter"),
  // Twilio Account Details (encrypted in production)
  twilioAccountSid: text("twilio_account_sid"),
  twilioAuthToken: text("twilio_auth_token"),
  twilioPhoneNumber: text("twilio_phone_number"),
  // Account Status  
  isActive: boolean("is_active").notNull().default(true),
  twilioVerified: boolean("twilio_verified").notNull().default(false),
  // Usage Tracking
  messagesUsed: integer("messages_used").notNull().default(0),
  messagesLimit: integer("messages_limit").notNull().default(1e3),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  status: text("status").notNull().default("draft"),
  messagesSent: integer("messages_sent").notNull().default(0),
  responseRate: text("response_rate").notNull().default("0%"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var whatsappTemplates = pgTable("whatsapp_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Template Details
  name: text("name").notNull(),
  category: text("category").notNull().default("MARKETING"),
  // MARKETING, UTILITY, AUTHENTICATION
  language: text("language").notNull().default("en"),
  body: text("body").notNull(),
  variables: text("variables"),
  // JSON string of variable names
  // Approval Status
  status: text("status").notNull().default("PENDING"),
  // PENDING, APPROVED, REJECTED
  rejectionReason: text("rejection_reason"),
  metaTemplateId: text("meta_template_id"),
  // ID from Meta when approved
  // Tracking
  createdAt: timestamp("created_at").notNull().defaultNow(),
  approvedAt: timestamp("approved_at"),
  lastStatusCheck: timestamp("last_status_check")
});
var templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true
});
var insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true
});
var insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true
});
var insertWhatsAppTemplateSchema = createInsertSchema(whatsappTemplates).omit({
  id: true,
  createdAt: true,
  approvedAt: true,
  lastStatusCheck: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  constructor() {
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByAuth0Id(auth0Id) {
    const [user] = await db.select().from(users).where(eq(users.auth0Id, auth0Id));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, updates) {
    const [user] = await db.update(users).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
    return user || void 0;
  }
  async createContact(insertContact) {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }
  async getContacts() {
    return db.select().from(contacts);
  }
  async getCampaignsByUserId(userId) {
    return db.select().from(campaigns).where(eq(campaigns.userId, userId));
  }
  async createCampaign(insertCampaign) {
    const [campaign] = await db.insert(campaigns).values(insertCampaign).returning();
    return campaign;
  }
  async getTemplatesByUserId(userId) {
    return db.select().from(templates).where(eq(templates.userId, userId));
  }
  async createTemplate(insertTemplate) {
    const [template] = await db.insert(templates).values(insertTemplate).returning();
    return template;
  }
  async getDashboardStats(userId) {
    return {
      messagesSent: 12458,
      responseRate: "68.5%",
      activeContacts: 8924,
      conversionRate: "24.8%"
    };
  }
  // WhatsApp Template Methods
  async getWhatsAppTemplatesByUserId(userId) {
    return db.select().from(whatsappTemplates).where(eq(whatsappTemplates.userId, userId));
  }
  async createWhatsAppTemplate(insertTemplate) {
    const [template] = await db.insert(whatsappTemplates).values(insertTemplate).returning();
    return template;
  }
  async updateWhatsAppTemplate(id, updates) {
    const [template] = await db.update(whatsappTemplates).set({ ...updates, lastStatusCheck: /* @__PURE__ */ new Date() }).where(eq(whatsappTemplates.id, id)).returning();
    return template || void 0;
  }
  async getWhatsAppTemplate(id) {
    const [template] = await db.select().from(whatsappTemplates).where(eq(whatsappTemplates.id, id));
    return template || void 0;
  }
};
var storage = new DatabaseStorage();

// server/whatsapp.ts
import twilio from "twilio";
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var twilioWhatsAppNumber = process.env.TWILIO_PHONE_NUMBER;
var client = null;
var credentialsError = null;
try {
  if (!accountSid || !authToken || !twilioWhatsAppNumber) {
    credentialsError = "Missing Twilio credentials: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER are required";
  } else {
    client = twilio(accountSid, authToken);
  }
} catch (error) {
  credentialsError = `Failed to initialize Twilio client: ${error instanceof Error ? error.message : "Unknown error"}`;
}
var approvedTemplates = [
  {
    id: "1",
    name: "welcome_series",
    category: "MARKETING",
    language: "en",
    body: "\u{1F389} Welcome to AaraConnect!\n\nStart growing your business with professional WhatsApp messaging:\n\u2705 Send bulk campaigns\n\u2705 Set up AI chatbots\n\u2705 Track analytics\n\nReady to get started? Visit your dashboard: {{1}}\n\nReply STOP to opt out anytime.",
    variables: ["dashboard_url"],
    status: "APPROVED",
    createdAt: /* @__PURE__ */ new Date()
  },
  {
    id: "2",
    name: "feature_announcement",
    category: "MARKETING",
    language: "en",
    body: "\u{1F4E2} New Feature Alert!\n\nAaraConnect now supports {{1}}!\n\nThis helps you:\n\u2022 {{2}}\n\u2022 {{3}}\n\u2022 Improve customer engagement\n\nCheck it out in your dashboard today.\n\nQuestions? Reply to this message.",
    variables: ["feature_name", "benefit_1", "benefit_2"],
    status: "APPROVED",
    createdAt: /* @__PURE__ */ new Date()
  },
  {
    id: "3",
    name: "marketing_tips",
    category: "MARKETING",
    language: "en",
    body: "\u{1F4A1} WhatsApp Marketing Tip #{{1}}\n\n{{2}}\n\nThis strategy helped our clients increase response rates by {{3}}%.\n\nWant to learn more tips? Visit: {{4}}\n\nReply TIPS for more marketing insights.",
    variables: ["tip_number", "tip_content", "percentage", "learn_more_url"],
    status: "APPROVED",
    createdAt: /* @__PURE__ */ new Date()
  },
  {
    id: "4",
    name: "success_story",
    category: "MARKETING",
    language: "en",
    body: `\u{1F31F} Success Story

"{{1}}" - {{2}}, {{3}}

See how AaraConnect helped them achieve:
\u2022 {{4}} more customer responses
\u2022 {{5}} time savings
\u2022 Better customer satisfaction

Ready for similar results? Let's chat!`,
    variables: ["testimonial", "customer_name", "company_name", "response_increase", "time_savings"],
    status: "APPROVED",
    createdAt: /* @__PURE__ */ new Date()
  },
  {
    id: "5",
    name: "limited_offer",
    category: "MARKETING",
    language: "en",
    body: "\u23F0 Limited Time: {{1}} Days Left\n\nGet {{2}}% off your AaraConnect upgrade!\n\n\u2705 Unlock advanced features\n\u2705 Send more messages\n\u2705 Priority support\n\nUse code: {{3}}\nExpires: {{4}}\n\nUpgrade now: {{5}}",
    variables: ["days_left", "discount_percentage", "promo_code", "expiry_date", "upgrade_url"],
    status: "APPROVED",
    createdAt: /* @__PURE__ */ new Date()
  }
];
function formatWhatsAppNumber(phoneNumber) {
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  if (cleanNumber.startsWith("1") && cleanNumber.length === 11) {
    return `+${cleanNumber}`;
  } else if (cleanNumber.length >= 10) {
    return cleanNumber.startsWith("+") ? cleanNumber : `+${cleanNumber}`;
  } else {
    throw new Error(`Invalid phone number format: ${phoneNumber}. Please use international format with country code.`);
  }
}
function validatePhoneNumber(phoneNumber) {
  try {
    const formatted = formatWhatsAppNumber(phoneNumber);
    return formatted.length >= 11 && formatted.length <= 15;
  } catch {
    return false;
  }
}
var WhatsAppService = class _WhatsAppService {
  defaultClient;
  credentialsError;
  constructor() {
    this.defaultClient = client;
    this.credentialsError = credentialsError;
  }
  // Create client for specific user credentials
  createUserClient(credentials) {
    try {
      return twilio(credentials.accountSid, credentials.authToken);
    } catch (error) {
      throw new Error(`Failed to create Twilio client: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  // Verify user's Twilio credentials
  async verifyUserCredentials(credentials) {
    try {
      const userClient = this.createUserClient(credentials);
      await userClient.api.v2010.accounts(credentials.accountSid).fetch();
      const incomingPhoneNumbers = await userClient.incomingPhoneNumbers.list({
        phoneNumber: credentials.phoneNumber.replace("whatsapp:", "").replace("+", "")
      });
      return incomingPhoneNumbers.length > 0;
    } catch (error) {
      console.error("Failed to verify user Twilio credentials:", error);
      return false;
    }
  }
  ensureClient() {
    if (this.credentialsError) {
      throw new Error(this.credentialsError);
    }
    if (!this.defaultClient) {
      throw new Error("Twilio client not initialized");
    }
    return this.defaultClient;
  }
  // Send message using user's own credentials
  async sendMessage(message, userCredentials) {
    const client2 = this.createUserClient(userCredentials);
    try {
      const formattedPhoneNumber = formatWhatsAppNumber(message.to);
      if (!validatePhoneNumber(formattedPhoneNumber)) {
        throw new Error(`Invalid phone number: ${message.to}`);
      }
      const twilioMessage = await client2.messages.create({
        from: `whatsapp:${userCredentials.phoneNumber}`,
        to: `whatsapp:${formattedPhoneNumber}`,
        body: message.body,
        ...message.mediaUrl && { mediaUrl: [message.mediaUrl] }
      });
      console.log(`WhatsApp message sent successfully to ${formattedPhoneNumber}: ${twilioMessage.sid}`);
      return twilioMessage.sid;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to send WhatsApp message:", {
        to: message.to,
        error: errorMessage
      });
      throw new Error(`Failed to send WhatsApp message to ${message.to}: ${errorMessage}`);
    }
  }
  async sendTemplateMessage(to, templateName, variables = [], userCredentials) {
    const template = approvedTemplates.find((t) => t.name === templateName);
    if (!template) {
      const availableTemplates = approvedTemplates.map((t) => t.name).join(", ");
      throw new Error(`Template '${templateName}' not found. Available templates: ${availableTemplates}`);
    }
    let body = template.body;
    variables.forEach((variable, index) => {
      const placeholder = `{{${index + 1}}}`;
      body = body.replace(new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"), variable);
    });
    const unreplacedVariables = body.match(/\{\{\d+\}\}/g);
    if (unreplacedVariables) {
      console.warn(`Template '${templateName}' has unreplaced variables: ${unreplacedVariables.join(", ")}`);
    }
    return this.sendMessage({ to, body }, userCredentials);
  }
  async sendBulkMessages(phoneNumbers, templateName, variables = [], userCredentials) {
    if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      throw new Error("Phone numbers array is required and must not be empty");
    }
    const results = {
      success: [],
      failed: []
    };
    console.log(`Starting bulk message send to ${phoneNumbers.length} recipients using template '${templateName}'`);
    for (let i = 0; i < phoneNumbers.length; i++) {
      const phoneNumber = phoneNumbers[i];
      try {
        if (!validatePhoneNumber(phoneNumber)) {
          throw new Error(`Invalid phone number format: ${phoneNumber}`);
        }
        await this.sendTemplateMessage(phoneNumber, templateName, variables, userCredentials);
        results.success.push(phoneNumber);
        console.log(`Bulk message ${i + 1}/${phoneNumbers.length} sent successfully to ${phoneNumber}`);
        if (i < phoneNumbers.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1e3));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Failed to send bulk message ${i + 1}/${phoneNumbers.length} to ${phoneNumber}:`, errorMessage);
        results.failed.push({
          phone: phoneNumber,
          error: errorMessage
        });
      }
    }
    const summary = `Bulk message send completed. Success: ${results.success.length}, Failed: ${results.failed.length}`;
    console.log(summary);
    return {
      success: results.success,
      failed: results.failed
    };
  }
  getAvailableTemplates() {
    return approvedTemplates;
  }
  getTemplate(templateName) {
    return approvedTemplates.find((t) => t.name === templateName);
  }
  // Check if service is configured
  isConfigured() {
    return this.defaultClient !== null && this.credentialsError === null;
  }
  // Get configuration status
  getStatus() {
    return {
      configured: this.isConfigured(),
      error: this.credentialsError || void 0
    };
  }
  // Handle incoming WhatsApp webhooks
  static processIncomingMessage(body) {
    if (!body) {
      throw new Error("Webhook body is required");
    }
    const from = body.From?.replace("whatsapp:", "") || "";
    const to = body.To?.replace("whatsapp:", "") || "";
    const messageBody = body.Body || "";
    const messageId = body.MessageSid || "";
    if (!from || !messageId) {
      throw new Error("Invalid webhook payload: missing required fields");
    }
    return {
      from,
      to,
      body: messageBody,
      messageId,
      timestamp: /* @__PURE__ */ new Date(),
      mediaUrl: body.MediaUrl0 || null,
      mediaType: body.MediaContentType0 || null
    };
  }
  // Get template by name with validation
  static getTemplateByName(templateName) {
    return approvedTemplates.find((t) => t.name === templateName) || null;
  }
  // Get all template names
  static getTemplateNames() {
    return approvedTemplates.map((t) => t.name);
  }
  // Preview template with variables replaced
  static previewTemplate(templateName, variables = []) {
    const template = _WhatsAppService.getTemplateByName(templateName);
    if (!template) {
      return null;
    }
    let body = template.body;
    variables.forEach((variable, index) => {
      const placeholder = `{{${index + 1}}}`;
      body = body.replace(new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"), variable);
    });
    return body;
  }
};
var whatsAppService = new WhatsAppService();

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse({
        ...req.body,
        userId: req.body.userId || "anonymous"
        // Allow anonymous submissions
      });
      const contact = await storage.createContact(validatedData);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/contacts", async (req, res) => {
    try {
      const contacts2 = await storage.getContacts();
      res.json(contacts2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/users/:auth0Id", async (req, res) => {
    try {
      const user = await storage.getUserByAuth0Id(req.params.auth0Id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats("demo-user");
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns2 = await storage.getCampaignsByUserId("demo-user");
      res.json(campaigns2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/templates", async (req, res) => {
    try {
      const templates2 = await storage.getTemplatesByUserId("demo-user");
      res.json(templates2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/whatsapp-templates", async (req, res) => {
    try {
      const templates2 = await storage.getWhatsAppTemplatesByUserId("demo-user");
      res.json(templates2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/whatsapp-templates", async (req, res) => {
    try {
      const validatedData = insertWhatsAppTemplateSchema.parse({
        ...req.body,
        userId: req.body.userId || "demo-user"
        // In production, get from session
      });
      const template = await storage.createWhatsAppTemplate(validatedData);
      res.json(template);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/whatsapp-templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const template = await storage.updateWhatsAppTemplate(id, updates);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/user/twilio-credentials", async (req, res) => {
    try {
      const { twilioAccountSid, twilioAuthToken, twilioPhoneNumber } = req.body;
      const userId = req.body.userId || "demo-user";
      if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
        return res.status(400).json({
          message: "All Twilio credentials are required: accountSid, authToken, phoneNumber"
        });
      }
      const credentials = {
        accountSid: twilioAccountSid,
        authToken: twilioAuthToken,
        phoneNumber: twilioPhoneNumber
      };
      const isValid = await whatsAppService.verifyUserCredentials(credentials);
      if (!isValid) {
        return res.status(400).json({
          message: "Invalid Twilio credentials or phone number not found in account"
        });
      }
      const user = await storage.updateUser(userId, {
        twilioAccountSid,
        twilioAuthToken,
        twilioPhoneNumber,
        twilioVerified: true
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { twilioAuthToken: _, ...safeUser } = user;
      res.json({
        success: true,
        user: safeUser,
        message: "Twilio credentials verified and saved successfully"
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/whatsapp/templates", async (req, res) => {
    try {
      const templates2 = whatsAppService.getAvailableTemplates();
      res.json(templates2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/whatsapp/send", async (req, res) => {
    try {
      const { to, templateName, variables, userId } = req.body;
      const userIdToUse = userId || "demo-user";
      if (!to || !templateName) {
        return res.status(400).json({ message: "Phone number and template name are required" });
      }
      const user = await storage.getUser(userIdToUse);
      if (!user || !user.twilioAccountSid || !user.twilioAuthToken || !user.twilioPhoneNumber) {
        return res.status(400).json({
          message: "User Twilio credentials not configured. Please set up your Twilio account first."
        });
      }
      if (!user.twilioVerified) {
        return res.status(400).json({
          message: "Twilio credentials not verified. Please verify your credentials first."
        });
      }
      const credentials = {
        accountSid: user.twilioAccountSid,
        authToken: user.twilioAuthToken,
        phoneNumber: user.twilioPhoneNumber
      };
      const messageId = await whatsAppService.sendTemplateMessage(to, templateName, variables, credentials);
      res.json({ success: true, messageId, to });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/whatsapp/bulk-send", async (req, res) => {
    try {
      const { phoneNumbers, templateName, variables, userId } = req.body;
      const userIdToUse = userId || "demo-user";
      if (!phoneNumbers || !Array.isArray(phoneNumbers) || !templateName) {
        return res.status(400).json({ message: "Phone numbers array and template name are required" });
      }
      const user = await storage.getUser(userIdToUse);
      if (!user || !user.twilioAccountSid || !user.twilioAuthToken || !user.twilioPhoneNumber) {
        return res.status(400).json({
          message: "User Twilio credentials not configured. Please set up your Twilio account first."
        });
      }
      if (!user.twilioVerified) {
        return res.status(400).json({
          message: "Twilio credentials not verified. Please verify your credentials first."
        });
      }
      const credentials = {
        accountSid: user.twilioAccountSid,
        authToken: user.twilioAuthToken,
        phoneNumber: user.twilioPhoneNumber
      };
      const results = await whatsAppService.sendBulkMessages(phoneNumbers, templateName, variables, credentials);
      res.json({
        totalSent: results.success.length,
        totalFailed: results.failed.length,
        ...results
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/whatsapp/webhook", async (req, res) => {
    try {
      const incomingMessage = WhatsAppService.processIncomingMessage(req.body);
      console.log("Received WhatsApp message:", {
        from: incomingMessage.from,
        messageId: incomingMessage.messageId,
        timestamp: incomingMessage.timestamp,
        hasMedia: !!incomingMessage.mediaUrl
      });
      res.status(200).json({
        success: true,
        message: "Webhook processed successfully"
      });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  });
  app2.get("/api/whatsapp/status", async (req, res) => {
    try {
      const status = whatsAppService.getStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/whatsapp/preview-template", async (req, res) => {
    try {
      const { templateName, variables = [] } = req.body;
      if (!templateName) {
        return res.status(400).json({ message: "Template name is required" });
      }
      const preview = WhatsAppService.previewTemplate(templateName, variables);
      if (!preview) {
        return res.status(404).json({ message: `Template '${templateName}' not found` });
      }
      res.json({
        success: true,
        templateName,
        preview
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "localhost",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
