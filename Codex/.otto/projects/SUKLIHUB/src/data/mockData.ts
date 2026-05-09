import type { Product, Order, Customer, Employee, StockMovement, DailySummary } from "@/types";

export const categories = [
  "All", "Beverages", "Canned Goods", "Dairy", "Snacks", "Personal Care",
  "Condiments", "Frozen", "Bread & Bakery", "Cleaning", "Rice & Grains", "Noodles",
];

export const products: Product[] = [
  {
    id: "p001", name: "Coca-Cola 1.5L", barcode: "5449000000996", qrCode: "QR-P001",
    category: "Beverages", brand: "Coca-Cola", unit: "bottle", quantity: 48,
    costPrice: 48, sellingPrice: 65, supplier: "San Miguel Distributors",
    expirationDate: "2026-12-31", stockLocation: "Aisle 1", minStock: 12,
    isDeliveryItem: true, isBIRItem: true, image: "https://picsum.photos/200/200?random=1",
    status: "in_stock", lastUpdated: "2026-05-07",
  },
  {
    id: "p002", name: "Lucky Me Pancit Canton", barcode: "4800001234567", qrCode: "QR-P002",
    category: "Noodles", brand: "Lucky Me", unit: "pack", quantity: 5,
    costPrice: 12, sellingPrice: 18, supplier: "Monde Nissin",
    expirationDate: "2026-09-15", stockLocation: "Aisle 3", minStock: 24,
    isDeliveryItem: false, isBIRItem: true, image: "https://picsum.photos/200/200?random=2",
    status: "low_stock", lastUpdated: "2026-05-07",
  },
  {
    id: "p003", name: "Palmolive Shampoo 200ml", barcode: "8851932107428", qrCode: "QR-P003",
    category: "Personal Care", brand: "Palmolive", unit: "bottle", quantity: 0,
    costPrice: 85, sellingPrice: 120, supplier: "Colgate-Palmolive",
    expirationDate: "2027-06-30", stockLocation: "Aisle 5", minStock: 10,
    isDeliveryItem: false, isBIRItem: true, image: "https://picsum.photos/200/200?random=3",
    status: "out_of_stock", lastUpdated: "2026-05-06",
  },
  {
    id: "p004", name: "Century Tuna 155g", barcode: "4800088987654", qrCode: "QR-P004",
    category: "Canned Goods", brand: "Century Tuna", unit: "can", quantity: 120,
    costPrice: 38, sellingPrice: 52, supplier: "Century Pacific",
    expirationDate: "2028-03-20", stockLocation: "Aisle 2", minStock: 24,
    isDeliveryItem: true, isBIRItem: true, image: "https://picsum.photos/200/200?random=4",
    status: "in_stock", lastUpdated: "2026-05-07",
  },
  {
    id: "p005", name: "Nestle All-Purpose Cream", barcode: "6901234567890", qrCode: "QR-P005",
    category: "Dairy", brand: "Nestle", unit: "pack", quantity: 8,
    costPrice: 42, sellingPrice: 58, supplier: "Nestle Philippines",
    expirationDate: "2026-06-15", stockLocation: "Aisle 4", minStock: 15,
    isDeliveryItem: false, isBIRItem: true, image: "https://picsum.photos/200/200?random=5",
    status: "low_stock", lastUpdated: "2026-05-07",
  },
  {
    id: "p006", name: "Pringles Original 107g", barcode: "038000845222", qrCode: "QR-P006",
    category: "Snacks", brand: "Pringles", unit: "can", quantity: 36,
    costPrice: 95, sellingPrice: 135, supplier: "Kellogg's PH",
    expirationDate: "2026-10-30", stockLocation: "Aisle 3", minStock: 12,
    isDeliveryItem: false, isBIRItem: true, image: "https://picsum.photos/200/200?random=6",
    status: "in_stock", lastUpdated: "2026-05-07",
  },
  {
    id: "p007", name: "White King Rice 5kg", barcode: "4800123459876", qrCode: "QR-P007",
    category: "Rice & Grains", brand: "White King", unit: "bag", quantity: 20,
    costPrice: 280, sellingPrice: 340, supplier: "NFA Rice Distributors",
    stockLocation: "Storage Room", minStock: 10,
    isDeliveryItem: true, isBIRItem: false, image: "https://picsum.photos/200/200?random=7",
    status: "in_stock", lastUpdated: "2026-05-07",
  },
  {
    id: "p008", name: "Mama Sita Sinigang Mix", barcode: "4800056789012", qrCode: "QR-P008",
    category: "Condiments", brand: "Mama Sita", unit: "pack", quantity: 3,
    costPrice: 18, sellingPrice: 28, supplier: "Mama Sita's",
    expirationDate: "2027-01-15", stockLocation: "Aisle 2", minStock: 20,
    isDeliveryItem: false, isBIRItem: true, image: "https://picsum.photos/200/200?random=8",
    status: "low_stock", lastUpdated: "2026-05-07",
  },
];

export const orders: Order[] = [
  {
    id: "o001", orderNumber: "ORD-2026-0501", customerId: "c001", customerName: "Maria Santos",
    items: [
      { productId: "p001", productName: "Coca-Cola 1.5L", quantity: 3, price: 65, total: 195 },
      { productId: "p004", productName: "Century Tuna 155g", quantity: 5, price: 52, total: 260 },
    ],
    totalAmount: 455, paymentStatus: "paid", orderStatus: "completed",
    deliveryStatus: "delivered", isBIR: true, cashierName: "Ana Reyes",
    createdAt: "2026-05-07 09:15",
  },
  {
    id: "o002", orderNumber: "ORD-2026-0502", customerId: "c002", customerName: "Jose Dela Cruz",
    items: [
      { productId: "p006", productName: "Pringles Original 107g", quantity: 2, price: 135, total: 270 },
      { productId: "p007", productName: "White King Rice 5kg", quantity: 1, price: 340, total: 340 },
    ],
    totalAmount: 610, paymentStatus: "unpaid", orderStatus: "pending",
    deliveryStatus: "pending", isBIR: false, cashierName: "Ben Cruz",
    createdAt: "2026-05-07 10:30", deliveryDate: "2026-05-08",
  },
  {
    id: "o003", orderNumber: "ORD-2026-0503", customerName: "Walk-in Customer",
    items: [
      { productId: "p002", productName: "Lucky Me Pancit Canton", quantity: 10, price: 18, total: 180 },
    ],
    totalAmount: 180, paymentStatus: "paid", orderStatus: "completed",
    isBIR: true, cashierName: "Ana Reyes", createdAt: "2026-05-07 11:00",
  },
  {
    id: "o004", orderNumber: "ORD-2026-0504", customerId: "c003", customerName: "Liza Gomez",
    items: [
      { productId: "p005", productName: "Nestle All-Purpose Cream", quantity: 4, price: 58, total: 232 },
      { productId: "p008", productName: "Mama Sita Sinigang Mix", quantity: 6, price: 28, total: 168 },
    ],
    totalAmount: 400, paymentStatus: "paid", orderStatus: "voided",
    isBIR: false, cashierName: "Ben Cruz", createdAt: "2026-05-07 11:45",
  },
  {
    id: "o005", orderNumber: "ORD-2026-0505", customerId: "c001", customerName: "Maria Santos",
    items: [
      { productId: "p001", productName: "Coca-Cola 1.5L", quantity: 6, price: 65, total: 390 },
      { productId: "p004", productName: "Century Tuna 155g", quantity: 12, price: 52, total: 624 },
      { productId: "p007", productName: "White King Rice 5kg", quantity: 2, price: 340, total: 680 },
    ],
    totalAmount: 1694, paymentStatus: "partial", orderStatus: "delivery",
    deliveryStatus: "preparing", isBIR: true, cashierName: "Ana Reyes",
    createdAt: "2026-05-07 13:00", deliveryDate: "2026-05-08",
  },
];

export const customers: Customer[] = [
  {
    id: "c001", name: "Maria Santos", contact: "09171234567",
    address: "123 Rizal St., Brgy. San Jose, Manila",
    totalOrders: 45, totalSpending: 18500, creditBalance: 0,
    loyaltyPoints: 185, lastOrder: "2026-05-07",
    deliveryNotes: "Leave at gate if not home", qrCode: "QR-C001",
    favoriteProducts: ["p001", "p004"],
  },
  {
    id: "c002", name: "Jose Dela Cruz", contact: "09289876543",
    address: "456 Mabini Ave., Brgy. Poblacion, Makati",
    totalOrders: 23, totalSpending: 9200, creditBalance: 500,
    loyaltyPoints: 92, lastOrder: "2026-05-07",
    deliveryNotes: "Call before delivery", qrCode: "QR-C002",
    favoriteProducts: ["p007"],
  },
  {
    id: "c003", name: "Liza Gomez", contact: "09352345678",
    address: "789 Burgos St., Brgy. Malate, Manila",
    totalOrders: 67, totalSpending: 32000, creditBalance: 200,
    loyaltyPoints: 320, lastOrder: "2026-05-07",
    qrCode: "QR-C003", favoriteProducts: ["p005", "p008"],
  },
  {
    id: "c004", name: "Ramon Bautista", contact: "09463456789",
    address: "321 Luna Blvd., Caloocan City",
    totalOrders: 12, totalSpending: 4800, creditBalance: 0,
    loyaltyPoints: 48, lastOrder: "2026-05-06",
    qrCode: "QR-C004", favoriteProducts: ["p006"],
  },
];

export const employees: Employee[] = [
  {
    id: "e001", name: "Ana Reyes", role: "cashier",
    avatar: "https://i.pravatar.cc/100?u=ana-reyes",
    checkIn: "08:00", checkOut: undefined,
    totalSales: 45200, ordersProcessed: 78, voidsMade: 2,
    productsAdded: 5, isActive: true,
  },
  {
    id: "e002", name: "Ben Cruz", role: "inventory",
    avatar: "https://i.pravatar.cc/100?u=ben-cruz",
    checkIn: "08:30", checkOut: undefined,
    totalSales: 0, ordersProcessed: 0, voidsMade: 0,
    productsAdded: 45, isActive: true,
  },
  {
    id: "e003", name: "Clara Tan", role: "manager",
    avatar: "https://i.pravatar.cc/100?u=clara-tan",
    checkIn: "07:45", checkOut: undefined,
    totalSales: 12000, ordersProcessed: 20, voidsMade: 0,
    productsAdded: 10, isActive: true,
  },
  {
    id: "e004", name: "Diego Santos", role: "delivery",
    avatar: "https://i.pravatar.cc/100?u=diego-santos",
    checkIn: "09:00", checkOut: undefined,
    totalSales: 0, ordersProcessed: 8, voidsMade: 0,
    productsAdded: 0, isActive: true,
  },
];

export const stockMovements: StockMovement[] = [
  {
    id: "sm001", productId: "p001", productName: "Coca-Cola 1.5L", type: "stock_in",
    quantity: 24, before: 24, after: 48, note: "Restocked from supplier",
    employeeId: "e002", employeeName: "Ben Cruz", createdAt: "2026-05-07 08:00",
  },
  {
    id: "sm002", productId: "p002", productName: "Lucky Me Pancit Canton", type: "stock_out",
    quantity: 10, before: 15, after: 5, note: "Sold to walk-in",
    employeeId: "e001", employeeName: "Ana Reyes", createdAt: "2026-05-07 11:00",
  },
  {
    id: "sm003", productId: "p003", productName: "Palmolive Shampoo 200ml", type: "expired",
    quantity: 3, before: 3, after: 0, note: "Expired items removed",
    employeeId: "e003", employeeName: "Clara Tan", createdAt: "2026-05-07 07:45",
  },
  {
    id: "sm004", productId: "p004", productName: "Century Tuna 155g", type: "delivery_prep",
    quantity: 17, before: 137, after: 120, note: "Prepared for customer delivery",
    employeeId: "e004", employeeName: "Diego Santos", createdAt: "2026-05-07 13:00",
  },
];

export const dailySummary: DailySummary = {
  date: "2026-05-07",
  totalSales: 58745,
  totalOrders: 127,
  totalItemsSold: 342,
  pendingDelivery: 8,
  outgoingStock: 245,
  incomingStock: 180,
};

export const salesChartData = [
  { day: "Mon", sales: 42000, orders: 98 },
  { day: "Tue", sales: 55000, orders: 115 },
  { day: "Wed", sales: 48000, orders: 102 },
  { day: "Thu", sales: 61000, orders: 128 },
  { day: "Fri", sales: 73000, orders: 156 },
  { day: "Sat", sales: 89000, orders: 198 },
  { day: "Sun", sales: 58745, orders: 127 },
];

export const topProductsData = [
  { name: "Coca-Cola 1.5L", sold: 156, revenue: 10140 },
  { name: "Century Tuna 155g", sold: 134, revenue: 6968 },
  { name: "White King Rice 5kg", sold: 89, revenue: 30260 },
  { name: "Lucky Me Pancit Canton", sold: 210, revenue: 3780 },
  { name: "Pringles Original", sold: 67, revenue: 9045 },
];

export const stockMovementChartData = [
  { date: "05/01", in: 120, out: 95 },
  { date: "05/02", in: 80, out: 110 },
  { date: "05/03", in: 200, out: 145 },
  { date: "05/04", in: 160, out: 130 },
  { date: "05/05", in: 90, out: 170 },
  { date: "05/06", in: 180, out: 120 },
  { date: "05/07", in: 145, out: 98 },
];

export const deliveryTomorrow = [
  { customer: "Maria Santos", items: 3, address: "123 Rizal St., Manila", total: 1694 },
  { customer: "Jose Dela Cruz", items: 2, address: "456 Mabini Ave., Makati", total: 610 },
];

export const lowStockAlerts = products.filter(p => p.status === "low_stock" || p.status === "out_of_stock");

export const expiringProducts = products.filter(p => {
  if (!p.expirationDate) return false;
  const exp = new Date(p.expirationDate);
  const now = new Date("2026-05-07");
  const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 60;
});

export const recentActivity = [
  { id: 1, type: "sale", message: "Order #ORD-2026-0505 placed by Maria Santos", time: "2 min ago", icon: "shopping-cart" },
  { id: 2, type: "stock", message: "Ben Cruz added 24 units of Coca-Cola 1.5L", time: "1 hr ago", icon: "package" },
  { id: 3, type: "void", message: "Order #ORD-2026-0504 voided by Ben Cruz", time: "2 hr ago", icon: "x-circle" },
  { id: 4, type: "delivery", message: "Delivery prepared for Jose Dela Cruz", time: "3 hr ago", icon: "truck" },
  { id: 5, type: "alert", message: "Lucky Me Pancit Canton is low on stock (5 left)", time: "4 hr ago", icon: "alert-triangle" },
  { id: 6, type: "customer", message: "New customer Liza Gomez added", time: "5 hr ago", icon: "user-plus" },
];
