export interface OverviewStat {
  value: number | string
  subtext: string
  progress: number
}

export interface OverviewStats {
  activeNodes: OverviewStat
  apiRequests: OverviewStat
  aiOperations: OverviewStat
  storageUsed: OverviewStat
}

export interface NetworkNode {
  id: string
  group: number
  size?: number
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

export interface FileNode {
  id: string
  name: string
  type: "folder" | "file"
  modified: string
  size?: string
  children?: FileNode[]
}
