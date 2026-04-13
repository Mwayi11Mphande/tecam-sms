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
  price: number;           // convert string from backend to number
  cost: number;            // convert string from backend to number
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
  totalAmount: number;
  items: SaleItem[];
  createdAt: string;
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
