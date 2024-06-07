<script setup lang='ts'>
import { useGameStore } from '@/store/gameStore.ts'
import { computed } from 'vue'
import { GameEvent } from '@/store/gameStore.type.ts'

const gameStore = useGameStore()

const gameEvents = computed<GameEvent[]>(() => gameStore.getGameEvents)
</script>

<template>
<div>
  <h3>Events</h3>
  <ul>
    <li v-for='event in gameEvents' :key='event.id'>
      {{ event.loggable_type }} - {{ event.description }}
    </li>
  </ul>
</div>
</template>

<style scoped>

</style>