# HereForYou - Home Services Platform

A comprehensive platform connecting customers with verified home service professionals in Kerala.

## Features

### For Customers
- Browse and book various home services
- Real-time tracking of service providers
- Secure payment options
- Rate and review services
- 24/7 customer support

### For Professionals
- Register and get verified
- Manage bookings and availability
- Track earnings and performance
- Build customer relationships

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Responsive design
- Progressive Web App features

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- File upload with Multer
- Email notifications
- SMS integration

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd hereforyou
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB service

5. Seed the database
```bash
npm run seed
```

6. Start the development server
```bash
npm run server:dev
```

7. Start the frontend (in another terminal)
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-phone` - Verify phone number
- `POST /api/auth/forgot-password` - Password reset

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/addresses` - Add address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address

### Professionals
- `GET /api/professionals` - Get all professionals
- `GET /api/professionals/:id` - Get professional by ID
- `POST /api/professionals/register` - Register as professional
- `PUT /api/professionals/profile` - Update professional profile
- `GET /api/professionals/:id/availability` - Get availability

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/professional/:id` - Get professional reviews
- `GET /api/reviews/my-reviews` - Get user reviews

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/search/:query` - Search services

### Support
- `POST /api/support/ticket` - Create support ticket
- `GET /api/support/faq` - Get FAQ
- `POST /api/support/contact` - Contact form

## Database Schema

### User Model
- Personal information
- Authentication details
- Profile and preferences
- Address management
- Verification status

### Professional Model
- Service offerings
- Experience and skills
- Pricing and availability
- Verification documents
- Ratings and statistics

### Booking Model
- Service details
- Schedule and location
- Payment information
- Status tracking
- Timeline history

### Review Model
- Rating breakdown
- Comments and feedback
- Images and verification
- Helpful votes

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- File upload restrictions
- CORS protection
- Helmet security headers

## Deployment

### Environment Variables
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
EMAIL_HOST=your-email-host
EMAIL_USER=your-email
EMAIL_PASS=your-email-password
```

### Production Setup
1. Set up MongoDB Atlas or self-hosted MongoDB
2. Configure email service (Gmail, SendGrid, etc.)
3. Set up SMS service for OTP
4. Configure payment gateway
5. Set up file storage (AWS S3, Cloudinary, etc.)
6. Deploy to cloud platform (Heroku, AWS, DigitalOcean, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@hereforyou.in or join our Slack channel.
