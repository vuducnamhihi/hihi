<template>
  <div class="relative" ref="dropdownRef">
    <!-- Bell Button -->
    <button
      @click="isOpen = !isOpen"
      class="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all focus:outline-none"
      title="Thông báo hệ thống"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <!-- Unread Badge -->
      <span
        v-if="notificationStore.unreadCount > 0"
        class="absolute top-1 right-1 flex h-4 min-w-[1rem] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-pulse"
      >
        {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
      </span>
    </button>

    <!-- Dropdown Panel -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden flex flex-col max-h-[480px] animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <!-- Header -->
      <div class="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
        <div class="flex items-center space-x-2">
          <span class="font-extrabold text-sm text-slate-900 dark:text-white">🔔 Thông Báo</span>
          <span
            v-if="notificationStore.unreadCount > 0"
            class="bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[11px] font-bold px-2 py-0.5 rounded-full"
          >
            {{ notificationStore.unreadCount }} mới
          </span>
        </div>

        <div class="flex items-center space-x-2 text-[11px]">
          <button
            v-if="notificationStore.unreadCount > 0"
            @click="notificationStore.markAllAsRead()"
            class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            Đọc tất cả
          </button>
          <span class="text-slate-300 dark:text-slate-700">|</span>
          <button
            @click="notificationStore.clearAllForCurrentUser()"
            class="text-slate-400 hover:text-rose-500 font-medium"
          >
            Xóa
          </button>
        </div>
      </div>

      <!-- Tab Filter -->
      <div class="flex border-b border-slate-100 dark:border-slate-800 px-3 py-1.5 bg-white dark:bg-slate-900 gap-2">
        <button
          @click="activeTab = 'ALL'"
          class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
          :class="activeTab === 'ALL' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          Tất cả ({{ notificationStore.myNotifications.length }})
        </button>
        <button
          @click="activeTab = 'UNREAD'"
          class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
          :class="activeTab === 'UNREAD' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          Chưa đọc ({{ notificationStore.unreadCount }})
        </button>
      </div>

      <!-- Notification List -->
      <div class="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        <div
          v-if="filteredNotifications.length === 0"
          class="py-10 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2"
        >
          <span class="text-2xl">📭</span>
          <p class="font-semibold">Không có thông báo nào</p>
        </div>

        <div
          v-for="item in filteredNotifications"
          :key="item.id"
          @click="handleClickNotification(item)"
          class="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all flex items-start space-x-3 relative group"
          :class="!item.isRead ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''"
        >
          <!-- Unread Dot Indicator -->
          <div v-if="!item.isRead" class="w-2 h-2 rounded-full bg-indigo-600 absolute top-4 left-1.5"></div>

          <!-- Icon Type -->
          <div class="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-xs" :class="getTypeIconClass(item.type)">
            {{ getTypeEmoji(item.type) }}
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 pr-4">
            <h4 class="text-xs font-bold text-slate-900 dark:text-white leading-snug truncate">
              {{ item.title }}
            </h4>
            <p class="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
              {{ item.content }}
            </p>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
              {{ formatTime(item.createdAt) }}
            </span>
          </div>

          <!-- Quick Delete / Mark Read -->
          <button
            @click.stop="notificationStore.deleteNotification(item.id)"
            class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition"
            title="Xóa thông báo"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-center">
        <span class="text-[11px] text-slate-400">Hệ thống Quản lý Nhà trọ Vũ Đức Nam</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useNotificationStore } from '../stores/notification.store';
import { AppNotification, NotificationType } from '../types';

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const isOpen = ref(false);
const activeTab = ref<'ALL' | 'UNREAD'>('ALL');
const dropdownRef = ref<HTMLElement | null>(null);

const filteredNotifications = computed(() => {
  if (activeTab.value === 'UNREAD') {
    return notificationStore.myNotifications.filter((n) => !n.isRead);
  }
  return notificationStore.myNotifications;
});

const handleClickNotification = (item: AppNotification) => {
  notificationStore.markAsRead(item.id);
  
  // Tự động chuyển đổi góc nhìn vai trò phù hợp nếu cần
  if (item.targetRole && item.targetRole !== 'ALL' && authStore.currentUser?.role !== item.targetRole) {
    authStore.switchUser(item.targetRole);
  } else if (item.userId && authStore.currentUser?.id !== item.userId) {
    const targetUser = authStore.demoUsers.find((u) => u.id === item.userId);
    if (targetUser) {
      authStore.switchUser(targetUser.role, targetUser.id);
    }
  }

  if (item.link) {
    router.push(item.link);
  }
  isOpen.value = false;
};

const getTypeEmoji = (type: NotificationType) => {
  switch (type) {
    case 'PROFILE_REQUEST':
      return '📝';
    case 'PROFILE_APPROVED':
      return '✅';
    case 'PROFILE_REJECTED':
      return '❌';
    case 'INVOICE_NEW':
      return '📄';
    case 'PAYMENT_SUBMITTED':
      return '💵';
    case 'PAYMENT_CONFIRMED':
      return '🎉';
    default:
      return '🔔';
  }
};

const getTypeIconClass = (type: NotificationType) => {
  switch (type) {
    case 'PROFILE_REQUEST':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
    case 'PROFILE_APPROVED':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
    case 'PROFILE_REJECTED':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';
    case 'INVOICE_NEW':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
    case 'PAYMENT_SUBMITTED':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300';
    case 'PAYMENT_CONFIRMED':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  }
};

const formatTime = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return 'Hôm qua';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};

// Đóng dropdown khi bấm ra ngoài
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
