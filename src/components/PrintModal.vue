<template>
  <div class="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-xl border border-gray-700/50 p-6 max-w-2xl w-full">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-white">Предпросмотр заказ-наряда</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-white p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="bg-gray-700/50 rounded-lg p-4 mb-4">
        <PrintWorkOrder :workOrderId="workOrderId" />
      </div>

      <div class="flex gap-3">
        <button
          @click="printDocument"
          class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h8z" />
          </svg>
          Печать
        </button>
        <button
          @click="exportPDF"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Экспорт PDF
        </button>
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PrintWorkOrder from './PrintWorkOrder.vue';

export default {
  name: 'PrintModal',
  components: {
    PrintWorkOrder
  },
  props: {
    workOrderId: {
      type: Number,
      required: true
    }
  },
  methods: {
    printDocument() {
      window.print();
    },
    exportPDF() {
      // Используем браузерную печать для экспорта в PDF
      // Пользователь может выбрать "Сохранить как PDF" в диалоге печати
      window.print();
    }
  }
}
</script>

<style scoped>
@media print {
  .fixed {
    display: none;
  }
}
</style>