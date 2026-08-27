<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Quản Lý Hợp Đồng & Thanh Lý</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Quản lý thời hạn thuê, giá thuê cố định, tiền cọc và thực hiện quy trình thanh lý hợp đồng.
        </p>
      </div>

      <button
        @click="showContractModal = true"
        class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition"
      >
        ＋ Lập Hợp Đồng Mới
      </button>
    </div>

    <!-- Contracts Table -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th class="p-4">Phòng & Nhà Trọ</th>
              <th class="p-4">Khách Thuê</th>
              <th class="p-4">Thời Hạn Thuê</th>
              <th class="p-4">Giá Thuê</th>
              <th class="p-4">Tiền Đặt Cọc</th>
              <th class="p-4">Trạng Thái</th>
              <th class="p-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr
              v-for="contract in contractsWithDetails"
              :key="contract.id"
              class="hover:bg-slate-50/60 transition-colors"
            >
              <td class="p-4">
                <span class="font-extrabold text-slate-900 text-sm">Phòng {{ contract.room?.roomNumber }}</span>
                <span class="block text-[11px] text-slate-400 font-normal">{{ contract.room?.motel?.name }}</span>
              </td>
              <td class="p-4">
                <span class="font-bold text-slate-800">{{ getTenantName(contract.tenantId) }}</span>
                <span class="block text-[11px] text-slate-400 font-mono">Hạn đóng: Ngày {{ contract.paymentDay }} hàng tháng</span>
              </td>
              <td class="p-4">
                <span class="text-slate-700 font-semibold">{{ formatDate(contract.startDate) }} → {{ formatDate(contract.endDate) }}</span>
              </td>
              <td class="p-4">
                <span class="font-black text-indigo-600 text-sm">{{ formatCurrency(contract.rentalPrice) }}</span>
              </td>
              <td class="p-4">
                <span class="font-bold text-emerald-700">{{ formatCurrency(contract.depositAmount) }}</span>
              </td>
              <td class="p-4">
                <span
                  class="px-2.5 py-1 rounded-full text-[11px] font-extrabold"
                  :class="contract.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
                >
                  {{ contract.status === 'ACTIVE' ? 'Đang hiệu lực' : 'Đã thanh lý' }}
                </span>
              </td>
              <td class="p-4 text-right">
                <button
                  v-if="contract.status === 'ACTIVE'"
                  @click="handleTerminate(contract.id, contract.room?.roomNumber || '')"
                  class="px-3 py-1.5 rounded-lg font-bold text-xs bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-200"
                >
                  🚪 Thanh Lý Hợp Đồng
                </button>
                <span v-else class="text-slate-400 text-xs italic">Đã kết thúc</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ContractModal v-if="showContractModal" @close="showContractModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useRentalStore } from '../../stores/rental.store';
import ContractModal from '../../components/ContractModal.vue';

const authStore = useAuthStore();
const rentalStore = useRentalStore();
const showContractModal = ref(false);

const contractsWithDetails = computed(() => {
  return rentalStore.contracts.map((c) => {
    const room = rentalStore.rooms.find((r) => r.id === c.roomId);
    const motel = room ? rentalStore.motels.find((m) => m.id === room.motelId) : undefined;
    return {
      ...c,
      room: room ? { ...room, motel } : undefined,
    };
  });
});

const getTenantName = (tenantId: string) => {
  const user = authStore.demoUsers.find((u) => u.id === tenantId);
  if (user) return user.fullName;
  if (tenantId === 'usr_tenant_01') return 'Trần Thị Thuê Nhà';
  if (tenantId === 'usr_tenant_02') return 'Lê Văn An';
  return 'Khách Thuê #' + tenantId.slice(-4);
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

const handleTerminate = async (contractId: string, roomNumber: string) => {
  if (confirm(`Bạn có chắc chắn muốn THANH LÝ hợp đồng phòng ${roomNumber}? Phòng sẽ được tự động chuyển về trạng thái TRỐNG.`)) {
    try {
      await rentalStore.terminateContract(contractId);
      alert(`Đã thanh lý hợp đồng phòng ${roomNumber} thành công!`);
    } catch (error) {
      alert('Có lỗi xảy ra khi thanh lý hợp đồng.');
    }
  }
};
</script>
