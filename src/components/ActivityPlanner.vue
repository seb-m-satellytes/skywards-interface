<script setup lang='ts'>
  import { computed, onBeforeMount, ref } from 'vue'
  import { useGameStore } from '@/store/gameStore.ts'
  import { Activity, NewActivity } from '@/models/Activity.type.ts'

  const gameStore = useGameStore()

  const selectedWorkers = ref([])

  const charactersWhoCanWGather = computed(() => gameStore.getCharactersWhoCanWork.filter(character => character.specialization === 'gatherer'))

  const makeNewActivity = ref('')

  const selectedActivityDetails = ref('')

  const activities = ref<NewActivity[]>([{
    activityType: 'gathering',
    details: null,
  }])

  const isCharacterSelectedInOtherSlot = (characterId: number, index: number) => {
    return selectedWorkers.value.some((id, idx) => idx !== index && id === characterId)
  }

  const allowMaxWorkers = (index: number, maxLength: number) => {
    return index >= maxLength
  }

  const startActivity = async (activity: NewActivity) => {
    try {
      const workers = selectedWorkers.value.filter(worker => worker !== null)
      if (workers.length === 0) {
        return
      }

      await gameStore.startActivity(activity.activityType, workers, selectedActivityDetails.value)

      makeNewActivity.value = ''
    } catch (e) {
      console.error(e)
    }
  }

  onBeforeMount(() => {
    selectedWorkers.value = new Array(3).fill(null)
  })
</script>

<template>
  <div v-for='activity in activities' :key='activity.activityType'>
    <button v-if='!makeNewActivity' :disabled='charactersWhoCanWGather.length === 0'
            @click='makeNewActivity = activity.activityType'>New {{ activity.activityType }} mission
    </button>
    <div v-if='makeNewActivity === activity.activityType'>
      select characters
      <ul>
        <li v-for='(_, index) in selectedWorkers' :key='index'>
          <select v-model='selectedWorkers[index]' :disabled='allowMaxWorkers(index, 1)'>
            <option disabled value=''>Select a character</option>
            <option
              v-for='character in charactersWhoCanWGather'
              :key='character.id'
              :value='character.id'
              :disabled='isCharacterSelectedInOtherSlot(character.id, index)'>
              {{ character.name }}
            </option>
          </select>
        </li>
      </ul>
      <button @click='startActivity(activity)'>Start {{ activity.activityType }}</button>
      <button @click="makeNewActivity = ''">Cancel</button>
    </div>
  </div>
</template>

<style scoped>

</style>