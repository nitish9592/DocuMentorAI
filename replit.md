# DocuMentor - AI-Powered Document Management System

## Overview

DocuMentor is a full-stack document management application built with React, Express.js, and PostgreSQL. The system allows users to upload PDF documents, automatically generate AI-powered summaries using OpenAI's GPT-4, and manage documents with intelligent categorization and search capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with Tailwind CSS for styling
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized builds
- **Component Library**: Shadcn/ui for consistent, accessible UI components

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **File Processing**: Multer for file uploads and pdf-parse for PDF text extraction
- **AI Integration**: OpenAI API for document summarization and categorization

### Database Schema
- **documents**: Stores document metadata, file information, AI summaries, categories, and tags
- **users**: User authentication and management (defined but not fully implemented)
- **Database**: PostgreSQL with Neon Database serverless hosting

## Key Components

### Document Management
- **File Upload**: Drag-and-drop PDF upload with file validation and size limits (10MB)
- **Document Storage**: Server-side file storage with unique naming and metadata tracking
- **PDF Processing**: Text extraction from PDFs for AI analysis
- **Document Listing**: Searchable and filterable document grid with real-time updates

### AI Integration
- **Summary Generation**: Automatic document summarization using GPT-4
- **Smart Categorization**: AI-powered document classification (Finance, Marketing, Technical, Legal, HR, Operations)
- **Tag Extraction**: Automatic generation of relevant tags for documents
- **Confidence Scoring**: AI confidence metrics for summary quality assessment

### User Interface
- **Responsive Design**: Mobile-first design with sidebar navigation
- **Real-time Updates**: Live document status updates and progress indicators
- **Modal Interfaces**: Document preview, AI summary viewing, and management dialogs
- **Search & Filter**: Advanced document search with category-based filtering

## Data Flow

1. **Document Upload**: User uploads PDF → File validation → Server storage → Database record creation
2. **AI Processing**: PDF text extraction → OpenAI API call → Summary generation → Database update
3. **Document Management**: Real-time updates via React Query → UI refresh → User notification
4. **Search & Filter**: Client-side filtering with server-side search capabilities

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI components
- **openai**: AI integration for document analysis
- **multer**: File upload handling
- **pdf-parse**: PDF text extraction

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the application
- **Tailwind CSS**: Utility-first styling
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon Database serverless PostgreSQL
- **Environment Variables**: DATABASE_URL, OPENAI_API_KEY

### Production Build
- **Frontend**: Vite build with optimized assets
- **Backend**: ESBuild compilation for Node.js deployment
- **Database**: Drizzle migrations for schema management
- **File Storage**: Local file system (can be extended to cloud storage)

### Configuration
- **TypeScript**: Strict mode enabled with path mapping
- **Tailwind**: Custom design system with CSS variables
- **Database**: PostgreSQL with connection pooling via Neon

## Changelog

- July 03, 2025. Initial setup
- July 03, 2025. Enhanced with responsive design and AI-powered summarization
- July 03, 2025. Converted to single-page application per user request

## User Preferences

Preferred communication style: Simple, everyday language.