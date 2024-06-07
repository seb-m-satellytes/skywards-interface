<script setup lang='ts'>
import { Character } from '@/models/Character.type.ts'
import { useGameStore } from '@/store/gameStore.ts'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  character: Character,
}>()

const gameStore = useGameStore()
const currentSession = computed(() => gameStore.getCurrentSession)
const currentSettlement = computed(() => gameStore.getCurrentSettlement)

const showFlag = ref<{ name: string, change: number }[]>([])

watch(() => props.character, (newValue, oldValue) => {
    type C = keyof Character
    const trackedProps: C[] = ['health_status', 'morale_status', 'skill_level'];

    for (const [index, key] of trackedProps.entries()) {
      if (newValue[key] !== oldValue[key]) {
        const change: number = newValue[key] - (oldValue[key] || 0);
        showFlag.value.push({ name: key, change });

        setTimeout(() => {
          showFlag.value = showFlag.value.filter(flag => flag.name !== key)
        }, 2000 + (index * 300))
      }
    }
  },
  { deep: true }
)

const startHealing = async (characterId: number) => {
  if (!characterId) {
    return
  }

  const injuredCharacter = currentSettlement.value.characters.find(character => character.current_status_effect?.name === 'injured')

  if (!injuredCharacter) {
    console.warn('No injured character found')
    return
  }

  await gameStore.startActivity('healing', [characterId], injuredCharacter.id)
}

const evaluateActivity = async (id: number) => {
  const results = await gameStore.evaluateActivity(id)

  alert(JSON.stringify(results))
}

</script>

<template>
  <div class='charcard'>
    <div v-for="(flag, index) in showFlag" :key="index" class="change-flag">
      {{ flag.name }}: {{ flag.change > 0 ? `+${flag.change}` : flag.change }}
    </div>
    <div class='charcard__status'>
      <p class='charcard__health'>
        <span>H</span> {{ character.health_status }}
      </p>
      <p>
        <span>&uparrow;</span> {{ character.morale_status }}
      </p>
    </div>
    <img :src='`https://robohash.org/${character.name}?set=set5&size=100x100`' alt=''>
    <h3>
      Lvl. {{ character.skill_level }} {{ character.specialization }}
    </h3>
    <h2>
      {{ character.name }}
    </h2>
    <p class='charcard__effect'>
      {{ character.current_status_effect?.name }}
    </p>

    <div class='charcard__activities'>
      <template v-if='character.current_activity'>
        <p class='charcard__activity'>
          {{ character.current_activity.activity_type }}
        </p>
        <button
          v-if='character.current_activity.end_time < currentSession.absoluteTime && !character.current_activity.is_evaluated'
          class='charcard__button'
          @click='evaluateActivity(character.current_activity.id)'>
          Finish activity
        </button>
      </template>
      <template v-else>
        <p class='charcard__activity'>
          idle
        </p>
      </template>
    </div>

    <div v-if='character.specialization === "medic" && character.can_go_on_activity'>
      <button class='charcard__button' @click='startHealing(character.id)'>
        Heal
      </button>
    </div>
  </div>
</template>

<style scoped>

  .charcard {
    background: #242424;
    color: white;
    padding: 2px;
    border: 1px solid #535bf2;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .charcard__status {
    display: flex;
    justify-content: space-between;
  }

  .charcard__status p {
    margin: 0;
    padding: 0;
  }

  .charcard__health, .charcard__effect {
    color: #f25b5b;
  }

  .charcard h2 {
    margin: 0;
    font-size: 1rem;
    color: #737ee4;
  }

  .charcard h3 {
    margin: 0;
    font-size: 0.8rem;
    color: #73e479;
  }

  .charcard__activities {
    margin-top: auto;
    padding: 2px;
  }

  .charcard__activity {
    font-size: 0.75rem;
  }

  .charcard__button {
    border: 1px solid #535bf2;
    color: white;
    border-radius: 1px;
    background: transparent;
    padding: 5px;
    font-size: 0.75rem;
    width: 100%;
  }

  .charcard__button:hover {
    background: #3f3e3e;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }

  .change-flag {
    position: absolute;
    right: 10px;
    top: 10px;
    background-color: yellow;
    padding: 5px;
    color: black;
    font-size: 0.6rem;
    animation: slide-up 2s, fade-out 2s;
  }

  @keyframes slide-up {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-20px);
    }
  }

  @keyframes fade-out {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>