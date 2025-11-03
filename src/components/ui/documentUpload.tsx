import { CheckCircle2, FileText, Upload, X } from 'lucide-react';
import React, { useState } from 'react';

import { cn } from '@/libs/utils/utils';

import { Button } from '@/components/ui/button';

export interface DocumentUploadItem {
  id: string;
  label: string;
  required?: boolean;
}

interface DocumentUploadsProps {
  docs: DocumentUploadItem[];
  filesByDoc: Record<string, File[]>;
  onFilesChange: (docId: string, files: File[]) => void;
  isLoading?: boolean;
  className?: string;
  maxFileSizeMB?: number; // default 10MB
  allowedMimeTypes?: string[]; // default: jpg, png, pdf, doc, docx
}

export default function DocumentUploads({
  docs,
  filesByDoc,
  onFilesChange,
  isLoading,
  className,
  maxFileSizeMB = 10,
  allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
}: DocumentUploadsProps) {
  const [dragActiveDoc, setDragActiveDoc] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileSelect = (docId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const maxSize = maxFileSizeMB * 1024 * 1024;

    const validFiles = fileArray.filter((file) => {
      if (file.size > maxSize) {
        alert(
          `File "${file.name}" is too large. Maximum size is ${maxFileSizeMB}MB.`,
        );
        return false;
      }
      if (!allowedMimeTypes.includes(file.type)) {
        alert(`File "${file.name}" has an unsupported format.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const next = [...(filesByDoc[docId] || []), ...validFiles];
    onFilesChange(docId, next);
  };

  const handleRemoveFile = (docId: string, index: number) => {
    const next = [...(filesByDoc[docId] || [])];
    next.splice(index, 1);
    onFilesChange(docId, next);
  };

  const handleDragEnter = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveDoc(docId);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragActiveDoc(null);
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveDoc(null);
    handleFileSelect(docId, e.dataTransfer.files);
  };

  const accept = 'image/jpeg,image/jpg,image/png,application/pdf,.doc,.docx';

  return (
    <div className={cn('space-y-4', className)}>
      {docs.map((doc) => {
        const hasFiles = (filesByDoc[doc.id]?.length || 0) > 0;
        const isDragging = dragActiveDoc === doc.id;

        return (
          <div key={doc.id} className='space-y-3'>
            {/* Drop area */}
            <div
              onDragEnter={(e) => handleDragEnter(e, doc.id)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, doc.id)}
              className={cn(
                'relative rounded-xl border-2 border-dashed transition-all duration-200',
                isDragging
                  ? 'scale-[1.02] border-brand-blue bg-brand-blue/10'
                  : hasFiles
                    ? 'border-brand-green bg-brand-green/5'
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50',
              )}
            >
              <input
                type='file'
                id={`file-upload-${doc.id}`}
                multiple
                accept={accept}
                onChange={(e) => handleFileSelect(doc.id, e.target.files)}
                className='hidden'
                disabled={!!isLoading}
              />

              <label
                htmlFor={`file-upload-${doc.id}`}
                className={cn(
                  'flex cursor-pointer items-center gap-4 p-4',
                  isLoading && 'cursor-not-allowed opacity-50',
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'flex-shrink-0 rounded-lg p-3 transition-colors',
                    isDragging
                      ? 'bg-brand-blue text-white'
                      : hasFiles
                        ? 'bg-brand-green text-white'
                        : 'bg-gray-100 text-gray-600',
                  )}
                >
                  {hasFiles ? (
                    <CheckCircle2 className='size-6' />
                  ) : (
                    <Upload className='size-6' />
                  )}
                </div>

                {/* Text */}
                <div className='min-w-0 flex-1'>
                  <p className='m-0 mb-1 font-semibold text-gray-800'>
                    {doc.label}
                  </p>
                  <p className='m-0 text-sm text-gray-600'>
                    {isDragging ? (
                      <span className='font-medium text-brand-blue'>
                        Drop files here
                      </span>
                    ) : hasFiles ? (
                      <span className='font-medium text-brand-green'>
                        {filesByDoc[doc.id].length} file(s) uploaded
                      </span>
                    ) : (
                      'Drag and drop files or click to browse'
                    )}
                  </p>
                </div>

                {/* Browse/Add button */}
                {!isDragging && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className={cn(
                      'inline-flex flex-shrink-0 items-center rounded-lg',
                      hasFiles
                        ? 'border-brand-green text-brand-green hover:bg-brand-green/10'
                        : 'border-brand-blue text-brand-blue hover:bg-brand-blue/10',
                    )}
                    disabled={!!isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(`file-upload-${doc.id}`)?.click();
                    }}
                  >
                    <Upload className='mr-2 size-4' />
                    {hasFiles ? 'Add More' : 'Browse'}
                  </Button>
                )}
              </label>
            </div>

            {/* Files list */}
            {hasFiles && (
              <div className='space-y-2 pl-4'>
                {filesByDoc[doc.id].map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className='flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3'
                  >
                    <div className='flex min-w-0 flex-1 items-center gap-3'>
                      <FileText className='size-5 flex-shrink-0 text-brand-blue' />
                      <div className='min-w-0 flex-1'>
                        <p className='m-0 truncate text-sm font-medium text-gray-800'>
                          {file.name}
                        </p>
                        <p className='m-0 text-xs text-gray-600'>
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type='button'
                      onClick={() => handleRemoveFile(doc.id, index)}
                      className='flex-shrink-0 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50'
                      disabled={!!isLoading}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className='size-4' />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
