export interface ILoginPayload {
  user: string
  password: string
}

export type TUserRole = 'USER' | 'ADMIN'

export interface IUserData {
  name: string
  role: TUserRole
}

export interface ILoginResponse extends IUserData {
  accessToken: string
}
