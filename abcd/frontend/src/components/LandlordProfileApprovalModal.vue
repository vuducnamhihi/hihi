<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      
      <!-- Modal Header -->
      <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 to-white dark:from-slate-800 dark:to-slate-900">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
            ⚖️
          </div>
          <div>
            <h3 class="text-lg font-black text-slate-900 dark:text-white">
              Xét Duyệt Thay Đổi Thông Tin Khách Thuê
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Phòng {{ request.roomNumber }} - {{ request.motelName }} • Khách: <strong class="text-slate-800 dark:text-slate-200">{{ request.tenantName }}</strong>
            </p>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          ✕
        </button>
      </div>

      <!-- Modal Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        
        <!-- Status & Time Badge -->
        <div class="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-xs">
          <div>
            <span class="text-slate-400">Thời gian gửi yêu cầu:</span>
            <strong class="ml-1 text-slate-700 dark:text-slate-300">{{ formatDate(request.createdAt) }}</strong>
          </div>
          <span
            class="px-3 py-1 rounded-full font-black text-[11px]"
            :class="
              request.status === 'PENDING'
                ? 'bg-amber-500 text-white animate-pulse'
                : request.status === 'APPROVED'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            "
          >
            {{ request.status === 'PENDING' ? '⏳ Chờ Chủ trọ phê duyệt' : request.status === 'APPROVED' ? '✅ Đã phê duyệt' : '❌ Đã từ chối' }}
          </span>
        </div>

        <!-- Reason Card -->
        <div class="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1">
          <span class="font-extrabold text-indigo-900 dark:text-indigo-300 block text-[11px] uppercase tracking-wide">
            💬 Lý Do Khách Thuê Đề Xuất Thay Đổi:
          </span>
          <p class="text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
            "{{ request.newData.reason || 'Khách không nhập lý do cụ thể.' }}"
          </p>
        </div>

        <!-- Comparison Table (Old vs New) -->
        <div class="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div class="bg-slate-100/80 dark:bg-slate-800 p-3 grid grid-cols-12 text-[11px] font-black text-slate-500 uppercase tracking-wider">
            <div class="col-span-4">Trường Thông Tin</div>
            <div class="col-span-4 text-slate-600 dark:text-slate-400">Thông Tin Hiện Tại (Cũ)</div>
            <div class="col-span-4 text-indigo-600 dark:text-indigo-400 font-black">Thông Tin Mới Đề Xuất</div>
          </div>

          <div class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <!-- Row: Họ và tên -->
            <div class="p-3.5 grid grid-cols-12 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <div class="col-span-4 font-bold text-slate-700 dark:text-slate-300">Họ và Tên</div>
              <div class="col-span-4 text-slate-600 dark:text-slate-400">{{ request.oldData.fullName }}</div>
              <div
                class="col-span-4 font-black flex items-center space-x-1.5"
                :class="isChanged(request.oldData.fullName, request.newData.fullName) ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/40 p-1.5 rounded-lg' : 'text-slate-800 dark:text-slate-200'"
              >
                <span>{{ request.newData.fullName }}</span>
                <span v-if="isChanged(request.oldData.fullName, request.newData.fullName)" class="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-black">MỚI</span>
              </div>
            </div>

            <!-- Row: SĐT -->
            <div class="p-3.5 grid grid-cols-12 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <div class="col-span-4 font-bold text-slate-700 dark:text-slate-300">Số Điện Thoại</div>
              <div class="col-span-4 text-slate-600 dark:text-slate-400 font-mono">{{ request.oldData.phoneNumber }}</div>
              <div
                class="col-span-4 font-black font-mono flex items-center space-x-1.5"
                :class="isChanged(request.oldData.phoneNumber, request.newData.phoneNumber) ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/40 p-1.5 rounded-lg' : 'text-slate-800 dark:text-slate-200'"
              >
                <span>{{ request.newData.phoneNumber }}</span>
                <span v-if="isChanged(request.oldData.phoneNumber, request.newData.phoneNumber)" class="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-black font-sans">MỚI</span>
              </div>
            </div>

            <!-- Row: CCCD -->
            <div class="p-3.5 grid grid-cols-12 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <div class="col-span-4 font-bold text-slate-700 dark:text-slate-300">Số CCCD / CMND</div>
              <div class="col-span-4 text-slate-600 dark:text-slate-400 font-mono">{{ request.oldData.cccd || '(Chưa có)' }}</div>
              <div
                class="col-span-4 font-black font-mono flex items-center space-x-1.5"
                :class="isChanged(request.oldData.cccd, request.newData.cccd) ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/40 p-1.5 rounded-lg' : 'text-slate-800 dark:text-slate-200'"
              >
                <span>{{ request.newData.cccd || '(Không đổi)' }}</span>
                <span v-if="isChanged(request.oldData.cccd, request.newData.cccd)" class="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-black font-sans">MỚI</span>
              </div>
            </div>

            <!-- Row: Ngày sinh -->
            <div class="p-3.5 grid grid-cols-12 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <div class="col-span-4 font-bold text-slate-700 dark:text-slate-300">Ngày Sinh</div>
              <div class="col-span-4 text-slate-600 dark:text-slate-400">{{ request.oldData.dateOfBirth || '(Chưa có)' }}</div>
              <div
                class="col-span-4 font-black flex items-center space-x-1.5"
                :class="isChanged(request.oldData.dateOfBirth, request.newData.dateOfBirth) ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/40 p-1.5 rounded-lg' : 'text-slate-800 dark:text-slate-200'"
              >
                <span>{{ request.newData.dateOfBirth || '(Không đổi)' }}</span>
                <span v-if="isChanged(request.oldData.dateOfBirth, request.newData.dateOfBirth)" class="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-black">MỚI</span>
              </div>
            </div>

            <!-- Row: Quê quán -->
            <div class="p-3.5 grid grid-cols-12 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <div class="col-span-4 font-bold text-slate-700 dark:text-slate-300">Quê Quán / Thường Trú</div>
              <div class="col-span-4 text-slate-600 dark:text-slate-400">{{ request.oldData.hometown || '(Chưa có)' }}</div>
              <div
                class="col-span-4 font-black flex items-center space-x-1.5"
                :class="isChanged(request.oldData.hometown, request.newData.hometown) ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/40 p-1.5 rounded-lg' : 'text-slate-800 dark:text-slate-200'"
              >
                <span>{{ request.newData.hometown || '(Không đổi)' }}</span>
                <span v-if="isChanged(request.oldData.hometown, request.newData.hometown)" class="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-black">MỚI</span>
              </div>
            </div>

            <!-- Row: Nghề nghiệp -->
            <div class="p-3.5 grid grid-cols-12 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <div class="col-span-4 font-bold text-slate-700 dark:text-slate-300">Nghề Nghiệp</div>
              <div class="col-span-4 text-slate-600 dark:text-slate-400">{{ request.oldData.job || '(Chưa có)' }}</div>
              <div
                class="col-span-4 font-black flex items-center space-x-1.5"
                :class="isChanged(request.oldData.job, request.newData.job) ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/40 p-1.5 rounded-lg' : 'text-slate-800 dark:text-slate-200'"
              >
                <span>{{ request.newData.job || '(Không đổi)' }}</span>
                <span v-if="isChanged(request.oldData.job, request.newData.job)" class="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-black">MỚI</span>
              </div>
            </div>

            <!-- Row: Email -->
            <div class="p-3.5 grid grid-cols-12 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <div class="col-span-4 font-bold text-slate-700 dark:text-slate-300">Email</div>
              <div class="col-span-4 text-slate-600 dark:text-slate-400">{{ request.oldData.email || '(Chưa có)' }}</div>
              <div
                class="col-span-4 font-black flex items-center space-x-1.5"
                :class="isChanged(request.oldData.email, request.newData.email) ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/40 p-1.5 rounded-lg' : 'text-slate-800 dark:text-slate-200'"
              >
                <span>{{ request.newData.email || '(Không đổi)' }}</span>
                <span v-if="isChanged(request.oldData.email, request.newData.email)" class="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-black">MỚI</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Inline Rejection Form (if rejecting) -->
        <div v-if="showRejectInput" class="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800/60 space-y-3 animate-in fade-in duration-150">
          <label class="block text-xs font-bold text-rose-800 dark:text-rose-300">
            Nhập lý do từ chối yêu cầu của khách thuê:
          </label>
          <textarea
            v-model="rejectReason"
            rows="2"
            class="w-full bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-700 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-rose-500 resize-none"
            placeholder="VD: Số CCCD không trùng khớp với ảnh chụp / Chưa cung cấp thông tin chính xác..."
          ></textarea>
          <div class="flex justify-end space-x-2">
            <button
              @click="showRejectInput = false"
              class="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700"
            >
              Hủy
            </button>
            <button
              @click="handleConfirmReject"
              class="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-lg shadow-sm"
            >
              Xác Nhận Từ Chối
            </button>
          </div>
        </div>

      </div>

      <!-- Modal Footer Actions -->
      <div class="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          Đóng
        </button>

        <div v-if="request.status === 'PENDING' && !showRejectInput" class="flex items-center space-x-3">
          <button
            @click="showRejectInput = true"
            class="px-5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-extrabold transition"
          >
            ❌ Từ Chối
          </button>
          <button
            @click="handleApprove"
            class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
          >
            <span>✅ Chấp Nhận & Cập Nhật Hồ Sơ</span>
          </button>
        </div>

        <div v-else-if="request.status !== 'PENDING'" class="text-xs font-bold text-slate-500">
          Yêu cầu này đã được xử lý ({{ request.status === 'APPROVED' ? 'Đã duyệt' : 'Đã từ chối' }})
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRentalStore } from '../stores/rental.store';
import { ProfileChangeRequest } from '../types';

const props = defineProps<{
  request: ProfileChangeRequest;
}>();

const emit = defineEmits(['close']);

const rentalStore = useRentalStore();
const showRejectInput = ref(false);
const rejectReason = ref('');

const isChanged = (oldVal?: string, newVal?: string) => {
  return (newVal || '') !== (oldVal || '');
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const handleApprove = () => {
  if (confirm(`Bạn xác nhận PHÊ DUYỆT thay đổi thông tin cho khách ${props.request.tenantName}? Thông tin mới sẽ được cập nhật chính thức vào hệ thống.`)) {
    rentalStore.approveProfileChangeRequest(props.request.id);
    alert(`✅ Đã phê duyệt và cập nhật thông tin cho khách ${props.request.tenantName} thành công!`);
    emit('close');
  }
};

const handleConfirmReject = () => {
  if (!rejectReason.value.trim()) {
    alert('Vui lòng nhập lý do từ chối để thông báo cho khách thuê.');
    return;
  }
  rentalStore.rejectProfileChangeRequest(props.request.id, rejectReason.value);
  alert(`❌ Đã từ chối yêu cầu và gửi lý do cho khách thuê thành công.`);
  emit('close');
};
</script>
