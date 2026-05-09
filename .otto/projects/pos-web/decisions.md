# Project Decisions

## Technology Choices
- **Backend**: Node.js with Express for API development
- **Database**: SQLite for simplicity and file-based storage
- **Authentication**: JWT tokens with bcrypt password hashing
- **Frontend**: Vanilla JavaScript with modern CSS for lightweight deployment

## Architecture Decisions
- **RESTful API**: Clean separation between frontend and backend
- **Role-based Access**: Admin and cashier roles with different permissions
- **Real-time Updates**: Frontend polls for dashboard stats and inventory changes
- **Local Storage**: Client-side session management with automatic logout on token expiry

## Security Decisions
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Token Expiration**: 8-hour JWT tokens to balance security and usability
- **Input Validation**: Server-side validation for all API endpoints
- **CORS**: Configured for local development with production considerations

## Database Design
- **Normalized Schema**: Separate tables for users, products, sales, and sale items
- **Foreign Keys**: Proper relationships between entities
- **Indexing**: Optimized queries for common operations
- **Sample Data**: Included for immediate testing and demonstration
