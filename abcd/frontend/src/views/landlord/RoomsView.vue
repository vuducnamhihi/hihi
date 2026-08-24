<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Quản Lý Danh Sách Phòng Trọ</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Theo dõi trạng thái phòng (Trống, Đã thuê, Bảo trì), giá thuê, diện tích và tiện ích.
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <button
          @click="showRoomModal = true"
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
        class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
      >
        <div>
          <!-- Room Image -->
          <div class="relative h-48 bg-slate-100 overflow-hidden">
            <img
              :src="room.images[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'"
              class="w-full h-full object-cover"
            />
            <span
              class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black shadow-md"
              :class="room.status === 'OCCUPIED' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'"
            >
              {{ room.status === 'OCCUPIED' ? 'ĐANG THUÊ' : 'PHÒNG TRỐNG' }}
            </span>
            <span class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold">
              Tầng {{ room.floor }}
            </span>
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
        <div class="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
          <div v-if="room.status === 'OCCUPIED'" class="text-xs">
            <span class="text-slate-400 text-[11px] block">Người thuê:</span>
            <strong class="text-slate-800">{{ room.contract?.tenantId ? 'Trần Thị Thuê Nhà' : 'Đang thuê' }}</strong>
          </div>
          <div v-else class="text-xs text-slate-400">
            Sẵn sàng bàn giao
          </div>

          <div class="flex items-center space-x-1.5">
            <button
              v-if="room.status === 'AVAILABLE'"
              @click="openContractModal(room.id)"
              class="px-3 py-1.5 rounded-lg font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            >
              📝 Lập HĐ
            </button>
            <button
              @click="toggleStatus(room.id, room.status)"
              class="px-2.5 py-1.5 rounded-lg font-semibold text-xs border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
            >
              {{ room.status === 'OCCUPIED' ? 'Trả phòng' : 'Bảo trì' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <RoomModal v-if="showRoomModal" @close="showRoomModal = false" />
    <ContractModal v-if="showContractModal" @close="showContractModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRentalStore } from '../../stores/rental.store';
import RoomModal from '../../components/RoomModal.vue';
import ContractModal from '../../components/ContractModal.vue';

const rentalStore = useRentalStore();
const showRoomModal = ref(false);
const showContractModal = ref(false);

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

const openContractModal = (roomId: string) => {
  showContractModal.value = true;
};

const toggleStatus = (roomId: string, current: string) => {
  if (current === 'OCCUPIED') {
    if (confirm('Xác nhận kết thúc lượt thuê và chuyển phòng sang trạng thái TRỐNG?')) {
      rentalStore.updateRoomStatus(roomId, 'AVAILABLE');
    }
  } else {
    rentalStore.updateRoomStatus(roomId, current === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE');
  }
};
</script>
