export interface CreateProduct {
  name: string;
  goldWeight?: string;
  goldPercent?: string;
  stoneWeight?: string;
  company?: string;
  companyAddress?: string;
  wage?: string;
  quantity: string;
  categoryID: number;
}

export interface UpdateProduct {
  name: string;
  goldWeight?: string;
  goldPercent?: string;
  stoneWeight?: string;
  wage?: string;
  quantity: string;
  company?: string;
  companyAddress?: string;
  categoryID: number;
}

export interface Product {
  id: number;
  name: string;
  gold_weight?: string;
  gold_percent?: string;
  stone_weight?: string;
  wage?: string;
  company?: string;
  company_address?: string;
  total_weight: string;
  quantity: number;
  category_id: number;
  updated_at?: string;
  created_at?: string;
}

export interface UpdateProductToServer {
  id: number;
  name: string;
  gold_weight?: string;
  gold_percent?: string;
  stone_weight?: string;
  total_weight: number;
  company?: string;
  company_address?: string;
  wage?: string;
  quantity: number;
  category_id: number;
}

export interface ImageToServer {
  image_data: number[];
  file_name: string;
}

export interface GetProductPaginate {
  products: Product[];
  page: number;
  limit: number;
  total_page: number;
  total_count: number;
}