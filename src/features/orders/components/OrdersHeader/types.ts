import type { IOrder } from '../../type'

export type TAddOrderPayload = Pick<IOrder, 'name' | 'address' | 'comment'>
