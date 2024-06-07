import { Character } from './Character.type'
import {Resource} from "@/models/Resource.type.ts";
import {Building, BuildingSlot} from "@/models/Building.type.ts";
import { Activity } from '@/models/Activity.type.ts'
import { GameEvent } from '@/store/gameStore.type.ts'

export interface Settlement {
  id: number
  activities: Activity[]
  level?: number
  location?: string
  name: string
  characters: Character[]
  created_at: string
  updated_at: string
  resources: Resource[]
  buildings: Building[]
  slots: BuildingSlot[]
  available_slots: number
  max_building_slots: number
  clearable_slots: number
  total_housing_capacity: number
  filtered_game_events_last_minutes: GameEvent[]
}