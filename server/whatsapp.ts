import twilio, { type Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_PHONE_NUMBER;

// Create client with proper error handling
let client: Twilio | null = null;
let credentialsError: string | null = null;

try {
  if (!accountSid || !authToken || !twilioWhatsAppNumber) {
    credentialsError = 'Missing Twilio credentials: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER are required';
  } else {
    client = twilio(accountSid, authToken);
  }
} catch (error) {
  credentialsError = `Failed to initialize Twilio client: ${error instanceof Error ? error.message : 'Unknown error'}`;
}

export interface WhatsAppMessage {
  to: string;
  body: string;
  mediaUrl?: string;
}

export interface WhatsAppMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
  to: string;
}

export interface BulkMessageResult {
  totalSent: number;
  totalFailed: number;
  success: string[];
  failed: { phone: string; error: string }[];
  summary: string;
}

export interface IncomingWhatsAppMessage {
  from: string;
  to: string;
  body: string;
  messageId: string;
  timestamp: Date;
  mediaUrl: string | null;
  mediaType: string | null;
}

export interface WhatsAppTemplate {
  id?: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  body: string;
  variables?: string[];
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: Date;
  rejectionReason?: string;
}

export interface CreateTemplateRequest {
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  body: string;
  variables?: string[];
}

// Your 11 approved templates - replace these with your actual approved template names and content
export const approvedTemplates: WhatsAppTemplate[] = [
  {
    id: '1',
    name: 'welcome_series',
    category: 'MARKETING',
    language: 'en',
    body: '🎉 Welcome to AaraConnect!\n\nStart growing your business with professional WhatsApp messaging:\n✅ Send bulk campaigns\n✅ Set up AI chatbots\n✅ Track analytics\n\nReady to get started? Visit your dashboard: {{1}}\n\nReply STOP to opt out anytime.',
    variables: ['dashboard_url'],
    status: 'APPROVED',
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'feature_announcement',
    category: 'MARKETING',
    language: 'en',
    body: '📢 New Feature Alert!\n\nAaraConnect now supports {{1}}!\n\nThis helps you:\n• {{2}}\n• {{3}}\n• Improve customer engagement\n\nCheck it out in your dashboard today.\n\nQuestions? Reply to this message.',
    variables: ['feature_name', 'benefit_1', 'benefit_2'],
    status: 'APPROVED',
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'marketing_tips',
    category: 'MARKETING',
    language: 'en',
    body: '💡 WhatsApp Marketing Tip #{{1}}\n\n{{2}}\n\nThis strategy helped our clients increase response rates by {{3}}%.\n\nWant to learn more tips? Visit: {{4}}\n\nReply TIPS for more marketing insights.',
    variables: ['tip_number', 'tip_content', 'percentage', 'learn_more_url'],
    status: 'APPROVED',
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'success_story',
    category: 'MARKETING',
    language: 'en',
    body: '🌟 Success Story\n\n"{{1}}" - {{2}}, {{3}}\n\nSee how AaraConnect helped them achieve:\n• {{4}} more customer responses\n• {{5}} time savings\n• Better customer satisfaction\n\nReady for similar results? Let\'s chat!',
    variables: ['testimonial', 'customer_name', 'company_name', 'response_increase', 'time_savings'],
    status: 'APPROVED',
    createdAt: new Date()
  },
  {
    id: '5',
    name: 'limited_offer',
    category: 'MARKETING',
    language: 'en',
    body: '⏰ Limited Time: {{1}} Days Left\n\nGet {{2}}% off your AaraConnect upgrade!\n\n✅ Unlock advanced features\n✅ Send more messages\n✅ Priority support\n\nUse code: {{3}}\nExpires: {{4}}\n\nUpgrade now: {{5}}',
    variables: ['days_left', 'discount_percentage', 'promo_code', 'expiry_date', 'upgrade_url'],
    status: 'APPROVED',
    createdAt: new Date()
  }
];

// Helper function to format phone numbers for WhatsApp
export function formatWhatsAppNumber(phoneNumber: string): string {
  // Remove all non-numeric characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Add + if not present and ensure it starts with country code
  if (cleanNumber.startsWith('1') && cleanNumber.length === 11) {
    // US/Canada number
    return `+${cleanNumber}`;
  } else if (cleanNumber.length >= 10) {
    // International number - add + if missing
    return cleanNumber.startsWith('+') ? cleanNumber : `+${cleanNumber}`;
  } else {
    throw new Error(`Invalid phone number format: ${phoneNumber}. Please use international format with country code.`);
  }
}

// Helper function to validate phone number for WhatsApp
export function validatePhoneNumber(phoneNumber: string): boolean {
  try {
    const formatted = formatWhatsAppNumber(phoneNumber);
    return formatted.length >= 11 && formatted.length <= 15;
  } catch {
    return false;
  }
}

// User Twilio Credentials Interface
export interface UserTwilioCredentials {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export class WhatsAppService {
  private defaultClient: Twilio | null;
  private credentialsError: string | null;

  constructor() {
    this.defaultClient = client;
    this.credentialsError = credentialsError;
  }

  // Create client for specific user credentials
  private createUserClient(credentials: UserTwilioCredentials): Twilio {
    try {
      return twilio(credentials.accountSid, credentials.authToken);
    } catch (error) {
      throw new Error(`Failed to create Twilio client: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Verify user's Twilio credentials
  async verifyUserCredentials(credentials: UserTwilioCredentials): Promise<boolean> {
    try {
      const userClient = this.createUserClient(credentials);
      
      // Verify credentials by making a simple API call
      await userClient.api.v2010.accounts(credentials.accountSid).fetch();
      
      // Verify phone number exists in their account
      const incomingPhoneNumbers = await userClient.incomingPhoneNumbers.list({
        phoneNumber: credentials.phoneNumber.replace('whatsapp:', '').replace('+', '')
      });
      
      return incomingPhoneNumbers.length > 0;
    } catch (error) {
      console.error('Failed to verify user Twilio credentials:', error);
      return false;
    }
  }

  private ensureClient(): Twilio {
    if (this.credentialsError) {
      throw new Error(this.credentialsError);
    }
    if (!this.defaultClient) {
      throw new Error('Twilio client not initialized');
    }
    return this.defaultClient;
  }

  // Send message using user's own credentials
  async sendMessage(message: WhatsAppMessage, userCredentials: UserTwilioCredentials): Promise<string> {
    const client = this.createUserClient(userCredentials);

    try {
      // Format and validate phone number
      const formattedPhoneNumber = formatWhatsAppNumber(message.to);
      
      if (!validatePhoneNumber(formattedPhoneNumber)) {
        throw new Error(`Invalid phone number: ${message.to}`);
      }

      const twilioMessage = await client.messages.create({
        from: `whatsapp:${userCredentials.phoneNumber}`,
        to: `whatsapp:${formattedPhoneNumber}`,
        body: message.body,
        ...(message.mediaUrl && { mediaUrl: [message.mediaUrl] })
      });

      console.log(`WhatsApp message sent successfully to ${formattedPhoneNumber}: ${twilioMessage.sid}`);
      return twilioMessage.sid;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to send WhatsApp message:', {
        to: message.to,
        error: errorMessage
      });
      throw new Error(`Failed to send WhatsApp message to ${message.to}: ${errorMessage}`);
    }
  }

  async sendTemplateMessage(
    to: string, 
    templateName: string, 
    variables: string[] = [],
    userCredentials: UserTwilioCredentials
  ): Promise<string> {
    const template = approvedTemplates.find(t => t.name === templateName);
    
    if (!template) {
      const availableTemplates = approvedTemplates.map(t => t.name).join(', ');
      throw new Error(`Template '${templateName}' not found. Available templates: ${availableTemplates}`);
    }

    // Replace variables in template body
    let body = template.body;
    variables.forEach((variable, index) => {
      const placeholder = `{{${index + 1}}}`;
      body = body.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), variable);
    });

    // Check for unreplaced variables
    const unreplacedVariables = body.match(/\{\{\d+\}\}/g);
    if (unreplacedVariables) {
      console.warn(`Template '${templateName}' has unreplaced variables: ${unreplacedVariables.join(', ')}`);
    }

    return this.sendMessage({ to, body }, userCredentials);
  }

  async sendBulkMessages(
    phoneNumbers: string[], 
    templateName: string, 
    variables: string[] = [],
    userCredentials: UserTwilioCredentials
  ): Promise<{ success: string[], failed: { phone: string, error: string }[] }> {
    if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      throw new Error('Phone numbers array is required and must not be empty');
    }

    const results = {
      success: [] as string[],
      failed: [] as { phone: string, error: string }[]
    };

    console.log(`Starting bulk message send to ${phoneNumbers.length} recipients using template '${templateName}'`);

    // Send messages with delay to respect rate limits
    for (let i = 0; i < phoneNumbers.length; i++) {
      const phoneNumber = phoneNumbers[i];
      try {
        // Validate phone number before sending
        if (!validatePhoneNumber(phoneNumber)) {
          throw new Error(`Invalid phone number format: ${phoneNumber}`);
        }

        await this.sendTemplateMessage(phoneNumber, templateName, variables, userCredentials);
        results.success.push(phoneNumber);
        
        console.log(`Bulk message ${i + 1}/${phoneNumbers.length} sent successfully to ${phoneNumber}`);
        
        // Add 1 second delay between messages to respect WhatsApp rate limits
        if (i < phoneNumbers.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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

  getAvailableTemplates(): WhatsAppTemplate[] {
    return approvedTemplates;
  }

  getTemplate(templateName: string): WhatsAppTemplate | undefined {
    return approvedTemplates.find(t => t.name === templateName);
  }

  // Check if service is configured
  isConfigured(): boolean {
    return this.defaultClient !== null && this.credentialsError === null;
  }

  // Get configuration status
  getStatus(): { configured: boolean; error?: string } {
    return {
      configured: this.isConfigured(),
      error: this.credentialsError || undefined
    };
  }

  // Handle incoming WhatsApp webhooks
  static processIncomingMessage(body: any): IncomingWhatsAppMessage {
    if (!body) {
      throw new Error('Webhook body is required');
    }

    const from = body.From?.replace('whatsapp:', '') || '';
    const to = body.To?.replace('whatsapp:', '') || '';
    const messageBody = body.Body || '';
    const messageId = body.MessageSid || '';

    if (!from || !messageId) {
      throw new Error('Invalid webhook payload: missing required fields');
    }

    return {
      from,
      to,
      body: messageBody,
      messageId,
      timestamp: new Date(),
      mediaUrl: body.MediaUrl0 || null,
      mediaType: body.MediaContentType0 || null
    };
  }

  // Get template by name with validation
  static getTemplateByName(templateName: string): WhatsAppTemplate | null {
    return approvedTemplates.find(t => t.name === templateName) || null;
  }

  // Get all template names
  static getTemplateNames(): string[] {
    return approvedTemplates.map(t => t.name);
  }

  // Preview template with variables replaced
  static previewTemplate(templateName: string, variables: string[] = []): string | null {
    const template = WhatsAppService.getTemplateByName(templateName);
    if (!template) {
      return null;
    }

    let body = template.body;
    variables.forEach((variable, index) => {
      const placeholder = `{{${index + 1}}}`;
      body = body.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), variable);
    });

    return body;
  }
}

export const whatsAppService = new WhatsAppService();