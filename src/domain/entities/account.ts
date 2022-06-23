export interface Account {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface AddAccountModel {
  name: string;
  email: string;
  password: string;
}
