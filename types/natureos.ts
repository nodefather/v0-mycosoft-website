export interface StatCardData {
  value: number | string
  subtext: string
  progress: number
  change?: number
}

export interface OverviewStats {
  activeNodes: StatCardData
  apiRequests: StatCardData
  aiOperations: StatCardData
  storageUsed: StatCardData
}

export interface NetworkNode {
  id: string
  group: number
  size: number
}

export interface NetworkLink {
  source: string
  target: string
  value: number
}

export interface MyceliumNetworkData {
  nodes: NetworkNode[]
  links: NetworkLink[]
}

export interface TrendDataPoint {
  date: string
  value: number
}

export interface AnalyticsTrends {
  networkGrowth: TrendDataPoint[]
  signalStrength: TrendDataPoint[]
  dataProcessing: TrendDataPoint[]
}

export interface FileNode {
  id: string
  name: string
  type: "folder" | "file"
  size?: string
  modified: string
  children?: FileNode[]
}
