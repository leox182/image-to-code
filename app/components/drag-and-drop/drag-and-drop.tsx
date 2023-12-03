"use client";
import { Dropzone, ExtFile } from "@files-ui/react";

export default function DragAndDrop({ transformImageToCode }: { transformImageToCode: (file: File) => Promise<void> }) {
  const onLoadFiles = (files: ExtFile[]) => {
    const file = files[0].file;
    if (file) transformImageToCode(file);
  };

  return <Dropzone accept="image/*" header={false} footer={false} maxFiles={1} onChange={onLoadFiles} label="DRAG IMAGE HERE TO BEGIN"></Dropzone>;
}
