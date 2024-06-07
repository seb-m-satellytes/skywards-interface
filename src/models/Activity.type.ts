export interface Activity {
  id: number
  activity_type: string
  activity_target: string | null
  character_id: number
  start_time: number
  end_time: number
  is_evaluated: string
}

export interface NewActivity {
  activityType: string
  details: {
    objects: string[]
  } | null
}