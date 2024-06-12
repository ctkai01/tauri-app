export interface Config {
  id?: number;
  name: string;
  address?: string;
}

export interface UpdateConfigToServer {
  id: number;
  name: string;
  address?: string
}

export interface GetConfig {
  config: Config[];
}

