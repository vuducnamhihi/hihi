<template>
  <div class="relative" ref="dropdownRef">
    <!-- User Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 transition-all focus:outline-none"
    >
      <img
        :src="currentUser?.avatarUrl || defaultAvatar"
        class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover ring-1 ring-slate-300 dark:ring-slate-600"
      />
      <div class="text-left hidden sm:block">
        <div class="flex items-center space-x-1.5">
          <span class="text-xs font-black text-slate-800 dark:text-slate-200 max-w-[110px] truncate leading-none">
            {{ currentUser?.fullName }}
          </span>
          <span
            class="text-[9px] font-black px-1.5 py-0.5 rounded-md"
            :class="isLandlord ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'"
          >
            {{ isLandlord ? 'CHỦ TRỌ' : 'KHÁCH' }}
          </span>
        </div>
        <span class="text-[10px] text-slate-500 font-mono">{{ currentUser?.phoneNumber }}</span>
      </div>
      <svg
        class="w-4 h-4 text-slate-400 transition-transform duration-200"
        :class="isOpen ? 'rotate-180 text-indigo-600' : ''"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Sub-menu Popover -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-100 dark:divide-slate-800"
    >
      <!-- Profile Header Summary -->
      <div class="p-4 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-800/80 dark:to-indigo-950/20 flex items-center space-x-3.5">
        <img
          :src="currentUser?.avatarUrl || defaultAvatar"
          class="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md"
        />
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900 dark:text-white truncate">
              {{ currentUser?.fullName }}
            </h3>
            <span
              class="text-[10px] font-black px-2 py-0.5 rounded-full"
              :class="isLandlord ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'"
            >
              {{ isLandlord ? 'Chủ Trọ' : 'Khách Thuê' }}
            </span>
          </div>
          <p class="text-xs text-slate-500 font-mono mt-0.5">📞 {{ currentUser?.phoneNumber }}</p>
          <p v-if="currentUser?.address" class="text-[11px] text-slate-400 truncate mt-0.5">
            📍 {{ currentUser?.address }}
          </p>
        </div>
      </div>

      <!-- Landlord Contact Quick Badge (for Tenant) -->
      <div v-if="!isLandlord" class="p-3 bg-amber-50/60 dark:bg-amber-950/20 text-xs">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400 block">
              Chủ Trọ Quản Lý
            </span>
            <strong class="font-extrabold text-slate-900 dark:text-slate-100">Vũ Đức Nam</strong>
            <p class="text-[10px] text-slate-500">60 Lò Đúc, Hai Bà Trưng, Hà Nội</p>
          </div>
          <a
            href="tel:0337877836"
            class="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] transition shadow-xs flex items-center space-x-1"
          >
            <span>📞 0337877836</span>
          </a>
        </div>
      </div>

      <!-- Menu Actions -->
      <div class="p-2 space-y-1 text-xs font-semibold">
        <!-- Khách thuê: Sửa thông tin cá nhân (Cần duyệt) -->
        <button
          v-if="!isLandlord"
          @click="handleOpenProfileModal"
          class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-700 transition flex items-center justify-between group"
        >
          <div class="flex items-center space-x-2.5">
            <span class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-sm">
              ✏️
            </span>
            <div>
              <span class="block font-bold">Chỉnh Sửa Thông Tin Cá Nhân</span>
              <span class="text-[10px] text-slate-400 font-normal">Gửi yêu cầu chủ trọ duyệt</span>
            </div>
          </div>
          <span class="text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
        </button>

        <!-- Chủ trọ: Xem danh sách yêu cầu sửa thông tin khách thuê -->
        <router-link
          v-if="isLandlord"
          to="/landlord/tenant-requests"
          @click="isOpen = false"
          class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-700 transition flex items-center justify-between group"
        >
          <div class="flex items-center space-x-2.5">
            <span class="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center text-sm">
              📋
            </span>
            <div>
              <span class="block font-bold">Duyệt Thông Tin Khách Thuê</span>
              <span class="text-[10px] text-slate-400 font-normal">Phê duyệt thay đổi CCCD, hồ sơ</span>
            </div>
          </div>
          <span
            v-if="rentalStore.pendingProfileRequestsCount > 0"
            class="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full"
          >
            {{ rentalStore.pendingProfileRequestsCount }}
          </span>
        </router-link>

        <!-- Xem phòng hoặc hóa đơn -->
        <router-link
          :to="isLandlord ? '/landlord/rooms' : '/tenant/my-room'"
          @click="isOpen = false"
          class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition flex items-center space-x-2.5"
        >
          <span class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center text-sm">
            🏠
          </span>
          <span class="font-bold">{{ isLandlord ? 'Quản lý phòng trọ' : 'Chi tiết phòng đang thuê' }}</span>
        </router-link>
      </div>

      <!-- Chuyển đổi nhanh Demo -->
      <div class="p-3 bg-slate-50/70 dark:bg-slate-800/40">
        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          Đổi nhanh tài khoản demo
        </label>
        <div class="grid grid-cols-2 gap-1.5">
          <button
            v-for="user in authStore.demoUsers"
            :key="user.id"
            @click="handleQuickSwitch(user)"
            class="px-2 py-1.5 rounded-lg text-left text-[11px] font-bold border transition flex items-center space-x-1.5 truncate"
            :class="
              currentUser?.id === user.id
                ? 'bg-white dark:bg-slate-700 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
            "
          >
            <span>{{ user.role === 'LANDLORD' ? '👑' : '👤' }}</span>
            <span class="truncate">{{ user.fullName.split(' ')[0] }}</span>
          </button>
        </div>
      </div>

      <!-- Đăng Xuất (Logout) -->
      <div class="p-2 bg-white dark:bg-slate-900">
        <button
          @click="handleLogout"
          class="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center justify-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Đăng Xuất Khỏi Hệ Thống</span>
        </button>
      </div>
    </div>

    <!-- Modal sửa thông tin cho Khách thuê -->
    <TenantProfileEditModal
      v-if="showProfileModal"
      @close="showProfileModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useRentalStore } from '../stores/rental.store';
import { User } from '../types';
import TenantProfileEditModal from './TenantProfileEditModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const rentalStore = useRentalStore();

const isOpen = ref(false);
const showProfileModal = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const defaultAvatar =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

const currentUser = computed(() => authStore.currentUser);
const isLandlord = computed(() => currentUser.value?.role === 'LANDLORD');

const handleOpenProfileModal = () => {
  isOpen.value = false;
  showProfileModal.value = true;
};

const handleQuickSwitch = (user: User) => {
  authStore.switchUser(user.role, user.id);
  isOpen.value = false;
  if (user.role === 'LANDLORD') {
    router.push('/landlord/invoices');
  } else {
    router.push('/tenant/my-invoices');
  }
};

const handleLogout = () => {
  authStore.logout();
  isOpen.value = false;
  router.push('/auth/login');
};

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
