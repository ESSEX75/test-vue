export type TOrderStatus = 'COMPLETED' | 'NEW'

export interface IOrder {
  id: number
  name: string
  address: string
  date: string
  status: TOrderStatus
  comment?: string
}
