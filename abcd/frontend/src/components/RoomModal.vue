<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-xl w-full overflow-hidden transition-all">
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
        <button @click="$emit('close')" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition">✕</button>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-indigo-600/50 flex items-center justify-center text-xl">
            {{ isEditMode ? '✏️' : '🏠' }}
          </div>
          <div>
            <h2 class="text-xl font-black">{{ isEditMode ? 'Chỉnh Sửa Thông Tin & Ảnh Phòng' : 'Thêm Phòng Trọ Mới' }}</h2>
            <p class="text-xs text-slate-300 mt-0.5">
              {{ isEditMode ? `Cập nhật thông số và album ảnh cho phòng ${roomToEdit?.roomNumber}` : 'Khai báo chi tiết diện tích, giá, tiện ích và hình ảnh thực tế' }}
            </p>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 text-sm max-h-[78vh] overflow-y-auto">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Thuộc nhà trọ</label>
          <select
            v-model="form.motelId"
            required
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
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
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tầng</label>
            <input
              type="number"
              v-model.number="form.floor"
              required
              min="1"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Diện tích (m²)</label>
            <input
              type="number"
              v-model.number="form.areaSqm"
              required
              min="10"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
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
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 font-black text-indigo-600 text-base"
          />
        </div>

        <div class="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <input
            type="checkbox"
            id="isSelfContained"
            v-model="form.isSelfContained"
            class="w-4 h-4 text-indigo-600 rounded cursor-pointer"
          />
          <label for="isSelfContained" class="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            Phòng khép kín (vệ sinh riêng trong phòng)
          </label>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mô tả phòng</label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Mô tả ưu điểm, ánh sáng, ban công, chỗ nấu ăn..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tiện ích kèm theo</label>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <label v-for="amenity in availableAmenities" :key="amenity" class="flex items-center space-x-1.5 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
              <input
                type="checkbox"
                :value="amenity"
                v-model="form.amenities"
                class="text-indigo-600 rounded"
              />
              <span class="text-slate-700 dark:text-slate-300 font-medium">{{ amenity }}</span>
            </label>
          </div>
        </div>

        <!-- Section Upload & Quản lý Hình Ảnh Phòng -->
        <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-xs font-black text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
              <span>📸 Hình ảnh phòng cho thuê ({{ form.images.length }} ảnh)</span>
            </label>
            <span class="text-[10px] text-slate-400">Ảnh đầu tiên là ảnh bìa</span>
          </div>

          <!-- File upload input + URL input -->
          <div class="space-y-2 mb-3">
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="triggerFileInput"
                class="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition flex items-center space-x-1.5"
              >
                <span>📁 Tải ảnh từ máy tính</span>
              </button>
              <input
                ref="fileInputRef"
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              />

              <div class="grow flex items-center space-x-1.5">
                <input
                  type="url"
                  v-model="newImageUrl"
                  placeholder="Dán link ảnh URL..."
                  class="grow bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  @keyup.enter.prevent="handleAddUrl"
                />
                <button
                  type="button"
                  @click="handleAddUrl"
                  :disabled="!newImageUrl.trim()"
                  class="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition"
                >
                  ＋ Thêm
                </button>
              </div>
            </div>
          </div>

          <!-- Thumbnails Preview Grid -->
          <div v-if="form.images.length > 0" class="grid grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <div
              v-for="(img, idx) in form.images"
              :key="idx"
              class="relative h-20 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden group border"
              :class="idx === 0 ? 'border-indigo-600 ring-2 ring-indigo-400' : 'border-slate-200 dark:border-slate-700'"
            >
              <img :src="img" class="w-full h-full object-cover" />
              <span
                v-if="idx === 0"
                class="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-black shadow"
              >
                Bìa
              </span>
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-1.5">
                <button
                  v-if="idx !== 0"
                  type="button"
                  @click="setAsCover(idx)"
                  class="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold"
                  title="Đặt làm ảnh bìa"
                >
                  ⭐
                </button>
                <button
                  type="button"
                  @click="removeImage(idx)"
                  class="px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold"
                  title="Xóa ảnh"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
          <p v-else class="text-[11px] text-slate-400 italic">Chưa có ảnh nào. Bạn nên đính kèm ít nhất 1 ảnh phòng.</p>
        </div>

        <div class="pt-3 flex space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="w-1/3 py-2.5 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-2/3 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition"
          >
            {{ isSubmitting ? 'Đang lưu...' : (isEditMode ? '💾 Cập Nhật Phòng' : '＋ Lưu Phòng Trọ') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { Room } from '../types';
import { useRentalStore } from '../stores/rental.store';

const props = defineProps<{
  roomToEdit?: Room | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved'): void;
}>();

const rentalStore = useRentalStore();
const fileInputRef = ref<HTMLInputElement | null>(null);
const newImageUrl = ref('');
const isSubmitting = ref(false);

const isEditMode = computed(() => !!props.roomToEdit);

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
  motelId: props.roomToEdit?.motelId || rentalStore.motels[0]?.id || 'motel_01',
  roomNumber: props.roomToEdit?.roomNumber || '',
  floor: props.roomToEdit?.floor || 1,
  areaSqm: props.roomToEdit?.areaSqm || 25,
  basePrice: props.roomToEdit?.basePrice || 3500000,
  isSelfContained: props.roomToEdit ? props.roomToEdit.isSelfContained : true,
  description: props.roomToEdit?.description || '',
  amenities: props.roomToEdit?.amenities ? [...props.roomToEdit.amenities] : ['Điều hòa', 'Bình nóng lạnh', 'Wifi tốc độ cao'],
  images: props.roomToEdit?.images ? [...props.roomToEdit.images] : [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  ],
});

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    Array.from(target.files).forEach((file) => {
      const url = URL.createObjectURL(file);
      form.images.push(url);
    });
    target.value = '';
  }
};

const handleAddUrl = () => {
  const url = newImageUrl.value.trim();
  if (!url) return;
  form.images.push(url);
  newImageUrl.value = '';
};

const removeImage = (idx: number) => {
  form.images.splice(idx, 1);
};

const setAsCover = (idx: number) => {
  const img = form.images.splice(idx, 1)[0];
  form.images.unshift(img);
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    if (isEditMode.value && props.roomToEdit) {
      await rentalStore.updateRoom(props.roomToEdit.id, {
        motelId: form.motelId,
        roomNumber: form.roomNumber,
        floor: form.floor,
        areaSqm: form.areaSqm,
        basePrice: form.basePrice,
        isSelfContained: form.isSelfContained,
        description: form.description,
        amenities: form.amenities,
        images: form.images,
      });
      alert('Đã cập nhật thông tin và hình ảnh phòng thành công!');
    } else {
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
    }
    emit('saved');
    emit('close');
  } catch (error) {
    alert('Có lỗi xảy ra khi lưu thông tin phòng. Vui lòng kiểm tra lại!');
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
