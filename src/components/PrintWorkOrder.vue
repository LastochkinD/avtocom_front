<template>
  <div id="print-work-order" class="print-container">
    <!-- Шапка -->
    <header class="print-header">
      <div class="logo-placeholder">
        <div class="logo-placeholder-content">
          <span class="logo-text">ЛОГОТИП</span>
        </div>
      </div>
      <div class="company-info">
        <h1 class="company-name">Название организации</h1>
        <div class="company-details">
          <p>ИНН: 1234567890</p>
          <p>ОГРН: 1234567890123</p>
          <p>Адрес: г. Самара, ул. Примерная, д. 1</p>
          <p>Тел.: +7 (846) 123-45-67</p>
        </div>
      </div>
    </header>

    <!-- Основная информация -->
    <section class="main-info">
      <h2 class="section-title">Заказ-наряд №{{ workOrder.NUM }} от {{ formatDate(workOrder.OPEN_DATE) }}</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Клиент:</span>
          <span class="info-value">{{ workOrder.CLIENT_NAME || 'Не указан' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Автомобиль:</span>
          <span class="info-value">{{ workOrder.CAR_BRAND }} {{ workOrder.CAR_MODEL }} {{ workOrder.CAR_NUMBER || '' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Пробег:</span>
          <span class="info-value">{{ workOrder.PROBEG || 'Не указан' }} км</span>
        </div>
        <div class="info-item">
          <span class="info-label">Дата открытия:</span>
          <span class="info-value">{{ formatDate(workOrder.OPEN_DATE) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Дата закрытия:</span>
          <span class="info-value">{{ formatDate(workOrder.CLOSE_DATE) || 'Не закрыт' }}</span>
        </div>
      </div>
    </section>

    <!-- Таблица работ -->
    <section class="works-section">
      <h3 class="section-title">Выполненные работы</h3>
      <div class="table-container">
        <table class="works-table">
          <thead>
            <tr>
              <th>Код</th>
              <th>Наименование</th>
              <th>Количество</th>
              <th>Цена</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="work in works" :key="work.ID">
              <td>{{ work.CODE || '-' }}</td>
              <td>{{ work.NAME }}</td>
              <td>{{ work.KOL }}</td>
              <td>{{ formatPrice(work.PRICE) }}</td>
              <td>{{ formatPrice(calculateWorkSum(work)) }}</td>
            </tr>
            <tr v-if="works.length === 0">
              <td colspan="5" class="text-center">Работы не найдены</td>
            </tr>
          </tbody>
        </table>
        <div class="table-footer">
          <div class="total-label">Итого по работам:</div>
          <div class="total-amount">{{ formatPrice(totalWorksAmount) }}</div>
        </div>
      </div>
    </section>

    <!-- Таблица запчастей -->
    <section class="parts-section">
      <h3 class="section-title">Использованные запчасти</h3>
      <div class="table-container">
        <table class="parts-table">
          <thead>
            <tr>
              <th>Код</th>
              <th>Наименование</th>
              <th>Количество</th>
              <th>Ед. изм.</th>
              <th>Цена</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="part in parts" :key="part.ID">
              <td>{{ part.CODE || '-' }}</td>
              <td>{{ part.NAME }}</td>
              <td>{{ part.KOL }}</td>
              <td>{{ part.UNIT_NAME || '-' }}</td>
              <td>{{ formatPrice(part.PRICE) }}</td>
              <td>{{ formatPrice(calculatePartSum(part)) }}</td>
            </tr>
            <tr v-if="parts.length === 0">
              <td colspan="6" class="text-center">Запчасти не найдены</td>
            </tr>
          </tbody>
        </table>
        <div class="table-footer">
          <div class="total-label">Итого по запчастям:</div>
          <div class="total-amount">{{ formatPrice(totalPartsAmount) }}</div>
        </div>
      </div>
    </section>

    <!-- Финансовая информация -->
    <section class="financial-info">
      <h3 class="section-title">Финансовая информация</h3>
      <div class="financial-grid">
        <div class="financial-item">
          <span class="financial-label">Скидка на работы:</span>
          <span class="financial-value">{{ workOrder.SKIDKA_W || 0 }}%</span>
        </div>
        <div class="financial-item">
          <span class="financial-label">Скидка на запчасти:</span>
          <span class="financial-value">{{ workOrder.SKIDKA_P || 0 }}%</span>
        </div>
        <div class="financial-item">
          <span class="financial-label">НДС ({{ workOrder.NDS || 0 }}%):</span>
          <span class="financial-value">{{ formatPrice(ndsAmount) }}</span>
        </div>
        <div class="financial-item total">
          <span class="financial-label">ИТОГО:</span>
          <span class="financial-value">{{ formatPrice(totalAmount) }}</span>
        </div>
      </div>
    </section>

    <!-- Подвал -->
    <footer class="print-footer">
      <div class="signatures">
        <div class="signature-block">
          <div class="signature-line">
            <span class="signature-label">Клиент:</span>
            <div class="signature-placeholder"></div>
          </div>
          <div class="signature-name">{{ workOrder.CLIENT_NAME || '________________' }}</div>
        </div>
        <div class="signature-block">
          <div class="signature-line">
            <span class="signature-label">Мастер:</span>
            <div class="signature-placeholder"></div>
          </div>
          <div class="signature-name">________________</div>
        </div>
      </div>
      <div class="footer-text">
        <p>Все работы выполнены в соответствии с договором</p>
        <p>Дата: {{ formatDate(new Date()) }}</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PrintWorkOrder',
  props: {
    workOrderId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      workOrder: {},
      works: [],
      parts: []
    }
  },
  computed: {
    totalWorksAmount() {
      return this.works.reduce((total, work) => {
        return total + this.calculateWorkSum(work);
      }, 0);
    },
    totalPartsAmount() {
      return this.parts.reduce((total, part) => {
        return total + this.calculatePartSum(part);
      }, 0);
    },
    ndsAmount() {
      const totalWithoutNds = this.totalWorksAmount + this.totalPartsAmount;
      const ndsRate = this.workOrder.NDS || 0;
      return totalWithoutNds * (ndsRate / 100);
    },
    totalAmount() {
      return this.totalWorksAmount + this.totalPartsAmount + this.ndsAmount;
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return 'Не указана';
      const d = new Date(date);
      return d.toLocaleDateString('ru-RU');
    },
    formatPrice(price) {
      if (price === null || price === undefined) return '0.00';
      return new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price);
    },
    calculateWorkSum(work) {
      const price = work.PRICE || 0;
      const discount = this.workOrder.SKIDKA_W || 0;
      const discountedPrice = price * (1 - discount / 100);
      return discountedPrice * (work.KOL || 1);
    },
    calculatePartSum(part) {
      const price = part.PRICE || 0;
      const discount = this.workOrder.SKIDKA_P || 0;
      const discountedPrice = price * (1 - discount / 100);
      return discountedPrice * (part.KOL || 1);
    },
    async loadWorkOrderData() {
      try {
        // Загрузка основной информации о заказ-наряде
        const response = await fetch(`/api/docs/${this.workOrderId}`);
        this.workOrder = await response.json();

        // Загрузка работ
        const worksResponse = await fetch(`/api/works?docId=${this.workOrderId}`);
        this.works = await worksResponse.json();

        // Загрузка запчастей
        const partsResponse = await fetch(`/api/parts?docId=${this.workOrderId}`);
        this.parts = await partsResponse.json();
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    }
  },
  mounted() {
    this.loadWorkOrderData();
  }
}
</script>

<style scoped>
.print-container {
  width: 210mm;
  min-height: 297mm;
  padding: 20px;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.print-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
}

.logo-placeholder {
  width: 100px;
  height: 100px;
  background: #f0f0f0;
  border: 1px dashed #999;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.logo-placeholder-content {
  text-align: center;
}

.logo-text {
  font-size: 12px;
  color: #666;
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.company-details {
  font-size: 12px;
  color: #666;
}

.company-details p {
  margin: 2px 0;
}

.main-info {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.info-label {
  font-weight: bold;
  color: #555;
}

.info-value {
  color: #333;
}

.works-section,
.parts-section {
  margin-bottom: 30px;
}

.table-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f5f5f5;
  padding: 10px;
  text-align: left;
  font-weight: bold;
  color: #333;
  border-bottom: 2px solid #ddd;
}

td {
  padding: 8px 10px;
  border-bottom: 1px solid #eee;
}

tbody tr:hover {
  background-color: #f9f9f9;
}

.table-footer {
  display: flex;
  justify-content: flex-end;
  background-color: #f5f5f5;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.total-label {
  font-weight: bold;
  margin-right: 20px;
  color: #555;
}

.total-amount {
  font-weight: bold;
  color: #333;
}

.financial-info {
  margin-bottom: 30px;
}

.financial-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.financial-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.financial-label {
  font-weight: bold;
  color: #555;
}

.financial-value {
  color: #333;
}

.financial-item.total {
  grid-column: 1 / -1;
  background-color: #f5f5f5;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.financial-item.total .financial-label {
  font-size: 16px;
  color: #333;
}

.financial-item.total .financial-value {
  font-size: 16px;
  font-weight: bold;
  color: #e74c3c;
}

.print-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #ccc;
}

.signatures {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.signature-block {
  text-align: center;
}

.signature-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}

.signature-label {
  font-weight: bold;
  color: #555;
  min-width: 60px;
}

.signature-placeholder {
  flex: 1;
  height: 40px;
  border-bottom: 2px solid #333;
}

.signature-name {
  font-size: 12px;
  color: #666;
  font-style: italic;
}

.footer-text {
  text-align: center;
  font-size: 12px;
  color: #666;
  line-height: 1.6;
}

@media print {
  .print-container {
    box-shadow: none;
    margin: 0;
    padding: 0;
    width: auto;
    height: auto;
  }

  .print-header,
  .main-info,
  .works-section,
  .parts-section,
  .financial-info,
  .print-footer {
    break-inside: avoid;
  }
}
</style>