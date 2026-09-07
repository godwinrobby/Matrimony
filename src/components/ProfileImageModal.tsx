import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Camera, Upload, Link, Check, Sparkles, RefreshCw, 
  Image as ImageIcon, UserCheck, AlertCircle 
} from 'lucide-react';
import { Profile } from '../types';

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Profile;
  onUpdateUser: (updatedUser: Profile) => void;
  onAddNotification: (msg: string, type: 'success' | 'info' | 'heart') => void;
}

// Preset matrimony profile avatar choices filtered by traditional elegance
const GROOM_PRESETS = [
  {
    id: 'g1',
    label: 'Traditional Silk Kurta',
    url: 'https://images.unsplash.com/photo-1605135738135-7f982ca32f97?auto=format&fit=crop&q=80&w=400&h=400'
  },
  {
    id: 'g2',
    label: 'Modern Professional',
    url: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400&h=400'
  },
  {
    id: 'g3',
    label: 'Vedic Ceremonial',
    url: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=400&h=400'
  },
  {
    id: 'g4',
    label: 'Classic Portrait',
    url: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=400&h=400'
  },
  {
    id: 'g5',
    label: 'Royal Ethnic Attire',
    url: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=400&h=400'
  }
];

const BRIDE_PRESETS = [
  {
    id: 'b1',
    label: 'Kanjeevaram Silk Saree',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400&h=400'
  },
  {
    id: 'b2',
    label: 'Traditional Temple Jewelry',
    url: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=400&h=400'
  },
  {
    id: 'b3',
    label: 'Graceful Traditional',
    url: 'https://images.unsplash.com/photo-1618015358954-115ef1ed6515?auto=format&fit=crop&q=80&w=400&h=400'
  },
  {
    id: 'b4',
    label: 'Modern Professional Bride',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=400&h=400'
  },
  {
    id: 'b5',
    label: 'Festive Festive Saree',
    url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=400&h=400'
  }
];

export default function ProfileImageModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onAddNotification
}: ProfileImageModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [selectedImage, setSelectedImage] = useState<string>(currentUser.image);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const presets = currentUser.gender === 'Bride' ? BRIDE_PRESETS : GROOM_PRESETS;

  // Handle local file upload via FileReader
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onAddNotification('Please select a valid image file (JPG, PNG, WebP).', 'info');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      onAddNotification('Image size is too large. Please select an image under 8MB.', 'info');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
        onAddNotification('Image loaded! Click "Save Profile Photo" to apply.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handle URL submit
  const handleApplyUrl = () => {
    setUrlError(null);
    if (!customUrlInput.trim()) {
      setUrlError('Please enter a valid image URL');
      return;
    }

    if (!customUrlInput.match(/^https?:\/\/.+/i)) {
      setUrlError('URL must start with http:// or https://');
      return;
    }

    setSelectedImage(customUrlInput.trim());
    onAddNotification('Custom image URL applied to preview!', 'info');
  };

  // Save changes
  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      const updatedUser: Profile = {
        ...currentUser,
        image: selectedImage
      };

      onUpdateUser(updatedUser);
      setIsSaving(false);
      onAddNotification('Profile picture updated successfully on your dashboard!', 'success');
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 font-sans"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-50 via-pink-50 to-orange-50 border-b border-orange-100/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-xl shadow-xs">
                <Camera size={18} />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-gray-900 text-base">Update Profile Photo</h3>
                <p className="text-[11px] text-gray-500 font-sans">Choose or upload your new matrimonial picture</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white/80 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Live Preview Bar */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-orange-50/30 border border-gray-100">
              <div className="relative shrink-0">
                <img
                  src={selectedImage}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md shadow-orange-500/10 ring-2 ring-orange-400/30"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback on broken image load
                    (e.target as HTMLImageElement).src = currentUser.image;
                    onAddNotification('Image link could not be loaded. Reset to previous photo.', 'info');
                  }}
                />
                <span className="absolute bottom-0 right-0 p-1 bg-emerald-500 text-white rounded-full border-2 border-white text-[9px] font-bold">
                  <Check size={10} />
                </span>
              </div>
              <div className="text-left space-y-1">
                <span className="text-xs font-bold text-orange-600 font-poppins flex items-center gap-1">
                  <Sparkles size={12} /> Photo Preview
                </span>
                <p className="text-xs font-semibold text-gray-800">{currentUser.name}</p>
                <p className="text-[11px] text-gray-500">
                  This photo will be displayed across your profile, dashboard, and AI match recommendations.
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-gray-100/80 p-1 rounded-2xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'upload'
                    ? 'bg-white text-orange-600 shadow-xs font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Upload size={14} />
                <span>Upload Device File</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'presets'
                    ? 'bg-white text-orange-600 shadow-xs font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <ImageIcon size={14} />
                <span>Sample Gallery</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'url'
                    ? 'bg-white text-orange-600 shadow-xs font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Link size={14} />
                <span>Image Link</span>
              </button>
            </div>

            {/* TAB CONTENT: UPLOAD */}
            {activeTab === 'upload' && (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-orange-500 bg-orange-50/50 scale-[1.01]'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/20'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-100 text-[#F97316] flex items-center justify-center mb-3 shadow-xs">
                    <Upload size={22} />
                  </div>
                  <p className="text-xs font-bold text-gray-800 font-poppins">
                    Click to browse or drop your photo here
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Supports PNG, JPG, JPEG or WebP (max 8MB)
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PRESETS */}
            {activeTab === 'presets' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 text-left font-medium">
                  Select a refined matrimony profile portrait ({currentUser.gender === 'Bride' ? 'Bride Collection' : 'Groom Collection'}):
                </p>
                <div className="grid grid-cols-5 gap-3">
                  {presets.map((preset) => {
                    const isSelected = selectedImage === preset.url;
                    return (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => setSelectedImage(preset.url)}
                        className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group ${
                          isSelected
                            ? 'border-orange-500 ring-2 ring-orange-500/20 scale-105 shadow-md'
                            : 'border-transparent hover:border-orange-200 opacity-80 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                            <div className="p-1 bg-orange-500 text-white rounded-full shadow-xs">
                              <Check size={12} />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: URL */}
            {activeTab === 'url' && (
              <div className="space-y-3 text-left">
                <label className="block text-xs font-semibold text-gray-700">
                  Paste Direct Web Image URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => {
                      setCustomUrlInput(e.target.value);
                      setUrlError(null);
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-sans"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-4 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Preview
                  </button>
                </div>
                {urlError && (
                  <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {urlError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setSelectedImage(currentUser.image);
                onAddNotification('Reset preview to original profile photo.', 'info');
              }}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer flex items-center gap-1"
            >
              <RefreshCw size={12} /> Reset
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 hover:opacity-95 active:scale-98 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isSaving ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <UserCheck size={14} />
                )}
                <span>Save Profile Photo</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
