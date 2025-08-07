# DAO Token Buyback Dashboard

A real-time dashboard for tracking token buybacks across leading DeFi DAOs: Hyperliquid (HYPE), Jupiter (JUP), and Aave (AAVE).

## Features

- **Real-time Data**: Track token buybacks with automatic updates every 5 minutes
- **Multi-DAO Support**: Monitor Hyperliquid, Jupiter, and Aave simultaneously
- **Comprehensive Metrics**: View total repurchased amounts, value in USD, supply reduction percentages
- **Annual Projections**: See estimated annual buyback amounts based on current rates
- **Recent Activity**: Track monthly buyback history for each DAO
- **Modern UI**: Clean, responsive design with DAO-specific colors and branding

## Tracked DAOs

### Hyperliquid (HYPE)
- Uses 97% of trading fees for buybacks and redistribution
- Over 20 million HYPE tokens repurchased (~$386M, 6.2% of supply)
- Estimated $600M annual buyback rate

### Jupiter (JUP)
- Allocates 50% of DAO fees to buybacks
- Estimated $250M annually in buybacks
- Active monthly buyback program

### Aave (AAVE)
- Weekly buybacks of $1M for six months (started April 2025)
- 100% of designated DAO fees allocated to buybacks
- Focus on supply reduction and liquidity optimization

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the dashboard

## Data Sources

The dashboard integrates with:
- CoinGecko API for real-time token prices
- DAO-specific APIs for buyback data
- Mock data with realistic values for demonstration

## Architecture

- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern styling
- **Axios** for API requests with caching
- **Recharts** for data visualization (ready for future charts)
- **Service Layer** for data management and caching

## Future Enhancements

- Integration with Context7 MCP for enhanced data fetching
- Real-time WebSocket connections for live updates
- Historical charts and trend analysis
- Additional DAO support
- Alert system for significant buyback events
- Mobile app version

## Development

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Contributing

Feel free to submit issues and enhancement requests!