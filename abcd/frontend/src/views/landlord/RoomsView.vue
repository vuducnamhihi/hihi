<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Quản Lý Danh Sách Phòng Trọ</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Quản lý hình ảnh thực tế, giá thuê, diện tích, tiện ích và trạng thái phòng (Trống, Đang thuê, Bảo trì).
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <button
          @click="openCreateModal"
          class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition flex items-center space-x-2"
        >
          <span>＋ Thêm Phòng Mới</span>
        </button>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <span class="text-xs text-slate-500 font-semibold">Tổng số phòng</span>
        <p class="text-2xl font-black text-slate-900 mt-1">{{ rentalStore.rooms.length }}</p>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <span class="text-xs text-emerald-600 font-semibold">Phòng đang thuê</span>
        <p class="text-2xl font-black text-emerald-600 mt-1">{{ occupiedCount }}</p>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <span class="text-xs text-indigo-600 font-semibold">Phòng còn trống</span>
        <p class="text-2xl font-black text-indigo-600 mt-1">{{ availableCount }}</p>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <span class="text-xs text-slate-500 font-semibold">Tỷ lệ lấp đầy</span>
        <p class="text-2xl font-black text-slate-800 mt-1">{{ occupancyRate }}%</p>
      </div>
    </div>

    <!-- Room Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="room in rentalStore.enrichedRooms"
        :key="room.id"
        class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
      >
        <div>
          <!-- Room Image & Image Carousel Switcher -->
          <div class="relative h-52 bg-slate-900 overflow-hidden group">
            <img
              :src="getRoomActiveImage(room)"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <!-- Top Left Status Badge -->
            <span
              class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black shadow-md z-10"
              :class="room.status === 'OCCUPIED' ? 'bg-emerald-600 text-white' : (room.status === 'MAINTENANCE' ? 'bg-amber-600 text-white' : 'bg-indigo-600 text-white')"
            >
              {{ room.status === 'OCCUPIED' ? 'ĐANG THUÊ' : (room.status === 'MAINTENANCE' ? 'BẢO TRÌ' : 'PHÒNG TRỐNG') }}
            </span>

            <!-- Top Right Floor Badge -->
            <span class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold z-10">
              Tầng {{ room.floor }}
            </span>

            <!-- Bottom Left Photo Count Badge -->
            <button
              @click.stop="openImageModal(room)"
              class="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black/90 backdrop-blur-sm text-white text-xs font-bold flex items-center space-x-1.5 shadow-md transition z-10"
              title="Nhấn để cập nhật album ảnh"
            >
              <span>📸 {{ room.images?.length || 0 }} ảnh</span>
              <span class="text-indigo-300 underline text-[11px] ml-1">Sửa ảnh</span>
            </button>

            <!-- Slide left/right buttons on card -->
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

          <!-- Room Info -->
          <div class="p-5 space-y-3">
            <div class="flex items-baseline justify-between">
              <h3 class="text-lg font-black text-slate-900">Phòng {{ room.roomNumber }}</h3>
              <span class="text-base font-extrabold text-indigo-600">{{ formatCurrency(room.basePrice) }}<span class="text-xs font-medium text-slate-400">/tháng</span></span>
            </div>

            <p class="text-xs text-slate-500 font-medium flex items-center space-x-1">
              <span>📍 {{ room.motel?.name }}</span>
            </p>

            <div class="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-600">
              <span class="bg-slate-100 px-2 py-0.5 rounded-md">📐 {{ room.areaSqm }} m²</span>
              <span class="bg-slate-100 px-2 py-0.5 rounded-md">{{ room.isSelfContained ? '🚿 Khép kín' : '🚻 Vệ sinh ngoài' }}</span>
            </div>

            <p v-if="room.description" class="text-xs text-slate-600 line-clamp-2 italic">
              "{{ room.description }}"
            </p>

            <!-- Amenities -->
            <div class="flex flex-wrap gap-1 text-[10px] text-slate-500">
              <span v-for="am in room.amenities.slice(0, 4)" :key="am" class="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                ✓ {{ am }}
              </span>
              <span v-if="room.amenities.length > 4" class="text-slate-400 font-medium">
                +{{ room.amenities.length - 4 }} khác
              </span>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-col gap-2.5">
          <!-- Sub status info -->
          <div class="flex items-center justify-between text-xs">
            <div v-if="room.status === 'OCCUPIED'">
              <span class="text-slate-400 text-[11px] block">Người thuê:</span>
              <strong class="text-slate-800">{{ room.contract?.tenantId ? 'Trần Thị Thuê Nhà' : 'Đang thuê' }}</strong>
            </div>
            <div v-else-if="room.status === 'MAINTENANCE'" class="text-amber-600 font-bold">
              🛠️ Đang sửa chữa / bảo trì
            </div>
            <div v-else class="text-emerald-600 font-bold">
              ✨ Sẵn sàng bàn giao
            </div>

            <div class="flex items-center space-x-1.5">
              <button
                @click="openImageModal(room)"
                class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition flex items-center space-x-1"
                title="Cập nhật album hình ảnh phòng"
              >
                <span>📸 Ảnh</span>
              </button>
              <button
                @click="openEditModal(room)"
                class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title="Chỉnh sửa thông tin phòng"
              >
                <span>✏️ Sửa</span>
              </button>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="flex items-center space-x-2 pt-1 border-t border-slate-200/60">
            <button
              v-if="room.status === 'AVAILABLE'"
              @click="openContractModal(room.id)"
              class="w-full py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
            >
              📝 Lập Hợp Đồng Mới
            </button>
            <button
              @click="toggleStatus(room.id, room.status)"
              class="w-full py-2 rounded-xl font-semibold text-xs border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition"
            >
              {{ room.status === 'OCCUPIED' ? '🚪 Trả phòng' : (room.status === 'AVAILABLE' ? '🛠️ Bảo trì' : '✅ Đặt làm Trống') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <RoomModal
      v-if="showRoomModal"
      :roomToEdit="selectedRoomForEdit"
      @close="closeRoomModal"
      @saved="handleRoomSaved"
    />
    <RoomImageModal
      v-if="showImageModal && selectedRoomForImages"
      :room="selectedRoomForImages"
      @close="showImageModal = false"
      @saved="handleImagesSaved"
    />
    <ContractModal v-if="showContractModal" @close="showContractModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { Room } from '../../types';
import { useRentalStore } from '../../stores/rental.store';
import RoomModal from '../../components/RoomModal.vue';
import RoomImageModal from '../../components/RoomImageModal.vue';
import ContractModal from '../../components/ContractModal.vue';

const rentalStore = useRentalStore();
const showRoomModal = ref(false);
const showImageModal = ref(false);
const showContractModal = ref(false);
const selectedRoomForEdit = ref<Room | null>(null);
const selectedRoomForImages = ref<Room | null>(null);

// Reactive object tracking active image index for each room card preview
const activeImageIndexMap = reactive<Record<string, number>>({});

onMounted(() => {
  rentalStore.fetchLandlordData();
});

const occupiedCount = computed(() => rentalStore.rooms.filter((r) => r.status === 'OCCUPIED').length);
const availableCount = computed(() => rentalStore.rooms.filter((r) => r.status === 'AVAILABLE').length);
const occupancyRate = computed(() => {
  if (rentalStore.rooms.length === 0) return 0;
  return Math.round((occupiedCount.value / rentalStore.rooms.length) * 100);
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const getRoomActiveImage = (room: Room) => {
  if (!room.images || room.images.length === 0) {
    return 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
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

const openCreateModal = () => {
  selectedRoomForEdit.value = null;
  showRoomModal.value = true;
};

const openEditModal = (room: Room) => {
  selectedRoomForEdit.value = room;
  showRoomModal.value = true;
};

const closeRoomModal = () => {
  showRoomModal.value = false;
  selectedRoomForEdit.value = null;
};

const openImageModal = (room: Room) => {
  selectedRoomForImages.value = room;
  showImageModal.value = true;
};

const handleRoomSaved = () => {
  rentalStore.fetchLandlordData();
};

const handleImagesSaved = () => {
  rentalStore.fetchLandlordData();
};

const openContractModal = (roomId: string) => {
  showContractModal.value = true;
};

const toggleStatus = (roomId: string, current: string) => {
  if (current === 'OCCUPIED') {
    if (confirm('Xác nhận kết thúc lượt thuê và chuyển phòng sang trạng thái TRỐNG?')) {
      rentalStore.updateRoomStatus(roomId, 'AVAILABLE');
    }
  } else if (current === 'AVAILABLE') {
    rentalStore.updateRoomStatus(roomId, 'MAINTENANCE');
  } else {
    rentalStore.updateRoomStatus(roomId, 'AVAILABLE');
  }
};
</script>
