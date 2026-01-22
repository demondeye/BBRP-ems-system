import { useState, useEffect } from 'react';
import { uploadToCloudinary, deleteFromCloudinary, getCloudinaryUrl } from '../cloudinary';

export default function UserSettings({ user, settings, onSave, onClose }) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [originalSettings, setOriginalSettings] = useState(settings); // Store original
  const [customImageFile, setCustomImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [editingImageUrl, setEditingImageUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Update original settings when settings prop changes
  useEffect(() => {
    // Infer backgroundFit if not set but backgroundSize exists
    let updatedSettings = { ...settings };
    if (settings.backgroundSize && !settings.backgroundFit) {
      // Infer the fit based on backgroundSize
      if (settings.backgroundSize === 'cover') {
        updatedSettings.backgroundFit = 'Fill';
      } else if (settings.backgroundSize === 'contain') {
        updatedSettings.backgroundFit = 'Fit';
      } else if (settings.backgroundSize === '100% 100%') {
        updatedSettings.backgroundFit = 'Stretch';
      } else if (settings.backgroundSize === 'auto' && settings.backgroundRepeat === 'repeat') {
        updatedSettings.backgroundFit = 'Tile';
      } else if (settings.backgroundSize === 'auto') {
        updatedSettings.backgroundFit = 'Center';
      } else {
        updatedSettings.backgroundFit = 'Stretch'; // Default
      }
    }
    
    setOriginalSettings(updatedSettings);
    setLocalSettings(updatedSettings);
  }, [settings]);

  // Apply preview settings dynamically to parent (preview mode)
  useEffect(() => {
    // Create a temporary preview by dispatching a custom event
    const event = new CustomEvent('previewSettings', { detail: localSettings });
    window.dispatchEvent(event);
  }, [localSettings]);

  const backgrounds = [
    { name: 'Blue Purple', value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)' },
    { name: 'Ocean Blue', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Forest', value: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)' },
    { name: 'Dark Night', value: 'linear-gradient(135deg, #000428 0%, #004e92 100%)' },
    { name: 'Pink Dream', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    // Check file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      setUploadError('File size must be under 2MB');
      return;
    }

    setUploadingImage(true);
    setUploadError('');

    try {
      // Create sanitized username (replace spaces and special chars)
      const sanitizedUsername = user.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Use public ID without extension - Cloudinary adds it automatically
      const publicId = `backgrounds/${sanitizedUsername}.editing`;
      
      // Delete old editing file first (if it exists)
      try {
        await deleteFromCloudinary(publicId);
        console.log('Old editing image deleted');
      } catch (err) {
        // It's okay if it doesn't exist
        console.log('No old editing image to delete');
      }
      
      // Convert image to png blob if needed
      let uploadFile = file;
      if (!file.type.includes('png')) {
        // Convert to png using canvas
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        await new Promise((resolve, reject) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                uploadFile = new File([blob], `${sanitizedUsername}.editing.png`, { type: 'image/png' });
                resolve();
              } else {
                reject(new Error('Failed to convert image'));
              }
            }, 'image/png');
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      }
      
      // Upload to Cloudinary as editing image
      const result = await uploadToCloudinary(uploadFile, publicId, maxSize);
      
      console.log('Editing image uploaded:', publicId, result.secure_url);
      
      // Set the editing image URL
      setEditingImageUrl(result.secure_url);
      
      // Create preview with the uploaded image
      const imageUrl = result.secure_url;
      const backgroundValue = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${imageUrl})`;
      
      // Use last selected fit option if it exists, otherwise use Stretch as default
      const lastFit = localSettings.backgroundFit || 'Stretch';
      let fitSize, fitRepeat, fitPosition;
      
      // Apply the fit settings based on last used or default
      switch(lastFit) {
        case 'Fill':
          fitSize = 'cover';
          fitRepeat = 'no-repeat';
          fitPosition = 'center';
          break;
        case 'Fit':
          fitSize = 'contain';
          fitRepeat = 'no-repeat';
          fitPosition = 'center';
          break;
        case 'Stretch':
          fitSize = '100% 100%';
          fitRepeat = 'no-repeat';
          fitPosition = 'center';
          break;
        case 'Tile':
          fitSize = 'auto';
          fitRepeat = 'repeat';
          fitPosition = 'center';
          break;
        case 'Center':
          fitSize = 'auto';
          fitRepeat = 'no-repeat';
          fitPosition = 'center';
          break;
        case 'Span':
          fitSize = 'cover';
          fitRepeat = 'no-repeat';
          fitPosition = 'center';
          break;
        default:
          // Stretch as default
          fitSize = '100% 100%';
          fitRepeat = 'no-repeat';
          fitPosition = 'center';
      }
      
      setLocalSettings({ 
        ...localSettings, 
        background: backgroundValue,
        backgroundSize: fitSize,
        backgroundPosition: fitPosition,
        backgroundRepeat: fitRepeat,
        backgroundFit: lastFit,
        cloudinaryImageUrl: imageUrl
      });
      
      setCustomImageFile(file.name);
      setUploadingImage(false);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload image');
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true); // Start saving
    
    // If there's an editing image, apply it as final
    if (editingImageUrl && user?.uid) {
      try {
        // Create sanitized username
        const sanitizedUsername = user.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Use public ID without extension
        const publicId = `backgrounds/${sanitizedUsername}.final`;
        
        // Delete old final file first (if it exists)
        try {
          await deleteFromCloudinary(publicId);
          console.log('Old final image deleted');
        } catch (err) {
          console.log('No old final image to delete');
        }
        
        // Re-upload the editing image as final
        const response = await fetch(editingImageUrl);
        const blob = await response.blob();
        const file = new File([blob], `${sanitizedUsername}.final.png`, { type: 'image/png' });
        
        // Upload as final
        const result = await uploadToCloudinary(file, publicId);
        
        console.log('Final image saved:', publicId, result.secure_url);
        
        // Update settings with final image URL AND backgroundFit
        const finalBackgroundValue = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${result.secure_url})`;
        const updatedSettings = {
          ...localSettings,
          background: finalBackgroundValue,
          cloudinaryImageUrl: result.secure_url,
          cloudinaryPublicId: publicId,
          // Save the fit settings explicitly
          backgroundSize: localSettings.backgroundSize,
          backgroundPosition: localSettings.backgroundPosition,
          backgroundRepeat: localSettings.backgroundRepeat,
          backgroundFit: localSettings.backgroundFit
        };
        
        // Delete editing image
        try {
          await deleteFromCloudinary(`backgrounds/${sanitizedUsername}.editing`);
          console.log('Editing image deleted');
        } catch (err) {
          console.log('Could not delete editing image:', err);
        }
        
        // Save the changes permanently
        onSave(updatedSettings);
        onClose();
      } catch (error) {
        console.error('Error applying image:', error);
        setUploadError('Failed to apply image. Please try again.');
        setIsSaving(false); // Stop saving on error
      }
    } else {
      // No image upload, just save settings
      onSave(localSettings);
      onClose();
    }
  };

  const handleCancel = async () => {
    // Delete editing image if it exists
    if (editingImageUrl && user?.fullName) {
      try {
        const sanitizedUsername = user.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        await deleteFromCloudinary(`backgrounds/${sanitizedUsername}.editing`);
        console.log('Editing image deleted on cancel');
      } catch (error) {
        console.log('Could not delete editing image:', error);
      }
    }
    // Just close - Desktop will handle clearing preview
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#2d2d2d] rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#1a1a1a] border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <div className="text-white font-semibold">{user.fullName}</div>
              <div className="text-white/60 text-sm">{user.email}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Account Information */}
            <div>
              <h3 className="text-white font-semibold mb-3">Account Information</h3>
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Full Name</span>
                  <span className="text-white text-sm font-medium">{user.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Rank</span>
                  <span className="text-white text-sm font-medium">{user.rank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Unit</span>
                  <span className="text-white text-sm font-medium">{user.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Division</span>
                  <span className="text-white text-sm font-medium">{user.division}</span>
                </div>
              </div>
            </div>

            {/* Background Selection */}
            <div>
              <h3 className="text-white font-semibold mb-3">Desktop Background</h3>
              
              {/* Custom Image Upload */}
              <div className="mb-3">
                <label className="block">
                  <div className={`bg-white/5 hover:bg-white/10 border-2 border-dashed border-white/20 rounded-lg p-4 text-center transition-colors ${uploadingImage ? 'cursor-wait opacity-50' : 'cursor-pointer'}`}>
                    <svg className="w-8 h-8 text-white/50 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="text-white text-sm font-medium">
                      {uploadingImage ? 'Uploading...' : 'Upload Custom Image'}
                    </div>
                    <div className="text-white/50 text-xs mt-1">
                      {uploadingImage 
                        ? 'Please wait...'
                        : customImageFile 
                          ? `${customImageFile} (Max 2MB, 30% opacity applied)` 
                          : 'Click to browse (Max 2MB, 30% opacity applied)'}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
                
                {/* Upload Error */}
                {uploadError && (
                  <div className="mt-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-3 py-2 text-xs">
                    {uploadError}
                  </div>
                )}
              </div>

              {/* Background Fit Options - Only show if custom image */}
              {localSettings.backgroundSize && (
                <div className="mb-3">
                  <div className="text-white/70 text-xs mb-2">Choose a fit</div>
                  <div className="flex gap-2">
                    {['Fill', 'Fit', 'Stretch', 'Tile', 'Center', 'Span'].map((fit) => {
                      const fitValue = fit === 'Fill' ? 'cover' : fit === 'Fit' ? 'contain' : fit === 'Stretch' ? '100% 100%' : fit === 'Tile' ? 'auto' : fit === 'Center' ? 'auto' : 'cover';
                      const repeatValue = fit === 'Tile' ? 'repeat' : 'no-repeat';
                      const positionValue = fit === 'Center' ? 'center' : 'center';
                      
                      return (
                        <button
                          key={fit}
                          className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${
                            localSettings.backgroundFit === fit
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/5 text-white/70 hover:bg-white/10'
                          }`}
                          onClick={() => setLocalSettings({
                            ...localSettings,
                            backgroundSize: fitValue,
                            backgroundRepeat: repeatValue,
                            backgroundPosition: positionValue,
                            backgroundFit: fit
                          })}
                        >
                          {fit}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Preset Backgrounds */}
              <div className="grid grid-cols-3 gap-3">
                {backgrounds.map((bg, idx) => (
                  <button
                    key={idx}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      localSettings.background === bg.value && !localSettings.backgroundSize
                        ? 'border-blue-500 ring-2 ring-blue-500/50'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ background: bg.value }}
                    onClick={() => setLocalSettings({ 
                      ...localSettings, 
                      background: bg.value,
                      backgroundSize: undefined,
                      backgroundPosition: undefined,
                      backgroundRepeat: undefined,
                      backgroundFit: undefined
                    })}
                  >
                    <div className="w-full h-full flex items-end p-2">
                      <span className="text-white text-xs font-medium drop-shadow-lg">
                        {bg.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Server Information */}
            <div>
              <h3 className="text-white font-semibold mb-3">Server Information</h3>
              <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-white text-sm font-medium">Bluebird RP</div>
                    <div className="text-white/40 text-xs">Community Server</div>
                  </div>
                </div>
                <a 
                  href="https://discord.gg/bluebird" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                >
                  View Discord
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#1a1a1a] border-t border-white/10 p-4 flex items-center justify-end gap-2">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white text-sm font-medium ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium flex items-center gap-2 ${isSaving ? 'opacity-75 cursor-wait' : ''}`}
          >
            {isSaving && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
