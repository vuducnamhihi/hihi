<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
      <div class="max-w-2xl">
        <span class="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
          Khu vực thanh toán
        </span>
        <h2 class="text-2xl sm:text-3xl font-black tracking-tight">Hóa Đơn & Tiền Nhà Của Bạn</h2>
        <p class="text-emerald-100 text-sm mt-1">
          Xem bảng kê tiền phòng, điện, nước hàng tháng. Quét mã VietQR và gửi ảnh chụp màn hình chuyển khoản lên hệ thống.
        </p>
      </div>
    </div>

    <!-- Danh sách hóa đơn -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="inv in myInvoices"
        :key="inv.id"
        class="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition"
      >
        <div class="space-y-4">
          <!-- Card Header -->
          <div class="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="text-xs font-semibold text-slate-400">Kỳ hóa đơn</span>
              <h3 class="text-xl font-black text-slate-900">Tháng {{ inv.periodMonth }}/{{ inv.periodYear }}</h3>
              <p class="text-xs text-slate-500 font-medium">Phòng {{ inv.room?.roomNumber }} • {{ inv.room?.motel?.name }}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-black" :class="getStatusBadgeClass(inv.status)">
              {{ getStatusLabel(inv.status) }}
            </span>
          </div>

          <!-- Chi tiết bảng tiền -->
          <div class="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs font-medium text-slate-600">
            <div class="flex justify-between">
              <span>Tiền phòng:</span>
              <span class="font-bold text-slate-900">{{ formatCurrency(inv.roomAmount) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tiền điện ({{ inv.electricityUsage }} kWh):</span>
              <span class="font-bold text-slate-900">{{ formatCurrency(inv.electricityAmount) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tiền nước ({{ inv.waterUsage }} m³):</span>
              <span class="font-bold text-slate-900">{{ formatCurrency(inv.waterAmount) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Phí dịch vụ & phát sinh:</span>
              <span class="font-bold text-slate-900">{{ formatCurrency(inv.otherFees) }}</span>
            </div>
            <div class="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-sm text-emerald-600">
              <span>Tổng thanh toán:</span>
              <span class="text-base font-black">{{ formatCurrency(inv.totalAmount) }}</span>
            </div>
          </div>

          <!-- Trạng thái minh chứng MinIO nếu đã nộp -->
          <div v-if="inv.paymentProofUrl" class="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-900 flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span>📸</span>
              <span>Đã tải lên ảnh chụp bill chuyển khoản</span>
            </div>
            <a :href="inv.paymentProofUrl" target="_blank" class="font-bold text-blue-600 hover:underline">
              Xem ảnh ↗
            </a>
          </div>
        </div>

        <!-- Card Action -->
        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-400 font-medium">Hạn đóng: {{ formatDate(inv.dueDate) }}</span>

          <button
            v-if="inv.status === 'PENDING_PAYMENT' || inv.status === 'PAYMENT_SUBMITTED'"
            @click="openPaymentModal(inv)"
            class="px-5 py-2.5 rounded-xl font-black text-xs text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition shadow-md shadow-emerald-200 flex items-center space-x-1.5"
          >
            <span>{{ inv.status === 'PAYMENT_SUBMITTED' ? '📸 Cập nhật lại Bill' : '💳 Thanh toán VietQR & Gửi Bill' }}</span>
          </button>
          <span v-else-if="inv.status === 'PAID'" class="text-emerald-600 text-xs font-bold flex items-center space-x-1">
            <span>✓ Đã thanh toán xong</span>
          </span>
          <span v-else-if="inv.status === 'DRAFT'" class="text-slate-400 text-xs italic">
            Chủ trọ đang chốt số điện nước
          </span>
        </div>
      </div>

      <div v-if="myInvoices.length === 0" class="col-span-2 text-center py-16 bg-white rounded-3xl border border-slate-200">
        <p class="text-slate-500 font-bold">Bạn chưa có hóa đơn nào trong hệ thống.</p>
      </div>
    </div>

    <!-- Modal Thanh Toán VietQR & Upload MinIO -->
    <TenantBillPaymentModal
      v-if="selectedInvoice"
      :invoice="selectedInvoice"
      @close="selectedInvoice = null"
      @success="selectedInvoice = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import { useRentalStore } from '../../stores/rental.store';
import { Invoice, InvoiceStatus } from '../../types';
import TenantBillPaymentModal from '../../components/TenantBillPaymentModal.vue';

const route = useRoute();
const authStore = useAuthStore();
const rentalStore = useRentalStore();
const selectedInvoice = ref<Invoice | null>(null);

onMounted(() => {
  rentalStore.fetchTenantData();
  checkRouteParams();
});

const checkRouteParams = () => {
  if (route.query.invoiceId) {
    const inv = rentalStore.enrichedInvoices.find(
      (i) => i.id === route.query.invoiceId && i.tenantId === authStore.currentUser?.id,
    );
    if (inv) selectedInvoice.value = inv;
  } else if (route.query.status === 'PENDING_PAYMENT') {
    const pendingInv = rentalStore.enrichedInvoices.find(
      (i) => i.tenantId === authStore.currentUser?.id && i.status === 'PENDING_PAYMENT',
    );
    if (pendingInv) selectedInvoice.value = pendingInv;
  }
};

watch(() => route.query, () => {
  checkRouteParams();
});

const myInvoices = computed(() => {
  return rentalStore.enrichedInvoices.filter(
    (i) => i.tenantId === authStore.currentUser?.id,
  );
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
      return 'bg-slate-100 text-slate-600';
    case 'PENDING_PAYMENT':
      return 'bg-amber-100 text-amber-800 border border-amber-300';
    case 'PAYMENT_SUBMITTED':
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    case 'PAID':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
    default:
      return 'bg-slate-100 text-slate-600';
  }
};

const getStatusLabel = (st: InvoiceStatus) => {
  switch (st) {
    case 'DRAFT':
      return 'Chờ phát hành';
    case 'PENDING_PAYMENT':
      return 'Chờ thanh toán';
    case 'PAYMENT_SUBMITTED':
      return 'Đã gửi minh chứng';
    case 'PAID':
      return 'Đã thanh toán';
    default:
      return st;
  }
};

const openPaymentModal = (inv: Invoice) => {
  selectedInvoice.value = inv;
};
</script>
