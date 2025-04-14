import { useState, useRef, useCallback, useEffect } from "react";

export function DraggableSidebar({
  children,
  initialWidth = 320,
  minWidth = 200,
  maxWidth = 600,
}: {
  children: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      startX.current = e.clientX;
      startWidth.current = sidebarWidth;
      document.body.classList.add("select-none");
    },
    [sidebarWidth],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;

      const delta = e.clientX - startX.current;
      const newWidth = startWidth.current + delta;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    },
    [minWidth, maxWidth],
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.classList.remove("select-none");
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <>
      <div
        className="bg-white border-r overflow-y-auto h-full relative"
        style={{ width: sidebarWidth }}
      >
        <div className="pr-1 h-full overflow-y-auto">{children}</div>
        <div
          className="absolute right-0 top-0 bottom-0 w-1 bg-transparent hover:bg-gray-200 active:bg-gray-300 transition-colors cursor-col-resize"
          onMouseDown={handleMouseDown}
        />
      </div>
    </>
  );
}
