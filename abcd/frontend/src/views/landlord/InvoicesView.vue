<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Trung Tâm Duyệt Hóa Đơn Hằng Tháng</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Xem bảng tính tiền tự động do BullMQ tạo, chỉnh sửa chỉ số điện/nước và duyệt hóa đơn cho khách.
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <button
          @click="handleTriggerCron"
          class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center space-x-2"
        >
          <span>⚡ Quét tạo Hóa đơn DRAFT (BullMQ)</span>
        </button>
      </div>
    </div>

    <!-- Filter Pills -->
    <div class="flex flex-wrap items-center gap-2 text-xs font-bold">
      <button
        v-for="st in statusFilters"
        :key="st.value"
        @click="selectedStatus = st.value"
        class="px-3.5 py-1.5 rounded-full transition-all"
        :class="
          selectedStatus === st.value
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
        "
      >
        {{ st.label }} ({{ countByStatus(st.value) }})
      </button>
    </div>

    <!-- Invoice Table / Cards -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th class="p-4">Phòng & Nhà Trọ</th>
              <th class="p-4">Người Thuê</th>
              <th class="p-4">Kỳ Hóa Đơn</th>
              <th class="p-4">Điện (kWh)</th>
              <th class="p-4">Nước (m³)</th>
              <th class="p-4">Tổng Tiền</th>
              <th class="p-4">Minh chứng (MinIO)</th>
              <th class="p-4">Trạng Thái</th>
              <th class="p-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr
              v-for="inv in filteredInvoices"
              :key="inv.id"
              class="hover:bg-indigo-50/30 transition-colors"
            >
              <td class="p-4">
                <span class="font-extrabold text-slate-900 text-sm">Phòng {{ inv.room?.roomNumber }}</span>
                <span class="block text-[11px] text-slate-400 font-normal">{{ inv.room?.motel?.name }}</span>
              </td>
              <td class="p-4">
                <span class="font-bold text-slate-800">{{ inv.tenant?.fullName || 'Khách thuê' }}</span>
                <span class="block text-[11px] text-slate-400 font-mono">{{ inv.tenant?.phoneNumber || '09...' }}</span>
              </td>
              <td class="p-4">
                <span class="font-bold text-indigo-600">Tháng {{ inv.periodMonth }}/{{ inv.periodYear }}</span>
                <span class="block text-[10px] text-slate-400">Hạn: {{ formatDate(inv.dueDate) }}</span>
              </td>
              <td class="p-4">
                <span class="font-bold text-amber-700">{{ inv.electricityUsage }}</span>
                <span class="text-slate-400 text-[10px]"> kWh</span>
              </td>
              <td class="p-4">
                <span class="font-bold text-blue-700">{{ inv.waterUsage }}</span>
                <span class="text-slate-400 text-[10px]"> m³</span>
              </td>
              <td class="p-4">
                <span class="font-black text-slate-900 text-sm">{{ formatCurrency(inv.totalAmount) }}</span>
              </td>
              <td class="p-4">
                <div v-if="inv.paymentProofUrl" class="flex items-center space-x-1.5 text-indigo-600 font-bold">
                  <span class="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                  <a :href="inv.paymentProofUrl" target="_blank" class="hover:underline">Có ảnh bill ↗</a>
                </div>
                <span v-else class="text-slate-300">Chưa nộp</span>
              </td>
              <td class="p-4">
                <span class="px-2.5 py-1 rounded-full text-[11px] font-extrabold" :class="getStatusBadgeClass(inv.status)">
                  {{ getStatusLabel(inv.status) }}
                </span>
              </td>
              <td class="p-4 text-right space-x-1">
                <button
                  @click="openReviewModal(inv)"
                  class="px-3 py-1.5 rounded-lg font-bold text-xs transition"
                  :class="
                    inv.status === 'DRAFT'
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                      : inv.status === 'PAYMENT_SUBMITTED'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  "
                >
                  {{ inv.status === 'DRAFT' ? '✏️ Nhập số & Duyệt' : inv.status === 'PAYMENT_SUBMITTED' ? '🔍 Đối soát & Nhận' : 'Chi tiết' }}
                </button>
              </td>
            </tr>

            <tr v-if="filteredInvoices.length === 0">
              <td colspan="9" class="text-center py-12 text-slate-400">
                <p class="text-base font-semibold">Không có hóa đơn nào phù hợp với bộ lọc.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Review / Approve Modal -->
    <LandlordInvoiceReviewModal
      v-if="selectedInvoice"
      :invoice="selectedInvoice"
      @close="selectedInvoice = null"
      @updated="selectedInvoice = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRentalStore } from '../../stores/rental.store';
import { Invoice, InvoiceStatus } from '../../types';
import LandlordInvoiceReviewModal from '../../components/LandlordInvoiceReviewModal.vue';

const route = useRoute();
const rentalStore = useRentalStore();
const selectedStatus = ref<string>((route.query.status as string) || 'ALL');
const selectedInvoice = ref<Invoice | null>(null);

onMounted(() => {
  rentalStore.fetchLandlordData();
  if (route.query.status) {
    selectedStatus.value = route.query.status as string;
  }
  if (route.query.invoiceId) {
    const inv = rentalStore.enrichedInvoices.find((i) => i.id === route.query.invoiceId);
    if (inv) selectedInvoice.value = inv;
  }
});

watch(
  () => route.query.status,
  (newStatus) => {
    if (newStatus) {
      selectedStatus.value = newStatus as string;
    }
  },
);

watch(
  () => route.query.invoiceId,
  (invId) => {
    if (invId) {
      const inv = rentalStore.enrichedInvoices.find((i) => i.id === invId);
      if (inv) selectedInvoice.value = inv;
    }
  },
);

const statusFilters = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chờ duyệt (DRAFT)', value: 'DRAFT' },
  { label: 'Khách đã gửi Bill', value: 'PAYMENT_SUBMITTED' },
  { label: 'Chờ khách trả tiền', value: 'PENDING_PAYMENT' },
  { label: 'Đã thanh toán (PAID)', value: 'PAID' },
];

const countByStatus = (st: string) => {
  if (st === 'ALL') return rentalStore.enrichedInvoices.length;
  return rentalStore.enrichedInvoices.filter((i) => i.status === st).length;
};

const filteredInvoices = computed(() => {
  if (selectedStatus.value === 'ALL') return rentalStore.enrichedInvoices;
  return rentalStore.enrichedInvoices.filter((i) => i.status === selectedStatus.value);
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

const getStatusBadgeClass = (st: InvoiceStatus) => {
  switch (st) {
    case 'DRAFT':
      return 'bg-slate-100 text-slate-700 border border-slate-300';
    case 'PENDING_PAYMENT':
      return 'bg-amber-100 text-amber-800 border border-amber-300';
    case 'PAYMENT_SUBMITTED':
      return 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse';
    case 'PAID':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const getStatusLabel = (st: InvoiceStatus) => {
  switch (st) {
    case 'DRAFT':
      return 'Bản Nháp';
    case 'PENDING_PAYMENT':
      return 'Chờ thanh toán';
    case 'PAYMENT_SUBMITTED':
      return 'Đã nộp Bill';
    case 'PAID':
      return 'Đã thanh toán';
    default:
      return st;
  }
};

const openReviewModal = (inv: Invoice) => {
  selectedInvoice.value = inv;
};

const handleTriggerCron = async () => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const res = await rentalStore.triggerMonthlyBullMQJob(currentMonth, currentYear);
    alert(`BullMQ Cron Trigger thành công! Đã tạo thêm ${res.createdCount} bản ghi hóa đơn DRAFT.`);
  } catch (error) {
    alert('Có lỗi xảy ra khi trigger cron.');
  }
};
</script>
