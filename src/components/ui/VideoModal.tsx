"use client";

/**
 * Tanıtım videosu modal/lightbox.
 * - ESC veya overlay tıklaması ile kapanır.
 * - Açıkken body scroll kilidi (globals.css → body.no-scroll).
 * - Video kaynağı `site_settings` tablosundan gelecek (key: promo_video_url).
 *   YouTube URL'i → iframe embed; dosya URL'i → <video>; boş → placeholder.
 */

import { useEffect } from "react";
import styles from "./VideoModal.module.css";

type VideoModalProps = {
  open: boolean;
  onClose: () => void;
  /** site_settings.promo_video_url — YouTube linki veya video dosyası URL'i */
  videoUrl?: string | null;
  title?: string;
};

function toYouTubeEmbed(url: string): string | null {
  // youtube.com/watch?v=ID | youtu.be/ID | youtube.com/embed/ID
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/
  );
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0` : null;
}

export default function VideoModal({
  open,
  onClose,
  videoUrl,
  title = "Renta Yapı Tanıtım Filmi",
}: VideoModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("no-scroll");

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [open, onClose]);

  if (!open) return null;

  const embedUrl = videoUrl ? toYouTubeEmbed(videoUrl) : null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Kapat">
          ✕
        </button>
        <div className={styles.frame}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : videoUrl ? (
            <video src={videoUrl} controls autoPlay playsInline />
          ) : (
            <div className={styles.placeholder}>
              <span className={styles.badge}>Yakında</span>
              <p>
                Tanıtım filmi hazırlanıyor. Video dosyası temin edildiğinde
                admin panelden (<code>site_settings → promo_video_url</code>)
                eklenecek.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
