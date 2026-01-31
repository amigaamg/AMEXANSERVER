# AMEXAN Healthcare Application

A comprehensive Next.js healthcare management platform with chronic disease monitoring, telemedicine, billing, and more.

## Features

- 🏥 **Patient Dashboard** - Complete health management
- 👨‍⚕️ **Doctor Portal** - Patient management and analytics
- 💊 **Chronic Disease Management** - Diabetes, Hypertension, Asthma, Heart Disease
- 📅 **Appointment System** - Scheduling and reminders
- 💬 **Telemedicine** - Video calls and chat
- 💳 **Billing & Insurance** - Claims and payments
- 🛒 **Medical Supply Ordering** - Online supply catalog

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **File Upload**: Uploadcare
- **Real-time**: Socket.io
- **Video**: WebRTC
- **State Management**: Zustand
- **Charts**: Recharts

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

3. Set up environment variables in `.env.local`

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

- `/src/app` - Next.js App Router pages
- `/src/components` - Reusable UI components
- `/src/features` - Feature-based modules
- `/src/lib` - Core infrastructure (Firebase, Uploadcare)
- `/src/types` - TypeScript type definitions
- `/src/stores` - Global state management

## License

Proprietary - AMEXAN Healthcare 2025