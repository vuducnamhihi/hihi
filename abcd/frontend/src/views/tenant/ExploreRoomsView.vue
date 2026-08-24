<template>
  <div class="space-y-6">
    <!-- Search Banner -->
    <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      <div class="max-w-xl relative z-10">
        <span class="text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full inline-block mb-2">
          Tìm kiếm phòng trọ
        </span>
        <h2 class="text-2xl sm:text-3xl font-black tracking-tight">Tìm Phòng Trọ Ưng Ý Ngay Hôm Nay</h2>
        <p class="text-slate-300 text-sm mt-1">
          Hệ sinh thái phòng trọ tiện nghi, minh bạch giá điện nước, an ninh 24/7.
        </p>
      </div>

      <!-- Quick Filter Inputs -->
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-slate-800 text-xs font-semibold">
        <div>
          <select v-model="filterCity" class="w-full bg-white rounded-xl p-2.5 outline-none font-bold">
            <option value="">Tất cả Khu Vực / TP</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
          </select>
        </div>
        <div>
          <select v-model="filterMaxPrice" class="w-full bg-white rounded-xl p-2.5 outline-none font-bold">
            <option :value="0">Mọi mức giá</option>
            <option :value="3500000">Dưới 3.5 triệu</option>
            <option :value="4500000">Dưới 4.5 triệu</option>
            <option :value="6000000">Dưới 6 triệu</option>
          </select>
        </div>
        <div>
          <select v-model="filterSelfContained" class="w-full bg-white rounded-xl p-2.5 outline-none font-bold">
            <option value="">Khép kín / Vệ sinh</option>
            <option value="true">Chỉ phòng khép kín</option>
            <option value="false">Phòng thường (giá rẻ)</option>
          </select>
        </div>
        <div class="flex items-center">
          <button
            @click="resetFilters"
            class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Available Room Cards Grid -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-extrabold text-base text-slate-800">
          Danh Sách Phòng Trống ({{ filteredRooms.length }} phòng)
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="room in filteredRooms"
          :key="room.id"
          class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <div>
            <!-- Image & Badges -->
            <div class="relative h-48 bg-slate-100 overflow-hidden">
              <img :src="room.images[0]" class="w-full h-full object-cover" />
              <span class="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                CÒN TRỐNG
              </span>
              <span class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                {{ room.areaSqm }} m²
              </span>
            </div>

            <!-- Details -->
            <div class="p-5 space-y-2.5">
              <div class="flex items-baseline justify-between">
                <h4 class="font-extrabold text-lg text-slate-900">Phòng {{ room.roomNumber }}</h4>
                <span class="font-black text-indigo-600 text-base">{{ formatCurrency(room.basePrice) }}<span class="text-xs font-medium text-slate-400">/tháng</span></span>
              </div>

              <p class="text-xs text-slate-500 font-medium">📍 {{ room.motel?.address }}, {{ room.motel?.district }}, {{ room.motel?.city }}</p>
              <p class="text-xs text-slate-600 line-clamp-2">{{ room.description }}</p>

              <!-- Amenities -->
              <div class="flex flex-wrap gap-1 pt-1">
                <span v-for="am in room.amenities.slice(0, 3)" :key="am" class="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                  ✓ {{ am }}
                </span>
                <span v-if="room.amenities.length > 3" class="text-[10px] text-slate-400">
                  +{{ room.amenities.length - 3 }} tiện ích
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center space-x-2">
            <button
              @click="handleBookViewing(room.roomNumber)"
              class="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
            >
              🗓 Hẹn Xem Phòng
            </button>
            <button
              @click="handleDeposit(room.roomNumber, room.basePrice)"
              class="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              🔒 Đặt Cọc Giữ Chỗ
            </button>
          </div>
        </div>

        <div v-if="filteredRooms.length === 0" class="col-span-3 text-center py-20 bg-white rounded-3xl border border-slate-200">
          <p class="text-slate-500 font-bold">Không tìm thấy phòng nào phù hợp với bộ lọc hiện tại.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRentalStore } from '../../stores/rental.store';

const rentalStore = useRentalStore();

const filterCity = ref('');
const filterMaxPrice = ref<number>(0);
const filterSelfContained = ref('');

const filteredRooms = computed(() => {
  return rentalStore.enrichedRooms.filter((r) => {
    if (r.status !== 'AVAILABLE') return false;
    if (filterCity.value && !r.motel?.city.includes(filterCity.value)) return false;
    if (filterMaxPrice.value > 0 && r.basePrice > filterMaxPrice.value) return false;
    if (filterSelfContained.value !== '') {
      const isSelf = filterSelfContained.value === 'true';
      if (r.isSelfContained !== isSelf) return false;
    }
    return true;
  });
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const resetFilters = () => {
  filterCity.value = '';
  filterMaxPrice.value = 0;
  filterSelfContained.value = '';
};

const handleBookViewing = (roomNumber: string) => {
  const time = prompt(`Nhập thời gian bạn muốn hẹn xem phòng ${roomNumber} (VD: 18h30 ngày mai):`, '18:30 ngày mai');
  if (time) {
    alert(`Đã gửi yêu cầu hẹn xem phòng ${roomNumber} vào lúc ${time} đến Chủ trọ!`);
  }
};

const handleDeposit = (roomNumber: string, price: number) => {
  const deposit = price;
  if (confirm(`Bạn muốn đặt cọc giữ chỗ phòng ${roomNumber} số tiền ${formatCurrency(deposit)}?`)) {
    alert(`Yêu cầu cọc phòng ${roomNumber} đã được gửi. Chủ trọ sẽ liên hệ để xác nhận và lập hợp đồng!`);
  }
};
</script>
