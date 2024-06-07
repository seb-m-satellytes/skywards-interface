import {Activity} from "@/models/Activity.type.ts";

const useGetCurrentActivity = () => {
  const getCurrentActivity = (activities: Activity[], gametime: number) => {
    if (activities.length === 0) {
      return {id: null, display: 'idle', canEvaluate: false}
    }

    const unfinishedActivities = activities.filter(activity => activity.end_time > gametime)

    if (unfinishedActivities.length !== 0) {
      return {
        id: unfinishedActivities[0].id,
        display: `${unfinishedActivities[0].activity_type} ${unfinishedActivities[0].activity_target ?? ''}`,
        canEvaluate: false
      }
    }

    const unevaluatedActivities = activities.filter(activity => activity.is_evaluated === null)

    if (unevaluatedActivities.length !== 0) {
      return {
        id: unevaluatedActivities[0].id,
        display: `finished ${unevaluatedActivities[0].activity_type}`,
        canEvaluate: true
      }
    }

    return {id: null, display: 'idle', canEvaluate: false}
  }

  return {
    getCurrentActivity
  }
}

export default useGetCurrentActivity