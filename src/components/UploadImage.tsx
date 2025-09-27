"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera, Loader2, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormSetValue,
} from "react-hook-form";
import { cn } from "@/lib/utils";

interface UploadImageProps<T extends FieldValues> {
  currentImage: string;
  altImage: string;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
}

const UploadImage = <T extends FieldValues>({
  currentImage,
  altImage,
  setValue,
  errors,
  name,
}: UploadImageProps<T>) => {
  const [selectedImage, setSelectedImage] = useState(currentImage);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const inputId = `${name}-upload`;

  const simulateUpload = (fileSize: number) => {
    return new Promise<void>((resolve) => {
      const totalTime = Math.min(5000, fileSize / 50);
      const intervalTime = 100;
      let elapsed = 0;

      const interval = setInterval(() => {
        elapsed += intervalTime;
        const progress = Math.min((elapsed / totalTime) * 100, 100);
        setUploadProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, intervalTime);
    });
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setSelectedImage(url);
    setUploadComplete(false);
    setUploadProgress(0);

    // Simulate upload
    await simulateUpload(file.size);

    setValue(name, file as T[typeof name], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setUploadProgress(null);
    setUploadComplete(true);
  };

  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div className="relative group w-[200px] h-[200px] rounded-full overflow-hidden border shadow">
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={altImage}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Camera className="w-10 h-10 text-muted-foreground" />
          </div>
        )}

        {/* Overlay Label */}
        <label
          htmlFor={inputId}
          className={cn(
            "absolute inset-0 bg-black/40 hover:bg-black/20 transition-all flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100",
            uploadProgress !== null && "cursor-not-allowed"
          )}
        >
          {uploadProgress !== null ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Camera className="w-10 h-10 text-white" />
          )}
        </label>

        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploadProgress !== null}
          className="hidden"
        />
      </div>

      {/* Progress bar */}
      {uploadProgress !== null && (
        <div className="w-full max-w-xs">
          <Progress value={uploadProgress} />
          <p className="text-xs text-muted-foreground mt-2">
            Uploading image... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      {/* Upload complete check */}
      {uploadComplete && (
        <div className="flex items-center gap-2 text-green-600 text-sm ">
          <CheckCircle2 className="w-4 h-4" />
          uploaded image successfully
        </div>
      )}

      {/* Error message */}
      {errors[name] && (
        <p className="text-sm text-red-500">{String(errors[name]?.message)}</p>
      )}
    </div>
  );
};

export default UploadImage;
