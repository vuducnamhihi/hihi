import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
  },
  // Phân hệ Chủ trọ (Landlord)
  {
    path: '/landlord',
    component: () => import('../layouts/LandlordLayout.vue'),
    meta: { requiresAuth: true, role: 'LANDLORD' },
    children: [
      {
        path: '',
        redirect: '/landlord/invoices',
      },
      {
        path: 'invoices',
        name: 'LandlordInvoices',
        component: () => import('../views/landlord/InvoicesView.vue'),
      },
      {
        path: 'rooms',
        name: 'LandlordRooms',
        component: () => import('../views/landlord/RoomsView.vue'),
      },
      {
        path: 'contracts',
        name: 'LandlordContracts',
        component: () => import('../views/landlord/ContractsView.vue'),
      },
      {
        path: 'tenant-requests',
        name: 'LandlordTenantRequests',
        component: () => import('../views/landlord/TenantRequestsView.vue'),
      },
    ],
  },
  // Phân hệ Khách thuê (Tenant)
  {
    path: '/tenant',
    component: () => import('../layouts/TenantLayout.vue'),
    meta: { requiresAuth: true, role: 'TENANT' },
    children: [
      {
        path: '',
        redirect: '/tenant/my-invoices',
      },
      {
        path: 'my-invoices',
        name: 'TenantInvoices',
        component: () => import('../views/tenant/TenantInvoicesView.vue'),
      },
      {
        path: 'my-room',
        name: 'TenantMyRoom',
        component: () => import('../views/tenant/MyRoomView.vue'),
      },
      {
        path: 'explore',
        name: 'TenantExplore',
        component: () => import('../views/tenant/ExploreRoomsView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/auth/login',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const currentUser = authStore.currentUser;

  if (to.meta.requiresAuth && !currentUser) {
    return next('/auth/login');
  }

  if (to.meta.role && currentUser) {
    if (to.meta.role !== currentUser.role) {
      if (currentUser.role === 'LANDLORD') {
        return next('/landlord/invoices');
      } else {
        return next('/tenant/my-invoices');
      }
    }
  }

  if (to.path === '/auth/login' && currentUser) {
    if (currentUser.role === 'LANDLORD') {
      return next('/landlord/invoices');
    } else {
      return next('/tenant/my-invoices');
    }
  }

  next();
});

export default router;
