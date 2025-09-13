import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertUserSchema, insertWhatsAppTemplateSchema } from "@shared/schema";
import { whatsAppService, WhatsAppService, type UserTwilioCredentials } from "./whatsapp";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse({
        ...req.body,
        userId: req.body.userId || 'anonymous', // Allow anonymous submissions
      });
      
      const contact = await storage.createContact(validatedData);
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get all contacts (admin only)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User management
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:auth0Id", async (req, res) => {
    try {
      const user = await storage.getUserByAuth0Id(req.params.auth0Id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      // For demo purposes, return static data
      // In production, you'd get userId from authenticated session
      const stats = await storage.getDashboardStats('demo-user');
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Campaigns
  app.get("/api/campaigns", async (req, res) => {
    try {
      // In production, get userId from authenticated session
      const campaigns = await storage.getCampaignsByUserId('demo-user');
      res.json(campaigns);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Templates (legacy)
  app.get("/api/templates", async (req, res) => {
    try {
      // In production, get userId from authenticated session
      const templates = await storage.getTemplatesByUserId('demo-user');
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User-specific WhatsApp Templates
  app.get("/api/whatsapp-templates", async (req, res) => {
    try {
      // In production, get userId from authenticated session
      const templates = await storage.getWhatsAppTemplatesByUserId('demo-user');
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/whatsapp-templates", async (req, res) => {
    try {
      const validatedData = insertWhatsAppTemplateSchema.parse({
        ...req.body,
        userId: req.body.userId || 'demo-user', // In production, get from session
      });
      
      const template = await storage.createWhatsAppTemplate(validatedData);
      res.json(template);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/whatsapp-templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const template = await storage.updateWhatsAppTemplate(id, updates);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User Twilio credential management
  app.post("/api/user/twilio-credentials", async (req, res) => {
    try {
      const { twilioAccountSid, twilioAuthToken, twilioPhoneNumber } = req.body;
      const userId = req.body.userId || 'demo-user'; // In production, get from session
      
      if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
        return res.status(400).json({ 
          message: "All Twilio credentials are required: accountSid, authToken, phoneNumber" 
        });
      }

      // Verify credentials before saving
      const credentials: UserTwilioCredentials = {
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

      // Update user with verified credentials
      const user = await storage.updateUser(userId, {
        twilioAccountSid,
        twilioAuthToken,
        twilioPhoneNumber,
        twilioVerified: true
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't return sensitive credentials in response
      const { twilioAuthToken: _, ...safeUser } = user;
      res.json({ 
        success: true, 
        user: safeUser,
        message: "Twilio credentials verified and saved successfully" 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // WhatsApp API endpoints
  app.get("/api/whatsapp/templates", async (req, res) => {
    try {
      const templates = whatsAppService.getAvailableTemplates();
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/whatsapp/send", async (req, res) => {
    try {
      const { to, templateName, variables, userId } = req.body;
      const userIdToUse = userId || 'demo-user'; // In production, get from session
      
      if (!to || !templateName) {
        return res.status(400).json({ message: "Phone number and template name are required" });
      }

      // Get user's Twilio credentials
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

      const credentials: UserTwilioCredentials = {
        accountSid: user.twilioAccountSid,
        authToken: user.twilioAuthToken,
        phoneNumber: user.twilioPhoneNumber
      };

      const messageId = await whatsAppService.sendTemplateMessage(to, templateName, variables, credentials);
      res.json({ success: true, messageId, to });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/whatsapp/bulk-send", async (req, res) => {
    try {
      const { phoneNumbers, templateName, variables, userId } = req.body;
      const userIdToUse = userId || 'demo-user'; // In production, get from session
      
      if (!phoneNumbers || !Array.isArray(phoneNumbers) || !templateName) {
        return res.status(400).json({ message: "Phone numbers array and template name are required" });
      }

      // Get user's Twilio credentials
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

      const credentials: UserTwilioCredentials = {
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
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // WhatsApp webhook endpoint
  app.post("/api/whatsapp/webhook", async (req, res) => {
    try {
      const incomingMessage = WhatsAppService.processIncomingMessage(req.body);
      
      // Log incoming message for demo
      console.log('Received WhatsApp message:', {
        from: incomingMessage.from,
        messageId: incomingMessage.messageId,
        timestamp: incomingMessage.timestamp,
        hasMedia: !!incomingMessage.mediaUrl
      });
      
      // You can add your custom logic here to handle incoming messages
      // For example, store in database, trigger automated responses, etc.
      
      res.status(200).json({ 
        success: true, 
        message: 'Webhook processed successfully' 
      });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  });

  // WhatsApp service status endpoint
  app.get("/api/whatsapp/status", async (req, res) => {
    try {
      const status = whatsAppService.getStatus();
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Template preview endpoint
  app.post("/api/whatsapp/preview-template", async (req, res) => {
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
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
