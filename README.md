# Palette Grab 🎨

A Progressive Web App for capturing and managing colors from the real world using your device's camera.


## Features

✨ **Real-time Color Picking** - Live camera feed with center pixel color sampling  
🎨 **Palette Management** - Create and organize custom color palettes  
📊 **Color Analysis** - View HEX, RGB, HSL, and CMYK values  
🌈 **Color Harmonies** - Discover complementary, triadic, and analogous colors  
📱 **PWA Support** - Install on mobile and desktop, works offline  

## Tech Stack

- **React 18** + TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Modern utility-first CSS
- **Zustand** - Lightweight state management
- **Framer Motion** - Fluid animations
- **PWA** - Service Worker + Web Manifest

## Getting Started

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd palette-grab

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

The production build will be in the `dist/` folder.

## PWA Installation

## Camera Permissions

The app requires camera access to capture colors. On first use:
- **Desktop**: Click "Allow" when prompted
- **Mobile**: Grant camera permissions in settings if needed

## Features Guide

### Capturing Colors
1. Point your camera at any color
2. The hex code updates in real-time
3. Tap the capture button to save
4. Choose a palette or create a new one

### Managing Palettes
- Create unlimited palettes
- Add/remove colors from palettes
- View color details and harmonies
- Delete palettes when done

### Color History
- All captured colors are automatically saved
- Browse by date
- Click any color for detailed info

### Color Details
- View all color formats (HEX, RGB, HSL, CMYK)
- Copy values to clipboard
- Explore color harmonies
- See complementary, triadic, and analogous colors
