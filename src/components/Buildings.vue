<script setup lang='ts'>
  import { computed, ref, watch } from 'vue'
  import { BuildingBlueprint, BuildingSlot } from '@/models/Building.type.ts'
  import { useGameStore } from '@/store/gameStore.ts'
  import { Settlement } from '@/models/Settlement.type.ts'
  import useApi from '@/lib/composables/useApi.ts'
  import { apiRoutes } from '@/lib/consts.ts'

  const gameStore = useGameStore()
  const api = useApi()

  const props = defineProps<{
    currentSettlement: Settlement
  }>()

  const startBuildingMode = ref<boolean>(false)
  const startClearingMode = ref<boolean>(false)

  const buildingOptions = ref<BuildingBlueprint[]>([])

  watch(() => startBuildingMode.value, async (newValue) => {
    if (newValue) {
      try {
        const allAvailableBuildings = await api.get(`${apiRoutes.blueprints}`, { settlement_id: props.currentSettlement.id })

        buildingOptions.value = allAvailableBuildings
      } catch (e) {
        console.error(e)
      }
    }
  })

  const clearingWorkerId = ref<number | null>(null)
  const clearingSlotId = ref<number | null>(null)

  const newBuilder = ref<number | null>(null)
  const newSlot = ref<number | null>(null)

  const slotsWithBuildings = computed(() => {
    if (!props.currentSettlement) {
      return []
    }

    return props.currentSettlement.slots.map(slot => {
      const building = props.currentSettlement.buildings.find(building => building.id === slot.building_id)
      return building ?? null
    }).filter(Boolean)
  })

  const availableSlots = computed<BuildingSlot[]>(() => {
    if (!props.currentSettlement) {
      return []
    }

    return props.currentSettlement.slots.filter(slot => !slot.building_id && slot.usable === 1)
  })

  const clearableSlots = computed(() => {
    if (!props.currentSettlement) {
      return []
    }

    return props.currentSettlement.slots.filter(slot => slot.usable === 0)
  })

  const startBuilding = async (id: number) => {
    if (!id || !newBuilder.value || !newSlot.value) {
      return
    }

    await gameStore.startBuilding(id, [newBuilder.value], props.currentSettlement.id, [newSlot.value])
    startBuildingMode.value = false
  }

  const startClearing = async () => {
    if (!clearingSlotId.value || !clearingWorkerId.value) {
      return
    }

    await gameStore.startClearing(clearingSlotId.value, clearingWorkerId.value, props.currentSettlement.id)
    startClearingMode.value = false
  }

</script>

<template>
  <div>
    <h3>Buildings</h3>
    <ul>
      <li v-for='entry in slotsWithBuildings' :key='entry.id'>
        {{ entry?.name || 'Empty' }} {{ entry?.status }}
      </li>
    </ul>

    <p v-if='currentSettlement.available_slots === 0 && currentSettlement.clearable_slots > 0'>Clear some space to
      enable building.</p>
    <button :disabled='currentSettlement.clearable_slots === 0' @click='startClearingMode = true'>Start Clearing Slots</button>
    <button :disabled='startBuildingMode || currentSettlement.available_slots === 0' @click='startBuildingMode = true'>
      Add Building
    </button>

    <div v-if='startBuildingMode'>
      <h4>Add Building</h4>
      <div class='available-blueprints'>

        <div
          v-for='buildingOption in buildingOptions'
          :key='buildingOption.name'>

          {{ buildingOption.name }}
          <p>Costs</p>
          <ul>
            <li v-for='[resource_type, amount] in Object.entries(buildingOption.baseResources)' :key='resource_type'>
              {{ resource_type }}, Amount: req {{ amount
              }} | have {{ props.currentSettlement.resources.find(settlementResource => settlementResource.resource_type === resource_type)?.amount || 0
              }}
            </li>
          </ul>
          <p>Select Builder</p>
          <select v-model='newBuilder'>
            <option v-for='character in gameStore.getCharactersWhoCanWork' :key='character.id' :value='character.id'>
              {{ character.name }} ({{ character.specialization }})
            </option>
          </select>
          <p>Select Slot</p>
          <select v-model='newSlot'>
            <option v-for='slot in availableSlots' :key='slot.settlement_slot_id' :value='slot.settlement_slot_id'>
              {{ slot.settlement_slot_id }}
            </option>
          </select>
          <button :disabled='!buildingOption.isBuildable' @click='startBuilding(buildingOption.id)'>Build {{ buildingOption.name }}
          </button>
          <button @click='startBuildingMode = false'>Cancel</button>
        </div>
      </div>


    </div>

    <div v-if='startClearingMode'>
      <h4>Clearing Slots</h4>
      <select v-model='clearingWorkerId'>
        <option v-for='character in gameStore.getCharactersWhoCanWork' :key='character.id' :value='character.id'>
          {{ character.name }} ({{ character.specialization }})
        </option>
      </select>
      <select v-model='clearingSlotId'>
        <option v-for='slot in clearableSlots' :key='slot.settlement_slot_id' :value='slot.settlement_slot_id'>
          {{ slot.settlement_slot_id }}
        </option>
      </select>
      <button @click='startClearing'>Clear Slot {{ clearingSlotId }}</button>
      <button @click='startClearingMode = false'>Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.available-blueprints {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, min-content);
  grid-column-gap: 0;
  grid-row-gap: 0;
}

.available-blueprints div {
  border: 1px solid black;
  padding: 10px;
}
</style>