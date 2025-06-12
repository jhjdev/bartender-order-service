# Bar Manager Dashboard

A comprehensive bar management system built with modern web technologies. This application helps bar managers handle orders, inventory, staff scheduling, and reporting in one centralized platform.

## Technologies Used

### Frontend

- React 18
- TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- D3.js for data visualization (planned)
- React-Toastify for notifications (planned)
- Playwright for E2E testing (planned)
- Vitest for unit testing (planned)

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB (using native MongoDB driver)
- JWT for authentication
- Bcrypt for password hashing
- Swagger for API documentation (planned)

### Development Tools

- Vite for build tooling
- ESLint for code linting
- Prettier for code formatting
- GitHub Actions for CI/CD (planned)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bar-manager-dashboard.git
cd bar-manager-dashboard
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=4000
VITE_API_URL=http://localhost:4000

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string
DB_NAME=bartender

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Email Configuration (if needed)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# Pexels API Configuration (Optional)
# Only needed if you want to use the image download feature
PEXELS_API_KEY=your_pexels_api_key
```

> Note: The Pexels API key is optional and is only required if you want to use the image download feature. You can get a free API key from [Pexels](https://www.pexels.com/api/).

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The backend API runs on port 4000.

## Database Seeding

To seed the database with initial data:

1. Ensure your MongoDB connection is properly configured in the `.env` file
2. Run the seeding script:

```bash
npm run seed
# or
yarn seed
```

This will populate your database with:

- Admin user
- Sample staff members
- Initial menu items
- Sample orders
- Basic schedule data

## Creating an Admin User

To create an initial admin user, follow these steps:

1. Make sure your MongoDB connection is set up in your `.env` file:

   ```
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=bartender
   ```

2. Run the seed script:

   ```bash
   # From the project root
   cd backend
   npx ts-node scripts/seedAdmin.ts
   ```

3. The script will create an admin user with the following default credentials:

   - Email: admin@bartender.com
   - Password: (randomly generated, will be displayed in the console)

4. Save the credentials displayed in the console. You can use these to log in to the system.

5. For security reasons, make sure to change the password after your first login.

Note: If you run the script multiple times, it will update the password of the existing admin user instead of creating a new one.

## Project Structure

```
bar-manager-dashboard/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── redux/         # Redux store and slices
│   ├── services/      # API services
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── App.tsx        # Root component
├── public/            # Static assets
├── tests/             # Test files
└── package.json       # Project dependencies
```

## TO-DO List

### High Priority

- [ ] Improve theming and start to use it consistently throughout the app
- [ ] Finish Add New Order and the Order Overview, and overhaul Orders endpoint
- [ ] Seed the Orders in our hosted MongoDB to give us data for the Reporting tool
- [ ] Update admin profile and seed more staff members
- [ ] Finish the file management interface
- [ ] Implement i18next for text and language management
- [ ] Add more text throughout the app
- [ ] Add tooltips throughout the app

### Medium Priority

- [ ] Map out and draw how I want the inventory management to look like and function
- [ ] Finish the schedule system and seed it with data (using D3)
- [ ] Finish the reports tool (using D3)
- [ ] Start the architecture for the mobile app, and map out the functionality
- [ ] Start on mobile app API expansion on our current API endpoints
- [ ] Start work on the mobile app

### Low Priority

- [ ] Implement Jest and Maestro for testing for the mobile app
- [ ] Implement a notification tool that will work with both the web app and the mobile app
- [ ] Add Github actions for the project
- [ ] Clean up unused clusters in our hosted MongoDB
- [ ] Add Swagger to the web app project
- [ ] Add tests with Vitest and Playwright for the web app
- [ ] Use Toastify for all success messages
- [ ] Use HTTP status codes like 429 where it gives meaning
- [ ] Implement ErrorBoundry for both web app and mobile app
- [x] ~~Update the PageNotFound component with a way to go to the home page or go back~~
- [x] ~~Implement the PageNotFound component when we have a 404~~
- [ ] Add features like current day, weather, some other nice to have information in header or below header.

### Next Steps

1. Test existing functionality in the web app and clean up MongoDB
2. Start working on the Orders overview and order management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@barmanager.com or open an issue in the GitHub repository.
