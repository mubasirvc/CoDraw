import { useEffect } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { useMoveImage } from "../../hooks/useMoveImage";
import { optimizeImage } from "@/common/lib/optimizeImage";

const ImageChoser = () => {
  const { setMoveImage } = useMoveImage();

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (const item of items) {
          if (item.type.includes("image")) {
            const file = item.getAsFile();
            if (file)
              optimizeImage(file, (uri) => setMoveImage({base64: uri}))
          }
        }
      }
    }

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [setMoveImage]);

  const handleImageInput = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.addEventListener("change", () => {
      if (fileInput && fileInput.files) {
        const file = fileInput.files[0];
        optimizeImage(file, (uri) => setMoveImage({base64: uri}));
      }
    });
  };

  return (
    <button className=" w-10 h-10 flex justify-center items-center" onClick={handleImageInput}>
      <BsFillImageFill />
    </button>
  );
};

export default ImageChoser;