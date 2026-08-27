<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Phòng Trọ Đang Thuê</h2>
        <p class="text-xs text-slate-500 mt-0.5">Thông tin chi tiết hợp đồng, tiền phòng, hồ sơ cá nhân và liên hệ chủ trọ.</p>
      </div>

      <div class="flex items-center space-x-2">
        <button
          @click="showProfileModal = true"
          class="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition flex items-center space-x-1.5"
        >
          <span>✏️ Sửa Thông Tin Cá Nhân</span>
        </button>

        <button
          @click="handleRequestCheckOut"
          class="px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition"
        >
          🚪 Báo Trả Phòng
        </button>
      </div>
    </div>

    <!-- Banner Pending Request if any -->
    <div
      v-if="pendingRequest"
      class="bg-amber-50 border border-amber-200 rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-xs animate-pulse"
    >
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shrink-0 font-bold">
          ⏳
        </div>
        <div>
          <h4 class="text-xs font-black text-amber-900">Yêu cầu thay đổi thông tin đang chờ phê duyệt</h4>
          <p class="text-[11px] text-amber-700 mt-0.5">
            Bạn đã gửi yêu cầu cập nhật hồ sơ cá nhân. Chủ nhà <strong>Vũ Đức Nam</strong> đang xem xét và sẽ phản hồi sớm.
          </p>
        </div>
      </div>

      <button
        @click="showProfileModal = true"
        class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition"
      >
        Xem Trạng Thái
      </button>
    </div>

    <!-- Active Room Details Card -->
    <div v-if="myContract" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        <!-- Photos Carousel / Image -->
        <div class="lg:col-span-5 relative bg-slate-100 h-64 lg:h-auto min-h-[300px]">
          <img
            :src="myContract.room?.images[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
            <span class="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full inline-block w-max mb-2 shadow-md">
              HỢP ĐỒNG ĐANG HIỆU LỰC
            </span>
            <h3 class="text-2xl font-black">Phòng {{ myContract.room?.roomNumber }}</h3>
            <p class="text-xs text-slate-200">{{ myContract.room?.motel?.name }}</p>
            <p class="text-[11px] text-slate-300">📍 {{ myContract.room?.motel?.address }}</p>
          </div>
        </div>

        <!-- Info Specs -->
        <div class="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div class="space-y-4">
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div class="bg-slate-50 p-3 rounded-xl">
                <span class="text-slate-400 font-semibold block">Giá thuê cố định:</span>
                <strong class="text-sm text-indigo-600 font-black">{{ formatCurrency(myContract.rentalPrice) }}/tháng</strong>
              </div>
              <div class="bg-slate-50 p-3 rounded-xl">
                <span class="text-slate-400 font-semibold block">Tiền cọc giữ chân:</span>
                <strong class="text-sm text-slate-800 font-bold">{{ formatCurrency(myContract.depositAmount) }}</strong>
              </div>
              <div class="bg-slate-50 p-3 rounded-xl">
                <span class="text-slate-400 font-semibold block">Diện tích phòng:</span>
                <strong class="text-sm text-slate-800 font-bold">{{ myContract.room?.areaSqm }} m²</strong>
              </div>
            </div>

            <!-- Thời hạn hợp đồng -->
            <div class="border border-slate-100 bg-slate-50/50 p-4 rounded-2xl space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-500">Thời hạn thuê:</span>
                <strong class="text-slate-800">{{ formatDate(myContract.startDate) }} → {{ formatDate(myContract.endDate) }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Ngày thanh toán hàng tháng:</span>
                <strong class="text-indigo-600 font-bold">Ngày {{ myContract.paymentDay }} hàng tháng</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Đơn giá điện:</span>
                <strong class="text-slate-800">{{ formatCurrency(myContract.room?.motel?.electricityUnitPrice || 3800) }}/kWh</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Đơn giá nước:</span>
                <strong class="text-slate-800">{{ formatCurrency(myContract.room?.motel?.waterUnitPrice || 28000) }}/m³</strong>
              </div>
            </div>

            <!-- Tiện ích phòng -->
            <div>
              <h4 class="text-xs font-bold text-slate-800 mb-2">Tiện ích trong phòng</h4>
              <div class="flex flex-wrap gap-1.5 text-xs">
                <span v-for="am in myContract.room?.amenities" :key="am" class="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg font-medium border border-emerald-100">
                  ✓ {{ am }}
                </span>
              </div>
            </div>
          </div>

          <!-- Chủ trọ hotline - Vũ Đức Nam -->
          <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50/80 -mx-6 -mb-6 p-6 sm:-mx-8 sm:-mb-8">
            <div>
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Chủ nhà trọ trực tiếp:</span>
              <strong class="text-slate-900 font-black text-sm">Vũ Đức Nam</strong>
              <p class="text-[11px] text-slate-500">📍 60 Lò Đúc, Hai Bà Trưng, Hà Nội</p>
            </div>
            <a
              href="tel:0337877836"
              class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition flex items-center justify-center space-x-2 shadow-md shadow-indigo-200"
            >
              <span>📞 Gọi Chủ Trọ (0337877836)</span>
            </a>
          </div>
        </div>

      </div>

      <!-- Hồ sơ thông tin cá nhân khách thuê Card -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-lg font-bold">
              👤
            </div>
            <div>
              <h3 class="text-base font-black text-slate-900">Hồ Sơ Cá Nhân Khách Thuê</h3>
              <p class="text-xs text-slate-500">Thông tin đăng ký tạm trú và quản lý hợp đồng</p>
            </div>
          </div>

          <button
            @click="showProfileModal = true"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-200 transition flex items-center space-x-1.5"
          >
            <span>✏️ Gửi Yêu Cầu Sửa Thông Tin</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span class="text-slate-400 font-bold block text-[10px] uppercase">Họ và Tên</span>
            <strong class="text-sm text-slate-900 font-black block">{{ currentUser?.fullName }}</strong>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span class="text-slate-400 font-bold block text-[10px] uppercase">Số Điện Thoại</span>
            <strong class="text-sm text-slate-900 font-mono font-bold block">{{ currentUser?.phoneNumber }}</strong>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span class="text-slate-400 font-bold block text-[10px] uppercase">Số Căn Cước Công Dân</span>
            <strong class="text-sm text-indigo-600 font-mono font-black block">{{ currentUser?.cccd || '(Chưa cập nhật)' }}</strong>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span class="text-slate-400 font-bold block text-[10px] uppercase">Ngày Sinh</span>
            <strong class="text-slate-800 font-bold block">{{ currentUser?.dateOfBirth ? formatDate(currentUser.dateOfBirth) : '(Chưa cập nhật)' }}</strong>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span class="text-slate-400 font-bold block text-[10px] uppercase">Quê Quán / Thường Trú</span>
            <strong class="text-slate-800 font-bold block">{{ currentUser?.hometown || '(Chưa cập nhật)' }}</strong>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span class="text-slate-400 font-bold block text-[10px] uppercase">Nghề Nghiệp</span>
            <strong class="text-slate-800 font-bold block">{{ currentUser?.job || '(Chưa cập nhật)' }}</strong>
          </div>
        </div>

        <div class="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs text-indigo-900 flex items-start space-x-2.5">
          <span class="text-indigo-600 font-bold text-sm">ℹ️</span>
          <p class="leading-relaxed">
            Mọi thông tin chỉnh sửa sẽ được gửi trực tiếp đến Chủ trọ <strong>Vũ Đức Nam</strong>. Khi chủ nhà chấp thuận, hệ thống sẽ tự động cập nhật lại hồ sơ và hợp đồng thuê phòng của bạn.
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 bg-white rounded-3xl border border-slate-200">
      <p class="text-slate-500 font-bold">Tài khoản của bạn hiện chưa có hợp đồng thuê phòng nào.</p>
    </div>

    <!-- Modal sửa thông tin -->
    <TenantProfileEditModal
      v-if="showProfileModal"
      :initialTab="profileModalTab"
      @close="showProfileModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import { useRentalStore } from '../../stores/rental.store';
import TenantProfileEditModal from '../../components/TenantProfileEditModal.vue';

const route = useRoute();
const authStore = useAuthStore();
const rentalStore = useRentalStore();
const showProfileModal = ref(false);
const profileModalTab = ref<'FORM' | 'HISTORY'>('FORM');

onMounted(() => {
  if (route.query.openProfileModal === 'true') {
    showProfileModal.value = true;
    if (route.query.tab === 'HISTORY') {
      profileModalTab.value = 'HISTORY';
    }
  }
});

watch(
  () => route.query.openProfileModal,
  (val) => {
    if (val === 'true') {
      showProfileModal.value = true;
      if (route.query.tab === 'HISTORY') {
        profileModalTab.value = 'HISTORY';
      }
    }
  },
);

const currentUser = computed(() => authStore.currentUser);

const myContract = computed(() => {
  const c = rentalStore.contracts.find(
    (item) => item.tenantId === authStore.currentUser?.id && item.status === 'ACTIVE',
  );
  if (!c) return null;
  const room = rentalStore.enrichedRooms.find((r) => r.id === c.roomId);
  return { ...c, room };
});

const pendingRequest = computed(() => {
  return rentalStore.profileRequests.find(
    (r) => r.tenantId === authStore.currentUser?.id && r.status === 'PENDING'
  );
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

const handleRequestCheckOut = () => {
  const checkoutDate = prompt('Nhập ngày bạn dự kiến trả phòng (VD: 30/09/2026):', '30/09/2026');
  if (checkoutDate) {
    alert(`Đã gửi thông báo hẹn ngày trả phòng (${checkoutDate}) đến Chủ trọ Vũ Đức Nam thành công!`);
  }
};
</script>
