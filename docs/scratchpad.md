# Treasury Dashboard - Scratchpad

## Current Active Tasks

### 🚀 Aave Buyback Data Integration
- **Status**: In Progress
- **Implementation Plan**: [aave-buyback-scraper.md](implementation-plan/aave-buyback-scraper.md)
- **Started**: 2025-01-27
- **Goal**: Replace mock Aave data with real buyback data from TokenLogic

### 🧹 Codebase Cleanup and Refactoring
- **Status**: Planning Complete - Ready for Implementation
- **Implementation Plan**: [codebase-cleanup.md](implementation-plan/codebase-cleanup.md)
- **Started**: 2025-01-27
- **Goal**: Clean up redundant components, consolidate services, improve maintainability and documentation

## Lessons Learned

- [2025-01-27] The TokenLogic Aave buybacks page at https://aave.tokenlogic.xyz/buybacks contains comprehensive buyback metrics that need to be scraped and integrated
- [2025-01-27] Current Aave implementation uses mock data in dataService.ts that needs to be replaced with real API calls

## Quick Notes

- Project uses optimized data service architecture with caching
- Multiple dashboard components need to support new Aave buyback data
- Need to maintain existing performance optimizations while adding real data