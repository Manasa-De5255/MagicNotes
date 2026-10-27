import React, { useState, useRef, useEffect } from 'react';
import { NoteSticker } from '../types/notebook';
import { STICKER_COLLECTION } from '../data/stickers';
import { Trash2, RotateCw, ZoomIn, Layers, Check } from 'lucide-react';

interface NotebookStickerCanvasProps {
  stickers: NoteSticker[];
  onUpdateSticker: (stickerId: string, updates: Partial<NoteSticker>) => void;
  onRemoveSticker: (stickerId: string) => void;
  readOnly?: boolean;
}

export const NotebookStickerCanvas: React.FC<NotebookStickerCanvasProps> = ({
  stickers,
  onUpdateSticker,
  onRemoveSticker,
  readOnly = false,
}) => {
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0, stickerX: 0, stickerY: 0 });

  // Handle outside click to deselect sticker so user can write text seamlessly
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelectedStickerId(null);
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  const handlePointerDown = (
    e: React.PointerEvent,
    sticker: NoteSticker
  ) => {
    if (readOnly) return;
    e.stopPropagation();
    setSelectedStickerId(sticker.id);

    isDraggingRef.current = true;
    dragStartPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      stickerX: sticker.x,
      stickerY: sticker.y,
    };

    const handlePointerMove = (moveEv: PointerEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      const deltaXPixels = moveEv.clientX - dragStartPosRef.current.x;
      const deltaYPixels = moveEv.clientY - dragStartPosRef.current.y;

      const deltaXPercent = (deltaXPixels / rect.width) * 100;
      const deltaYPercent = (deltaYPixels / rect.height) * 100;

      const newX = Math.max(2, Math.min(92, dragStartPosRef.current.stickerX + deltaXPercent));
      const newY = Math.max(2, Math.min(94, dragStartPosRef.current.stickerY + deltaYPercent));

      onUpdateSticker(sticker.id, { x: newX, y: newY });
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
    >
      {stickers.map((st) => {
        const meta = STICKER_COLLECTION.find((item) => item.id === st.sticker_id);
        const isSelected = selectedStickerId === st.id && !readOnly;

        return (
          <div
            key={st.id}
            style={{
              left: `${st.x}%`,
              top: `${st.y}%`,
              transform: `translate(-50%, -50%) rotate(${st.rotation}deg) scale(${st.scale})`,
              zIndex: st.z_index + (isSelected ? 50 : 0),
            }}
            onPointerDown={(e) => handlePointerDown(e, st)}
            className={`absolute pointer-events-auto cursor-grab active:cursor-grabbing select-none transition-shadow ${
              isSelected ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent rounded-xl' : ''
            }`}
          >
            {/* The SVG Artwork */}
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md hover:drop-shadow-xl transition-all"
              dangerouslySetInnerHTML={{
                __html: meta ? meta.svgIcon : `<div class="text-3xl">${st.sticker_id}</div>`,
              }}
            />

            {/* Quick Sticker Controls toolbar when selected */}
            {isSelected && (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1b153b] text-purple-100 border border-purple-500/50 rounded-full px-2 py-1 shadow-xl flex items-center gap-1.5 whitespace-nowrap text-xs z-50 animate-in fade-in zoom-in-90"
              >
                {/* Rotate button */}
                <button
                  type="button"
                  title="Rotate 15°"
                  onClick={() =>
                    onUpdateSticker(st.id, {
                      rotation: (st.rotation + 15) % 360,
                    })
                  }
                  className="p-1 hover:bg-purple-800/60 rounded-full transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5 text-purple-300" />
                </button>

                {/* Scale Up / Down */}
                <button
                  type="button"
                  title="Resize"
                  onClick={() =>
                    onUpdateSticker(st.id, {
                      scale: st.scale >= 1.8 ? 0.7 : Number((st.scale + 0.25).toFixed(2)),
                    })
                  }
                  className="p-1 hover:bg-purple-800/60 rounded-full transition-colors flex items-center gap-0.5 text-[10px]"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-pink-300" />
                  <span>{st.scale}x</span>
                </button>

                {/* Layer bring forward */}
                <button
                  type="button"
                  title="Bring forward"
                  onClick={() =>
                    onUpdateSticker(st.id, {
                      z_index: st.z_index + 1,
                    })
                  }
                  className="p-1 hover:bg-purple-800/60 rounded-full transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-300" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  title="Delete sticker"
                  onClick={() => onRemoveSticker(st.id)}
                  className="p-1 hover:bg-rose-900/60 rounded-full transition-colors text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Done */}
                <button
                  type="button"
                  title="Done editing sticker"
                  onClick={() => setSelectedStickerId(null)}
                  className="p-1 hover:bg-emerald-900/60 rounded-full transition-colors text-emerald-400"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
