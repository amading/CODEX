# POS Web - Full Stack Point of Sale System

## 🚀 Features Added

### Backend API (Node.js + Express + SQLite)
- **Authentication System**: JWT-based login with role-based access
- **Database Integration**: SQLite database with proper schema
- **RESTful API**: Complete CRUD operations for products, sales, settings
- **Security**: Password hashing, token authentication, input validation

### Enhanced Frontend
- **User Authentication**: Login/logout with session management
- **Dashboard**: Real-time stats and low stock alerts
- **Persistent Data**: All data saved to database
- **Advanced Features**: Barcode scanning, inventory alerts, sales analytics

### Database Schema
- **Users**: Authentication and role management
- **Products**: Inventory with categories and barcodes
- **Sales**: Transaction records with payment methods
- **Sale Items**: Detailed transaction items
- **Settings**: Store configuration and preferences

## 🛠 Technical Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern design
- **Vanilla JavaScript** - Client-side logic
- **Fetch API** - HTTP requests

## 📁 Project Structure

```
pos-web/
├── server.js              # Backend API server
├── index.html            # Frontend application
├── styles.css            # CSS styling
├── package.json          # Dependencies
├── pos.db               # SQLite database (created automatically)
└── public/
    └── script.js         # Frontend JavaScript
```

## 📖 Gabay sa Proyekto (Tagalog Guide)

Ang POS Web ay isang komprehensibong web-based na sistema ng Point of Sale na binuo gamit ang modernong web technologies. Ang sistemang ito ay idinisenyo upang tulungan ang mga maliit at katamtamang negosyo sa retail na pamahalaan ang kanilang inventory, proseso ng pagbebenta, at pagsusuri ng sales data.

### Mga Pangunahing Bahagi ng Sistema:

#### 1. **Sistema ng Pag-login at Seguridad**
- Gumagamit ng JWT (JSON Web Tokens) para sa secure authentication
- May role-based access control (Admin at Cashier)
- Automatic logout kapag expired ang token
- Password hashing gamit bcrypt para sa seguridad

#### 2. **Dashboard at Analytics**
- Real-time na display ng sales data para sa araw na iyon
- Low stock alerts para sa inventory management
- Summary ng total products at stock levels
- Visual na representation ng key metrics

#### 3. **Point of Sale (POS) Interface**
- Madaling paghahanap ng produkto sa pamamagitan ng name o barcode
- Real-time na cart calculation kasama ang tax
- Support para sa iba't ibang payment methods
- Customer name at order notes para sa tracking

#### 4. **Pamamahala ng Inventory**
- CRUD operations para sa mga produkto
- Kategorya-based organization
- Stock level tracking at alerts
- Barcode support para sa quick scanning

#### 5. **Sales History at Reports**
- Komprehensibong rekord ng lahat ng transaksyon
- Date-based filtering para sa reports
- Detalye ng mga item na binenta
- Payment method tracking

#### 6. **Settings at Configuration**
- I-customize ang store name, tax rate, at currency
- Flexible settings para sa iba't ibang business needs
- Easy configuration para sa localization

### Paano Gamitin ang Sistema:

1. **Pag-install at Setup**
   ```bash
   npm install
   npm start
   ```
   Buksan ang browser sa `http://localhost:3001`

2. **Unang Login**
   - Username: admin
   - Password: admin123

3. **Pangunahing Workflow**
   - Suriin ang Dashboard para sa overview
   - Mag-navigate sa POS para mag-process ng orders
   - Pamahalaan ang inventory sa Inventory section
   - Suriin ang sales history sa Sales section
   - I-adjust ang settings ayon sa kailangan

### Teknikal na Detalye:

- **Database**: SQLite para sa easy deployment at portability
- **API**: RESTful design na madaling i-extend
- **Frontend**: Vanilla JavaScript na walang external frameworks
- **Security**: Input validation at SQL injection protection
- **Performance**: Efficient queries at client-side caching

Ang sistemang ito ay production-ready para sa maliit hanggang katamtamang retail operations at madaling i-scale up sa mas malalaking databases tulad ng PostgreSQL kung kailangan.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```

3. **Access the Application**:
   - Open `http://localhost:3001` in your browser
   - Login with: `admin` / `admin123`

## 🔐 Default Credentials

- **Username**: admin
- **Password**: admin123
- **Role**: Administrator

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (admin only)

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `POST /api/sales` - Create new sale
- `GET /api/sales` - Get sales history

### Settings
- `GET /api/settings` - Get store settings
- `PUT /api/settings` - Update settings

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## 🎯 Key Features

### Point of Sale
- Real-time product search
- Shopping cart with quantity controls
- Tax calculations
- Multiple payment methods
- Receipt generation

### Inventory Management
- Add/edit/delete products
- Stock level tracking
- Category organization
- Barcode support
- Low stock alerts

### Sales Analytics
- Transaction history
- Date range filtering
- Payment method tracking
- Sales reporting

### User Management
- Role-based access (Admin/Cashier)
- Secure authentication
- Session management

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- SQL injection prevention

## 📱 Responsive Design

- Mobile-friendly interface
- Adaptive layouts
- Touch-optimized controls
- Cross-browser compatibility

## 🔄 Data Persistence

- SQLite database for data storage
- Automatic database initialization
- Sample data included
- Data integrity constraints

## 🚀 Future Enhancements

- Real barcode scanning
- Receipt printing
- Multi-store support
- Advanced reporting with charts
- Customer management
- Supplier integration
- Mobile app version
- Cloud deployment

## 📝 Usage Guide

1. **Login** with default credentials
2. **Dashboard** shows real-time statistics
3. **POS Section** for making sales
4. **Inventory** for managing products
5. **Sales** for viewing transaction history
6. **Reports** for analytics
7. **Settings** for store configuration

This POS system provides a solid foundation for retail operations with room for expansion based on specific business needs.
