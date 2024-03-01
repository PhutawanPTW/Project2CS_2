export interface User {
  userID: number;
  username: string;
  password: string;
  image: string;
  type: string;
  email: string;
}

export interface Register {
  username: string,
  password: string,
  email: string
}