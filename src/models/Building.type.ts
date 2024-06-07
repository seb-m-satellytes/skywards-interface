import { Resource } from '@/models/Resource.type.ts'

export interface Building {
  id: number
  name: string
  building_type: string
  status: string
}

export interface BuildingBlueprint {
  id: number
  name: string
  category: string
  slots_required: number
  baseResources: Resource[]
  timeToBuild: number
  isBuildable: boolean
}

export interface BuildingSlot {
  building_id: number | null
  settlement_slot_id: number
  usable: 0 | 1
}