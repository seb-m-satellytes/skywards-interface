import { onMounted, onUnmounted, ref } from 'vue';

const usePolling = (callApiFn: () => any, interval = 1000, startOnMount = false)=> {
  const isPolling = ref(false);
  let intervalId: number | null = null;

  const startPolling = () => {
    if (!isPolling.value) {
      isPolling.value = true;
      intervalId = setInterval(async () => {
        try {
          await callApiFn();
        } catch (error) {
          console.error('Error during polling:', error);
          stopPolling()
          // Handle error or stop polling as needed
        }
      }, interval);
    }
  };

  const stopPolling = () => {
    if (isPolling.value && intervalId) {
      clearInterval(intervalId);
      isPolling.value = false;
    }
  };

  startOnMount ? onMounted(startPolling) : null;
  onUnmounted(stopPolling);

  return { isPolling, startPolling, stopPolling };
}

export default usePolling