export interface CreateProduct {
  name: string;
  unit: string;
  image?: File;
  goldWeight?: number;
  goldAge?: number;
  stoneWeight?: number;
  note?: string;
  wage?: number;
  stonePrice?: number;
  price?: number;
}

// export interface UpdateCategory {
//   id?: string;
//   name?: string;
// }