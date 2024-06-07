<script setup lang="ts">
 import usePolling from "@/lib/composables/usePolling.ts";
 import {useGameStore} from "@/store/gameStore.ts";
 import {onBeforeMount, onBeforeUnmount} from "vue";
 const gameStore = useGameStore()

</script>

<template>
    <router-view></router-view>
</template>
