import { useEffect } from "react";
import "./ImageViewer.css";

function ImageViewer({ src, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="image-viewer-overlay" onClick={onClose}>
      <button className="image-viewer-close" onClick={onClose} type="button">✕</button>
      <img className="image-viewer-img" src={src} alt="" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

export default ImageViewer;
