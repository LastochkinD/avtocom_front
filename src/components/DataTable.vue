<template>
  <div>
    <!-- Поиск -->
    <div v-if="searchable" class="mb-6">
      <input
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        type="text"
        :placeholder="searchPlaceholder"
        class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
      />
    </div>

    <!-- Таблица -->
    <div class="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-800/80">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-4 py-3 text-sm font-semibold text-gray-300',
                column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
              ]"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700/50">
          <tr v-for="item in items" :key="item[rowKey]" class="hover:bg-gray-700/30 transition-colors">
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-4 py-3',
                column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
              ]"
            >
            <!-- Слот для кастомного рендеринга -->
              <template v-if="$slots[column.key]">
                <slot
                  :name="column.key"
                  :item="item"
                  :value="item[column.key]"
                />
              </template>
              <template v-else>
                <span :class="column.textClass">
                  {{ formatValue(item[column.key], column.format) }}
                </span>
              </template>
            </td>
          </tr>
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-4 py-8 text-center text-gray-400">
              Загрузка...
            </td>
          </tr>
          <tr v-if="!loading && items.length === 0">
            <td :colspan="columns.length" class="px-4 py-8 text-center text-gray-400">
              {{ emptyText }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Пагинация -->
    <div v-if="paginated" class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-400">
        {{ paginationInfo }}
      </div>
      <div class="flex gap-2">
        <button
          :disabled="skip === 0"
          @click="$emit('page-change', skip - limit)"
          class="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm transition-colors"
        >
          Назад
        </button>
        <button
          :disabled="items.length < limit"
          @click="$emit('page-change', skip + limit)"
          class="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm transition-colors"
        >
          Далее
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(col => col.key && col.label)
    }
  },
  items: {
    type: Array,
    default: () => []
  },
  rowKey: {
    type: String,
    default: 'ID'
  },
  loading: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: true
  },
  searchPlaceholder: {
    type: String,
    default: 'Поиск...'
  },
  searchQuery: {
    type: String,
    default: ''
  },
  paginated: {
    type: Boolean,
    default: true
  },
  skip: {
    type: Number,
    default: 0
  },
  limit: {
    type: Number,
    default: 40
  },
  totalCount: {
    type: Number,
    default: 0
  },
  emptyText: {
    type: String,
    default: 'Записи не найдены'
  }
})

const emit = defineEmits(['page-change', 'update:searchQuery'])

const paginationInfo = computed(() => {
  const start = props.skip + 1
  const end = props.skip + props.items.length
  return `Показано ${start}-${end} из ${props.totalCount || props.items.length}`
})

const formatValue = (value, format) => {
  if (value == null || value === '') return '-'
  
  if (format === 'date') {
    const date = new Date(value)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  if (format === 'datetime') {
    const date = new Date(value)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return value
}
</script>
