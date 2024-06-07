import { defineStore } from 'pinia'
import useApi from '@/lib/composables/useApi'
import { apiRoutes } from '@/lib/consts.ts'
import { Settlement } from '@/models/Settlement.type.ts'
import { GameSessionResource, GameState, GameSession, GameEvent } from '@/store/gameStore.type.ts'
import { Character } from '@/models/Character.type.ts'

const api = useApi()

export const useGameStore = defineStore('gameState', {
  state: (): GameState => ({
    gameState: {
      settlements: [],
      currentSettlement: null,
      session: {
        id: 0,
        currentDay: 0,
        currentTime: '',
        absoluteTime: 0,
      },
    },
    events: [],
  }),
  actions: {
    updateEvents(newEvents: GameEvent[]) {
      const allEvents = [...this.events, ...newEvents];

      const uniqueEvents = Array.from(new Map(allEvents.map(event => [event.id, event])).values());

      this.events = uniqueEvents;
    },
    async fetchGameState() {
      try {
        const gameSessionId = 10
        const res: GameSessionResource = await api.get(`${apiRoutes.gameSession}/${gameSessionId}`)
        this.gameState.settlements = res.settlements

        const indexOfNonOutsideSettlement = this.gameState.settlements.findIndex(settlement => settlement.name !== 'Outside')

        this.gameState.currentSettlement = this.gameState.settlements[indexOfNonOutsideSettlement]

        this.gameState.session.currentDay = res.current_day
        this.gameState.session.currentTime = res.current_time
        this.gameState.session.absoluteTime = res.game_session.in_game_minutes
        this.gameState.session.id = res.game_session.id

        const newEvents = res.settlements.map((settlement: Settlement) => {
          const settlementEvents = settlement.filtered_game_events_last_minutes
          const characterEvents = settlement.characters.flatMap((character: Character) => character.filtered_game_events_last_minutes)

          return [...settlementEvents, ...characterEvents]
        }).flatMap((events: GameEvent[]) => events)

        this.updateEvents(newEvents)
      } catch (e) {
        throw e
      }
    },
    async startActivity(activityType: string, characterIds: number[], targetId?: number) {
      try {
        const promises = characterIds.map(id => api.post(`${apiRoutes.characters}/${id}/start_activity`,
          null, {
            activity_type: activityType,
            activity_target: targetId || null,
          }))

        const res = await Promise.all(promises)

        if (res) {
          await this.fetchGameState()
        } else {
          throw new Error('Something went wrong')
        }
      } catch (e) {
        throw e
      }
    },
    async startBuilding(newBuildingId: number, characterIds: number[], settlementId: number, slots: number[]) {
      try {
        await api.post(`${apiRoutes.buildings}`, {
          settlement_id: settlementId,
          worker_id: characterIds[0],
          blueprint_id: newBuildingId,
          slots_to_use: slots.join(','),
        })

        await this.fetchGameState()
      } catch (e) {
        throw e
      }
    },
    async startHiring(specialization: string, settlementId: number) {
      try {
        await api.post(`${apiRoutes.settlements}/${settlementId}/hire`, {
          specialization: specialization,
        })

        await this.fetchGameState()
      } catch (e) {
        throw e
      }
    },
    async startClearing(slotId: number, characterId: number, settlementId: number) {
      try {
        await api.post(`${apiRoutes.settlements}/${settlementId}/clear_slots`, {
          worker_id: characterId,
          slot: slotId,
        })

        await this.fetchGameState()
      } catch (e) {
        throw e
      }
    },
    async evaluateActivity(activityId: number) {
      try {
        const res = await api.post(`${apiRoutes.activities}/${activityId}/evaluate`)

        if (res) {
          await this.fetchGameState()
          return res
        } else {
          throw new Error('Something went wrong')
        }
      } catch (e) {
        throw e
      }
    },
  },
  getters: {
    getCurrentSession: (state): GameSession => {
      return state.gameState.session
    },
    getCurrentSettlement: (state): Settlement | null => {
      return state.gameState.currentSettlement
    },
    getCharactersWhoCanWork: (state): Character[] => {
      const chars = state.gameState.currentSettlement?.characters
      if (chars && chars.length) {
        return chars.filter(character => character.can_go_on_activity)
      } else {
        return []
      }
    },
    getSettlements: state => state.gameState.settlements.map((settlement: Settlement) => ({
      name: settlement.name,
      id: settlement.id,
      population: settlement.characters.length,
    })),
    getGameEvents: state => state.events.sort((a, b) => a.in_game_time - b.in_game_time),
  },
})
