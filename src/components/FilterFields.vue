<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div v-for="field in fields" :key="field.key" class="flex flex-col">
      <label v-if="field.label" :for="field.key" class="text-sm text-gray-400 mb-1">
        {{ field.label }}
      </label>
      <input
        :id="field.key"
        :value="modelValue[field.key]"
        @input="$emit('update:modelValue', { ...modelValue, [field.key]: $event.target.value })"
        :type="field.type || 'text'"
        :placeholder="field.placeholder || ''"
        class="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  fields: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(field => field.key)
    }
  }
})

defineEmits(['update:modelValue'])
</script>
