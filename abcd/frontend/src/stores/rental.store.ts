import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { Motel, Room, Contract, Invoice, RoomStatus, ProfileChangeRequest, ProfileData } from '../types';
import { useAuthStore } from './auth.store';
import { useNotificationStore } from './notification.store';

const API_URL = 'http://localhost:3000';

const initialMotels: Motel[] = [
  {
    id: 'motel_01',
    landlordId: 'usr_landlord_01',
    name: 'Khu Trọ Xanh Cầu Giấy',
    address: 'Số 18, Ngõ 123 Xuân Thủy',
    ward: 'Dịch Vọng Hậu',
    district: 'Cầu Giấy',
    city: 'Hà Nội',
    electricityUnitPrice: 3800,
    waterUnitPrice: 28000,
  },
  {
    id: 'motel_02',
    landlordId: 'usr_landlord_01',
    name: 'Nhà Trọ Cao Cấp 60 Lò Đúc',
    address: '60 Lò Đúc',
    ward: 'Phạm Đình Hổ',
    district: 'Hai Bà Trưng',
    city: 'Hà Nội',
    electricityUnitPrice: 4000,
    waterUnitPrice: 30000,
  },
];

const initialRooms: Room[] = [
  {
    id: 'room_101',
    motelId: 'motel_01',
    roomNumber: '101',
    floor: 1,
    areaSqm: 25,
    basePrice: 3500000,
    isSelfContained: true,
    status: 'OCCUPIED',
    description: 'Phòng tầng 1 khép kín, có gác xép, điều hòa, tủ lạnh, kệ bếp riêng.',
    amenities: ['Điều hòa', 'Bình nóng lạnh', 'Gác xép', 'Tủ lạnh', 'Wifi tốc độ cao', 'Cửa khóa vân tay'],
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'room_102',
    motelId: 'motel_01',
    roomNumber: '102',
    floor: 1,
    areaSqm: 28,
    basePrice: 4200000,
    isSelfContained: true,
    status: 'OCCUPIED',
    description: 'Phòng studio full nội thất, ban công thoáng mát đón ánh sáng tự nhiên.',
    amenities: ['Điều hòa Inverter', 'Nóng lạnh', 'Máy giặt riêng', 'Tủ quần áo', 'Bàn làm việc'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'room_201',
    motelId: 'motel_01',
    roomNumber: '201',
    floor: 2,
    areaSqm: 22,
    basePrice: 3200000,
    isSelfContained: true,
    status: 'AVAILABLE',
    description: 'Phòng thoáng mát, có cửa sổ lớn, sạch sẽ, dọn vào ở ngay.',
    amenities: ['Điều hòa', 'Nóng lạnh', 'Wifi'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'room_a202',
    motelId: 'motel_02',
    roomNumber: 'LD-202',
    floor: 2,
    areaSqm: 35,
    basePrice: 5500000,
    isSelfContained: true,
    status: 'AVAILABLE',
    description: 'Căn hộ dịch vụ cao cấp 60 Lò Đúc, trung tâm Hai Bà Trưng, an ninh 24/7.',
    amenities: ['Full nội thất', 'Khóa điện tử', 'Thang máy', 'Camera an ninh', 'Chỗ để xe rộng'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

const initialContracts: Contract[] = [
  {
    id: 'contract_01',
    roomId: 'room_101',
    tenantId: 'usr_tenant_01',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    rentalPrice: 3500000,
    depositAmount: 3500000,
    paymentDay: 5,
    status: 'ACTIVE',
  },
  {
    id: 'contract_02',
    roomId: 'room_102',
    tenantId: 'usr_tenant_02',
    startDate: '2026-02-01',
    endDate: '2027-01-31',
    rentalPrice: 4200000,
    depositAmount: 4200000,
    paymentDay: 5,
    status: 'ACTIVE',
  },
];

const initialInvoices: Invoice[] = [
  {
    id: 'inv_01',
    contractId: 'contract_01',
    roomId: 'room_101',
    tenantId: 'usr_tenant_01',
    periodMonth: 8,
    periodYear: 2026,
    roomAmount: 3500000,
    electricityUsage: 110,
    electricityAmount: 110 * 3800,
    waterUsage: 5,
    waterAmount: 5 * 28000,
    otherFees: 100000,
    totalAmount: 3500000 + 110 * 3800 + 5 * 28000 + 100000,
    status: 'PENDING_PAYMENT',
    dueDate: '2026-08-05',
  },
  {
    id: 'inv_02',
    contractId: 'contract_02',
    roomId: 'room_102',
    tenantId: 'usr_tenant_02',
    periodMonth: 8,
    periodYear: 2026,
    roomAmount: 4200000,
    electricityUsage: 145,
    electricityAmount: 145 * 3800,
    waterUsage: 6,
    waterAmount: 6 * 28000,
    otherFees: 120000,
    totalAmount: 4200000 + 145 * 3800 + 6 * 28000 + 120000,
    status: 'PAYMENT_SUBMITTED',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    tenantNote: 'Em chuyển tiền qua Vietcombank lúc 19:30 rồi anh Nam nhé.',
    dueDate: '2026-08-05',
  },
  {
    id: 'inv_03',
    contractId: 'contract_01',
    roomId: 'room_101',
    tenantId: 'usr_tenant_01',
    periodMonth: 9,
    periodYear: 2026,
    roomAmount: 3500000,
    electricityUsage: 0,
    electricityAmount: 0,
    waterUsage: 0,
    waterAmount: 0,
    otherFees: 0,
    totalAmount: 3500000,
    status: 'DRAFT',
    dueDate: '2026-09-05',
  },
];

const initialProfileRequests: ProfileChangeRequest[] = [
  {
    id: 'req_01',
    tenantId: 'usr_tenant_01',
    tenantName: 'Trần Thị Thuê Nhà',
    roomNumber: '101',
    motelName: 'Khu Trọ Xanh Cầu Giấy',
    oldData: {
      fullName: 'Trần Thị Thuê Nhà',
      phoneNumber: '0912345678',
      cccd: '001198012345',
      dateOfBirth: '1998-05-15',
      hometown: 'Nam Định',
      job: 'Nhân viên văn phòng',
      address: 'Phòng 101, Số 18, Ngõ 123 Xuân Thủy, Cầu Giấy, Hà Nội',
    },
    newData: {
      fullName: 'Trần Thị Thu Giang',
      phoneNumber: '0912345678',
      cccd: '038198009999',
      dateOfBirth: '1998-05-15',
      hometown: 'TP. Nam Định, Tỉnh Nam Định',
      job: 'Kế toán trưởng',
      address: 'Phòng 101, Số 18, Ngõ 123 Xuân Thủy, Cầu Giấy, Hà Nội',
      reason: 'Cập nhật lại họ tên chính xác theo CCCD gắn chip mới đổi và nâng cấp nghề nghiệp.',
    },
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

export const useRentalStore = defineStore('rental', () => {
  const authStore = useAuthStore();
  const notificationStore = useNotificationStore();

  const motels = ref<Motel[]>(JSON.parse(JSON.stringify(initialMotels)));
  const rooms = ref<Room[]>(JSON.parse(JSON.stringify(initialRooms)));
  const contracts = ref<Contract[]>(JSON.parse(JSON.stringify(initialContracts)));
  const invoices = ref<Invoice[]>(JSON.parse(JSON.stringify(initialInvoices)));

  const savedProfileReqs = localStorage.getItem('profile_requests');
  const profileRequests = ref<ProfileChangeRequest[]>(
    savedProfileReqs ? JSON.parse(savedProfileReqs) : initialProfileRequests
  );

  function persistProfileRequests() {
    localStorage.setItem('profile_requests', JSON.stringify(profileRequests.value));
  }

  // Axios instance with interceptor
  const api = axios.create({ baseURL: API_URL, timeout: 3000 });
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Getters
  const enrichedRooms = computed(() => {
    return rooms.value.map((room) => {
      const motel = motels.value.find((m) => m.id === room.motelId);
      const contract = contracts.value.find((c) => c.roomId === room.id && c.status === 'ACTIVE');
      return {
        ...room,
        motel,
        contract,
      };
    });
  });

  const enrichedInvoices = computed(() => {
    return invoices.value.map((inv) => {
      const room = rooms.value.find((r) => r.id === inv.roomId);
      const motel = room ? motels.value.find((m) => m.id === room.motelId) : undefined;
      const contract = contracts.value.find((c) => c.id === inv.contractId);
      const tenant = authStore.demoUsers.find((u) => u.id === inv.tenantId);
      return {
        ...inv,
        room: room ? { ...room, motel } : undefined,
        contract,
        tenant: tenant || inv.tenant,
      };
    });
  });

  const pendingProfileRequestsCount = computed(() => {
    return profileRequests.value.filter((r) => r.status === 'PENDING').length;
  });

  // Actions
  async function fetchLandlordData() {
    try {
      const resMotels = await api.get('/motels/my-motels');
      if (resMotels.data && resMotels.data.length > 0) {
        motels.value = resMotels.data;
        const allRooms: Room[] = [];
        resMotels.data.forEach((motel: any) => {
          if (motel.rooms) {
            allRooms.push(...motel.rooms);
          }
        });
        if (allRooms.length > 0) rooms.value = allRooms;
      }

      const resContracts = await api.get('/contracts/landlord/my-contracts');
      if (resContracts.data && resContracts.data.length > 0) {
        contracts.value = resContracts.data;
      }

      const resInvoices = await api.get('/invoices/landlord/my-invoices');
      if (resInvoices.data && resInvoices.data.length > 0) {
        invoices.value = resInvoices.data;
      }
    } catch (error) {
      console.warn('Backend offline or error, using local fallback state.');
    }
  }

  async function fetchTenantData() {
    try {
      const resContracts = await api.get('/contracts/tenant/my-contracts');
      if (resContracts.data && resContracts.data.length > 0) {
        contracts.value = resContracts.data;
      }

      const resInvoices = await api.get('/invoices/tenant/my-invoices');
      if (resInvoices.data && resInvoices.data.length > 0) {
        invoices.value = resInvoices.data;
      }
    } catch (error) {
      console.warn('Backend offline or error, using local fallback state.');
    }
  }

  async function addRoom(newRoom: Omit<Room, 'id'>) {
    try {
      const res = await api.post(`/rooms/${newRoom.motelId}`, newRoom);
      if (res.data) {
        await fetchLandlordData();
        return;
      }
    } catch (error) {
      console.warn('Backend call failed, applying locally');
    }
    const created: Room = {
      ...newRoom,
      id: 'room_' + Date.now(),
    };
    rooms.value.push(created);
  }

  async function updateRoom(roomId: string, data: Partial<Room>) {
    try {
      const res = await api.put(`/rooms/${roomId}`, data);
      if (res.data) {
        await fetchLandlordData();
        return;
      }
    } catch (error) {
      console.warn('Backend call failed, applying locally');
    }
    const idx = rooms.value.findIndex((r) => r.id === roomId);
    if (idx !== -1) {
      rooms.value[idx] = { ...rooms.value[idx], ...data };
    }
  }

  async function updateRoomImages(roomId: string, images: string[]) {
    try {
      const res = await api.put(`/rooms/${roomId}/images`, { images });
      if (res.data) {
        await fetchLandlordData();
        return;
      }
    } catch (error) {
      console.warn('Backend call failed, applying locally');
    }
    const r = rooms.value.find((item) => item.id === roomId);
    if (r) {
      r.images = [...images];
    }
  }

  async function uploadRoomImages(roomId: string, files: File[]) {
    if (!files || files.length === 0) return [];
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });
      const res = await api.post(`/rooms/${roomId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.newUrls) {
        await fetchLandlordData();
        return res.data.newUrls;
      }
    } catch (error) {
      console.warn('Backend upload failed, generating local object URLs fallback');
    }

    // Local Storage / Fallback
    const localUrls = files.map((file) => URL.createObjectURL(file));
    const r = rooms.value.find((item) => item.id === roomId);
    if (r) {
      r.images = [...(r.images || []), ...localUrls];
    }
    return localUrls;
  }

  async function deleteRoomImage(roomId: string, imageUrl: string) {
    try {
      await api.delete(`/rooms/${roomId}/images`, { data: { imageUrl } });
      await fetchLandlordData();
      return;
    } catch (error) {
      console.warn('Backend call failed, applying locally');
    }
    const r = rooms.value.find((item) => item.id === roomId);
    if (r && r.images) {
      r.images = r.images.filter((img) => img !== imageUrl);
    }
  }

  async function setRoomCoverImage(roomId: string, imageUrl: string) {
    const r = rooms.value.find((item) => item.id === roomId);
    if (r && r.images) {
      const otherImages = r.images.filter((img) => img !== imageUrl);
      const reordered = [imageUrl, ...otherImages];
      await updateRoomImages(roomId, reordered);
    }
  }

  async function updateRoomStatus(roomId: string, status: RoomStatus) {
    try {
      await api.put(`/rooms/${roomId}/status`, { status });
      await fetchLandlordData();
      return;
    } catch (error) {
      console.warn('Backend call failed, applying locally');
    }
    const r = rooms.value.find((item) => item.id === roomId);
    if (r) r.status = status;
  }

  async function addContract(data: Omit<Contract, 'id' | 'status'>) {
    try {
      await api.post('/contracts', data);
      await fetchLandlordData();
      return;
    } catch (error) {
      console.warn('Backend call failed, applying locally');
    }
    const newContract: Contract = {
      ...data,
      id: 'contract_' + Date.now(),
      status: 'ACTIVE',
    };
    contracts.value.push(newContract);
    const room = rooms.value.find((r) => r.id === data.roomId);
    if (room) room.status = 'OCCUPIED';
  }

  async function terminateContract(contractId: string) {
    try {
      await api.put(`/contracts/${contractId}/terminate`);
      await fetchLandlordData();
      return;
    } catch (error) {
      console.warn('Backend call failed, applying locally');
    }
    const contract = contracts.value.find((c) => c.id === contractId);
    if (contract) {
      contract.status = 'TERMINATED';
      const room = rooms.value.find((r) => r.id === contract.roomId);
      if (room) room.status = 'AVAILABLE';
    }
  }

  async function updateAndApproveInvoice(
    invoiceId: string,
    payload: {
      electricityUsage: number;
      waterUsage: number;
      otherFees: number;
      roomAmount?: number;
      approveImmediately?: boolean;
    },
  ) {
    try {
      if (payload.approveImmediately) {
        await api.put(`/invoices/${invoiceId}/approve`, payload);
      } else {
        await api.put(`/invoices/${invoiceId}/update-draft`, payload);
      }
      await fetchLandlordData();
      return;
    } catch (error) {
      console.warn('Backend call failed, applying locally');
    }
    const inv = invoices.value.find((i) => i.id === invoiceId);
    if (inv) {
      const room = rooms.value.find((r) => r.id === inv.roomId);
      const motel = room ? motels.value.find((m) => m.id === room.motelId) : null;
      const elecPrice = motel?.electricityUnitPrice || 3800;
      const waterPrice = motel?.waterUnitPrice || 28000;

      inv.electricityUsage = payload.electricityUsage;
      inv.electricityAmount = payload.electricityUsage * elecPrice;
      inv.waterUsage = payload.waterUsage;
      inv.waterAmount = payload.waterUsage * waterPrice;
      inv.otherFees = payload.otherFees;
      if (payload.roomAmount !== undefined) {
        inv.roomAmount = payload.roomAmount;
      }
      inv.totalAmount = inv.roomAmount + inv.electricityAmount + inv.waterAmount + inv.otherFees;
      if (payload.approveImmediately) {
        inv.status = 'PENDING_PAYMENT';
        // Gửi thông báo cho khách thuê
        notificationStore.addNotification({
          userId: inv.tenantId,
          targetRole: 'TENANT',
          title: `📄 Hóa đơn tiền phòng tháng ${inv.periodMonth}/${inv.periodYear}`,
          content: `Chủ trọ Vũ Đức Nam đã phê duyệt hóa đơn tháng ${inv.periodMonth}/${inv.periodYear}. Tổng số tiền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(inv.totalAmount)}. Hạn nộp: ${inv.dueDate}`,
          type: 'INVOICE_NEW',
          link: '/tenant/my-invoices',
        });
      }
    }
  }

  async function submitPaymentProof(invoiceId: string, proofFile: File | null, note?: string) {
    try {
      const formData = new FormData();
      if (proofFile) {
        formData.append('billImage', proofFile);
      }
      if (note) {
        formData.append('note', note);
      }
      await api.post(`/invoices/${invoiceId}/submit-payment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (authStore.currentUser?.role === 'TENANT') {
        await fetchTenantData();
      } else {
        await fetchLandlordData();
      }
      return;
    } catch (error) {
      console.warn('Backend call failed, applying locally');
    }
    const inv = invoices.value.find((i) => i.id === invoiceId);
    if (inv) {
      inv.status = 'PAYMENT_SUBMITTED';
      inv.tenantNote = note;
      if (proofFile) {
        inv.paymentProofUrl = URL.createObjectURL(proofFile);
      } else {
        inv.paymentProofUrl =
          'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80';
      }

      // Thông báo cho chủ trọ
      const currentUserName = authStore.currentUser?.fullName || 'Khách thuê';
      notificationStore.addNotification({
        targetRole: 'LANDLORD',
        title: '💵 Khách vừa gửi bill thanh toán',
        content: `${currentUserName} đã tải lên ảnh bill chuyển khoản cho hóa đơn tháng ${inv.periodMonth}/${inv.periodYear}.`,
        type: 'PAYMENT_SUBMITTED',
        link: '/landlord/invoices?status=PAYMENT_SUBMITTED',
      });
    }
  }

  async function confirmPaymentSuccess(invoiceId: string) {
    try {
      await api.put(`/invoices/${invoiceId}/confirm-paid`);
      await fetchLandlordData();
      return;
    } catch (error) {
      console.warn('Backend call failed, applying locally');
    }
    const inv = invoices.value.find((i) => i.id === invoiceId);
    if (inv) {
      inv.status = 'PAID';
      inv.paidAt = new Date().toISOString();

      // Thông báo cho khách thuê
      notificationStore.addNotification({
        userId: inv.tenantId,
        targetRole: 'TENANT',
        title: '🎉 Thanh toán hoàn tất',
        content: `Chủ trọ Vũ Đức Nam đã xác nhận thu tiền hóa đơn tháng ${inv.periodMonth}/${inv.periodYear}. Cảm ơn bạn đã thanh toán đúng hạn!`,
        type: 'PAYMENT_CONFIRMED',
        link: '/tenant/my-invoices?status=PAID',
      });
    }
  }

  // Chức năng: Người thuê gửi yêu cầu thay đổi thông tin
  function submitProfileChangeRequest(payload: {
    tenantId: string;
    tenantName: string;
    roomNumber: string;
    motelName: string;
    oldData: ProfileData;
    newData: ProfileData & { reason?: string };
  }) {
    const newReq: ProfileChangeRequest = {
      id: 'req_' + Date.now(),
      tenantId: payload.tenantId,
      tenantName: payload.tenantName,
      roomNumber: payload.roomNumber,
      motelName: payload.motelName,
      oldData: payload.oldData,
      newData: payload.newData,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    profileRequests.value.unshift(newReq);
    persistProfileRequests();

    // Phát thông báo cho Chủ trọ (Vũ Đức Nam)
    notificationStore.addNotification({
      targetRole: 'LANDLORD',
      title: '📝 Yêu cầu sửa thông tin khách thuê mới',
      content: `${payload.tenantName} (Phòng ${payload.roomNumber} - ${payload.motelName}) vừa gửi yêu cầu sửa thông tin cá nhân. Vui lòng xem xét và phê duyệt.`,
      type: 'PROFILE_REQUEST',
      link: '/landlord/tenant-requests?status=PENDING',
    });

    return newReq;
  }

  // Chức năng: Chủ trọ phê duyệt yêu cầu
  function approveProfileChangeRequest(requestId: string) {
    const req = profileRequests.value.find((r) => r.id === requestId);
    if (!req) return;

    req.status = 'APPROVED';
    req.reviewedAt = new Date().toISOString();
    persistProfileRequests();

    // Cập nhật thông tin thực tế của người thuê vào Auth Store
    authStore.updateUserData(req.tenantId, {
      fullName: req.newData.fullName,
      phoneNumber: req.newData.phoneNumber,
      cccd: req.newData.cccd,
      dateOfBirth: req.newData.dateOfBirth,
      hometown: req.newData.hometown,
      job: req.newData.job,
      address: req.newData.address,
      email: req.newData.email,
    });

    // Phát thông báo cho Khách thuê
    notificationStore.addNotification({
      userId: req.tenantId,
      targetRole: 'TENANT',
      title: '✅ Yêu cầu sửa thông tin ĐÃ ĐƯỢC PHÊ DUYỆT',
      content: `Chủ trọ Vũ Đức Nam đã chấp nhận yêu cầu cập nhật thông tin cá nhân của bạn. Thông tin mới đã được cập nhật chính thức vào hệ thống.`,
      type: 'PROFILE_APPROVED',
      link: '/tenant/my-room?openProfileModal=true&tab=HISTORY',
    });
  }

  // Chức năng: Chủ trọ từ chối yêu cầu
  function rejectProfileChangeRequest(requestId: string, rejectReason: string) {
    const req = profileRequests.value.find((r) => r.id === requestId);
    if (!req) return;

    req.status = 'REJECTED';
    req.rejectReason = rejectReason;
    req.reviewedAt = new Date().toISOString();
    persistProfileRequests();

    // Phát thông báo cho Khách thuê
    notificationStore.addNotification({
      userId: req.tenantId,
      targetRole: 'TENANT',
      title: '❌ Yêu cầu sửa thông tin BỊ TỪ CHỐI',
      content: `Chủ trọ Vũ Đức Nam đã từ chối yêu cầu cập nhật thông tin. Lý do: "${rejectReason || 'Thông tin chưa chính xác'}". Vui lòng kiểm tra lại.`,
      type: 'PROFILE_REJECTED',
      link: '/tenant/my-room?openProfileModal=true&tab=HISTORY',
    });
  }

  async function triggerMonthlyBullMQJob(month: number, year: number) {
    try {
      const res = await api.post('/invoices/trigger-cron', { month, year });
      await fetchLandlordData();
      return { createdCount: res.data.createdCount || 0 };
    } catch (error) {
      console.warn('Backend call failed, generating draft invoices locally');
    }

    let createdCount = 0;
    contracts.value
      .filter((c) => c.status === 'ACTIVE')
      .forEach((contract) => {
        const exists = invoices.value.some(
          (inv) => inv.contractId === contract.id && inv.periodMonth === month && inv.periodYear === year,
        );
        if (!exists) {
          const newDraft: Invoice = {
            id: 'inv_' + Date.now() + '_' + contract.id,
            contractId: contract.id,
            roomId: contract.roomId,
            tenantId: contract.tenantId,
            periodMonth: month,
            periodYear: year,
            roomAmount: contract.rentalPrice,
            electricityUsage: 0,
            electricityAmount: 0,
            waterUsage: 0,
            waterAmount: 0,
            otherFees: 0,
            totalAmount: contract.rentalPrice,
            status: 'DRAFT',
            dueDate: `${year}-${String(month).padStart(2, '0')}-05`,
          };
          invoices.value.unshift(newDraft);
          createdCount++;
        }
      });
    return { createdCount };
  }

  return {
    motels,
    rooms,
    contracts,
    invoices,
    profileRequests,
    enrichedRooms,
    enrichedInvoices,
    pendingProfileRequestsCount,
    fetchLandlordData,
    fetchTenantData,
    addRoom,
    updateRoom,
    updateRoomImages,
    uploadRoomImages,
    deleteRoomImage,
    setRoomCoverImage,
    updateRoomStatus,
    addContract,
    terminateContract,
    updateAndApproveInvoice,
    submitPaymentProof,
    confirmPaymentSuccess,
    submitProfileChangeRequest,
    approveProfileChangeRequest,
    rejectProfileChangeRequest,
    triggerMonthlyBullMQJob,
  };
});
