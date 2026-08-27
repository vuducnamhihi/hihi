<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2">
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Duyệt Thông Tin Khách Thuê</h2>
          <span
            v-if="pendingCount > 0"
            class="bg-amber-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full animate-bounce"
          >
            {{ pendingCount }} chờ duyệt
          </span>
        </div>
        <p class="text-xs text-slate-500 mt-0.5">
          Xem xét, đối chiếu thông tin cũ - mới và phê duyệt các yêu cầu cập nhật hồ sơ, CCCD từ người thuê phòng.
        </p>
      </div>

      <!-- Quick Info of Landlord -->
      <div class="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-2 text-xs flex items-center space-x-3">
        <div class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
          👑
        </div>
        <div>
          <span class="text-[10px] text-indigo-500 font-bold block uppercase">Chủ Trọ Quản Lý</span>
          <strong class="text-indigo-950 font-black">Vũ Đức Nam (0337877836)</strong>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
      <button
        @click="statusFilter = 'ALL'"
        class="px-4 py-2 rounded-xl text-xs font-bold transition-all"
        :class="statusFilter === 'ALL' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
      >
        Tất Cả ({{ rentalStore.profileRequests.length }})
      </button>

      <button
        @click="statusFilter = 'PENDING'"
        class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
        :class="statusFilter === 'PENDING' ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
      >
        <span>⏳ Chờ Duyệt</span>
        <span
          v-if="pendingCount > 0"
          class="bg-white/20 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full"
        >
          {{ pendingCount }}
        </span>
      </button>

      <button
        @click="statusFilter = 'APPROVED'"
        class="px-4 py-2 rounded-xl text-xs font-bold transition-all"
        :class="statusFilter === 'APPROVED' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
      >
        ✅ Đã Chấp Nhận ({{ approvedCount }})
      </button>

      <button
        @click="statusFilter = 'REJECTED'"
        class="px-4 py-2 rounded-xl text-xs font-bold transition-all"
        :class="statusFilter === 'REJECTED' ? 'bg-rose-600 text-white shadow-md shadow-rose-200' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
      >
        ❌ Đã Từ Chối ({{ rejectedCount }})
      </button>
    </div>

    <!-- Requests List -->
    <div v-if="filteredRequests.length === 0" class="py-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs">
      <span class="text-4xl block mb-2">🎉</span>
      <h3 class="text-sm font-black text-slate-800">Không có yêu cầu nào trong danh mục này</h3>
      <p class="text-xs text-slate-400 mt-1">Tất cả yêu cầu cập nhật thông tin khách thuê đã được xử lý xong.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="req in filteredRequests"
        :key="req.id"
        class="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
        :class="req.status === 'PENDING' ? 'ring-2 ring-amber-400/40 bg-amber-50/20' : ''"
      >
        <div class="space-y-3">
          <!-- Card Header -->
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                {{ req.roomNumber }}
              </div>
              <div>
                <h4 class="text-sm font-black text-slate-900 leading-tight">{{ req.tenantName }}</h4>
                <p class="text-[11px] text-slate-400">Phòng {{ req.roomNumber }} • {{ req.motelName }}</p>
              </div>
            </div>

            <span
              class="px-2.5 py-1 rounded-full text-[10px] font-black"
              :class="
                req.status === 'PENDING'
                  ? 'bg-amber-500 text-white animate-pulse'
                  : req.status === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              "
            >
              {{ req.status === 'PENDING' ? '⏳ Chờ duyệt' : req.status === 'APPROVED' ? '✅ Đã duyệt' : '❌ Từ chối' }}
            </span>
          </div>

          <!-- Highlight Changes Tags -->
          <div class="flex flex-wrap gap-1.5 text-[10px] font-bold">
            <span
              v-if="req.oldData.fullName !== req.newData.fullName"
              class="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md"
            >
              ✏️ Đổi Tên: {{ req.newData.fullName }}
            </span>
            <span
              v-if="req.oldData.cccd !== req.newData.cccd"
              class="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md"
            >
              💳 Đổi CCCD: {{ req.newData.cccd }}
            </span>
            <span
              v-if="req.oldData.phoneNumber !== req.newData.phoneNumber"
              class="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-md"
            >
              📞 Đổi SĐT: {{ req.newData.phoneNumber }}
            </span>
            <span
              v-if="req.oldData.hometown !== req.newData.hometown"
              class="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md"
            >
              🏡 Đổi Quê quán
            </span>
          </div>

          <!-- Diff Preview Box -->
          <div class="bg-slate-50 rounded-2xl p-3 text-xs space-y-1.5 border border-slate-100">
            <div class="flex justify-between">
              <span class="text-slate-400">CCCD Hiện tại:</span>
              <strong class="text-slate-600 font-mono">{{ req.oldData.cccd || '(Chưa có)' }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">CCCD Mới đề xuất:</span>
              <strong class="text-indigo-600 font-mono font-black">{{ req.newData.cccd || '(Không đổi)' }}</strong>
            </div>
            <div v-if="req.newData.reason" class="pt-1.5 border-t border-slate-200 text-[11px] text-slate-500 italic">
              "{{ req.newData.reason }}"
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[10px] text-slate-400">{{ formatDate(req.createdAt) }}</span>

          <div class="flex items-center space-x-2">
            <button
              @click="openApprovalModal(req)"
              class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center space-x-1"
            >
              <span>🔍 Xem Xét & Phê Duyệt</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Xem xét và Duyệt -->
    <LandlordProfileApprovalModal
      v-if="selectedRequest"
      :request="selectedRequest"
      @close="selectedRequest = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRentalStore } from '../../stores/rental.store';
import { ProfileChangeRequest } from '../../types';
import LandlordProfileApprovalModal from '../../components/LandlordProfileApprovalModal.vue';

const route = useRoute();
const rentalStore = useRentalStore();
const statusFilter = ref<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>(
  (route.query.status as any) || 'ALL',
);
const selectedRequest = ref<ProfileChangeRequest | null>(null);

onMounted(() => {
  if (route.query.status) {
    statusFilter.value = route.query.status as any;
  }
  if (route.query.requestId) {
    const req = rentalStore.profileRequests.find((r) => r.id === route.query.requestId);
    if (req) selectedRequest.value = req;
  }
});

watch(
  () => route.query.status,
  (newStatus) => {
    if (newStatus) {
      statusFilter.value = newStatus as any;
    }
  },
);

watch(
  () => route.query.requestId,
  (reqId) => {
    if (reqId) {
      const req = rentalStore.profileRequests.find((r) => r.id === reqId);
      if (req) selectedRequest.value = req;
    }
  },
);

const pendingCount = computed(() => {
  return rentalStore.profileRequests.filter((r) => r.status === 'PENDING').length;
});

const approvedCount = computed(() => {
  return rentalStore.profileRequests.filter((r) => r.status === 'APPROVED').length;
});

const rejectedCount = computed(() => {
  return rentalStore.profileRequests.filter((r) => r.status === 'REJECTED').length;
});

const filteredRequests = computed(() => {
  if (statusFilter.value === 'ALL') {
    return rentalStore.profileRequests;
  }
  return rentalStore.profileRequests.filter((r) => r.status === statusFilter.value);
});

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

const openApprovalModal = (req: ProfileChangeRequest) => {
  selectedRequest.value = req;
};
</script>
