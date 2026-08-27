<template>
  <div v-if="authStore.currentUser" class="bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between border-b border-slate-800 shadow-sm z-50">
    <div class="flex items-center space-x-3">
      <span class="flex h-2.5 w-2.5 relative">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
      <span class="font-semibold text-slate-300">DEMO MODE ACTIVE</span>
      <span class="text-slate-500">|</span>
      <span class="text-slate-400">Đang xem với vai trò:</span>
      <span
        class="font-bold px-2 py-0.5 rounded text-xs"
        :class="authStore.currentUser.role === 'LANDLORD' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'"
      >
        {{ authStore.currentUser.role === 'LANDLORD' ? '👑 CHỦ TRỌ' : '👤 KHÁCH THUÊ' }}
      </span>
      <span class="font-medium text-slate-200">{{ authStore.currentUser.fullName }}</span>
    </div>

    <!-- Nút chuyển đổi tài khoản 1-click -->
    <div class="flex items-center space-x-2 mt-1 sm:mt-0">
      <span class="text-slate-400 text-xs hidden md:inline">Chuyển góc nhìn:</span>
      <button
        v-for="user in authStore.demoUsers"
        :key="user.id"
        @click="handleSwitch(user)"
        class="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
        :class="
          authStore.currentUser?.id === user.id
            ? 'bg-white text-slate-900 font-bold shadow'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        "
      >
        {{ user.role === 'LANDLORD' ? '👑 ' : '🏠 ' }}{{ user.fullName.split(' ')[0] }} ({{ user.role === 'LANDLORD' ? 'Chủ' : 'Thuê' }})
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';
import { User } from '../types';

const authStore = useAuthStore();
const router = useRouter();

const handleSwitch = (user: User) => {
  authStore.switchUser(user.role, user.id);
  if (user.role === 'LANDLORD') {
    router.push('/landlord/invoices');
  } else {
    router.push('/tenant/my-invoices');
  }
};
</script>
