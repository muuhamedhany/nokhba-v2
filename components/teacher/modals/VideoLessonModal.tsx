'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import type { VideoItem } from '@/types';
import { UploadSimple, FileVideo } from '@phosphor-icons/react';

interface VideoLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (video: Omit<VideoItem, 'id' | 'type'>) => void;
  initialData?: VideoItem;
}

export function VideoLessonModal({ isOpen, onClose, onSave, initialData }: VideoLessonModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [duration, setDuration] = useState(0); // in seconds
  
  // Upload vs Link state
  const [inputType, setInputType] = useState<'upload' | 'link'>('upload');

  // Mock file state
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setUrl(initialData?.url || '');
      setDuration(initialData?.duration || 0);
      
      if (initialData?.url) {
        if (initialData.url.startsWith('blob:')) {
          setInputType('upload');
          setFileName('فيديو_مسجل.mp4');
        } else {
          setInputType('link');
          setFileName('');
        }
      } else {
        setInputType('upload');
        setFileName('');
      }
    }
  }, [isOpen, initialData]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    // In a real app we'd upload and get URL. Here we just set a mock URL
    setUrl(URL.createObjectURL(file));
    // Mock duration
    setDuration(Math.floor(Math.random() * 1200) + 600); // 10-30 mins
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || (!url && !fileName)) return alert('الرجاء إدخال العنوان ورفع الفيديو');
    
    onSave({ title, url: url || 'mock_url', duration });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "تعديل الدرس" : "إضافة درس جديد"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        <Input 
          label="عنوان الدرس" 
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="مثال: الدرس الأول: مفهوم الدولة"
          required
        />

        <div className="flex flex-col gap-4">
          <div className="flex bg-black/5 p-1 rounded-xl w-fit mx-auto gap-1">
            <button
              type="button"
              onClick={() => setInputType('upload')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${inputType === 'upload' ? 'bg-white text-forest' : 'text-forest/50 hover:text-forest'}`}
            >
              رفع فيديو
            </button>
            <button
              type="button"
              onClick={() => setInputType('link')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${inputType === 'link' ? 'bg-white text-forest' : 'text-forest/50 hover:text-forest'}`}
            >
              رابط فيديو
            </button>
          </div>
          
          {inputType === 'upload' ? (
            <div 
              className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer ${fileName ? 'border-gold bg-gold/5' : 'border-black/10 bg-black/5 hover:border-gold/50'}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('videoUpload')?.click()}
            >
              <input 
                id="videoUpload" 
                type="file" 
                accept="video/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
              
              {fileName ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-forest">
                    <FileVideo size={32} weight="duotone" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-forest">{fileName}</p>
                    <p className="text-sm text-forest/50">اضغط أو اسحب لتغيير الملف</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-forest/50">
                    <UploadSimple size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-forest">اضغط هنا لرفع الفيديو</p>
                    <p className="text-sm text-forest/50">أو اسحب وأفلت الملف هنا (MP4, WebM)</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Input 
                label="رابط الفيديو (يوتيوب أو فيميو)" 
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                dir="ltr"
                className="text-start"
              />
              <Input 
                label="مدة الفيديو (بالدقائق)" 
                type="number"
                placeholder="مثال: 45"
                value={duration ? Math.floor(duration / 60) : ''}
                onChange={e => setDuration(Number(e.target.value) * 60)}
                dir="ltr"
              />
            </div>
          )}
        </div>

        {duration > 0 && (
          <div className="text-sm text-forest/70 text-end">
            مدة الفيديو: {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-black/5">
          <Button variant="ghost" onClick={onClose} type="button">إلغاء</Button>
          <Button type="submit">حفظ الدرس</Button>
        </div>

      </form>
    </Modal>
  );
}
