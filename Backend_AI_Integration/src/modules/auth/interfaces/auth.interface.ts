export interface ISessionUser {
  id: string;
  fullname: string;
  email: string;
  status: string;
  type: string;
  idrole: string;
  password: string;
  role: {
    id: string;
    permission: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IDataUser {
  id: string;
  fullname: string;
  phone: string;
  gender: string;
  email: string;
  password: string;
  refreshtoken: string;
  urlavatar: string;
  status: string;
  type: string;
  idrole: string;
  createdAt: Date;
  updatedAt: Date;
  role: {
    id: string;
    permission: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IRegisterUser {
  id: string;
  fullname: string;
  gender: string;
  email: string;
  urlavatar: string;
  type: string;
  hashPassword: string;
}
