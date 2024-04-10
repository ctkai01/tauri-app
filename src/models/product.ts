export interface CreateProduct {
  name: string;
  unit: string;
  goldWeight?: string;
  goldAge?: string;
  stoneWeight?: string;
  note?: string;
  wage?: string;
  stonePrice?: string;
  price?: string;
  quantity: string;
  categoryID: number;
}

export interface UpdateProduct {
  name: string;
  unit: string;
  goldWeight?: string;
  goldAge?: string;
  stoneWeight?: string;
  note?: string;
  wage?: string;
  stonePrice?: string;
  price?: string;
  quantity: string;
  categoryID: number;
}

export interface Product {
  id: number;
  name: string;
  unit: string;
  gold_weight?: string;
  gold_age?: string;
  stone_weight?: string;
  note?: string;
  wage?: string;
  stone_price?: string;
  image?: string;
  price?: string;
  total_weight: string;
  quantity: number;
  category_id: number;
  updated_at?: string;
  created_at?: string;
}

