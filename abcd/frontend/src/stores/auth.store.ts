import { defineStore } from 'pinia';
import { ref } from 'vue';
import { User, Role } from '../types';
import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

export const useAuthStore = defineStore('auth', () => {
  // Danh sách tài khoản demo sẵn có
  const demoUsers: User[] = [
    {
      id: 'usr_landlord_01',
      phoneNumber: '0901234567',
      fullName: 'Nguyễn Văn Chủ Trọ',
      role: 'LANDLORD',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
    {
      id: 'usr_tenant_01',
      phoneNumber: '0912345678',
      fullName: 'Trần Thị Thuê Nhà (Phòng 101)',
      role: 'TENANT',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    },
    {
      id: 'usr_tenant_02',
      phoneNumber: '0987654321',
      fullName: 'Lê Văn An (Phòng 102)',
      role: 'TENANT',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    },
  ];

  const savedUser = localStorage.getItem('currentUser');
  const savedToken = localStorage.getItem('token');

  const currentUser = ref<User | null>(savedUser ? JSON.parse(savedUser) : demoUsers[0]);
  const token = ref<string | null>(savedToken || 'demo_jwt_token_' + demoUsers[0].id);

  function setUserSession(user: User, jwtToken: string) {
    currentUser.value = user;
    token.value = jwtToken;
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', jwtToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
  }

  function clearSession() {
    currentUser.value = null;
    token.value = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }

  if (token.value && token.value.startsWith('eyJ')) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  async function loginOrRegister(phoneNumber: string, otp: string, role?: Role, fullName?: string) {
    try {
      const response = await axios.post(`${API_URL}/login-otp`, {
        phoneNumber,
        otp,
        role,
        fullName
      });

      const data = response.data;
      setUserSession(data.user, data.accessToken);
      return data.user;
    } catch (error: any) {
      console.error('Lỗi xác thực:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Lỗi kết nối đến máy chủ.');
      }
    }
  }

  function switchUser(role: Role, userId?: string) {
    let found = demoUsers.find((u) => u.id === userId);
    if (!found) {
      found = demoUsers.find((u) => u.role === role);
    }
    if (found) {
      setUserSession(found, 'demo_jwt_token_' + found.id);
    }
  }

  function setCustomUser(user: User, customToken?: string) {
    setUserSession(user, customToken || 'demo_jwt_token_' + user.id);
  }

  function logout() {
    clearSession();
  }

  return {
    currentUser,
    token,
    demoUsers,
    loginOrRegister,
    switchUser,
    setCustomUser,
    logout
  };
});
