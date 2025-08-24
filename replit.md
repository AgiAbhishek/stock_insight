# Portfolio Dashboard - Live Indian Stock Market Tracker

## Overview

A real-time portfolio dashboard application that tracks Indian stock market investments with live price updates, sector analysis, and comprehensive analytics. The application provides a clean, professional interface for monitoring stock portfolios with automatic price updates every 15 seconds and financial metrics updates every 60 seconds.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using modern React architecture with TypeScript for type safety:
- **React 18** with functional components and hooks
- **Vite** as the build tool and development server for fast development
- **TanStack React Query** for efficient server state management with polling intervals
- **Wouter** for lightweight client-side routing
- **Tailwind CSS** with Shadcn/UI components for consistent, responsive design
- **Component Structure**: Organized into reusable UI components, page components, and utility functions

### Backend Architecture
The backend follows a RESTful API design pattern:
- **Express.js** with TypeScript for the web server
- **File-based storage** using JSON files for portfolio data (located in `/data/portfolio.json`)
- **In-memory caching** with LRU cache implementation for performance optimization
- **Rate limiting** using Bottleneck library to manage API call frequency
- **API endpoints**: `/api/holdings`, `/api/quotes`, and `/api/metrics`
- **Error handling**: Robust error boundaries with fallback mechanisms

### Data Management Strategy
The application uses a hybrid approach for data management:
- **Static data**: Portfolio holdings loaded from JSON file at startup
- **Live data**: Real-time stock prices and metrics fetched from external APIs
- **Caching strategy**: 15-second TTL for quotes, 60-second TTL for metrics
- **Data validation**: Zod schemas for runtime type checking and validation

### Performance Optimizations
Several performance strategies are implemented:
- **LRU caching**: Prevents redundant API calls and reduces external service load
- **Request throttling**: Bottleneck library manages concurrent requests
- **Polling intervals**: Different refresh rates for quotes (15s) vs metrics (60s)
- **Memoization**: React useMemo for expensive calculations
- **Error resilience**: Graceful degradation when external services are unavailable

### UI/UX Design Patterns
The interface follows modern dashboard design principles:
- **Responsive design**: Works across desktop and mobile devices
- **Real-time updates**: Live data refresh with visual indicators
- **Sector grouping**: Holdings organized by industry sectors
- **Color coding**: Green/red indicators for gains and losses
- **Error states**: Clear user feedback for connection issues
- **Loading states**: Skeleton components during data fetching

## External Dependencies

### Third-Party APIs
- **Yahoo Finance API**: Primary source for real-time stock quotes and current market prices
- **Google Finance**: Secondary source for P/E ratios and latest earnings data (planned feature)

### Core Libraries
- **React ecosystem**: React 18, React DOM, React Query for state management
- **UI framework**: Radix UI primitives with Shadcn/UI component library
- **Styling**: Tailwind CSS for utility-first styling approach
- **TypeScript**: Full type coverage across frontend and backend
- **Build tools**: Vite for development and bundling, ESBuild for server compilation

### Backend Services
- **Express.js**: Web server framework with middleware support
- **Caching**: LRU-cache for in-memory data storage
- **Rate limiting**: Bottleneck for API request throttling
- **Validation**: Zod for schema validation and type inference

### Development Tools
- **Database toolkit**: Drizzle ORM with PostgreSQL support (configured but not actively used)
- **Session management**: Connect-pg-simple for PostgreSQL session store
- **Development**: Hot module replacement via Vite, TypeScript compiler checking
- **Deployment**: Node.js runtime with production build optimization