<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
    <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-3xl w-full overflow-hidden transition-all flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative shrink-0">
        <button
          @click="$emit('close')"
          class="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition"
        >
          ✕
        </button>
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded-2xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center text-2xl shadow-inner">
            📸
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h2 class="text-xl font-black tracking-tight">Quản Lý Hình Ảnh Cho Thuê</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                Phòng {{ room.roomNumber }}
              </span>
            </div>
            <p class="text-xs text-slate-300 mt-0.5">
              {{ room.motel?.name || 'Nhà trọ' }} — Tải lên nhiều góc ảnh đẹp giúp khách dễ dàng chọn thuê!
            </p>
          </div>
        </div>
      </div>

      <!-- Body Content -->
      <div class="p-6 space-y-6 overflow-y-auto grow text-sm">
        <!-- Upload Section & URL Add -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <!-- Drag and drop zone -->
          <div class="md:col-span-8">
            <div
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              class="border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center cursor-pointer group"
              :class="isDragging ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 hover:bg-slate-50'"
              @click="triggerFileInput"
            >
              <input
                ref="fileInputRef"
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              />
              <div class="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform">
                ☁️
              </div>
              <p class="font-bold text-slate-800 dark:text-slate-200 text-xs">
                Kéo thả nhiều ảnh vào đây, hoặc <span class="text-indigo-600 underline">chọn từ thiết bị</span>
              </p>
              <p class="text-[11px] text-slate-400 mt-1">
                Hỗ trợ PNG, JPG, JPEG, WEBP (Tối đa 10 ảnh cùng lúc)
              </p>
            </div>
          </div>

          <!-- Quick URL Add -->
          <div class="md:col-span-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1">
                <span>🔗 Thêm ảnh từ URL</span>
              </label>
              <input
                type="url"
                v-model="customUrl"
                placeholder="https://images.unsplash.com/..."
                class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                @keyup.enter="handleAddUrl"
              />
            </div>

            <button
              type="button"
              @click="handleAddUrl"
              :disabled="!customUrl.trim()"
              class="w-full mt-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              ＋ Thêm URL Này
            </button>
          </div>
        </div>

        <!-- Uploading Progress Indicator -->
        <div v-if="isUploading" class="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-center space-x-3 text-xs text-indigo-900 dark:text-indigo-200 animate-pulse">
          <span class="text-base animate-spin">⏳</span>
          <span class="font-bold">Đang tải và xử lý hình ảnh lên hệ thống... Vui lòng đợi trong giây lát.</span>
        </div>

        <!-- Image Gallery Grid -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-extrabold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <span>🖼️ Album Ảnh Hiện Tại</span>
              <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-[11px]">
                {{ currentImages.length }} ảnh
              </span>
            </h3>
            <span class="text-[11px] text-slate-400">
              * Ảnh đầu tiên (vị trí số 1) sẽ tự động là <strong>Ảnh bìa hiển thị chính</strong>.
            </span>
          </div>

          <!-- Empty State -->
          <div
            v-if="currentImages.length === 0"
            class="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl"
          >
            <div class="text-4xl mb-2">📸</div>
            <p class="text-xs font-bold text-slate-600 dark:text-slate-400">Chưa có hình ảnh nào cho phòng này.</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Tải lên các góc chụp phòng ngủ, nhà vệ sinh, ban công, gác xép để thu hút người thuê!</p>
          </div>

          <!-- Gallery List -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            <div
              v-for="(img, idx) in currentImages"
              :key="idx"
              class="group relative bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border-2 transition-all shadow-xs hover:shadow-md"
              :class="idx === 0 ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-700'"
            >
              <!-- Thumbnail -->
              <div class="h-32 w-full bg-slate-200 relative overflow-hidden">
                <img :src="img" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                
                <!-- Index Badge / Cover Badge -->
                <div class="absolute top-2 left-2 flex flex-col gap-1">
                  <span
                    v-if="idx === 0"
                    class="px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-600 text-white shadow-md flex items-center space-x-1"
                  >
                    <span>⭐ ẢNH BÌA</span>
                  </span>
                  <span
                    v-else
                    class="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-xs text-white"
                  >
                    #{{ idx + 1 }}
                  </span>
                </div>

                <!-- Lightbox Zoom Preview Overlay Trigger -->
                <button
                  type="button"
                  @click="openLightbox(img)"
                  class="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/50 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs"
                  title="Phóng to ảnh"
                >
                  🔍
                </button>
              </div>

              <!-- Action Bar for this image -->
              <div class="p-2 bg-white dark:bg-slate-900 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
                <!-- Move Left/Right Reorder -->
                <div class="flex items-center space-x-1">
                  <button
                    type="button"
                    :disabled="idx === 0"
                    @click="moveImage(idx, -1)"
                    class="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-[10px] flex items-center justify-center font-bold"
                    title="Di chuyển sang trái"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    :disabled="idx === currentImages.length - 1"
                    @click="moveImage(idx, 1)"
                    class="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-[10px] flex items-center justify-center font-bold"
                    title="Di chuyển sang phải"
                  >
                    ▶
                  </button>
                </div>

                <div class="flex items-center space-x-1">
                  <!-- Set as Cover Button (if not already cover) -->
                  <button
                    v-if="idx !== 0"
                    type="button"
                    @click="setAsCover(idx)"
                    class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 hover:bg-indigo-100 transition"
                    title="Đặt làm ảnh bìa chính"
                  >
                    ⭐ Bìa
                  </button>

                  <!-- Delete Image Button -->
                  <button
                    type="button"
                    @click="removeImage(idx)"
                    class="w-6 h-6 rounded bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100 flex items-center justify-center text-[11px] font-bold transition"
                    title="Xóa ảnh này"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
        <span class="text-xs text-slate-500">
          💡 Bạn có thể lưu lại bất cứ lúc nào sau khi chỉnh sửa.
        </span>

        <div class="flex items-center space-x-2.5">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2.5 rounded-xl font-bold bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs transition"
          >
            Đóng
          </button>
          <button
            type="button"
            @click="handleSave"
            :disabled="isSaving"
            class="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 text-xs transition flex items-center space-x-1.5"
          >
            <span>{{ isSaving ? 'Đang lưu...' : '💾 Lưu Thay Đổi Ảnh' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div
      v-if="lightboxUrl"
      @click="lightboxUrl = ''"
      class="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
    >
      <div class="relative max-w-4xl w-full max-h-[85vh] flex items-center justify-center" @click.stop>
        <button
          @click="lightboxUrl = ''"
          class="absolute -top-10 right-0 text-white text-xl font-bold hover:text-indigo-400"
        >
          ✕ Đóng
        </button>
        <img :src="lightboxUrl" class="max-h-[80vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Room } from '../types';
import { useRentalStore } from '../stores/rental.store';

const props = defineProps<{
  room: Room;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved', updatedImages: string[]): void;
}>();

const rentalStore = useRentalStore();
const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const isUploading = ref(false);
const isSaving = ref(false);
const customUrl = ref('');
const lightboxUrl = ref('');

// Copy images to local state for reactive editing
const currentImages = ref<string[]>([...(props.room.images || [])]);

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    await uploadFiles(Array.from(target.files));
    target.value = '';
  }
};

const handleDrop = async (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    await uploadFiles(Array.from(e.dataTransfer.files));
  }
};

const uploadFiles = async (files: File[]) => {
  isUploading.value = true;
  try {
    const uploadedUrls = await rentalStore.uploadRoomImages(props.room.id, files);
    if (uploadedUrls && uploadedUrls.length > 0) {
      currentImages.value = [...currentImages.value, ...uploadedUrls];
    }
  } catch (error) {
    console.error('Lỗi khi tải ảnh:', error);
    // Local fallback object URL
    const fallbackUrls = files.map((f) => URL.createObjectURL(f));
    currentImages.value = [...currentImages.value, ...fallbackUrls];
  } finally {
    isUploading.value = false;
  }
};

const handleAddUrl = () => {
  const url = customUrl.value.trim();
  if (!url) return;
  currentImages.value.push(url);
  customUrl.value = '';
};

const removeImage = (index: number) => {
  if (confirm(`Bạn có chắc chắn muốn xóa ảnh số #${index + 1} này?`)) {
    currentImages.value.splice(index, 1);
  }
};

const setAsCover = (index: number) => {
  const img = currentImages.value.splice(index, 1)[0];
  currentImages.value.unshift(img);
};

const moveImage = (index: number, offset: number) => {
  const newIndex = index + offset;
  if (newIndex < 0 || newIndex >= currentImages.value.length) return;
  const temp = currentImages.value[index];
  currentImages.value[index] = currentImages.value[newIndex];
  currentImages.value[newIndex] = temp;
};

const openLightbox = (url: string) => {
  lightboxUrl.value = url;
};

const handleSave = async () => {
  isSaving.value = true;
  try {
    await rentalStore.updateRoomImages(props.room.id, currentImages.value);
    emit('saved', currentImages.value);
    emit('close');
  } catch (error) {
    alert('Có lỗi khi lưu hình ảnh. Vui lòng thử lại!');
    console.error(error);
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>
