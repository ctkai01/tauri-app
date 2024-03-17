export interface CreateCategory {
  id: string;
  name: string;
}

export interface UpdateCategory {
  id?: string;
  name?: string;
}

export interface UpdateAvatar {
  image?: File;
}


export interface CreateCategoryToServer {
  id: string;
  name: string;
  category_id: string | null;
}