import { computed } from 'vue'
import { useGameStore } from '@/store/gameStore.ts'

const useAmbientColor = () => {
  const gameStore = useGameStore()
  const gameTime = computed(() => gameStore.getCurrentSession.currentTime)

  const interpolateColor = (color1: string, color2: string, factor: number): string => {
    // Split the input colors into their RGB components and interpolate
    const result = color1.slice(1).match(/.{2}/g)?.map((hex, index) => {
      const color1Component = parseInt(hex, 16);
      const tempComp = color2.slice(1).match(/.{2}/g)[index]
      const color2Component = parseInt(tempComp, 16);
      const interpolatedValue = color1Component * (1 - factor) + color2Component * factor;
      return Math.round(interpolatedValue);
    }) || [];

    // Convert the interpolated RGB values back to a hex string
    return '#' + result.map(val => val.toString(16).padStart(2, '0')).join('');
  }


  const backgroundColor = computed(() => {
    // Extract hours and minutes from gameTime
    const [hours, minutes] = gameTime.value.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;

    const sunriseAt = 4 * 60;
    const morningAt = 6 * 60;
    const dayAt = 8 * 60;
    const sunsetAt = 18 * 60;
    const nightAt = 20 * 60;

    // Define the color for different times
    const nightColor = '#000033'; // Dark blue
    const morningColor = '#FFD700'; // Light yellow for sunrise
    const dayColor = '#87CEEB'; // Light blue for day
    const eveningColor = '#FF8C00'; // Orange for sunset

    // Calculate transition based on totalMinutes
    if (totalMinutes >= nightAt || totalMinutes < sunriseAt) {
      return nightColor;
    } else if (totalMinutes >= sunriseAt && totalMinutes < morningAt) {
      return interpolateColor(nightColor, morningColor, (totalMinutes - sunriseAt) / (2 * 60));
    } else if (totalMinutes >= morningAt && totalMinutes < dayAt) {
      return interpolateColor(morningColor, dayColor, (totalMinutes - morningAt) / (2 * 60));
    } else if (totalMinutes >= dayAt && totalMinutes < sunsetAt) {
      return dayColor;
    } else if (totalMinutes >= sunsetAt && totalMinutes < nightAt) {
      return interpolateColor(dayColor, eveningColor, (totalMinutes - sunsetAt) / (2*60));
    } else {
      return nightColor;
    }
  })

  return {
    backgroundColor
  }
}

export default useAmbientColor;


