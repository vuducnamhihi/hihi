<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-lg w-full overflow-hidden transition-all">
      <div class="bg-slate-900 p-6 text-white relative">
        <button @click="$emit('close')" class="absolute top-5 right-5 text-white/70 hover:text-white">✕</button>
        <h2 class="text-xl font-bold">Lập Hợp Đồng Thuê Phòng</h2>
        <p class="text-xs text-slate-400 mt-1">Tạo hợp đồng mới và bàn giao phòng cho khách</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 text-sm">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Chọn phòng trống</label>
          <select
            v-model="form.roomId"
            required
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>-- Chọn phòng trọ --</option>
            <option
              v-for="room in availableRooms"
              :key="room.id"
              :value="room.id"
            >
              {{ room.motel?.name }} - Phòng {{ room.roomNumber }} ({{ formatCurrency(room.basePrice) }}/tháng)
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Họ tên người thuê</label>
            <input
              type="text"
              v-model="form.tenantName"
              required
              placeholder="VD: Nguyễn Văn B"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Số điện thoại</label>
            <input
              type="tel"
              v-model="form.tenantPhone"
              required
              placeholder="0988..."
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Giá thuê cố định (VND)</label>
            <input
              type="number"
              v-model.number="form.rentalPrice"
              required
              step="50000"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tiền đặt cọc (VND)</label>
            <input
              type="number"
              v-model.number="form.depositAmount"
              required
              step="50000"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ngày bắt đầu</label>
            <input
              type="date"
              v-model="form.startDate"
              required
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ngày kết thúc</label>
            <input
              type="date"
              v-model="form.endDate"
              required
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div class="pt-3 flex space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="w-1/3 py-2.5 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            class="w-2/3 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
          >
            Ký Hợp Đồng & Bàn Giao
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useRentalStore } from '../stores/rental.store';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const rentalStore = useRentalStore();

const availableRooms = computed(() =>
  rentalStore.enrichedRooms.filter((r) => r.status === 'AVAILABLE'),
);

const form = reactive({
  roomId: '',
  tenantName: '',
  tenantPhone: '',
  rentalPrice: 3500000,
  depositAmount: 3500000,
  startDate: '2026-08-25',
  endDate: '2027-08-24',
  paymentDay: 5,
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const handleSubmit = async () => {
  try {
    await rentalStore.addContract({
      roomId: form.roomId,
      tenantPhone: form.tenantPhone,
      tenantName: form.tenantName,
      startDate: form.startDate,
      endDate: form.endDate,
      rentalPrice: form.rentalPrice,
      depositAmount: form.depositAmount,
      paymentDay: form.paymentDay,
    } as any);
    alert('Đã tạo hợp đồng thuê thành công! Phòng đã chuyển sang trạng thái ĐÃ THUÊ.');
    emit('close');
  } catch (error) {
    alert('Có lỗi xảy ra khi tạo hợp đồng. Vui lòng kiểm tra lại.');
    console.error(error);
  }
};
</script>
