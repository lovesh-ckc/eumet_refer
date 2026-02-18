"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface PortalDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function PortalDropdown({ trigger, children, align = "right", className, isOpen: controlledIsOpen, onOpenChange }: PortalDropdownProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; transform: string } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle Open
  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isOpen;
    if (!isControlled) {
      setInternalIsOpen(newState);
    }
    onOpenChange?.(newState);
    
    if (newState) {
       // Defer coord update slightly to ensure ref is ready? No, ref is always there.
       // But we need to call updateCoords *after* render? 
       // Actually, in the old logic we called updateCoords then setIsOpen. 
       // Here, if controlled, we wait for parent.
       // We should use an effect to update coords when isOpen becomes true.
    }
  };

  // Close on click outside & Update Coords
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
         if (!isControlled) setInternalIsOpen(false);
         onOpenChange?.(false);
      }
    };

    if (isOpen) {
      updateCoords(); // Update on open
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords);
    };
  }, [isOpen]);

  // Calculate position
  const updateCoords = () => {
    if (triggerRef.current && isOpen) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Basic positioning: below the trigger
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const height = 200; // estimated max height or use a ref measurement
      
      let top = rect.bottom + window.scrollY + 4;
      let left = align === "right" ? rect.right + window.scrollX : rect.left + window.scrollX;
      
      let transform = align === "right" ? "translateX(-100%)" : "none";

      if (spaceBelow < height && spaceAbove > height) {
          // Flip to top
          top = rect.top + window.scrollY - 4;
          transform = align === "right" ? "translate(-100%, -100%)" : "translateY(-100%)";
      }

      setCoords({
        top,
        left,
        width: rect.width,
        transform
      });
    }
  };

  return (
    <>
      <div ref={triggerRef} onClick={toggle} className="inline-block cursor-pointer">
        {trigger}
      </div>
      {isOpen && coords && createPortal(
        <div
            ref={dropdownRef}
            style={{
                position: "absolute",
                top: coords.top,
                left: coords.left,
                transform: coords.transform,
            }}
            className={`z-[9999] min-w-[12rem] ${className}`}
        >
            {children}
        </div>,
        document.body
      )}
    </>
  );
}
