export type TTypeFilter = 'UP' | 'DOWN'

export type TSortType = 'FILTER' | 'ADDERS'

export interface IFilter {
  date: TTypeFilter
  address: TTypeFilter
}
