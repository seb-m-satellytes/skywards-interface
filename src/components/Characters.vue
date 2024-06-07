<script setup lang='ts'>
  import { Settlement } from '@/models/Settlement.type.ts'
  import { GameSession } from '@/store/gameStore.type.ts'
  import { useGameStore } from '@/store/gameStore.ts'
  import { computed, ref } from 'vue'
  import CharacterCard from '@/components/CharacterCard.vue'

  const props = defineProps<{
    currentSession: GameSession,
    currentSettlement: Settlement
  }>()

  const gameStore = useGameStore()

  const newCitizenSpecialization = ref('generic')

  const availableHousingSpots = computed(() => {
    if (!props.currentSettlement) {
      return 0
    }

    return props.currentSettlement.total_housing_capacity - props.currentSettlement.characters.length
  })

  const postNewHiringSign = async () => {
    if (!props.currentSettlement || !newCitizenSpecialization.value) {
      return
    }

    await gameStore.startHiring(newCitizenSpecialization.value, props.currentSettlement.id)
  }

  const evaluateActivity = async (id: number) => {
    const results = await gameStore.evaluateActivity(id)

    alert(JSON.stringify(results))
  }
</script>

<template>
  <h3>Characters</h3>
  <div class='charcards__wrapper'>
    <CharacterCard v-for='character in currentSettlement.characters' :key='character.id' :character='character' />
  </div>

  <div v-if='availableHousingSpots > 0'>
    <p>Invite new citizens. You have {{ availableHousingSpots }} spaces.</p>
    <select v-model='newCitizenSpecialization'>
      <option value='generic'>No specialization</option>
      <option value='gatherer'>Gatherer/ Salvager</option>
      <option value='engineer'>Engineer</option>
      <option value='medic'>Medic</option>
    </select>
    <button @click='postNewHiringSign'>Hang out sign</button>

    <div v-if='currentSettlement.activities.some(activity => activity.end_time && !activity.is_evaluated )'>
      <ul>
        <li
          v-for='thisActivity in currentSettlement.activities.filter(activity => activity.end_time && !activity.is_evaluated)'
          :key='thisActivity.id'>
          <button @click='evaluateActivity(thisActivity.id)'>Hire</button>
        </li>
      </ul>

    </div>
  </div>
</template>

<style scoped>
  .charcards__wrapper {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    max-width: 900px;
    gap: 2px;
    list-style-type: none;
    font-family: Inconsolata, monospace;
  }

</style>