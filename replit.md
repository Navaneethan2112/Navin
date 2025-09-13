# Overview

Aara Connect is a WhatsApp Business messaging platform designed to empower small businesses with smart communication solutions. The application provides automated campaigns, approved message templates, chatbots, analytics, and comprehensive contact management through the WhatsApp Business API. Built as a full-stack SaaS application, it combines a React frontend with an Express.js backend and PostgreSQL database using Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Authentication**: Auth0 React SDK for user authentication and authorization
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas for data validation
- **Session Management**: PostgreSQL session store with connect-pg-simple

## Database Design
The application uses PostgreSQL with the following core entities:
- **Users**: Auth0 integration with plan-based message limits
- **Contacts**: Customer contact information and messaging history
- **Campaigns**: Marketing campaign management with status tracking
- **Templates**: WhatsApp-approved message templates

## Authentication & Authorization
- **Provider**: Auth0 for secure authentication
- **Strategy**: JWT-based authentication with redirect flows
- **Route Protection**: Client-side protected routes with automatic login redirects
- **User Management**: Auth0 ID mapping to internal user records

## Development & Deployment
- **Build System**: Vite for frontend, ESBuild for backend bundling
- **Development**: Hot module replacement with development server integration
- **TypeScript**: Strict type checking across the entire codebase
- **Module Resolution**: Path aliases for clean imports

# External Dependencies

## Authentication Services
- **Auth0**: Complete authentication and authorization platform
- **Configuration**: Domain, client ID, and audience-based setup

## Database Services
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Connection**: Environment-based DATABASE_URL configuration
- **Migration**: Drizzle Kit for schema migrations

## Development Tools
- **Replit Integration**: Development banner and runtime error overlay
- **Cartographer**: Code mapping for Replit environment

## UI & Styling Dependencies
- **Radix UI**: Comprehensive primitive component library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe CSS utility management

## Data Management
- **TanStack Query**: Server state synchronization and caching
- **React Hook Form**: Form state management and validation
- **Date-fns**: Date manipulation and formatting utilities

## WhatsApp Business Integration
The application is designed to integrate with WhatsApp Business API for:
- Message template management and approval
- Bulk messaging capabilities
- Campaign delivery and tracking
- Chatbot automation