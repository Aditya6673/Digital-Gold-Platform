# Digital Gold Platform - Frontend

A modern React-based frontend for the Digital Gold Platform, featuring a beautiful gold-themed design with responsive layout and smooth animations.

## Features

- 🎨 **Gold-themed Design**: Rich gold (#FFD700), light beige (#F5F5DC), and bronze (#CD7F32) color scheme
- 📱 **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- ✨ **Smooth Animations**: Framer Motion animations for enhanced user experience
- 🔐 **Authentication**: Secure login and registration with JWT tokens
- 📊 **Dashboard**: Real-time portfolio overview and gold price tracking
- 💼 **Portfolio Management**: Detailed holdings and performance metrics
- 📈 **Transaction History**: Complete transaction tracking with filtering
- 🎯 **Modern UI**: Clean, professional interface with gold-themed icons

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── context/           # React context providers
│   ├── pages/             # Page components
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

## API Integration

The frontend connects to the backend API running on `http://localhost:5000`. The Vite configuration includes a proxy to handle API requests during development.

### Available Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/holdings` - Get user holdings
- `GET /api/transactions` - Get transaction history
- `GET /api/gold/price` - Get current gold price

## Styling

The application uses a custom gold theme with the following colors:

- **Primary Gold**: #FFD700
- **Light Beige**: #F5F5DC
- **Bronze**: #CD7F32
- **Typography**: Playfair Display (headlines), PT Sans (body text)

## Components

### Core Components

- **Navbar**: Responsive navigation with authentication state
- **AuthContext**: Global authentication state management
- **Gold-themed Cards**: Reusable card components with gold styling

### Pages

- **Home**: Landing page with features and call-to-action
- **Login**: User authentication form
- **Register**: User registration form
- **Dashboard**: Portfolio overview and statistics
- **Portfolio**: Detailed holdings and performance
- **Transactions**: Transaction history with filtering

## Development

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Update the navigation in `src/components/Navbar.jsx`

### Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow the gold theme color palette
- Use Framer Motion for animations
- Ensure responsive design for all screen sizes

### State Management

- Use React Context for global state (authentication)
- Use local state for component-specific data
- Use useEffect for API calls and side effects

## Contributing

1. Follow the existing code style and structure
2. Use the gold theme consistently
3. Ensure responsive design
4. Add appropriate animations
5. Test on different screen sizes

## License

This project is part of the Digital Gold Platform. 