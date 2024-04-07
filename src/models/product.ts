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
  quantity: number;
  categoryID: number;
}

export interface Product {
  id: string;
  name: string;
  unit: string;
  goldWeight?: string;
  goldAge?: string;
  stoneWeight?: string;
  note?: string;
  wage?: string;
  stonePrice?: string;
  price?: string;
  quantity: number;
  categoryID: number;
  createdAt?: string;
}

