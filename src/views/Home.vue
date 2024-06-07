<script setup lang='ts'>
  import { useGameStore } from '../store/gameStore.ts'
  import ActivityPlanner from '@/components/ActivityPlanner.vue'
  import { computed, onBeforeUnmount } from 'vue'
  import usePolling from '@/lib/composables/usePolling.ts'
  import Buildings from '@/components/Buildings.vue'
  import Characters from '@/components/Characters.vue'
  import useAmbientColor from '@/lib/composables/useAmbientColor.ts'
  import GameEvents from '@/components/GameEvents.vue'

  const gameSpeed = 2

  const gameStore = useGameStore()
  const { backgroundColor } = useAmbientColor()
  const { isPolling, startPolling, stopPolling } = usePolling(gameStore.fetchGameState, 1000 / gameSpeed)

  const settlements = computed(() => gameStore.getSettlements)
  const currentSettlement = computed(() => gameStore.getCurrentSettlement)
  const currentSession = computed(() => gameStore.getCurrentSession)

  onBeforeUnmount(() => {
    stopPolling()
  })
</script>

<template>
  <div class='home'>
    <h2>Settlements</h2>
    <ul>
      <li v-for='settlement in settlements' :key='settlement.id'>
        {{ settlement.name }}
      </li>
    </ul>

    <h2>Current Settlement (Details)</h2>

    <button @click='isPolling ? stopPolling() : startPolling()'>{{ isPolling ? 'Pause' : 'Start' }}</button>
    <div v-if='currentSettlement'>
      <pre>{{ currentSettlement.name }}</pre>
      <p>
        Current population: {{ currentSettlement.characters.length }} (max:
        {{ currentSettlement.total_housing_capacity
        }})
      </p>
      <div :style='{ backgroundColor: backgroundColor }' class='time-of-day'>
        <pre>Day {{ currentSession.currentDay }} - {{ currentSession.currentTime }} o'clock</pre>
      </div>
      <h3>Resources</h3>
      <ul>
        <li v-for='resource in currentSettlement.resources' :key='resource.id'>
          {{ resource.resource_type }}, Current amount: {{ resource.amount }}
        </li>
      </ul>

      <Buildings :current-settlement='currentSettlement' />

      <Characters :current-session='currentSession' :current-settlement='currentSettlement' />

      <h3>Activities</h3>
      <ActivityPlanner />

      <GameEvents />
    </div>

  </div>
</template>

<style scoped>
  .time-of-day {
    transition: background-color 1s linear;
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .time-of-day pre {
    background: rgba(0, 0, 0, 0.2);
    padding: 2px;
    color: white;
  }
</style>