# WIP: Bar Manager Dashboard

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

- [ ] Start work on New Order and Order History backend. Routes, models, controllers
- [ ] Continue work on New Order and Order History, and move on to frontend.
- [ ] Seed the Orders in our hosted MongoDB to give us data for the Reporting tool
- [x] ~~Update Profile Page~~
- [ ] Seed more staff members
- [ ] Finish the file management interface
- [ ] Finish the Schedule management (using D3)
- [ ] Finish the Reports Tool (using D3)
- [ ] Map out architecture for Inventory and finish it
- [ ] Finish the Home Component Dashboard
- [ ] Add features like current day, weather, stats & some other nice to have information in Home Component.
- [ ] Start work on CRM Tools
- [ ] Finish work work on CRM Tools

### Medium Priority

- [x] ~~Improve theming and start to use it consistently throughout the app~~
- [x] ~~Implement i18next for text and language management~~
- [x] ~~Fix translation keys~~
- [ ] Add more text throughout the app
- [ ] Add tooltips throughout the app
- [ ] Add mnore animate.css features throughout the app
- [x] ~~Use Toastify for all success messages~~
- [x] ~~Use HTTP status codes like 429 where it gives meaning~~
- [ ] Implement Vitest and Cypress for testing on web
- [ ] Add tests with Vitest and Playwright for the web app
- [ ] Implement ErrorBoundry for web
- [ ] Fix the form for Add New Order.
- [ ] Fix the form for Add New Drink.
- [ ] Fix the form for Add New Cocktail.
- [ ] Fix active color on the drinks categories.

### Low Priority

- [ ] Add Github actions for the project
- [ ] Add Swagger to the web app project
- [ ] Make sure everything is translated to Danish and Swedish
- [ ] Implement forgot password and more auth stuff
- [x] ~~Clean up unused clusters in our hosted MongoDB~~
- [x] ~~Update the PageNotFound component with a way to go to the home page or go back~~
- [x] ~~Implement the PageNotFound component when we have a 404~~
- [ ] Start the architecture for the mobile app, and map out the functionality
- [ ] Start on mobile app API expansion on our current API endpoints
- [ ] Start work on the mobile app
- [ ] Implement Jest and Maestro for testing on mobile
- [ ] Implement ErrorBoundry for the mobile app
- [ ] Implement a messaging tool that will work with both the web app and the mobile app
- [ ] Implement a notification tool that will work with both the web app and the mobile app

### Next Steps

1. ~~Test existing functionality in the web app and clean up MongoDB~~
2. Start working on the Orders overview and order management
3. Investigate usage of memo and context where it might make sense.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email jhj@jhjdev.com or open an issue in the GitHub repository.
