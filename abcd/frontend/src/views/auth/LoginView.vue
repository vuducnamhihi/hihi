<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-700/40">
      
      <!-- Brand & Header -->
      <div class="text-center">
        <router-link
          to="/auth/login"
          class="inline-block space-y-3 cursor-pointer group hover:opacity-95 transition select-none"
          title="Trang Đăng Nhập BOPPY"
        >
          <div class="w-24 h-24 rounded-3xl bg-white flex items-center justify-center p-2.5 mx-auto shadow-xl ring-4 ring-indigo-500/20 group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="BOPPY Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              BOPPY
            </h2>
            <p class="text-xs text-indigo-500 font-bold uppercase tracking-wider">Dịch Vụ Cho Thuê Phòng Trọ</p>
            <p class="text-[11px] text-slate-400 mt-1">Chủ trọ: <strong>Vũ Đức Nam (0337877836)</strong> • 60 Lò Đúc, Hà Nội</p>
          </div>
        </router-link>
      </div>

      <!-- Chọn nhanh tài khoản Demo -->
      <div class="space-y-2">
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
          ⚡ Chọn nhanh tài khoản (1-Click Login):
        </label>
        <div class="space-y-2">
          <button
            v-for="user in authStore.demoUsers"
            :key="user.id"
            @click="selectDemoUser(user)"
            class="w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between group"
            :class="
              authStore.currentUser?.id === user.id
                ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            "
          >
            <div class="flex items-center space-x-3">
              <img :src="user.avatarUrl" class="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-300" />
              <div>
                <strong class="text-xs font-black block">{{ user.fullName }}</strong>
                <span class="text-[11px] text-slate-400 font-mono">📞 {{ user.phoneNumber }}</span>
              </div>
            </div>
            <span
              class="text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs"
              :class="user.role === 'LANDLORD' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'"
            >
              {{ user.role === 'LANDLORD' ? '👑 CHỦ TRỌ' : '👤 KHÁCH THUÊ' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Tab Chuyển đổi Đăng nhập / Đăng ký -->
      <div class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
        <button 
          @click="isRegister = false"
          :class="!isRegister ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'"
          class="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
        >
          Đăng Nhập SĐT
        </button>
        <button 
          @click="isRegister = true"
          :class="isRegister ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'"
          class="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
        >
          Đăng Ký Mới
        </button>
      </div>

      <!-- Thông báo lỗi -->
      <div v-if="errorMessage" class="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-semibold">
        {{ errorMessage }}
      </div>

      <!-- Form nhập -->
      <form @submit.prevent="handleAuth" class="space-y-3 pt-1">
        <div v-if="isRegister">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Họ và Tên</label>
          <input
            type="text"
            v-model="fullName"
            :required="isRegister"
            placeholder="Nhập họ và tên của bạn"
            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div v-if="isRegister">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Vai trò</label>
          <select 
            v-model="role" 
            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="TENANT">Khách Thuê Phòng</option>
            <option value="LANDLORD">Chủ Trọ (Quản lý)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Số điện thoại</label>
          <input
            type="tel"
            v-model="phone"
            required
            placeholder="09xx xxx xxx hoặc 0337877836"
            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mã OTP (Mã demo: 123456)</label>
          <input
            type="text"
            v-model="otp"
            required
            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold tracking-widest text-center outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition mt-2 flex justify-center items-center text-xs"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isRegister ? 'Đăng Ký Tài Khoản' : 'Vào Hệ Thống Nhà Trọ' }}
        </button>
      </form>

      <!-- Footer Note -->
      <div class="text-center pt-2 border-t border-slate-100 dark:border-slate-700/50">
        <p class="text-[11px] text-slate-400">© 2026 Nhà Trọ Vũ Đức Nam • Hệ thống quản lý thông minh</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import { User, Role } from '../../types';

const router = useRouter();
const authStore = useAuthStore();

const isRegister = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const phone = ref('');
const otp = ref('123456');
const fullName = ref('');
const role = ref<Role>('TENANT');

const selectDemoUser = (user: User) => {
  authStore.switchUser(user.role, user.id);
  phone.value = user.phoneNumber;
  
  if (authStore.currentUser?.role === 'LANDLORD') {
    router.push('/landlord/invoices');
  } else {
    router.push('/tenant/my-invoices');
  }
};

const handleAuth = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const user = await authStore.loginOrRegister(
      phone.value, 
      otp.value, 
      isRegister.value ? role.value : undefined, 
      isRegister.value ? fullName.value : undefined
    );

    if (user.role === 'LANDLORD') {
      router.push('/landlord/invoices');
    } else {
      router.push('/tenant/my-invoices');
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Có lỗi xảy ra khi xác thực.';
  } finally {
    isLoading.value = false;
  }
};
</script>
