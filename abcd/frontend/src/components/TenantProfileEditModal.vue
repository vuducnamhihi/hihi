<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      
      <!-- Modal Header -->
      <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-white dark:from-slate-800 dark:to-slate-900">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-500/20">
            ✏️
          </div>
          <div>
            <h3 class="text-lg font-black text-slate-900 dark:text-white">
              Cập Nhật Hồ Sơ Khách Thuê
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Yêu cầu sửa đổi thông tin cá nhân (Cần Chủ trọ Vũ Đức Nam phê duyệt)
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

      <!-- Navigation Tabs -->
      <div class="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-3 bg-slate-50/50 dark:bg-slate-900 gap-4">
        <button
          @click="activeTab = 'FORM'"
          class="pb-3 text-xs font-black border-b-2 transition-all flex items-center space-x-2"
          :class="activeTab === 'FORM' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'"
        >
          <span>📝 Gửi Yêu Cầu Chỉnh Sửa</span>
        </button>
        <button
          @click="activeTab = 'HISTORY'"
          class="pb-3 text-xs font-black border-b-2 transition-all flex items-center space-x-2"
          :class="activeTab === 'HISTORY' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'"
        >
          <span>📜 Lịch Sử Yêu Cầu</span>
          <span
            v-if="myRequests.length > 0"
            class="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full"
          >
            {{ myRequests.length }}
          </span>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-5">
        
        <!-- Tab 1: Form Chỉnh Sửa -->
        <div v-if="activeTab === 'FORM'" class="space-y-5">
          <!-- Important Notice -->
          <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs space-y-1.5">
            <div class="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-extrabold">
              <span>⚠️ Quy trình phê duyệt thông tin</span>
            </div>
            <p class="text-amber-700 dark:text-amber-400 leading-relaxed">
              Theo quy chế quản lý nhà trọ, các thay đổi về <strong>Họ tên, Số điện thoại, CCCD/CMND, Ngày sinh, Quê quán</strong> phải được Chủ nhà <strong>Vũ Đức Nam (0337877836 - 60 Lò Đúc)</strong> phê duyệt trước khi có hiệu lực chính thức.
            </p>
          </div>

          <form @submit.prevent="handleSubmitRequest" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Họ và tên -->
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Họ và Tên Mới <span class="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="form.fullName"
                  required
                  class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nhập họ và tên đầy đủ"
                />
              </div>

              <!-- Số điện thoại -->
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Số Điện Thoại Mới <span class="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  v-model="form.phoneNumber"
                  required
                  class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="09xx xxx xxx"
                />
              </div>

              <!-- Số CCCD / CMND -->
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Số Căn Cước Công Dân (CCCD 12 số) <span class="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="form.cccd"
                  required
                  maxlength="12"
                  class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="001198012345"
                />
              </div>

              <!-- Ngày sinh -->
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ngày Tháng Năm Sinh
                </label>
                <input
                  type="date"
                  v-model="form.dateOfBirth"
                  class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <!-- Quê quán / Thường trú -->
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quê Quán / Nơi ĐKHK Thường Trú
                </label>
                <input
                  type="text"
                  v-model="form.hometown"
                  class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Tỉnh/Thành phố quê quán"
                />
              </div>

              <!-- Nghề nghiệp / Cơ quan -->
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nghề Nghiệp / Cơ Quan Công Tác
                </label>
                <input
                  type="text"
                  v-model="form.job"
                  class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="VD: Kế toán, Lập trình viên, Sinh viên..."
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Địa Chỉ Email Nhận Thông Báo
              </label>
              <input
                type="email"
                v-model="form.email"
                class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="email@example.com"
              />
            </div>

            <!-- Lý do chỉnh sửa -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Lý Do Thay Đổi Thông Tin <span class="text-rose-500">*</span>
              </label>
              <textarea
                v-model="form.reason"
                required
                rows="3"
                class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="VD: Em vừa làm lại CCCD gắn chip mới / đổi số điện thoại liên hệ chính..."
              ></textarea>
            </div>

            <!-- Submit Button -->
            <div class="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                @click="$emit('close')"
                class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition flex items-center space-x-2"
              >
                <span>📤 Gửi Yêu Cầu Cho Chủ Trọ Duyệt</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Tab 2: Lịch Sử Yêu Cầu -->
        <div v-else class="space-y-4">
          <div v-if="myRequests.length === 0" class="py-12 text-center text-slate-400 text-xs">
            <span class="text-3xl block mb-2">📋</span>
            <p class="font-bold">Bạn chưa có yêu cầu thay đổi thông tin nào.</p>
          </div>

          <div
            v-for="req in myRequests"
            :key="req.id"
            class="p-5 rounded-2xl border transition-all space-y-3"
            :class="
              req.status === 'PENDING'
                ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                : req.status === 'APPROVED'
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
            "
          >
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-black text-slate-800 dark:text-white">
                  Yêu cầu thay đổi hồ sơ
                </span>
                <span class="text-[11px] text-slate-400 block">{{ formatDate(req.createdAt) }}</span>
              </div>
              <span
                class="text-[11px] font-extrabold px-3 py-1 rounded-full"
                :class="
                  req.status === 'PENDING'
                    ? 'bg-amber-500 text-white animate-pulse'
                    : req.status === 'APPROVED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                "
              >
                {{ req.status === 'PENDING' ? '⏳ Đang chờ Chủ trọ Vũ Đức Nam duyệt' : req.status === 'APPROVED' ? '✅ Đã được chấp thuận' : '❌ Bị từ chối' }}
              </span>
            </div>

            <!-- Diff Content -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <span class="text-slate-400 font-bold block mb-1 text-[10px] uppercase">Thông Tin Trước Đó:</span>
                <p><strong>Họ tên:</strong> {{ req.oldData.fullName }}</p>
                <p><strong>SĐT:</strong> {{ req.oldData.phoneNumber }}</p>
                <p><strong>CCCD:</strong> {{ req.oldData.cccd || 'Chưa cập nhật' }}</p>
              </div>
              <div>
                <span class="text-emerald-600 dark:text-emerald-400 font-bold block mb-1 text-[10px] uppercase">Thông Tin Mới Đề Xuất:</span>
                <p><strong class="text-emerald-700 dark:text-emerald-300">Họ tên:</strong> {{ req.newData.fullName }}</p>
                <p><strong class="text-emerald-700 dark:text-emerald-300">SĐT:</strong> {{ req.newData.phoneNumber }}</p>
                <p><strong class="text-emerald-700 dark:text-emerald-300">CCCD:</strong> {{ req.newData.cccd }}</p>
              </div>
            </div>

            <!-- Lý do -->
            <p v-if="req.newData.reason" class="text-xs text-slate-600 dark:text-slate-400">
              <strong>Lý do:</strong> {{ req.newData.reason }}
            </p>

            <!-- Rejection reason if any -->
            <div v-if="req.status === 'REJECTED' && req.rejectReason" class="p-3 bg-rose-100/70 dark:bg-rose-950/60 rounded-xl text-xs text-rose-700 dark:text-rose-300">
              <strong>Lý do từ chối của Chủ trọ:</strong> {{ req.rejectReason }}
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useRentalStore } from '../stores/rental.store';

const props = defineProps<{
  initialTab?: 'FORM' | 'HISTORY';
}>();

const emit = defineEmits(['close']);

const authStore = useAuthStore();
const rentalStore = useRentalStore();

const activeTab = ref<'FORM' | 'HISTORY'>(props.initialTab || 'FORM');
const currentUser = computed(() => authStore.currentUser);

// Tìm thông tin phòng đang thuê
const myContract = computed(() => {
  return rentalStore.contracts.find(
    (c) => c.tenantId === currentUser.value?.id && c.status === 'ACTIVE'
  );
});

const myRoom = computed(() => {
  if (!myContract.value) return null;
  return rentalStore.enrichedRooms.find((r) => r.id === myContract.value?.roomId);
});

const form = reactive({
  fullName: currentUser.value?.fullName || '',
  phoneNumber: currentUser.value?.phoneNumber || '',
  cccd: currentUser.value?.cccd || '',
  dateOfBirth: currentUser.value?.dateOfBirth || '',
  hometown: currentUser.value?.hometown || '',
  job: currentUser.value?.job || '',
  email: currentUser.value?.email || '',
  reason: '',
});

const myRequests = computed(() => {
  return rentalStore.profileRequests.filter(
    (r) => r.tenantId === currentUser.value?.id
  );
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

const handleSubmitRequest = () => {
  if (!currentUser.value) return;

  const oldData = {
    fullName: currentUser.value.fullName,
    phoneNumber: currentUser.value.phoneNumber,
    cccd: currentUser.value.cccd,
    dateOfBirth: currentUser.value.dateOfBirth,
    hometown: currentUser.value.hometown,
    job: currentUser.value.job,
    address: currentUser.value.address,
    email: currentUser.value.email,
  };

  const newData = {
    fullName: form.fullName,
    phoneNumber: form.phoneNumber,
    cccd: form.cccd,
    dateOfBirth: form.dateOfBirth,
    hometown: form.hometown,
    job: form.job,
    address: currentUser.value.address,
    email: form.email,
    reason: form.reason,
  };

  rentalStore.submitProfileChangeRequest({
    tenantId: currentUser.value.id,
    tenantName: currentUser.value.fullName,
    roomNumber: myRoom.value?.roomNumber || '101',
    motelName: myRoom.value?.motel?.name || 'Khu Trọ Xanh Cầu Giấy',
    oldData,
    newData,
  });

  alert(
    '✅ Đã gửi yêu cầu thay đổi thông tin thành công!\nChủ nhà Vũ Đức Nam sẽ nhận được thông báo để xem xét và phê duyệt.'
  );

  activeTab.value = 'HISTORY';
  form.reason = '';
};
</script>
