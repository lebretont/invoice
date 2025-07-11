import { useRef, useCallback, useEffect } from "react";

export function useDebouncer(ms: number) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debounce = useCallback((action: () => void) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            action();
        }, ms);
    }, [ms]);

    // Nettoyage du timeout au démontage
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { debounce };
}
