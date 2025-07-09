// src/hooks/useScrollSpy.js
import { useEffect, useState } from 'react';

export const useScrollSpy = (ids, offset = 100) => {
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: `-${offset}px 0px -80% 0px`, // adjust offset trigger
                threshold: 0.1,
            }
        );

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [ids, offset]);

    return activeId;
};
