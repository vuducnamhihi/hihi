<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Top Role Switcher Bar -->
    <RoleSwitcherBar />

    <!-- Navigation Header cho Khách Thuê -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-lg text-white shadow-md shadow-emerald-600/20">
            NT
          </div>
          <div>
            <h1 class="font-extrabold text-base text-slate-900 tracking-tight leading-tight">Cổng Người Thuê</h1>
            <p class="text-[11px] text-emerald-600 font-semibold">Tra cứu & Thanh toán tiền trọ</p>
          </div>
        </div>

        <!-- Tab Navigation -->
        <nav class="flex items-center space-x-1 sm:space-x-2 text-sm font-semibold">
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

        <!-- User Profile Pill -->
        <div class="hidden sm:flex items-center space-x-2.5 bg-slate-100 py-1.5 px-3 rounded-full">
          <img
            :src="authStore.currentUser.avatarUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&q=80'"
            class="w-6 h-6 rounded-full object-cover"
          />
          <span class="text-xs font-bold text-slate-800">{{ authStore.currentUser.fullName.split(' ')[0] }}</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 md:p-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import RoleSwitcherBar from '../components/RoleSwitcherBar.vue';
import { useAuthStore } from '../stores/auth.store';
import { useRentalStore } from '../stores/rental.store';

const authStore = useAuthStore();
const rentalStore = useRentalStore();

onMounted(() => {
  rentalStore.fetchTenantData();
});

const unpaidInvoicesCount = computed(() => {
  return rentalStore.invoices.filter(
    (i) => i.tenantId === authStore.currentUser.id && i.status === 'PENDING_PAYMENT',
  ).length;
});
</script>
