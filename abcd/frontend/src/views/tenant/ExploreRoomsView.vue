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
          Hệ sinh thái phòng trọ tiện nghi, hình ảnh thực tế 100%, minh bạch giá điện nước, an ninh 24/7.
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
            class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-xs"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Available Room Cards Grid -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-extrabold text-base text-slate-800 flex items-center space-x-2">
          <span>Danh Sách Phòng Trống</span>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
            {{ filteredRooms.length }} phòng
          </span>
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="room in filteredRooms"
          :key="room.id"
          class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all transform hover:-translate-y-1 group"
        >
          <div>
            <!-- Image Carousel & Badges -->
            <div class="relative h-52 bg-slate-900 overflow-hidden cursor-pointer" @click="openGallery(room)">
              <img
                :src="getRoomActiveImage(room)"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              <span class="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md z-10">
                CÒN TRỐNG
              </span>
              <span class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold z-10">
                {{ room.areaSqm }} m²
              </span>

              <!-- Photo Count & View Full Gallery Button -->
              <div class="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs font-bold flex items-center space-x-1 shadow-md z-10">
                <span>📸 {{ room.images?.length || 0 }} ảnh</span>
                <span class="text-indigo-300 ml-1">· Xem album</span>
              </div>

              <!-- Slide Switchers on Card -->
              <div v-if="room.images && room.images.length > 1" class="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition z-10 pointer-events-none">
                <button
                  type="button"
                  @click.stop="prevRoomImage(room.id, room.images.length)"
                  class="w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-xs pointer-events-auto shadow-md"
                >
                  ◀
                </button>
                <button
                  type="button"
                  @click.stop="nextRoomImage(room.id, room.images.length)"
                  class="w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-xs pointer-events-auto shadow-md"
                >
                  ▶
                </button>
              </div>
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

    <!-- Lightbox Photo Gallery Modal for Tenants -->
    <div
      v-if="galleryModalOpen && selectedGalleryRoom"
      @click="galleryModalOpen = false"
      class="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div class="relative max-w-4xl w-full flex flex-col items-center justify-center" @click.stop>
        <!-- Top bar with title and close button -->
        <div class="w-full flex items-center justify-between text-white mb-3">
          <div>
            <h3 class="font-black text-lg">Ảnh Thực Tế Phòng {{ selectedGalleryRoom.roomNumber }}</h3>
            <p class="text-xs text-slate-400">{{ selectedGalleryRoom.motel?.name }} · {{ activeGalleryIndex + 1 }} / {{ selectedGalleryRoom.images?.length || 1 }} ảnh</p>
          </div>
          <button
            @click="galleryModalOpen = false"
            class="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
          >
            ✕ Đóng
          </button>
        </div>

        <!-- Main Photo Viewer with prev/next arrows -->
        <div class="relative w-full h-[65vh] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 shadow-2xl">
          <img
            :src="selectedGalleryRoom.images[activeGalleryIndex]"
            class="max-h-full max-w-full object-contain"
          />

          <button
            v-if="selectedGalleryRoom.images.length > 1"
            type="button"
            @click="activeGalleryIndex = (activeGalleryIndex - 1 + selectedGalleryRoom.images.length) % selectedGalleryRoom.images.length"
            class="absolute left-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-lg font-bold shadow-lg"
          >
            ◀
          </button>
          <button
            v-if="selectedGalleryRoom.images.length > 1"
            type="button"
            @click="activeGalleryIndex = (activeGalleryIndex + 1) % selectedGalleryRoom.images.length"
            class="absolute right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-lg font-bold shadow-lg"
          >
            ▶
          </button>
        </div>

        <!-- Bottom Thumbnails Strip -->
        <div v-if="selectedGalleryRoom.images.length > 1" class="flex gap-2 mt-3 overflow-x-auto p-1 max-w-full">
          <div
            v-for="(img, idx) in selectedGalleryRoom.images"
            :key="idx"
            @click="activeGalleryIndex = idx"
            class="h-16 w-20 rounded-xl overflow-hidden cursor-pointer border-2 transition shrink-0"
            :class="activeGalleryIndex === idx ? 'border-indigo-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { Room } from '../../types';
import { useRentalStore } from '../../stores/rental.store';

const rentalStore = useRentalStore();

const filterCity = ref('');
const filterMaxPrice = ref<number>(0);
const filterSelfContained = ref('');

// Tracking active image index on room cards
const activeImageIndexMap = reactive<Record<string, number>>({});

// Gallery modal state
const galleryModalOpen = ref(false);
const selectedGalleryRoom = ref<Room | null>(null);
const activeGalleryIndex = ref(0);

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

const getRoomActiveImage = (room: Room) => {
  if (!room.images || room.images.length === 0) {
    return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';
  }
  const currentIndex = activeImageIndexMap[room.id] || 0;
  return room.images[currentIndex % room.images.length] || room.images[0];
};

const prevRoomImage = (roomId: string, length: number) => {
  const current = activeImageIndexMap[roomId] || 0;
  activeImageIndexMap[roomId] = (current - 1 + length) % length;
};

const nextRoomImage = (roomId: string, length: number) => {
  const current = activeImageIndexMap[roomId] || 0;
  activeImageIndexMap[roomId] = (current + 1) % length;
};

const openGallery = (room: Room) => {
  selectedGalleryRoom.value = room;
  activeGalleryIndex.value = activeImageIndexMap[room.id] || 0;
  galleryModalOpen.value = true;
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
