import React, { useRef, useState } from 'react';
import { Button } from './button';
import { Camera, X, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoInputProps {
  onPhotosChange: (photos: string[]) => void;
  photos: string[];
  maxPhotos?: number;
  className?: string;
}

export const PhotoInput: React.FC<PhotoInputProps> = ({
  onPhotosChange,
  photos,
  maxPhotos = 5,
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto = e.target?.result as string;
          if (photos.length < maxPhotos) {
            onPhotosChange([...photos, newPhoto]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        {photos.map((photo, index) => (
          <div key={index} className="relative">
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg border-2 border-border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={() => removePhoto(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      
      {photos.length < maxPhotos && (
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
          >
            <Camera className="h-4 w-4 mr-2" />
            Añadir Fotos ({photos.length}/{maxPhotos})
          </Button>
        </div>
      )}
    </div>
  );
};