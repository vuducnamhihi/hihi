<template>
  <div class="min-h-screen md:h-screen bg-slate-100 flex flex-col md:overflow-hidden">
    <!-- Top Role Switcher Bar (Cố định trên cùng) -->
    <RoleSwitcherBar class="shrink-0 z-50 sticky top-0 md:static" />

    <div class="flex-1 flex flex-col md:flex-row md:overflow-hidden min-h-0">
      <!-- Sidebar Chủ Trọ (Đứng im cố định bên trái, không bị cuộn trôi theo trang) -->
      <aside class="w-full md:w-64 bg-slate-900 text-white p-5 flex flex-col justify-between shrink-0 shadow-xl md:h-full md:overflow-y-auto z-40">
        <div class="space-y-6">
          <router-link
            to="/landlord/invoices"
            class="flex items-center space-x-3 group cursor-pointer hover:opacity-90 transition select-none"
            title="Về Trang Chủ Chủ Trọ"
          >
            <div class="w-11 h-11 rounded-2xl bg-white flex items-center justify-center p-1 shadow-lg shadow-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="BOPPY Logo" class="w-full h-full object-contain" />
            </div>
            <div>
              <h1 class="font-extrabold text-base tracking-tight leading-tight text-white flex items-center space-x-1">
                <span>BOPPY</span>
                <span class="text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.2 rounded font-mono">PRO</span>
              </h1>
              <p class="text-[11px] text-indigo-300 font-medium">Bảng Điều Khiển Chủ Trọ</p>
            </div>
          </router-link>

          <!-- Navigation Links -->
          <nav class="space-y-1.5 text-sm font-semibold">
            <router-link
              to="/landlord/invoices"
              class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all"
              :class="$route.path.includes('invoices') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Duyệt Hóa Đơn</span>
              <span v-if="pendingInvoicesCount > 0" class="ml-auto bg-amber-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                {{ pendingInvoicesCount }}
              </span>
            </router-link>

            <router-link
              to="/landlord/tenant-requests"
              class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all"
              :class="$route.path.includes('tenant-requests') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Duyệt Khách Thuê</span>
              <span v-if="rentalStore.pendingProfileRequestsCount > 0" class="ml-auto bg-rose-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                {{ rentalStore.pendingProfileRequestsCount }}
              </span>
            </router-link>

            <router-link
              to="/landlord/rooms"
              class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all"
              :class="$route.path.includes('rooms') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Quản Lý Phòng</span>
            </router-link>

            <router-link
              to="/landlord/contracts"
              class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all"
              :class="$route.path.includes('contracts') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <span>Hợp Đồng & Thanh Lý</span>
            </router-link>
          </nav>

          <!-- Tự động hóa BullMQ Cron info box -->
          <div class="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 text-xs text-slate-300 space-y-2">
            <div class="flex items-center space-x-2 text-indigo-400 font-bold">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>BullMQ Monthly Cron</span>
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              Tự động khởi tạo hóa đơn DRAFT vào 00:00 ngày 1 hằng tháng và push thông báo cho chủ trọ.
            </p>
            <button
              @click="handleTriggerCron"
              class="w-full py-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-700 rounded-lg text-white font-semibold text-[11px] transition"
            >
              ⚡ Kích hoạt quét hóa đơn ngay
            </button>
          </div>
        </div>

        <!-- Landlord Info Footer & Quick Logout (Chỗ đăng nhập/tài khoản cố định) -->
        <div class="pt-4 mt-6 border-t border-slate-800 space-y-3 shrink-0">
          <div class="flex items-center space-x-3">
            <img
              :src="authStore.currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'"
              class="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/40 shrink-0"
            />
            <div class="min-w-0">
              <p class="text-xs font-bold text-white truncate">{{ authStore.currentUser?.fullName }}</p>
              <p class="text-[11px] text-indigo-300 font-mono">{{ authStore.currentUser?.phoneNumber }}</p>
              <p class="text-[10px] text-slate-400 truncate">60 Lò Đúc, Hà Nội</p>
            </div>
          </div>

          <button
            @click="handleLogout"
            class="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition flex items-center justify-center space-x-2 border border-slate-800"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Đăng Xuất</span>
          </button>
        </div>
      </aside>

      <!-- Main Area with Top Header Bar (Khu vực nội dung cuộn độc lập) -->
      <div class="flex-1 flex flex-col min-w-0 md:overflow-y-auto">
        <!-- Topbar Header -->
        <header class="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs shrink-0">
          <div>
            <span class="text-xs text-slate-400 font-semibold block">BOPPY • Quản Lý Nhà Trọ Vũ Đức Nam</span>
            <h2 class="text-base font-extrabold text-slate-900 leading-tight">
              {{ getCurrentPageTitle }}
            </h2>
          </div>

          <!-- Topbar Actions: Notifications & Menu Phụ -->
          <div class="flex items-center space-x-3">
            <!-- Notification Bell -->
            <NotificationDropdown />

            <!-- User Menu Dropdown (Menu phụ) -->
            <UserMenuDropdown />
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RoleSwitcherBar from '../components/RoleSwitcherBar.vue';
import NotificationDropdown from '../components/NotificationDropdown.vue';
import UserMenuDropdown from '../components/UserMenuDropdown.vue';
import { useAuthStore } from '../stores/auth.store';
import { useRentalStore } from '../stores/rental.store';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const rentalStore = useRentalStore();

onMounted(() => {
  rentalStore.fetchLandlordData();
});

const getCurrentPageTitle = computed(() => {
  if (route.path.includes('invoices')) return 'Quản Lý & Duyệt Hóa Đơn';
  if (route.path.includes('tenant-requests')) return 'Duyệt Thông Tin Khách Thuê';
  if (route.path.includes('rooms')) return 'Danh Sách Phòng Trọ';
  if (route.path.includes('contracts')) return 'Hợp Đồng & Thanh Lý';
  return 'Bảng Điều Khiển Chủ Trọ';
});

const pendingInvoicesCount = computed(() => {
  return rentalStore.invoices.filter((i) => i.status === 'DRAFT' || i.status === 'PAYMENT_SUBMITTED').length;
});

const handleLogout = () => {
  authStore.logout();
  router.push('/auth/login');
};

const handleTriggerCron = async () => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const res = await rentalStore.triggerMonthlyBullMQJob(currentMonth, currentYear);
    alert(`BullMQ Job đã hoàn tất: Tự động khởi tạo ${res.createdCount} hóa đơn DRAFT cho các phòng ACTIVE!`);
  } catch (error) {
    alert('Có lỗi xảy ra khi kích hoạt cron.');
  }
};
</script>
