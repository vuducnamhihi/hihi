import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { Motel, Room, Contract, Invoice, RoomStatus } from '../types';
import { useAuthStore } from './auth.store';

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
    name: 'Nhà Trọ Cao Cấp Bình Thạnh',
    address: '88/4 Nguyễn Gia Trí (D2 cũ)',
    ward: 'Phường 25',
    district: 'Bình Thạnh',
    city: 'Hồ Chí Minh',
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
    roomNumber: 'A202',
    floor: 2,
    areaSqm: 32,
    basePrice: 5500000,
    isSelfContained: true,
    status: 'AVAILABLE',
    description: 'Căn hộ dịch vụ cao cấp gần Đại học HUTECH, Ngoại Thương, an ninh 24/7.',
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
    tenantNote: 'Em chuyển tiền qua Vietcombank lúc 19:30 rồi anh nhé.',
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

export const useRentalStore = defineStore('rental', () => {
  const authStore = useAuthStore();
  const motels = ref<Motel[]>(JSON.parse(JSON.stringify(initialMotels)));
  const rooms = ref<Room[]>(JSON.parse(JSON.stringify(initialRooms)));
  const contracts = ref<Contract[]>(JSON.parse(JSON.stringify(initialContracts)));
  const invoices = ref<Invoice[]>(JSON.parse(JSON.stringify(initialInvoices)));

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
      return {
        ...inv,
        room: room ? { ...room, motel } : undefined,
        contract,
      };
    });
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
    }
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
    enrichedRooms,
    enrichedInvoices,
    fetchLandlordData,
    fetchTenantData,
    addRoom,
    updateRoomStatus,
    addContract,
    terminateContract,
    updateAndApproveInvoice,
    submitPaymentProof,
    confirmPaymentSuccess,
    triggerMonthlyBullMQJob,
  };
});
