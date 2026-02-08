<template>
  <div class="relative">
    <button
      type="button"
      @click="toggleDropdown"
      class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white text-left focus:outline-none focus:border-primary-500 flex items-center justify-between"
    >
      <span v-if="selectedOption">{{ selectedOption.label }}</span>
      <span v-else class="text-gray-400">{{ placeholder }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-gray-400 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <!-- Dropdown options -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
      >
        <div
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          class="px-4 py-2 text-white hover:bg-gray-600 cursor-pointer transition-colors"
          :class="{ 'bg-gray-600': modelValue === option.value }"
        >
          {{ option.label }}
        </div>
        <div
          v-if="options.length === 0"
          class="px-4 py-2 text-gray-400 text-sm"
        >
          {{ emptyText }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Выберите...'
  },
  emptyText: {
    type: String,
    default: 'Нет доступных опций'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  emit('change', option)
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
