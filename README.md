# Portfolio Dashboard - Live Indian Stock Market Tracker

A real-time portfolio dashboard application that tracks Indian stock market investments with live price updates, sector analysis, and comprehensive analytics.

## Features

- **Real-time Updates**: Live stock prices updated every 15 seconds, metrics every 60 seconds
- **Comprehensive Analytics**: Investment tracking, P&L calculations, portfolio percentages
- **Sector Grouping**: Organize holdings by sectors with sector-wise performance metrics
- **Indian Market Support**: Supports both NSE and BSE stock exchanges
- **Responsive Design**: Clean, professional interface that works on desktop and mobile
- **Error Handling**: Robust error handling with fallback to last known values
- **Performance Optimized**: LRU caching and rate limiting to optimize API calls

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- TanStack React Query for data fetching
- Wouter for routing
- Shadcn/UI components

### Backend
- Express.js with TypeScript
- Yahoo Finance API integration
- LRU cache for performance
- Bottleneck for rate limiting
- Zod for data validation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Prepare your portfolio data:
   - The application loads holdings from `data/portfolio.json`
   - Format each holding with: name, symbol, exchange, purchasePrice, quantity, sector
   - See the existing `data/portfolio.json` for reference

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

### Building for Production

```bash
npm run build
npm start
