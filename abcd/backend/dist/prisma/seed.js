"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Bắt đầu nạp dữ liệu mẫu (Seed Data)...');
    const landlord = await prisma.user.upsert({
        where: { phoneNumber: '0901234567' },
        update: {},
        create: {
            phoneNumber: '0901234567',
            fullName: 'Nguyễn Văn Chủ Trọ',
            role: client_1.Role.LANDLORD,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        },
    });
    const tenant1 = await prisma.user.upsert({
        where: { phoneNumber: '0912345678' },
        update: {},
        create: {
            phoneNumber: '0912345678',
            fullName: 'Trần Thị Thuê Nhà',
            role: client_1.Role.TENANT,
            avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
        },
    });
    const tenant2 = await prisma.user.upsert({
        where: { phoneNumber: '0987654321' },
        update: {},
        create: {
            phoneNumber: '0987654321',
            fullName: 'Lê Văn An',
            role: client_1.Role.TENANT,
            avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
        },
    });
    const motel1 = await prisma.motel.create({
        data: {
            landlordId: landlord.id,
            name: 'Khu Trọ Xanh Cầu Giấy',
            address: 'Số 18, Ngõ 123 Xuân Thủy',
            ward: 'Dịch Vọng Hậu',
            district: 'Cầu Giấy',
            city: 'Hà Nội',
            electricityUnitPrice: 3800,
            waterUnitPrice: 28000,
        },
    });
    const motel2 = await prisma.motel.create({
        data: {
            landlordId: landlord.id,
            name: 'Nhà Trọ Cao Cấp Bình Thạnh',
            address: '88/4 Nguyễn Gia Trí (D2 cũ)',
            ward: 'Phường 25',
            district: 'Bình Thạnh',
            city: 'Hồ Chí Minh',
            electricityUnitPrice: 4000,
            waterUnitPrice: 30000,
        },
    });
    const room101 = await prisma.room.create({
        data: {
            motelId: motel1.id,
            roomNumber: '101',
            floor: 1,
            areaSqm: 25,
            basePrice: 3500000,
            isSelfContained: true,
            status: client_1.RoomStatus.OCCUPIED,
            description: 'Phòng tầng 1 khép kín, có gác xép, điều hòa, tủ lạnh, kệ bếp riêng.',
            amenities: ['Điều hòa', 'Bình nóng lạnh', 'Gác xép', 'Tủ lạnh', 'Wifi tốc độ cao', 'Cửa khóa vân tay'],
            images: [
                'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
            ],
        },
    });
    const room102 = await prisma.room.create({
        data: {
            motelId: motel1.id,
            roomNumber: '102',
            floor: 1,
            areaSqm: 28,
            basePrice: 4200000,
            isSelfContained: true,
            status: client_1.RoomStatus.OCCUPIED,
            description: 'Phòng studio full nội thất, ban công thoáng mát đón ánh sáng tự nhiên.',
            amenities: ['Điều hòa Inverter', 'Nóng lạnh', 'Máy giặt riêng', 'Tủ quần áo', 'Bàn làm việc'],
            images: [
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
            ],
        },
    });
    const room201 = await prisma.room.create({
        data: {
            motelId: motel1.id,
            roomNumber: '201',
            floor: 2,
            areaSqm: 22,
            basePrice: 3200000,
            isSelfContained: true,
            status: client_1.RoomStatus.AVAILABLE,
            description: 'Phòng thoáng mát, có cửa sổ lớn, sạch sẽ, dọn vào ở ngay.',
            amenities: ['Điều hòa', 'Nóng lạnh', 'Wifi'],
            images: [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
            ],
        },
    });
    const room202 = await prisma.room.create({
        data: {
            motelId: motel2.id,
            roomNumber: 'A202',
            floor: 2,
            areaSqm: 32,
            basePrice: 5500000,
            isSelfContained: true,
            status: client_1.RoomStatus.AVAILABLE,
            description: 'Căn hộ dịch vụ cao cấp gần Đại học HUTECH, Ngoại Thương, an ninh 24/7.',
            amenities: ['Full nội thất', 'Khóa điện tử', 'Thang máy', 'Camera an ninh', 'Chỗ để xe rộng'],
            images: [
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
            ],
        },
    });
    const contract1 = await prisma.contract.create({
        data: {
            roomId: room101.id,
            tenantId: tenant1.id,
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-12-31'),
            rentalPrice: 3500000,
            depositAmount: 3500000,
            paymentDay: 5,
            status: client_1.ContractStatus.ACTIVE,
        },
    });
    const contract2 = await prisma.contract.create({
        data: {
            roomId: room102.id,
            tenantId: tenant2.id,
            startDate: new Date('2026-02-01'),
            endDate: new Date('2027-01-31'),
            rentalPrice: 4200000,
            depositAmount: 4200000,
            paymentDay: 5,
            status: client_1.ContractStatus.ACTIVE,
        },
    });
    await prisma.invoice.create({
        data: {
            contractId: contract1.id,
            roomId: room101.id,
            tenantId: tenant1.id,
            periodMonth: 8,
            periodYear: 2026,
            roomAmount: 3500000,
            electricityUsage: 110,
            electricityAmount: 110 * 3800,
            waterUsage: 5,
            waterAmount: 5 * 28000,
            otherFees: 100000,
            totalAmount: 3500000 + (110 * 3800) + (5 * 28000) + 100000,
            status: client_1.InvoiceStatus.PENDING_PAYMENT,
            dueDate: new Date('2026-08-05'),
        },
    });
    await prisma.invoice.create({
        data: {
            contractId: contract2.id,
            roomId: room102.id,
            tenantId: tenant2.id,
            periodMonth: 8,
            periodYear: 2026,
            roomAmount: 4200000,
            electricityUsage: 145,
            electricityAmount: 145 * 3800,
            waterUsage: 6,
            waterAmount: 6 * 28000,
            otherFees: 120000,
            totalAmount: 4200000 + (145 * 3800) + (6 * 28000) + 120000,
            status: client_1.InvoiceStatus.PAYMENT_SUBMITTED,
            paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
            tenantNote: 'Em chuyển tiền qua Vietcombank lúc 19:30 rồi anh nhé.',
            dueDate: new Date('2026-08-05'),
        },
    });
    await prisma.invoice.create({
        data: {
            contractId: contract1.id,
            roomId: room101.id,
            tenantId: tenant1.id,
            periodMonth: 9,
            periodYear: 2026,
            roomAmount: 3500000,
            electricityUsage: 0,
            electricityAmount: 0,
            waterUsage: 0,
            waterAmount: 0,
            otherFees: 0,
            totalAmount: 3500000,
            status: client_1.InvoiceStatus.DRAFT,
            dueDate: new Date('2026-09-05'),
        },
    });
    console.log('✅ Nạp dữ liệu mẫu hoàn tất thành công!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map