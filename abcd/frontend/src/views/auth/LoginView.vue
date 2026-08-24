<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-2xl text-white mx-auto shadow-lg shadow-indigo-500/30">
          NT
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">
          {{ isRegister ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập Nhà Trọ' }}
        </h2>
        <p class="text-xs text-slate-500">Xác thực nhanh bằng Số điện thoại + OTP</p>
      </div>

      <!-- Chọn vai trò Demo -->
      <div class="space-y-2">
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Chọn nhanh tài khoản Demo (Không cần OTP):</label>
        <div class="space-y-2">
          <button
            v-for="user in authStore.demoUsers"
            :key="user.id"
            @click="selectDemoUser(user)"
            class="w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between"
            :class="
              authStore.currentUser?.id === user.id
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            "
          >
            <div class="flex items-center space-x-3">
              <img :src="user.avatarUrl" class="w-8 h-8 rounded-full object-cover" />
              <div>
                <strong class="text-xs font-bold block">{{ user.fullName }}</strong>
                <span class="text-[11px] text-slate-400 font-mono">{{ user.phoneNumber }}</span>
              </div>
            </div>
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              :class="user.role === 'LANDLORD' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'"
            >
              {{ user.role === 'LANDLORD' ? 'CHỦ TRỌ' : 'KHÁCH THUÊ' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Tab Chuyển đổi Đăng nhập / Đăng ký -->
      <div class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
        <button 
          @click="isRegister = false"
          :class="!isRegister ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          class="flex-1 py-2 text-sm font-bold rounded-lg transition-all"
        >
          Đăng Nhập
        </button>
        <button 
          @click="isRegister = true"
          :class="isRegister ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          class="flex-1 py-2 text-sm font-bold rounded-lg transition-all"
        >
          Đăng Ký Mới
        </button>
      </div>

      <!-- Thông báo lỗi -->
      <div v-if="errorMessage" class="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
        {{ errorMessage }}
      </div>

      <!-- Form nhập -->
      <form @submit.prevent="handleAuth" class="space-y-3 pt-2">
        <div v-if="isRegister">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Họ và Tên</label>
          <input
            type="text"
            v-model="fullName"
            :required="isRegister"
            placeholder="Nhập họ và tên của bạn"
            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div v-if="isRegister">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Vai trò</label>
          <select 
            v-model="role" 
            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="TENANT">Khách Thuê</option>
            <option value="LANDLORD">Chủ Trọ</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Số điện thoại</label>
          <input
            type="tel"
            v-model="phone"
            required
            placeholder="09xx xxx xxx"
            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mã OTP (Mã demo: 123456)</label>
          <input
            type="text"
            v-model="otp"
            required
            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm font-bold tracking-widest text-center outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition mt-2 flex justify-center items-center"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isRegister ? 'Đăng Ký' : 'Vào Hệ Thống' }}
        </button>
      </form>
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
