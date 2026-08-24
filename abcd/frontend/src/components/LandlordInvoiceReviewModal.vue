<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-xl w-full overflow-hidden transition-all transform animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Header -->
      <div class="bg-slate-900 p-6 text-white relative">
        <button
          @click="$emit('close')"
          class="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <span>{{ invoice.room?.motel?.name || 'Nhà trọ' }}</span>
          <span>•</span>
          <span>Phòng {{ invoice.room?.roomNumber }}</span>
        </div>
        <h2 class="text-2xl font-black">Hóa đơn T{{ invoice.periodMonth }}/{{ invoice.periodYear }}</h2>
        <div class="flex items-center space-x-2 mt-2">
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full" :class="statusBadgeClass">
            {{ statusLabel }}
          </span>
          <span class="text-slate-400 text-xs">Khách thuê: <strong>{{ invoice.tenant?.fullName || 'Khách thuê' }}</strong></span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 max-h-[75vh] overflow-y-auto space-y-6">

        <!-- Minh chứng thanh toán do khách thuê tải lên MinIO (nếu có) -->
        <div v-if="invoice.paymentProofUrl" class="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5">
              <span>📸 Minh chứng chuyển khoản (MinIO Storage)</span>
            </span>
            <a :href="invoice.paymentProofUrl" target="_blank" class="text-xs text-indigo-600 hover:underline font-semibold">
              Mở ảnh gốc ↗
            </a>
          </div>
          <div class="relative group rounded-xl overflow-hidden bg-black/10 border border-indigo-200/50">
            <img :src="invoice.paymentProofUrl" alt="Bill Proof" class="w-full h-48 object-contain rounded-xl" />
          </div>
          <p v-if="invoice.tenantNote" class="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-white/70 dark:bg-slate-800 p-2.5 rounded-lg">
            💬 <strong>Ghi chú từ khách:</strong> "{{ invoice.tenantNote }}"
          </p>
        </div>

        <!-- Form nhập chỉ số điện nước & chi phí -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Chi tiết chỉ số & Số tiền
          </h3>

          <!-- Tiền phòng -->
          <div class="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl flex items-center justify-between">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">Tiền phòng cố định:</span>
            <span class="text-sm font-bold text-slate-900 dark:text-white">{{ formatCurrency(roomAmount) }}</span>
          </div>

          <!-- Nhập Điện -->
          <div class="grid grid-cols-2 gap-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-3.5 rounded-xl">
            <div>
              <label class="block text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
                Số điện tiêu thụ (kWh)
              </label>
              <input
                type="number"
                v-model.number="electricityUsage"
                min="0"
                class="w-full text-sm font-bold bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span class="text-[11px] text-amber-700/80 dark:text-amber-400 mt-0.5 block">
                Đơn giá: {{ formatCurrency(elecUnitPrice) }}/kWh
              </span>
            </div>
            <div class="text-right flex flex-col justify-end">
              <span class="text-xs text-slate-500">Thành tiền điện:</span>
              <span class="text-base font-extrabold text-amber-700 dark:text-amber-400">
                {{ formatCurrency(electricityAmount) }}
              </span>
            </div>
          </div>

          <!-- Nhập Nước -->
          <div class="grid grid-cols-2 gap-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-3.5 rounded-xl">
            <div>
              <label class="block text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">
                Số nước tiêu thụ (m³)
              </label>
              <input
                type="number"
                v-model.number="waterUsage"
                min="0"
                class="w-full text-sm font-bold bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-[11px] text-blue-700/80 dark:text-blue-400 mt-0.5 block">
                Đơn giá: {{ formatCurrency(waterUnitPrice) }}/m³
              </span>
            </div>
            <div class="text-right flex flex-col justify-end">
              <span class="text-xs text-slate-500">Thành tiền nước:</span>
              <span class="text-base font-extrabold text-blue-700 dark:text-blue-400">
                {{ formatCurrency(waterAmount) }}
              </span>
            </div>
          </div>

          <!-- Phí dịch vụ khác -->
          <div class="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl flex items-center justify-between">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Phí phát sinh / Rác / Wifi (VND):
            </label>
            <input
              type="number"
              v-model.number="otherFees"
              step="10000"
              class="w-36 text-right text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- Tổng tiền tự động tính -->
          <div class="bg-indigo-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-indigo-200 dark:shadow-none">
            <span class="font-bold text-sm">TỔNG TIỀN HÓA ĐƠN:</span>
            <span class="text-2xl font-black">{{ formatCurrency(totalCalculatedAmount) }}</span>
          </div>
        </div>

        <!-- Các Nút Hành Động Theo Trạng Thái -->
        <div class="pt-2 space-y-2.5">
          <!-- Nếu đang là DRAFT -> Nút Duyệt & Phát hành -->
          <button
            v-if="invoice.status === 'DRAFT'"
            @click="handleApprove"
            class="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition shadow-md shadow-indigo-200 dark:shadow-none flex items-center justify-center space-x-2"
          >
            <span>🚀 Duyệt & Phát hành cho Khách thuê</span>
          </button>

          <!-- Nếu khách đã upload bill -> Nút Xác nhận đã nhận tiền (PAID) -->
          <button
            v-if="invoice.status === 'PAYMENT_SUBMITTED'"
            @click="handleConfirmPaid"
            class="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition shadow-md shadow-emerald-200 dark:shadow-none flex items-center justify-center space-x-2"
          >
            <span>✅ Xác nhận Đã nhận đủ tiền (Chuyển thành PAID)</span>
          </button>

          <!-- Nút Lưu tạm -->
          <button
            v-if="invoice.status !== 'PAID'"
            @click="handleSaveDraft"
            class="w-full py-2.5 px-4 rounded-xl text-slate-700 dark:text-slate-200 font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
          >
            Lưu thay đổi số liệu
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Invoice } from '../types';
import { useRentalStore } from '../stores/rental.store';

const props = defineProps<{
  invoice: Invoice;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'updated'): void;
}>();

const rentalStore = useRentalStore();

const elecUnitPrice = computed(() => props.invoice.room?.motel?.electricityUnitPrice || 3800);
const waterUnitPrice = computed(() => props.invoice.room?.motel?.waterUnitPrice || 28000);

const roomAmount = ref(props.invoice.roomAmount);
const electricityUsage = ref(props.invoice.electricityUsage || 0);
const waterUsage = ref(props.invoice.waterUsage || 0);
const otherFees = ref(props.invoice.otherFees || 0);

const electricityAmount = computed(() => electricityUsage.value * elecUnitPrice.value);
const waterAmount = computed(() => waterUsage.value * waterUnitPrice.value);
const totalCalculatedAmount = computed(() => roomAmount.value + electricityAmount.value + waterAmount.value + otherFees.value);

const statusBadgeClass = computed(() => {
  switch (props.invoice.status) {
    case 'DRAFT':
      return 'bg-slate-700 text-slate-200';
    case 'PENDING_PAYMENT':
      return 'bg-amber-500 text-white';
    case 'PAYMENT_SUBMITTED':
      return 'bg-blue-500 text-white';
    case 'PAID':
      return 'bg-emerald-500 text-white';
    default:
      return 'bg-slate-500 text-white';
  }
});

const statusLabel = computed(() => {
  switch (props.invoice.status) {
    case 'DRAFT':
      return 'Bản Nháp (Chờ duyệt)';
    case 'PENDING_PAYMENT':
      return 'Đã phát hành (Chờ khách thanh toán)';
    case 'PAYMENT_SUBMITTED':
      return 'Khách đã gửi Bill (Cần đối soát)';
    case 'PAID':
      return 'Đã thanh toán (Hoàn tất)';
    default:
      return props.invoice.status;
  }
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const handleSaveDraft = async () => {
  try {
    await rentalStore.updateAndApproveInvoice(props.invoice.id, {
      electricityUsage: electricityUsage.value,
      waterUsage: waterUsage.value,
      otherFees: otherFees.value,
      roomAmount: roomAmount.value,
      approveImmediately: false,
    });
    alert('Đã cập nhật số liệu hóa đơn!');
    emit('updated');
  } catch (error) {
    alert('Có lỗi xảy ra khi cập nhật hóa đơn.');
  }
};

const handleApprove = async () => {
  try {
    await rentalStore.updateAndApproveInvoice(props.invoice.id, {
      electricityUsage: electricityUsage.value,
      waterUsage: waterUsage.value,
      otherFees: otherFees.value,
      roomAmount: roomAmount.value,
      approveImmediately: true,
    });
    alert('Đã DUYỆT và phát hành hóa đơn thành công! Khách thuê đã nhận được thông báo.');
    emit('updated');
    emit('close');
  } catch (error) {
    alert('Có lỗi xảy ra khi phê duyệt hóa đơn.');
  }
};

const handleConfirmPaid = async () => {
  try {
    await rentalStore.confirmPaymentSuccess(props.invoice.id);
    alert('Đã xác nhận thanh toán thành công (Trạng thái: PAID)!');
    emit('updated');
    emit('close');
  } catch (error) {
    alert('Có lỗi xảy ra khi xác nhận thanh toán.');
  }
};
</script>
