<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Top Role Switcher Bar -->
    <RoleSwitcherBar />

    <!-- Navigation Header cho Khách Thuê -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <!-- Brand / Title -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-1 shadow-sm shrink-0">
            <img src="/logo.png" alt="BOPPY Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <h1 class="font-extrabold text-base text-slate-900 tracking-tight leading-tight flex items-center space-x-1.5">
              <span>BOPPY</span>
              <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Khách Thuê</span>
            </h1>
            <p class="text-[11px] text-slate-500 font-semibold">Dịch vụ cho thuê phòng trọ</p>
          </div>
        </div>

        <!-- Tab Navigation -->
        <nav class="hidden md:flex items-center space-x-1 sm:space-x-2 text-sm font-semibold">
          <router-link
            to="/tenant/my-invoices"
            class="flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all"
            :class="$route.path.includes('my-invoices') ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Hóa Đơn Của Tôi</span>
            <span v-if="unpaidInvoicesCount > 0" class="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {{ unpaidInvoicesCount }}
            </span>
          </router-link>

          <router-link
            to="/tenant/my-room"
            class="flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all"
            :class="$route.path.includes('my-room') ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Phòng Đang Thuê</span>
          </router-link>

          <router-link
            to="/tenant/explore"
            class="flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all"
            :class="$route.path.includes('explore') ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Tìm Phòng Mới</span>
          </router-link>
        </nav>

        <!-- Right Side: Edit Profile Button + Notification + UserMenuDropdown -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- Button Sửa Thông Tin Cá Nhân -->
          <button
            @click="showProfileModal = true"
            class="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition shadow-2xs"
            title="Chỉnh sửa thông tin cá nhân (Cần chủ trọ duyệt)"
          >
            <span>✏️</span>
            <span>Sửa Hồ Sơ</span>
          </button>

          <!-- Notification Dropdown -->
          <NotificationDropdown />

          <!-- User Menu Dropdown (Menu Phụ) -->
          <UserMenuDropdown />
        </div>
      </div>

      <!-- Mobile Tab Bar -->
      <div class="md:hidden flex border-t border-slate-100 px-2 py-1.5 bg-slate-50 justify-around text-xs font-bold">
        <router-link
          to="/tenant/my-invoices"
          class="py-1 px-2.5 rounded-lg"
          :class="$route.path.includes('my-invoices') ? 'bg-emerald-600 text-white' : 'text-slate-600'"
        >
          Hóa Đơn ({{ unpaidInvoicesCount }})
        </router-link>
        <router-link
          to="/tenant/my-room"
          class="py-1 px-2.5 rounded-lg"
          :class="$route.path.includes('my-room') ? 'bg-emerald-600 text-white' : 'text-slate-600'"
        >
          Phòng Đang Thuê
        </router-link>
        <router-link
          to="/tenant/explore"
          class="py-1 px-2.5 rounded-lg"
          :class="$route.path.includes('explore') ? 'bg-emerald-600 text-white' : 'text-slate-600'"
        >
          Tìm Phòng
        </router-link>
        <button
          @click="showProfileModal = true"
          class="py-1 px-2.5 rounded-lg bg-emerald-100 text-emerald-800"
        >
          ✏️ Sửa Hồ Sơ
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 md:p-8">
      <router-view />
    </main>

    <!-- Modal sửa thông tin cá nhân -->
    <TenantProfileEditModal
      v-if="showProfileModal"
      @close="showProfileModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import RoleSwitcherBar from '../components/RoleSwitcherBar.vue';
import NotificationDropdown from '../components/NotificationDropdown.vue';
import UserMenuDropdown from '../components/UserMenuDropdown.vue';
import TenantProfileEditModal from '../components/TenantProfileEditModal.vue';
import { useAuthStore } from '../stores/auth.store';
import { useRentalStore } from '../stores/rental.store';

const authStore = useAuthStore();
const rentalStore = useRentalStore();
const showProfileModal = ref(false);

onMounted(() => {
  rentalStore.fetchTenantData();
});

const unpaidInvoicesCount = computed(() => {
  return rentalStore.invoices.filter(
    (i) => i.tenantId === authStore.currentUser?.id && i.status === 'PENDING_PAYMENT',
  ).length;
});
</script>
