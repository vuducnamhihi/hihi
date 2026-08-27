<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-lg w-full overflow-hidden transition-all transform animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white relative">
        <button
          @click="$emit('close')"
          class="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="flex items-center space-x-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">
          <span>Thanh toán tiền phòng</span>
          <span>•</span>
          <span>Phòng {{ invoice.room?.roomNumber || 'Trọ' }}</span>
        </div>
        <h2 class="text-2xl font-black">Hóa đơn T{{ invoice.periodMonth }}/{{ invoice.periodYear }}</h2>
        <p class="text-indigo-100 text-sm mt-0.5">Hạn thanh toán: {{ formatDate(invoice.dueDate) }}</p>
      </div>

      <div class="p-6 max-h-[75vh] overflow-y-auto space-y-6">
        <!-- Bảng chi tiết tính tiền -->
        <div class="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 space-y-2.5 text-sm border border-slate-100 dark:border-slate-800">
          <div class="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Tiền phòng:</span>
            <span class="font-semibold text-slate-900 dark:text-white">{{ formatCurrency(invoice.roomAmount) }}</span>
          </div>
          <div class="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Tiền điện ({{ invoice.electricityUsage }} kWh):</span>
            <span class="font-semibold text-slate-900 dark:text-white">{{ formatCurrency(invoice.electricityAmount) }}</span>
          </div>
          <div class="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Tiền nước ({{ invoice.waterUsage }} m³):</span>
            <span class="font-semibold text-slate-900 dark:text-white">{{ formatCurrency(invoice.waterAmount) }}</span>
          </div>
          <div class="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Phí dịch vụ & phát sinh:</span>
            <span class="font-semibold text-slate-900 dark:text-white">{{ formatCurrency(invoice.otherFees) }}</span>
          </div>
          <div class="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-baseline font-bold text-base text-indigo-600 dark:text-indigo-400">
            <span>Tổng số tiền cần thanh toán:</span>
            <span class="text-xl font-extrabold">{{ formatCurrency(invoice.totalAmount) }}</span>
          </div>
        </div>

        <!-- Mã VietQR Chuyển khoản Tự động -->
        <div class="text-center p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
          <p class="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-3">
            Quét mã QR bằng ứng dụng Ngân hàng (VietQR)
          </p>
          <div class="inline-block bg-white p-3 rounded-2xl shadow-md border border-slate-100">
            <img
              :src="qrCodeUrl"
              alt="VietQR Payment Code"
              class="w-44 h-44 mx-auto object-contain rounded-xl"
            />
          </div>
          <div class="mt-3 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>Chủ TK: <strong class="text-slate-800 dark:text-white">VU DUC NAM (0337877836)</strong></p>
            <p>Nội dung CK: <strong class="text-indigo-600 dark:text-indigo-400 font-mono">PHONG {{ invoice.room?.roomNumber || '101' }} T{{ invoice.periodMonth }}</strong></p>
          </div>
        </div>

        <!-- Form Tải Ảnh Bill Chuyển Tiền lên MinIO -->
        <form @submit.prevent="handleUploadProof" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
              📸 Tải ảnh chụp màn hình chuyển khoản (MinIO Storage)
            </label>

            <!-- Dropzone -->
            <div
              class="relative border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
              :class="[
                isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400',
                imagePreview ? 'p-2' : 'p-6'
              ]"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              @click="triggerFileInput"
            >
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              />

              <!-- Preview Ảnh nếu đã chọn -->
              <div v-if="imagePreview" class="relative w-full group">
                <img
                  :src="imagePreview"
                  alt="Bill Preview"
                  class="w-full h-56 object-contain rounded-xl bg-slate-900/5"
                />
                <button
                  type="button"
                  @click.stop="clearSelectedImage"
                  class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-transform active:scale-95"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Placeholder upload -->
              <div v-else class="text-center">
                <div class="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <span class="text-indigo-600 hover:underline">Chọn ảnh từ máy</span> hoặc kéo thả vào đây
                </p>
                <p class="text-xs text-slate-400 mt-1">Định dạng JPG, PNG, WEBP (Tối đa 5MB)</p>
              </div>
            </div>
          </div>

          <!-- Ghi chú cho chủ trọ -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Ghi chú cho chủ trọ (nếu có)
            </label>
            <input
              type="text"
              v-model="tenantNote"
              placeholder="VD: Em chuyển khoản từ tài khoản MB Bank Nguyễn Văn A..."
              class="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <!-- Progress Bar -->
          <div v-if="uploadProgress > 0 && uploadProgress < 100" class="space-y-1">
            <div class="flex justify-between text-xs text-slate-500">
              <span>Đang tải lên MinIO Object Storage...</span>
              <span>{{ uploadProgress }}%</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div class="bg-indigo-600 h-2 rounded-full transition-all duration-300" :style="{ width: `${uploadProgress}%` }"></div>
            </div>
          </div>

          <!-- Nút Gửi minh chứng -->
          <div class="pt-2 flex items-center space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="w-1/3 py-3 px-4 rounded-xl text-slate-600 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
            >
              Đóng
            </button>
            <button
              type="submit"
              :disabled="!selectedFile && !imagePreview"
              class="w-2/3 py-3 px-4 rounded-xl text-white font-bold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center space-x-2"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Đang gửi...' : 'Gửi ảnh minh chứng' }}</span>
            </button>
          </div>
        </form>
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
  (e: 'success'): void;
}>();

const rentalStore = useRentalStore();

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const imagePreview = ref<string | null>(props.invoice.paymentProofUrl || null);
const isDragging = ref(false);
const isSubmitting = ref(false);
const uploadProgress = ref(0);
const tenantNote = ref(props.invoice.tenantNote || '');

// Sinh VietQR tự động
const qrCodeUrl = computed(() => {
  const bankId = 'MB';
  const accountNo = '0901234567';
  const accountName = 'NGUYEN VAN CHU TRO';
  const memo = encodeURIComponent(`PHONG ${props.invoice.room?.roomNumber || '101'} T${props.invoice.periodMonth}`);
  return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${props.invoice.totalAmount}&addInfo=${memo}&accountName=${encodeURIComponent(accountName)}`;
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    processFile(target.files[0]);
  }
};

const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0]);
  }
};

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Vui lòng chỉ tải lên định dạng hình ảnh!');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('Dung lượng ảnh không được vượt quá 5MB!');
    return;
  }
  selectedFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const clearSelectedImage = () => {
  selectedFile.value = null;
  imagePreview.value = null;
  if (fileInputRef.value) fileInputRef.value.value = '';
};

const handleUploadProof = async () => {
  isSubmitting.value = true;
  uploadProgress.value = 25;

  try {
    uploadProgress.value = 75;
    await rentalStore.submitPaymentProof(props.invoice.id, selectedFile.value, tenantNote.value);
    uploadProgress.value = 100;

    alert('Đã tải ảnh bill lên MinIO và gửi cho Chủ trọ thành công!');
    emit('success');
    emit('close');
  } catch (e: any) {
    alert('Có lỗi xảy ra khi gửi bill thanh toán: ' + e.message);
  } finally {
    isSubmitting.value = false;
    uploadProgress.value = 0;
  }
};
</script>
