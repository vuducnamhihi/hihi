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
      phoneNumber: '0337877836',
      fullName: 'Vũ Đức Nam',
      role: 'LANDLORD',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      address: '60 Lò Đúc, Hai Bà Trưng, Hà Nội',
      email: 'nam.vuduc@nhatro.vn',
    },
    {
      id: 'usr_tenant_01',
      phoneNumber: '0912345678',
      fullName: 'Trần Thị Thuê Nhà',
      role: 'TENANT',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
      cccd: '001198012345',
      dateOfBirth: '1998-05-15',
      hometown: 'Nam Định',
      job: 'Nhân viên văn phòng',
      address: 'Phòng 101, Số 18, Ngõ 123 Xuân Thủy, Cầu Giấy, Hà Nội',
      email: 'thuenha.tran@gmail.com',
    },
    {
      id: 'usr_tenant_02',
      phoneNumber: '0987654321',
      fullName: 'Lê Văn An',
      role: 'TENANT',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
      cccd: '001199098765',
      dateOfBirth: '1999-11-20',
      hometown: 'Hải Phòng',
      job: 'Kỹ sư phần mềm',
      address: 'Phòng 102, Số 18, Ngõ 123 Xuân Thủy, Cầu Giấy, Hà Nội',
      email: 'an.levan@gmail.com',
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
      // Fallback cho demo nếu server offline
      const found = demoUsers.find((u) => u.phoneNumber === phoneNumber);
      if (found) {
        setUserSession(found, 'demo_jwt_token_' + found.id);
        return found;
      }
      if (phoneNumber) {
        const newUser: User = {
          id: 'usr_' + Date.now(),
          phoneNumber,
          fullName: fullName || (role === 'LANDLORD' ? 'Chủ Trọ Mới' : 'Khách Thuê Mới'),
          role: role || 'TENANT',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
        };
        demoUsers.push(newUser);
        setUserSession(newUser, 'demo_jwt_token_' + newUser.id);
        return newUser;
      }
      throw new Error('Số điện thoại không hợp lệ hoặc lỗi kết nối máy chủ.');
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

  function updateUserData(userId: string, data: Partial<User>) {
    const userIndex = demoUsers.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      demoUsers[userIndex] = { ...demoUsers[userIndex], ...data };
    }
    if (currentUser.value && currentUser.value.id === userId) {
      currentUser.value = { ...currentUser.value, ...data };
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
    }
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
    updateUserData,
    logout
  };
});
