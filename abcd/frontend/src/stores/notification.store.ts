import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AppNotification, NotificationType } from '../types';
import { useAuthStore } from './auth.store';

const initialNotifications: AppNotification[] = [
  {
    id: 'notif_01',
    targetRole: 'LANDLORD',
    title: '📝 Yêu cầu sửa thông tin khách thuê',
    content: 'Trần Thị Thuê Nhà (Phòng 101) vừa gửi yêu cầu cập nhật thông tin CCCD và ngày sinh.',
    type: 'PROFILE_REQUEST',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    link: '/landlord/tenant-requests?status=PENDING',
  },
  {
    id: 'notif_02',
    targetRole: 'LANDLORD',
    title: '💰 Đã nhận bằng chứng thanh toán',
    content: 'Lê Văn An (Phòng 102) đã tải lên hóa đơn chuyển khoản 4,930,000đ.',
    type: 'PAYMENT_SUBMITTED',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    link: '/landlord/invoices?status=PAYMENT_SUBMITTED',
  },
  {
    id: 'notif_03',
    userId: 'usr_tenant_01',
    targetRole: 'TENANT',
    title: '📄 Thông báo phát hành hóa đơn tháng 8/2026',
    content: 'Chủ trọ Vũ Đức Nam đã phát hành hóa đơn tiền phòng tháng 8/2026. Số tiền: 4,158,000đ.',
    type: 'INVOICE_NEW',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    link: '/tenant/my-invoices?status=PENDING_PAYMENT',
  },
  {
    id: 'notif_04',
    userId: 'usr_tenant_02',
    targetRole: 'TENANT',
    title: '✅ Thanh toán thành công',
    content: 'Chủ trọ Vũ Đức Nam đã xác nhận thu đủ tiền phòng tháng 7/2026.',
    type: 'PAYMENT_CONFIRMED',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    link: '/tenant/my-invoices?status=PAID',
  },
];

export const useNotificationStore = defineStore('notification', () => {
  const authStore = useAuthStore();
  const savedNotifs = localStorage.getItem('app_notifications');
  const notifications = ref<AppNotification[]>(
    savedNotifs ? JSON.parse(savedNotifs) : initialNotifications
  );

  function persist() {
    localStorage.setItem('app_notifications', JSON.stringify(notifications.value));
  }

  // Lọc thông báo phù hợp với tài khoản đang đăng nhập
  const myNotifications = computed(() => {
    const user = authStore.currentUser;
    if (!user) return [];
    return notifications.value.filter((n) => {
      if (n.userId && n.userId === user.id) return true;
      if (n.targetRole === 'ALL') return true;
      if (n.targetRole === user.role) return true;
      return false;
    });
  });

  const unreadCount = computed(() => {
    return myNotifications.value.filter((n) => !n.isRead).length;
  });

  function addNotification(payload: {
    userId?: string;
    targetRole?: 'LANDLORD' | 'TENANT' | 'ALL';
    title: string;
    content: string;
    type: NotificationType;
    link?: string;
  }) {
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      userId: payload.userId,
      targetRole: payload.targetRole || 'ALL',
      title: payload.title,
      content: payload.content,
      type: payload.type,
      isRead: false,
      createdAt: new Date().toISOString(),
      link: payload.link,
    };
    notifications.value.unshift(newNotif);
    persist();
    return newNotif;
  }

  function markAsRead(id: string) {
    const item = notifications.value.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
      persist();
    }
  }

  function markAllAsRead() {
    const user = authStore.currentUser;
    if (!user) return;
    notifications.value.forEach((n) => {
      if (n.userId === user.id || n.targetRole === user.role || n.targetRole === 'ALL') {
        n.isRead = true;
      }
    });
    persist();
  }

  function deleteNotification(id: string) {
    notifications.value = notifications.value.filter((n) => n.id !== id);
    persist();
  }

  function clearAllForCurrentUser() {
    const user = authStore.currentUser;
    if (!user) return;
    notifications.value = notifications.value.filter((n) => {
      const match = n.userId === user.id || n.targetRole === user.role || n.targetRole === 'ALL';
      return !match;
    });
    persist();
  }

  return {
    notifications,
    myNotifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllForCurrentUser,
  };
});
