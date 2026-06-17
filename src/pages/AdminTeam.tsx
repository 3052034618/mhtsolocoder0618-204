import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Card, { CardContent } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Tag from '@/components/common/Tag';
import Modal from '@/components/common/Modal';
import {
  Eye,
  CheckCircle,
  Package,
  Flag,
  Phone,
  Calendar,
  Users,
  MapPin,
  Plus,
  Trash2,
  Filter,
} from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { useTeamBookingStore } from '@/store/useTeamBookingStore';
import mockBookings from '@/data/mock/bookings.json';
import { format } from 'date-fns';
import { MaterialPackageItem, TeamBooking as TeamBookingType } from '@/types';

interface TeamBooking {
  id: string;
  orderNo: string;
  teamName: string;
  courseTitle: string;
  sessionDate: string;
  sessionStartTime: string;
  sessionEndTime: string;
  teamMemberCount: number;
  payAmount: number;
  status: string;
  contactName: string;
  contactPhone: string;
  workshopName: string;
  remark: string;
  materialPackageConfig?: MaterialPackageItem[];
}

const statusConfig: Record<string, { label: string; variant: string }> = {
  pending: { label: '待确认', variant: 'warning' },
  paid: { label: '已确认', variant: 'default' },
  confirmed: { label: '已确认', variant: 'success' },
  completed: { label: '已完成', variant: 'success' },
  cancelled: { label: '已取消', variant: 'danger' },
  refunded: { label: '已取消', variant: 'danger' },
};

export default function AdminTeam() {
  const { loadMockData, getCourseById, sessions } = useCourseStore();
  const { teamBookings: storeTeamBookings, updateStatus, updateMaterialPackage } = useTeamBookingStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<TeamBooking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialItems, setMaterialItems] = useState<MaterialPackageItem[]>([]);
  const [newMaterial, setNewMaterial] = useState({ name: '', quantity: 1, description: '' });

  useEffect(() => {
    loadMockData();
  }, [loadMockData]);

  const teamBookings = useMemo((): TeamBooking[] => {
    const mockTeamBookings: TeamBooking[] = mockBookings
      .filter(b => b.isTeamBooking)
      .map(b => ({
        id: b.id,
        orderNo: b.orderNo,
        teamName: b.teamName,
        courseTitle: b.courseTitle,
        sessionDate: b.sessionDate,
        sessionStartTime: b.sessionStartTime,
        sessionEndTime: b.sessionEndTime,
        teamMemberCount: b.teamMemberCount,
        payAmount: b.payAmount,
        status: b.status,
        contactName: b.contactName,
        contactPhone: b.contactPhone,
        workshopName: b.workshopName,
        remark: b.remark,
        materialPackageConfig: b.id === 'b004' ? [
          { name: '陶泥', quantity: 2, description: '每人2包优质陶泥' },
          { name: '工具套装', quantity: 1, description: '包含修坯刀、海绵、割泥线' },
          { name: '围裙', quantity: 8, description: '防污工作围裙' },
        ] : undefined,
      }));

    const storeIds = new Set(storeTeamBookings.map(b => b.id));
    const filteredMockBookings = mockTeamBookings.filter(b => !storeIds.has(b.id));

    const mappedStoreBookings: TeamBooking[] = storeTeamBookings.map(booking => {
      const course = getCourseById(booking.courseId);
      const session = sessions.find(s => s.id === booking.sessionId);
      const bookingData = booking as any;
      
      return {
        id: booking.id,
        orderNo: `BK${booking.id.slice(0, 8).toUpperCase()}`,
        teamName: booking.enterpriseName,
        courseTitle: bookingData.courseName || course?.title || '未知课程',
        sessionDate: session?.date || bookingData.sessionDate || bookingData.expectedDate || booking.createdAt.split('T')[0],
        sessionStartTime: session?.startTime || '09:00',
        sessionEndTime: session?.endTime || '11:00',
        teamMemberCount: booking.peopleCount,
        payAmount: booking.totalPrice,
        status: booking.status,
        contactName: bookingData.contactName || '联系人',
        contactPhone: bookingData.contactPhone || '联系电话',
        workshopName: bookingData.workshopName || course?.workshopName || '未知工坊',
        remark: booking.requirements,
        materialPackageConfig: booking.materialPackageConfig?.length > 0 
          ? booking.materialPackageConfig 
          : undefined,
      };
    });

    return [...mappedStoreBookings, ...filteredMockBookings].sort(
      (a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
    );
  }, [storeTeamBookings, getCourseById, sessions]);

  useEffect(() => {
    if (selectedBooking && (showDetailModal || showMaterialModal)) {
      const updatedBooking = teamBookings.find(b => b.id === selectedBooking.id);
      if (updatedBooking) {
        setSelectedBooking(updatedBooking);
        setMaterialItems(updatedBooking.materialPackageConfig || []);
      }
    }
  }, [teamBookings, selectedBooking?.id, showDetailModal, showMaterialModal]);

  const filteredBookings = useMemo(() => {
    return statusFilter === 'all' ? teamBookings : teamBookings.filter((b) => b.status === statusFilter);
  }, [teamBookings, statusFilter]);

  const handleViewDetail = (booking: TeamBooking) => {
    const currentBooking = teamBookings.find(b => b.id === booking.id) || booking;
    setSelectedBooking(currentBooking);
    setMaterialItems(currentBooking.materialPackageConfig || []);
    setShowDetailModal(true);
  };

  const confirm = (msg: string) => window.confirm(msg);
  
  const handleConfirmBooking = (id: string) => {
    if (confirm('确认预订？')) {
      updateStatus(id, 'confirmed');
      if (selectedBooking?.id === id) {
        const updated = teamBookings.find(b => b.id === id);
        if (updated) setSelectedBooking(updated);
      }
    }
  };
  
  const handleMarkComplete = (id: string) => {
    if (confirm('标记完成？')) {
      updateStatus(id, 'completed');
      if (selectedBooking?.id === id) {
        const updated = teamBookings.find(b => b.id === id);
        if (updated) setSelectedBooking(updated);
      }
    }
  };
  
  const handleConfigureMaterials = (b: TeamBooking) => {
    const currentBooking = teamBookings.find(booking => booking.id === b.id) || b;
    setSelectedBooking(currentBooking);
    setMaterialItems(currentBooking.materialPackageConfig || []);
    setShowMaterialModal(true);
  };
  
  const handleAddMaterial = () => {
    if (newMaterial.name.trim()) {
      setMaterialItems([...materialItems, { ...newMaterial }]);
      setNewMaterial({ name: '', quantity: 1, description: '' });
    }
  };
  
  const handleSaveMaterials = () => {
    if (selectedBooking) {
      updateMaterialPackage(selectedBooking.id, materialItems);
      setShowMaterialModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-sand-900 font-serif mb-2">团建专场管理</h1>
            <p className="text-sand-600">管理企业团建预订和材料包配置</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-sand-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-clay-500 bg-white"
                >
                  <option value="all">全部状态</option>
                  <option value="pending">待确认</option>
                  <option value="confirmed">已确认</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>
              <span className="text-sm text-sand-500">共 {filteredBookings.length} 条预订</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-sand-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">团队名称</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">课程</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">日期时间</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">人数</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">金额</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">状态</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-sand-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filteredBookings.map((booking) => {
                  const status = statusConfig[booking.status] || statusConfig.pending;
                  return (
                    <tr key={booking.id} className="hover:bg-sand-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-sand-900">{booking.teamName}</p>
                        <p className="text-xs text-sand-400">{booking.contactName} {booking.contactPhone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-sand-700">{booking.courseTitle}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-sand-900">{format(new Date(booking.sessionDate), 'yyyy-MM-dd')}</p>
                        <p className="text-xs text-sand-400">{booking.sessionStartTime} - {booking.sessionEndTime}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-sand-700">{booking.teamMemberCount}人</td>
                      <td className="px-6 py-4 text-sm font-medium text-sand-900">¥{booking.payAmount}</td>
                      <td className="px-6 py-4">
                        <Tag variant={status.variant as any}>{status.label}</Tag>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetail(booking)}><Eye size={16} /></Button>
                          {booking.status === 'pending' && (
                            <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleConfirmBooking(booking.id)}><CheckCircle size={16} /></Button>
                          )}
                          {(booking.status === 'confirmed' || booking.status === 'paid') && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleConfigureMaterials(booking)}><Package size={16} /></Button>
                              <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleMarkComplete(booking.id)}><Flag size={16} /></Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredBookings.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-sand-500">暂无团建预订</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="团建预订详情" size="lg">
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <h4 className="text-sm font-medium text-sand-500">团队信息</h4>
                    <div className="flex items-center gap-2"><Users size={14} className="text-sand-400" /><span>{selectedBooking.teamName}</span></div>
                    <div className="flex items-center gap-2"><Phone size={14} className="text-sand-400" /><span>{selectedBooking.contactName} {selectedBooking.contactPhone}</span></div>
                    <div className="flex items-center gap-2"><Users size={14} className="text-sand-400" /><span>{selectedBooking.teamMemberCount}人</span></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <h4 className="text-sm font-medium text-sand-500">课程信息</h4>
                    <p className="font-medium">{selectedBooking.courseTitle}</p>
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-sand-400" /><span className="text-sm">{selectedBooking.workshopName}</span></div>
                    <div className="flex items-center gap-2"><Calendar size={14} className="text-sand-400" /><span className="text-sm">{format(new Date(selectedBooking.sessionDate), 'MM-dd')} {selectedBooking.sessionStartTime}</span></div>
                  </CardContent>
                </Card>
              </div>
              <Card><CardContent className="p-4"><p className="text-sm text-sand-700">{selectedBooking.remark}</p></CardContent></Card>
              {materialItems.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-sand-500 mb-2">材料包配置</h4>
                    {materialItems.map((item, i) => (
                      <div key={i} className="flex justify-between py-1">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="text-sm text-sand-500">{item.description}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              <div className="flex justify-between pt-4 border-t">
                <span>金额：<span className="text-2xl font-bold text-clay-600">¥{selectedBooking.payAmount}</span></span>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setShowDetailModal(false)}>关闭</Button>
                  {selectedBooking.status === 'pending' && (
                    <Button onClick={() => handleConfirmBooking(selectedBooking.id)}><CheckCircle size={16} /> 确认</Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>

        <Modal isOpen={showMaterialModal} onClose={() => setShowMaterialModal(false)} title="配置材料包" size="lg">
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm text-sand-700 mb-1">材料名称</label>
                <input
                  type="text"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  placeholder="如：陶泥"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:ring-2 focus:ring-clay-500"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm text-sand-700 mb-1">数量</label>
                <input
                  type="number"
                  min="1"
                  value={newMaterial.quantity}
                  onChange={(e) => setNewMaterial({ ...newMaterial, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:ring-2 focus:ring-clay-500"
                />
              </div>
              <Button onClick={handleAddMaterial}><Plus size={18} /></Button>
            </div>
            <input
              type="text"
              value={newMaterial.description}
              onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
              placeholder="材料说明"
              className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:ring-2 focus:ring-clay-500"
            />
            <div className="space-y-2">
              {materialItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-sand-50 rounded-xl">
                  <div>
                    <p className="font-medium">{item.name} × {item.quantity}</p>
                    {item.description && <p className="text-sm text-sand-500">{item.description}</p>}
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setMaterialItems(materialItems.filter((_, idx) => idx !== i))}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              {materialItems.length === 0 && <div className="text-center py-8 text-sand-400">暂无材料配置</div>}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={() => setShowMaterialModal(false)}>取消</Button>
              <Button onClick={handleSaveMaterials}>保存</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
