# Masvingo City Council Rate Clearance Certificate System

## Overview

This is a municipal service application that enables Masvingo City Council residents to apply for and track Rate Clearance Certificates (RCC) online. The system provides a public-facing portal for citizens to submit applications and check their status, alongside an administrative dashboard for council staff to review and process applications. The platform aims to modernize municipal services by replacing manual, paper-based processes with a fast, transparent, and accessible digital solution.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**Routing**: Wouter for lightweight client-side routing with the following main routes:
- `/` - Public home page
- `/apply` - Application submission form
- `/track` - Application tracking by reference number
- `/admin` - Admin login
- `/admin/dashboard` - Admin application management

**UI Component Library**: Shadcn UI (New York variant) with Radix UI primitives, providing:
- Pre-built, accessible form components
- Dialog and modal systems
- Toast notifications for user feedback
- Fully customizable through Tailwind CSS

**Design System**: Material Design adapted for municipal/government services with:
- Primary color: Council Green (`142 65% 35%`)
- Status-specific colors for application states (submitted, under review, approved, rejected)
- Typography: Inter for body text, DM Sans for headings
- Consistent spacing using Tailwind's spacing scale

**State Management**: TanStack Query (React Query) for:
- Server state synchronization
- Automatic caching and refetching
- Optimistic updates
- Background data synchronization

**Form Handling**: React Hook Form with Zod for schema validation, ensuring type-safe form data and comprehensive validation rules

### Backend Architecture

**Runtime**: Node.js with Express.js

**API Design**: RESTful API with the following main endpoints:
- `POST /api/applications` - Submit new application
- `GET /api/applications/track/:referenceNumber` - Track application status
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/session` - Check admin session
- `GET /api/admin/applications` - List all applications (admin only)
- `GET /api/admin/statistics` - Dashboard statistics (admin only)
- `PUT /api/admin/applications/:id/status` - Update application status

**Session Management**: Express-session with configurable session store
- Cookie-based sessions for admin authentication
- HTTP-only cookies for security
- 24-hour session expiration

**Authentication Strategy**: Simple session-based authentication for admin users
- No authentication required for public application submission and tracking
- Protected admin routes require valid session
- Default admin credentials for initial setup

**Data Storage**: In-memory storage implementation (`MemStorage`) with interface-based design (`IStorage`)
- Allows easy migration to persistent database later
- Stores applications and admin accounts
- Generates unique reference numbers (format: `RCC-2025-XXXXXX`)

**Development Setup**: Dual-mode operation:
- Development: Vite dev server with HMR
- Production: Bundled static files served by Express

### Database Schema

**Drizzle ORM** configured for PostgreSQL (via `@neondatabase/serverless` driver) with two main tables:

**Applications Table**:
- Personal info: fullName, idNumber, phoneNumber, email
- Property info: propertyAddress, standNumber, propertyType
- Status tracking: status, submittedDate, reviewDate, completedDate
- Admin fields: adminNotes, reviewedBy
- Unique referenceNumber for public tracking

**Admins Table**:
- Basic auth: username, password (should be hashed in production)
- Profile: fullName
- Audit: createdAt timestamp

**Migration Strategy**: Drizzle Kit for schema migrations with TypeScript schema definitions shared between client and server

### External Dependencies

**UI Component Libraries**:
- Radix UI - Unstyled, accessible component primitives
- Shadcn UI - Pre-styled components built on Radix
- Lucide React - Icon library
- Tailwind CSS - Utility-first CSS framework

**Data Fetching & Forms**:
- TanStack Query - Server state management
- React Hook Form - Form state and validation
- Zod - Schema validation
- @hookform/resolvers - Bridge between React Hook Form and Zod

**Database & ORM**:
- Drizzle ORM - Type-safe SQL query builder
- @neondatabase/serverless - PostgreSQL driver for serverless environments
- drizzle-zod - Generate Zod schemas from Drizzle tables

**Backend**:
- Express.js - Web framework
- express-session - Session middleware
- connect-pg-simple - PostgreSQL session store (configured but may not be actively used with in-memory storage)

**Date Handling**: date-fns for consistent date formatting and manipulation

**Build Tools**:
- Vite - Frontend build tool and dev server
- TypeScript - Type safety across the stack
- esbuild - Fast JavaScript bundler for server code
- PostCSS with Autoprefixer - CSS processing

**Development Tools**:
- @replit/vite-plugin-runtime-error-modal - Enhanced error reporting
- @replit/vite-plugin-cartographer - Code navigation
- @replit/vite-plugin-dev-banner - Development mode indicator