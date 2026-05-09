export type OrderStatus = "completed" | "pending" | "voided" | "delivery";
export type PaymentStatus = "paid" | "unpaid" | "partial";
export type DeliveryStatus = "delivered" | "pending" | "preparing" | "cancelled";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type MovementType = "stock_in" | "stock_out" | "adjustment" | "damaged" | "expired" | "returned" | "transfer" | "delivery_prep";
export type EmployeeRole = "cashier" | "inventory" | "manager" | "admin" | "delivery";
export type Theme = "light" | "dark";

export interface Product {
  id: string;
  name: string;
  barcode: string;
  qrCode: string;
  category: string;
  brand: string;
  unit: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  expirationDate?: string;
  stockLocation: string;
  minStock: number;
  isDeliveryItem: boolean;
  isBIRItem: boolean;
  notes?: string;
  image: string;
  status: StockStatus;
  lastUpdated: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryStatus?: DeliveryStatus;
  isBIR: boolean;
  cashierName: string;
  createdAt: string;
  deliveryDate?: string;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  address: string;
  totalOrders: number;
  totalSpending: number;
  creditBalance: number;
  loyaltyPoints: number;
  lastOrder: string;
  deliveryNotes?: string;
  qrCode: string;
  favoriteProducts: string[];
}

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  avatar: string;
  checkIn?: string;
  checkOut?: string;
  totalSales: number;
  ordersProcessed: number;
  voidsMade: number;
  productsAdded: number;
  isActive: boolean;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  before: number;
  after: number;
  note?: string;
  employeeId: string;
  employeeName: string;
  createdAt: string;
}

export interface DailySummary {
  date: string;
  totalSales: number;
  totalOrders: number;
  totalItemsSold: number;
  pendingDelivery: number;
  outgoingStock: number;
  incomingStock: number;
}
