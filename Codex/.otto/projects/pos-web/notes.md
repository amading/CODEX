# Project Notes

## Development Notes
- Backend server runs on port 3001 to avoid conflicts with other services
- SQLite database file (pos.db) is created automatically on first run
- Default admin user is created with credentials: admin/admin123
- JWT tokens expire after 8 hours for security

## API Design Notes
- All endpoints require authentication except login
- Error responses include descriptive messages
- Successful operations return appropriate HTTP status codes
- Database transactions ensure data consistency for sales

## Frontend Notes
- Login state is maintained in localStorage
- Automatic logout on invalid/expired tokens
- Real-time cart calculations with tax
- Responsive design works on mobile devices
- Product search supports name and barcode lookup
- POS UI navigation now includes Dashboard, Menu, Orders, Inventory, Reports, Settings, and Help.
- Payment flow now lets the cashier choose Cash or Card before pressing Proceed Payment.
- Empty states were added for products, cart, inventory, sales, and low-stock alerts.

## Security Notes
- Passwords are hashed with bcrypt (10 salt rounds)
- JWT secrets should be changed for production
- Input validation prevents SQL injection
- CORS is configured for development environment

## Performance Notes
- SQLite is suitable for small to medium retail operations
- For larger scale, consider PostgreSQL migration
- Frontend makes efficient API calls with proper error handling
- Dashboard stats are cached and updated on demand

## Gabay sa Proyekto (Tagalog Project Guide)

Ang POS Web ay isang buong sistema ng Point of Sale na binuo gamit ang Node.js, Express, SQLite, at Vanilla JavaScript. Ito ay idinisenyo para sa maliit hanggang katamtamang operasyon ng retail tulad ng tindahan, cafe, o grocery store.

### Mga Pangunahing Tampok:
- **Sistema ng Pag-authenticate**: JWT-based login na may role-based access (admin/cashier)
- **Pamamahala ng Inventory**: CRUD operations para sa mga produkto na may kategorya at barcode
- **Point of Sale Interface**: Real-time na pagbuo ng order, cart calculation, at pagproseso ng pagbabayad
- **Sales Tracking**: Rekord ng mga transaksyon na may detalye ng item at payment method
- **Dashboard**: Mga istatistika ng araw-araw, low stock alerts, at sales summary
- **Settings**: Konfigurasyon ng store name, tax rate, at currency

### Paano Gumagana ang Sistema:
1. **Login**: Gumagamit ng default credentials (admin/admin123) o lumikha ng bagong user
2. **Dashboard**: Tingnan ang overview ng sales, inventory, at alerts
3. **POS**: Maghanap ng produkto, idagdag sa cart, kalkulahin ang total kasama tax, at iproseso ang pagbabayad
4. **Inventory**: Magdagdag, i-edit, o tanggalin ang mga produkto
5. **Sales**: Suriin ang history ng mga benta
6. **Settings**: I-adjust ang store settings

### Teknikal na Arkitektura:
- **Backend**: RESTful API gamit Express.js na kumokonekta sa SQLite database
- **Frontend**: Single-page application gamit vanilla JavaScript na kumukomunikate sa API
- **Database**: SQLite na may 5 tables (users, products, sales, sale_items, settings)
- **Security**: bcrypt para sa passwords, JWT para sa authentication, input validation

## File-by-File Manual Edit Guide (Tagalog)

### server.js - Backend API Server
- **Linya 1-15**: Import ng mga dependencies at setup ng Express app
  * Baguhin ang PORT kung kailangan (default 3001)
  * Baguhin ang JWT_SECRET para sa production security
- **Linya 16-50**: Database initialization
  * Magdagdag ng bagong tables sa initializeDatabase() function
  * I-edit ang createDefaultUser() para sa ibang default credentials
- **Linya 51-80**: Authentication middleware
  * Ito ang nagpoprotekta sa mga secure endpoints
- **Linya 81-150**: Auth routes (/api/auth/login, /api/auth/register)
  * Magdagdag ng bagong auth features tulad ng password reset
- **Linya 151-250**: Product routes
  * I-edit ang search logic sa GET /api/products
  * Magdagdag ng bagong validation sa POST/PUT
- **Linya 251-350**: Sales routes
  * Baguhin ang tax calculation logic
  * Magdagdag ng discount features
- **Linya 351-400**: Settings at Dashboard routes
  * I-customize ang dashboard stats
- **Linya 401-450**: Error handling at server start
  * Magdagdag ng custom error handling

### index.html - Frontend Interface
- **Linya 1-20**: HTML head at login section
  * Baguhin ang title at meta tags
- **Linya 21-100**: Main app structure (header, sidebar, content)
  * Magdagdag ng bagong navigation buttons
  * I-edit ang dashboard cards
- **Linya 101-200**: POS section (product grid, order panel)
  * Baguhin ang category filters
  * I-customize ang cart layout
  * I-edit ang Cash/Card buttons kung gusto mong magdagdag ng payment methods
- **Linya 201-300**: Inventory, Sales, Reports, Settings sections
  * Magdagdag ng bagong form fields
  * I-edit ang table structures
- **Linya 301-350**: Modals at script loading
  * Magdagdag ng bagong modals

### script.js - Frontend Logic
- **Linya 1-50**: Global variables at utility functions
  * Baguhin ang API_BASE_URL kung kailangan
- **Linya 51-150**: Authentication functions
  * I-edit ang login/logout logic
- **Linya 151-300**: Dashboard functions
  * Magdagdag ng bagong chart o stats
- **Linya 301-500**: POS functions (product loading, cart management)
  * Baguhin ang search/filter logic
  * I-customize ang payment processing
- **Linya 501-700**: Inventory management
  * Magdagdag ng bulk import features
- **Linya 701-900**: Sales at reports
  * I-edit ang date filtering
- **Linya 901-1000**: Settings at modal handling
  * Magdagdag ng bagong settings

### styles.css - Styling
- **Linya 1-100**: Global styles at variables
  * Baguhin ang color scheme
- **Linya 101-300**: Layout styles (header, sidebar, main content)
  * I-adjust ang responsive breakpoints
- **Linya 301-500**: Component styles (cards, buttons, forms)
  * I-customize ang button designs
- **UI navigation**: Baguhin ang `.nav-btn`, `.nav-icon`, at `.filter-chip` para sa sidebar at category design
- **Empty states**: Baguhin ang `.empty-state` kung gusto mong palitan ang style ng walang laman na listahan
- **Linya 501-700**: Table at modal styles
  * Magdagdag ng bagong themes

## Latest UI Completion Notes

| File | Section/Line Hint | Purpose | What You Can Change |
| --- | --- | --- | --- |
| index.html | Sidebar navigation | Makes all major POS sections reachable | Labels, order, and visible sections |
| index.html | POS order panel | Lets cashier review customer, note, cart, and payment | Customer fields, order tags, payment labels |
| public/script.js | selectPaymentMethod | Switches Cash/Card payment before checkout | Add new methods like GCash or Bank Transfer |
| public/script.js | empty states | Shows friendly messages when lists are empty | Empty message text |
| public/styles.css | dashboard-grid and controls | Makes cards and controls align better | Columns, spacing, card sizing |
| public/styles.css | payment-btn.active | Shows selected payment method | Active color and border |

### package.json - Dependencies
- Magdagdag ng bagong dependencies sa "dependencies" section
- I-update ang scripts para sa development/production
- Baguhin ang project metadata

## Run/Check Instructions (Tagalog)

### Paano Patakbuhin ang Project:
1. **Install Dependencies**: `npm install`
2. **Start Server**: `npm start` o `npm run dev` para sa development
3. **Access App**: Buksan ang browser sa `http://localhost:3001`
4. **Login**: Gamitin ang default credentials: admin / admin123

### Paano Suriin ang Project:
1. **Check Database**: Ang pos.db file ay awtomatikong nililikha
2. **Test API**: Gamitin tools tulad ng Postman para sa /api endpoints
3. **Check Console**: Buksan browser dev tools para sa errors
4. **Test Features**: Subukan ang login, POS, inventory, sales
5. **Verify Data**: Suriin kung ang data ay nasesave sa database

### Troubleshooting:
- Kung may port conflict, baguhin ang PORT sa server.js
- Kung may database error, tanggalin ang pos.db at i-restart
- Para sa production, baguhin ang JWT_SECRET at i-secure ang credentials
