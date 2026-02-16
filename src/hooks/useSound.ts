import { useCallback } from 'react';

export function useSound(src: string) {
    const play = useCallback(() => {
        // SSR Check
        if (typeof window === 'undefined') return;

        try {
            const audio = new Audio(src);
            audio.volume = 0.5;

            const promise = audio.play();
            if (promise !== undefined) {
                promise.catch(() => {
                    // Ignore auto-play errors
                });
            }
        } catch (e) {
            // Ignore audio construction errors
        }
    }, [src]);

    return play;
}
