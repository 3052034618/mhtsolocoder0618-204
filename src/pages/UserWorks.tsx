import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Share2,
  Edit3,
  Image,
  Calendar,
  ChevronLeft,
  X,
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useWorkCardStore } from '@/store/useWorkCardStore';
import type { WorkCard } from '@/types';
import Card, { CardContent } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import WorkCardEditor from '@/components/workcard/WorkCardEditor';
import EmptyState from '@/components/common/EmptyState';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function UserWorks() {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { getWorkCardsByUser, deleteWorkCard, setCurrentImage } = useWorkCardStore();
  const [showEditor, setShowEditor] = useState(false);
  const [selectedWork, setSelectedWork] = useState<WorkCard | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const works = currentUser ? getWorkCardsByUser(currentUser.id) : [];

  const handleEdit = (work: WorkCard) => {
    setSelectedWork(work);
    setCurrentImage(work.originalImage);
    setShowEditor(true);
  };

  const handleUploadNew = () => {
    setSelectedWork(null);
    setCurrentImage(null);
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCurrentImage(result);
        setShowEditor(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = (work: WorkCard) => {
    const shareUrl = `${window.location.origin}/works/${work.id}`;
    navigator.clipboard.writeText(shareUrl);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个作品吗？')) {
      deleteWorkCard(id);
    }
  };

  const closeEditor = () => {
    setShowEditor(false);
    setSelectedWork(null);
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/user')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-sand-100 transition-colors"
            >
              <ChevronLeft size={20} className="text-sand-700" />
            </button>
            <h1 className="text-2xl font-bold text-sand-900">我的作品</h1>
            <span className="text-sand-500">({works.length} 个作品)</span>
          </div>
          <Button onClick={handleUploadNew}>
            <Plus size={18} />
            上传新作品
          </Button>
        </div>

        {works.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={Image}
                title="还没有作品"
                description="上传你的第一个手工作品，记录创作过程中的美好瞬间"
                action={
                  <Button onClick={handleUploadNew}>
                    <Plus size={18} />
                    上传作品
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work) => (
              <Card key={work.id} hoverable className="group">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={work.processedImage || work.originalImage}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => handleEdit(work)}
                      >
                        <Edit3 size={14} />
                        编辑
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => handleShare(work)}
                      >
                        <Share2 size={14} />
                        分享
                      </Button>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(work.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
                <CardContent className="py-4">
                  <h3 className="font-semibold text-sand-900 mb-2 truncate">{work.title}</h3>
                  <div className="space-y-1 text-sm text-sand-500">
                    <div className="flex items-center gap-2">
                      <Image size={14} />
                      <span className="truncate">{work.courseName || '未关联课程'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{format(new Date(work.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Modal
          isOpen={showEditor}
          onClose={closeEditor}
          title={selectedWork ? '编辑作品' : '创建作品卡'}
          size="lg"
        >
          <WorkCardEditor />
        </Modal>

        {shareSuccess && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-forest-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
            <Share2 size={18} />
            分享链接已复制到剪贴板
          </div>
        )}
      </div>
    </div>
  );
}
