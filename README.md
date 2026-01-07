# Village Trash Management System

A full-stack web application for managing trash in villages, built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🏠 **For Villagers**
- **Report Trash**: Use camera or gallery to report trash locations
- **Location Tracking**: Automatic GPS location capture with user permission
- **Interactive Map**: View all reported trash areas on a live map
- **Real-time Updates**: Track the status of your reports

### 🤝 **For Volunteers**
- **Dashboard**: View all trash reports with photos and locations
- **Map Integration**: See trash areas on an interactive map
- **Progress Tracking**: Mark reports as in-progress and completed
- **Before/After Photos**: Upload cleanup photos to verify completion

### 🎮 **For Children**
- **Points System**: Earn points for reporting trash and helping clean
- **Virtual Gifts**: Redeem points for badges, trophies, and crowns
- **Gamification**: Level up from Beginner to Eco Master
- **Achievement Tracking**: View earned rewards and activity history

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Maps**: Leaflet with OpenStreetMap
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd village-trash-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your database URL and other secrets:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/village_trash"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── report/            # Trash reporting page
│   ├── map/               # Interactive map page
│   ├── volunteer/         # Volunteer dashboard
│   └── kids/              # Kids zone with rewards
├── components/            # Reusable components
│   ├── Navigation.tsx     # Main navigation
│   └── Map.tsx           # Interactive map component
└── lib/                   # Utility libraries
    └── prisma.ts          # Prisma client
```

## Database Schema

The application uses the following main models:

- **User**: Stores user information and roles (VILLAGER, VOLUNTEER, CHILD, ADMIN)
- **TrashReport**: Contains trash reports with location, photos, and status
- **Cleaning**: Tracks volunteer cleanup activities with before/after photos
- **Gift**: Virtual rewards for children
- **UserGift**: Tracks redeemed gifts by users

## Deployment

### Vercel Deployment

1. **Push your code to GitHub**
2. **Connect your repository to Vercel**
3. **Configure environment variables** in Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_URL`: Your Vercel app URL
   - `NEXTAUTH_SECRET`: Generate a random secret

4. **Deploy** - Vercel will automatically build and deploy your app

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-production-secret"
```

## Features in Detail

### 📸 **Camera Integration**
- Access device camera for real-time photo capture
- Gallery upload support for existing photos
- Image preview before submission
- Responsive camera interface for mobile devices

### 🗺️ **Interactive Maps**
- Real-time trash location visualization
- Color-coded markers by status (Pending, In Progress, Completed)
- Click-to-view detailed report information
- Responsive map design for all screen sizes

### 🎯 **Gamification for Kids**
- Points-based reward system
- Multiple reward categories (Badges, Trophies, Crowns)
- Progress tracking with level system
- Activity history and achievements

### 📱 **Responsive Design**
- Mobile-first approach
- Touch-friendly interfaces
- Progressive Web App ready
- Optimized for all device sizes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact [your-email@example.com](mailto:your-email@example.com) or create an issue in the GitHub repository.

---

**Built with ❤️ for cleaner villages and happier communities**
