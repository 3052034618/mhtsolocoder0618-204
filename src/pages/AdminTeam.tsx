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
  Clock,
  FileText,
} from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { useTeamBookingStore } from '@/store/useTeamBookingStore';
import mockBookings from '@/data/mock/bookings.json';
import { format } from 'date-fns';
import { MaterialPackageItem, TeamBooking as TeamBookingType } from '@/types';

interface TeamBookingDisplay {
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
  expectedDate?: string;
  teacherNotes?: string;
  materialPackageConfig?: MaterialPackageItem[];
  isFromStore?: boolean;
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
  const { teamBookings: storeTeamBookings, confirmSchedule, updateStatus, updateMaterialPackage } = useTeamBookingStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<TeamBookingDisplay | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [materialItems, setMaterialItems] = useState<MaterialPackageItem[]>([]);
  const [newMaterial, setNewMaterial] = useState({ name: '', quantity: 1, description: '' });
  const [confirmForm, setConfirmForm] = useState({
    confirmedDate: '',
    confirmedStartTime: '09:00',
    confirmedEndTime: '11:00',
    teacherNotes: '',
  });

  useEffect(() => {
    loadMockData();
  }, [loadMockData]);

  const teamBookings = useMemo((): TeamBookingDisplay[] => {
    const mockTeamBookings: TeamBookingDisplay[] = mockBookings
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

    const mappedStoreBookings: TeamBookingDisplay[] = storeTeamBookings.map(booking => {
      const course = getCourseById(booking.courseId);
      const bookingData = booking as any;
      const displayDate = booking.confirmedDate || bookingData.expectedDate || booking.createdAt.split('T')[0];
      const displayStartTime = booking.confirmedStartTime || '09:00';
      const displayEndTime = booking.confirmedEndTime || '11:00';

      return {
        id: booking.id,
        orderNo: `BK${booking.id.slice(0, 8).toUpperCase()}`,
        teamName: booking.enterpriseName,
        courseTitle: bookingData.courseName || course?.title || '未知课程',
        sessionDate: displayDate,
        sessionStartTime: displayStartTime,
        sessionEndTime: displayEndTime,
        teamMemberCount: booking.peopleCount,
        payAmount: booking.totalPrice,
        status: booking.status,
        contactName: bookingData.contactName || '联系人',
        contactPhone: bookingData.contactPhone || '联系电话',
        workshopName: bookingData.workshopName || course?.workshopName || '未知工坊',
        remark: booking.requirements,
        expectedDate: bookingData.expectedDate,
        teacherNotes: booking.teacherNotes,
        materialPackageConfig: booking.materialPackageConfig?.length > 0
          ? booking.materialPackageConfig
          : undefined,
        isFromStore: true,
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

  const handleViewDetail = (booking: TeamBookingDisplay) => {
    const currentBooking = teamBookings.find(b => b.id === booking.id) || booking;
    setSelectedBooking(currentBooking);
    setMaterialItems(currentBooking.materialPackageConfig || []);
    setShowDetailModal(true);
  };

  const handleOpenConfirm = (booking: TeamBookingDisplay) => {
    const currentBooking = teamBookings.find(b => b.id === booking.id) || booking;
    setSelectedBooking(currentBooking);
    setConfirmForm({
      confirmedDate: currentBooking.expectedDate || currentBooking.sessionDate || new Date().toISOString().split('T')[0],
      confirmedStartTime: '09:00',
      confirmedEndTime: '11:00',
      teacherNotes: '',
    });
    setShowConfirmModal(true);
  };

  const handleConfirmSchedule = () => {
    if (!selectedBooking || !confirmForm.confirmedDate) return;
    confirmSchedule(selectedBooking.id, {
      confirmedDate: confirmForm.confirmedDate,
      confirmedStartTime: confirmForm.confirmedStartTime,
      confirmedEndTime: confirmForm.confirmedEndTime,
      teacherNotes: confirmForm.teacherNotes,
    });
    setShowConfirmModal(false);
    setShowDetailModal(false);
  };

  const handleMarkComplete = (id: string) => {
    if (window.confirm('标记完成？')) {
      updateStatus(id, 'completed');
    }
  };

  const handleConfigureMaterials = (b: TeamBookingDisplay) => {
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
            <p className="text-sand-600">管理企业团建预订、排期确认和材料包配置</p>
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
                            <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleOpenConfirm(booking)}><CheckCircle size={16} /></Button>
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
                    <div className="flex items-center gap-2"><Calendar size={14} className="text-sand-400" /><span className="text-sm">{format(new Date(selectedBooking.sessionDate), 'yyyy-MM-dd')} {selectedBooking.sessionStartTime}-{selectedBooking.sessionEndTime}</span></div>
                    {selectedBooking.expectedDate && selectedBooking.expectedDate !== selectedBooking.sessionDate && (
                      <div className="flex items-center gap-2 text-xs text-sand-400"><Calendar size={12} /><span>期望日期: {selectedBooking.expectedDate}</span></div>
                    )}
                  </CardContent>
                </Card>
              </div>
              {selectedBooking.teacherNotes && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={14} className="text-sand-400" />
                      <h4 className="text-sm font-medium text-sand-500">老师备注</h4>
                    </div>
                    <p className="text-sm text-sand-700">{selectedBooking.teacherNotes}</p>
                  </CardContent>
                </Card>
              )}
              {selectedBooking.remark && (
                <Card><CardContent className="p-4"><p className="text-sm text-sand-700">{selectedBooking.remark}</p></CardContent></Card>
              )}
              {selectedBooking.materialPackageConfig && selectedBooking.materialPackageConfig.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-sand-500 mb-2">材料包配置</h4>
                    {selectedBooking.materialPackageConfig.map((item, i) => (
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
                    <Button onClick={() => handleOpenConfirm(selectedBooking)}><CheckCircle size={16} /> 排期确认</Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>

        <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="排期确认" size="lg">
          {selectedBooking && (
            <div className="space-y-5">
              <div className="bg-sand-50 rounded-2xl p-4">
                <h4 className="font-semibold text-sand-900 mb-2">{selectedBooking.teamName}</h4>
                <p className="text-sm text-sand-600">{selectedBooking.courseTitle} · {selectedBooking.teamMemberCount}人 · ¥{selectedBooking.payAmount}</p>
                {selectedBooking.expectedDate && (
                  <p className="text-sm text-sand-500 mt-1">期望日期：{selectedBooking.expectedDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-sand-700 mb-2">
                  <Calendar size={14} className="inline mr-1" />
                  上课日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={confirmForm.confirmedDate}
                  onChange={(e) => setConfirmForm({ ...confirmForm, confirmedDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">
                    <Clock size={14} className="inline mr-1" />
                    开始时间
                  </label>
                  <input
                    type="time"
                    value={confirmForm.confirmedStartTime}
                    onChange={(e) => setConfirmForm({ ...confirmForm, confirmedStartTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">
                    <Clock size={14} className="inline mr-1" />
                    结束时间
                  </label>
                  <input
                    type="time"
                    value={confirmForm.confirmedEndTime}
                    onChange={(e) => setConfirmForm({ ...confirmForm, confirmedEndTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sand-700 mb-2">
                  <FileText size={14} className="inline mr-1" />
                  老师备注
                </label>
                <textarea
                  rows={3}
                  value={confirmForm.teacherNotes}
                  onChange={(e) => setConfirmForm({ ...confirmForm, teacherNotes: e.target.value })}
                  placeholder="如：需要提前准备陶泥、安排两位老师..."
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>取消</Button>
                <Button onClick={handleConfirmSchedule} disabled={!confirmForm.confirmedDate}>
                  <CheckCircle size={16} /> 确认排期
                </Button>
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
