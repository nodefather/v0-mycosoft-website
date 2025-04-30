export interface Fungi {
  id: number
  scientificName: string
  commonName: string
  family: string
  genus: string
  species: string
  description: string
  habitat: string
  ecology: string
  edibility: string
  toxicity: string
  season: string
  distribution: string
  notes: string
  createdAt: string
  updatedAt: string
  characteristics: FungiCharacteristics
  images: FungiImage[]
  taxonomy: TaxonomicClassification
}

export interface FungiImage {
  id: number
  fungiId: number
  imageUrl: string
  caption: string
  isPrimary: boolean
  createdAt: string
}

export interface FungiCharacteristics {
  id: number
  fungiId: number
  capShape: string
  capSurface: string
  capColor: string
  bruises: boolean
  odor: string
  gillAttachment: string
  gillSpacing: string
  gillColor: string
  stalkShape: string
  stalkRoot: string
  stalkSurfaceAboveRing: string
  stalkSurfaceBelowRing: string
  stalkColorAboveRing: string
  stalkColorBelowRing: string
  veilType: string
  veilColor: string
  ringNumber: number
  ringType: string
  sporePrintColor: string
  population: string
  substrate: string
}

export interface TaxonomicClassification {
  id: number
  fungiId: number
  kingdom: string
  phylum: string
  class: string
  orderName: string
  family: string
  genus: string
  species: string
}
