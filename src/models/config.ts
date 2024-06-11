export interface Config {
  id?: number;
  name: string;
}

export interface UpdateConfigToServer {
  id: number;
  name: string;
}

export interface GetConfig {
  config: Config[];
}

