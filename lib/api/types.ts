// -----------------------------
// Generic API Types
// -----------------------------

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

// -----------------------------
// Auth
// -----------------------------

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  shopId?: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

// -----------------------------
// Products
// -----------------------------

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  status: "ACTIVE" | "INACTIVE";
  stockQty: number;
  lowStockThreshold: number;
  shopId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// -----------------------------
// Categories
// -----------------------------

export type Category = {
  id: string;
  name: string;
  createdAt: string;
};

// -----------------------------
// Sales
// -----------------------------

export type SaleItem = {
  id: string;
  productId?: string;
  serviceId?: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
};

export type Sale = {
  id: string;

  shopId: string;
  cashierId: string;

  receiptNumber: string;

  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;

  totalItems: number;

  paymentMethod:
    | "CASH"
    | "CARD"
    | "MOBILE"
    | "BANK";

  amountPaid: number;
  changeGiven: number;

  status:
    | "COMPLETED"
    | "VOIDED"
    | "PENDING";

  voidedAt: string | null;
  voidedById: string | null;
  voidReason: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  saleItems: SaleItem[];

  cashier: {
    id: string;
    fullName: string;
  };
};

// -----------------------------
// Staff
// -----------------------------
export type Staff = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  shopId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Shop = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  tpin?: string;

  vatRegistered: boolean;
  vatRate: number; // convert string -> number

  subscriptionStatus: "TRIAL" | "ACTIVE" | "SUSPENDED" | "CANCELLED";
  subscriptionPlan: "BASIC" | "PRO" | "ENTERPRISE" | null;
  subscriptionExpiry: string | null;

  isActive: boolean;

  ownerId: string;

  createdAt: string;
  updatedAt: string;
};
