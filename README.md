# Wild Pack

Wild Pack is a privacy-focused, real-time mobile app built on the Tonk platform for groups to connect and explore together. It features a live map showing users' locations, real-time messaging, photo sharing, and a notification system. 

## Core Features

- **Live Map**: Display users' locations with privacy controls (exact, city-level, or hidden)
- **Messaging**: Text-based individual and group chats, with location sharing capability
- **Photo Sharing**: Upload and view photos with location data in a group feed
- **Notification Bell**: Badge counting unread messages/photos since last viewed
- **Privacy-First**: Local-first architecture with end-to-end sync and offline capability

## Technology Stack

- **Frontend**: React with TypeScript
- **Mapping**: Leaflet for lightweight map rendering
- **State Management**: Zustand with Tonk's Store API
- **Styling**: Tailwind CSS
- **Real-time Sync**: Tonk's shared Store for data synchronization

## Getting Started

### Prerequisites

- Node.js 14+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate into the project
cd wild-pack

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Usage

1. **First Run**: Set up your profile name and location privacy preferences
2. **Map View**: See where your crew members are (according to their privacy settings)
3. **Chat**: Message individuals or groups with optional location attachments
4. **Photos**: Share photos with optional captions and location data
5. **Notifications**: Check the bell icon for unread messages and new photos

## Privacy Features

Wild Pack is built with privacy in mind:

- Location sharing with three levels of control (exact, city-level, hidden)
- Decentralized architecture with local-first storage
- No tracking, no ads, no data collection
- All data stays on-device with peer-to-peer syncing

## License

[MIT License](LICENSE)

## Acknowledgements

- Built on the [Tonk Platform](https://github.com/tonk-labs/tonk)
- Icons by [Lucide](https://lucide.dev/)
- Maps by [Leaflet](https://leafletjs.com/) and [OpenStreetMap](https://www.openstreetmap.org/)
