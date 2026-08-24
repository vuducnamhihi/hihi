<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Phòng Trọ Đang Thuê</h2>
        <p class="text-xs text-slate-500 mt-0.5">Thông tin chi tiết hợp đồng, tiền phòng, chỉ số và liên hệ chủ trọ.</p>
      </div>

      <button
        @click="handleRequestCheckOut"
        class="px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition"
      >
        🚪 Gửi thông báo hẹn ngày trả phòng
      </button>
    </div>

    <!-- Active Room Details Card -->
    <div v-if="myContract" class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
      
      <!-- Photos Carousel / Image -->
      <div class="lg:col-span-5 relative bg-slate-100 h-64 lg:h-auto min-h-[300px]">
        <img
          :src="myContract.room?.images[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
          <span class="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full inline-block w-max mb-2 shadow-md">
            HỢP ĐỒNG ĐANG HIỆU LỰC
          </span>
          <h3 class="text-2xl font-black">Phòng {{ myContract.room?.roomNumber }}</h3>
          <p class="text-xs text-slate-200">{{ myContract.room?.motel?.name }}</p>
        </div>
      </div>

      <!-- Info Specs -->
      <div class="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
        <div class="space-y-4">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div class="bg-slate-50 p-3 rounded-xl">
              <span class="text-slate-400 font-semibold block">Giá thuê cố định:</span>
              <strong class="text-sm text-indigo-600 font-black">{{ formatCurrency(myContract.rentalPrice) }}/tháng</strong>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl">
              <span class="text-slate-400 font-semibold block">Tiền cọc giữ chân:</span>
              <strong class="text-sm text-slate-800 font-bold">{{ formatCurrency(myContract.depositAmount) }}</strong>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl">
              <span class="text-slate-400 font-semibold block">Diện tích phòng:</span>
              <strong class="text-sm text-slate-800 font-bold">{{ myContract.room?.areaSqm }} m²</strong>
            </div>
          </div>

          <!-- Thời hạn hợp đồng -->
          <div class="border border-slate-100 bg-slate-50/50 p-4 rounded-2xl space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-500">Thời hạn thuê:</span>
              <strong class="text-slate-800">{{ formatDate(myContract.startDate) }} → {{ formatDate(myContract.endDate) }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Ngày thanh toán hàng tháng:</span>
              <strong class="text-indigo-600 font-bold">Ngày {{ myContract.paymentDay }} hàng tháng</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Đơn giá điện:</span>
              <strong class="text-slate-800">{{ formatCurrency(myContract.room?.motel?.electricityUnitPrice || 3800) }}/kWh</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Đơn giá nước:</span>
              <strong class="text-slate-800">{{ formatCurrency(myContract.room?.motel?.waterUnitPrice || 28000) }}/m³</strong>
            </div>
          </div>

          <!-- Tiện ích phòng -->
          <div>
            <h4 class="text-xs font-bold text-slate-800 mb-2">Tiện ích trong phòng</h4>
            <div class="flex flex-wrap gap-1.5 text-xs">
              <span v-for="am in myContract.room?.amenities" :key="am" class="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg font-medium border border-emerald-100">
                ✓ {{ am }}
              </span>
            </div>
          </div>
        </div>

        <!-- Chủ trọ hotline -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span class="text-slate-400 block">Chủ nhà trọ:</span>
            <strong class="text-slate-900 font-bold">Nguyễn Văn Chủ Trọ</strong>
          </div>
          <a href="tel:0901234567" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm">
            <span>📞 Gọi Chủ Trọ</span>
          </a>
        </div>
      </div>

    </div>

    <div v-else class="text-center py-20 bg-white rounded-3xl border border-slate-200">
      <p class="text-slate-500 font-bold">Tài khoản của bạn hiện chưa có hợp đồng thuê phòng nào.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useRentalStore } from '../../stores/rental.store';

const authStore = useAuthStore();
const rentalStore = useRentalStore();

const myContract = computed(() => {
  const c = rentalStore.contracts.find(
    (item) => item.tenantId === authStore.currentUser.id && item.status === 'ACTIVE',
  );
  if (!c) return null;
  const room = rentalStore.enrichedRooms.find((r) => r.id === c.roomId);
  return { ...c, room };
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

const handleRequestCheckOut = () => {
  const checkoutDate = prompt('Nhập ngày bạn dự kiến trả phòng (VD: 30/09/2026):', '30/09/2026');
  if (checkoutDate) {
    alert(`Đã gửi thông báo hẹn ngày trả phòng (${checkoutDate}) đến Chủ trọ thành công!`);
  }
};
</script>
