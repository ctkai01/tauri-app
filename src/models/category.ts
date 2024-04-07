export interface CreateCategory {
  code: string;
  name: string;
}

export interface UpdateCategory {
  id: number;
  name: string;
  code: string;
  parent_id: number;
}

export interface UpdateAvatar {
  image?: File;
}


export interface CreateCategoryToServer {
  code: string;
  name: string;
  parent_id: number;
}


export interface UpdateCategoryToServer {
  id: number;
  code: string;
  name: string;
  parent_id: number;
}

export interface DeleteCategoryToServer {
  id: number;
}