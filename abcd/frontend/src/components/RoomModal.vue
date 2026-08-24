<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-lg w-full overflow-hidden transition-all">
      <div class="bg-slate-900 p-6 text-white relative">
        <button @click="$emit('close')" class="absolute top-5 right-5 text-white/70 hover:text-white">✕</button>
        <h2 class="text-xl font-bold">Thêm Phòng Trọ Mới</h2>
        <p class="text-xs text-slate-400 mt-1">Khai báo chi tiết diện tích, giá và tiện ích phòng</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 text-sm max-h-[75vh] overflow-y-auto">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Thuộc nhà trọ</label>
          <select
            v-model="form.motelId"
            required
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option v-for="m in rentalStore.motels" :key="m.id" :value="m.id">
              {{ m.name }} ({{ m.city }})
            </option>
          </select>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Số phòng</label>
            <input
              type="text"
              v-model="form.roomNumber"
              required
              placeholder="VD: 301"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tầng</label>
            <input
              type="number"
              v-model.number="form.floor"
              required
              min="1"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Diện tích (m²)</label>
            <input
              type="number"
              v-model.number="form.areaSqm"
              required
              min="10"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Giá thuê đề xuất (VND/tháng)</label>
          <input
            type="number"
            v-model.number="form.basePrice"
            required
            step="100000"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isSelfContained"
            v-model="form.isSelfContained"
            class="w-4 h-4 text-indigo-600 rounded"
          />
          <label for="isSelfContained" class="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Phòng khép kín (vệ sinh riêng trong phòng)
          </label>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mô tả phòng</label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Mô tả ưu điểm, ánh sáng, ban công..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tiện ích kèm theo</label>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <label v-for="amenity in availableAmenities" :key="amenity" class="flex items-center space-x-1.5">
              <input
                type="checkbox"
                :value="amenity"
                v-model="form.amenities"
                class="text-indigo-600 rounded"
              />
              <span>{{ amenity }}</span>
            </label>
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
            Lưu Phòng Trọ
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRentalStore } from '../stores/rental.store';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const rentalStore = useRentalStore();

const availableAmenities = [
  'Điều hòa',
  'Bình nóng lạnh',
  'Gác xép',
  'Tủ lạnh',
  'Máy giặt riêng',
  'Tủ quần áo',
  'Wifi tốc độ cao',
  'Khóa vân tay',
];

const form = reactive({
  motelId: rentalStore.motels[0]?.id || 'motel_01',
  roomNumber: '',
  floor: 1,
  areaSqm: 25,
  basePrice: 3500000,
  isSelfContained: true,
  description: '',
  amenities: ['Điều hòa', 'Bình nóng lạnh', 'Wifi tốc độ cao'],
  images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
});

const handleSubmit = async () => {
  try {
    await rentalStore.addRoom({
      motelId: form.motelId,
      roomNumber: form.roomNumber,
      floor: form.floor,
      areaSqm: form.areaSqm,
      basePrice: form.basePrice,
      isSelfContained: form.isSelfContained,
      description: form.description,
      amenities: form.amenities,
      images: form.images,
      status: 'AVAILABLE',
    });
    alert('Đã thêm phòng mới thành công!');
    emit('close');
  } catch (error) {
    alert('Có lỗi xảy ra khi lưu phòng trọ. Vui lòng kiểm tra lại!');
    console.error(error);
  }
};
</script>
