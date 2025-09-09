import React, { useCallback, useRef, useState } from "react";

export interface IUseOpenFileInputType {
  onOpenFiles?: (files: FileList | null) => void,
  acceptedExtensions?: string,
  multiple?: boolean
}

const useOpenFile = ({onOpenFiles, acceptedExtensions, multiple}: IUseOpenFileInputType) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const openFileDialog = () => inputRef.current?.click();
  const clearSelectedFiles = () => setSelectedFiles(null);

  const onFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onOpenFiles?.(e.target.files)
    setSelectedFiles(e.target.files);
  }, [onOpenFiles]);

  const FileInputComponent = useCallback(
    () => (
      <input
        accept={acceptedExtensions}
        ref={inputRef}
        type="file"
        hidden
        className="hidden"
        onChange={onFileUpload}
        multiple={multiple}
      />
    ),
    [acceptedExtensions, multiple, onFileUpload]
  );

  return { openFileDialog, selectedFiles, clearSelectedFiles, FileInputComponent };
};

export default useOpenFile;
