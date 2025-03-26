import { useEffect, useRef, useState } from "react";

interface MenuHandleOptions {
    closeOnScroll?: boolean;
}

export function useMenuHandle(options: MenuHandleOptions = {}) {
    const { closeOnScroll = false } = options;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };

    const handleScroll = () => {
        if (closeOnScroll) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            
            if (closeOnScroll) {
                document.addEventListener("scroll", handleScroll, true);
            }
        }
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            
            if (closeOnScroll) {
                document.removeEventListener("scroll", handleScroll, true);
            }
        };
    }, [isMenuOpen, closeOnScroll]);
    
    return { isMenuOpen, menuRef, setIsMenuOpen };
}
