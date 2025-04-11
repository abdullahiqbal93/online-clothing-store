# Flexxy - Modern E-commerce Platform

## Overview
Flexxy is a full-stack e-commerce platform built with modern web technologies, featuring a robust React frontend and Node.js backend. The platform offers a seamless shopping experience with features like user authentication, product management, Basic order tracking and secure payment processing

## Tech Stack

### Frontend
- **React 18** - Latest version of the popular UI library
- **Vite** - Next-generation frontend tooling
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Zod** -  schema validation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **JWT Authentication** - Secure user authentication
- **RSA Encryption** - Enhanced security with public/private key pairs

## Key Features
- 🔐 Secure Authentication and profile management
- 🛍️ Product Management and Rating System
- 🛒 Shopping Cart and Wishlist Functionality
- 💳 Secure Payment Processing (Paypal)
- 📦 Basic order management
- 📱 Responsive Design
- 🎨 Modern UI/UX with Tailwind CSS
- 🔄 State Management with Redux
- ⚡ Fast Development with Vite
- 🔒 Data Validation with Zod

## Project Structure
```
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── config/     # Configuration files
│   └── public/         # Static assets
│
└── backend/           # Node.js backend application
     |── src/
       ├── api/       # API routes and controllers
       ├── lib/       # Helper functions
       └── app.js     # Express application setup

```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Frontend Setup
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

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure your environment variables

4. Start the server:
   ```bash
   npm run dev
   ```

## Development Features
- Hot Module Replacement (HMR)
- ESLint configuration for code quality
- Husky pre-commit hooks
- Tailwind CSS for styling
- Component library integration

## Security Features
- JWT-based authentication
- RSA encryption for sensitive data
- Secure HTTP-only cookies
- Input validation and sanitization

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.