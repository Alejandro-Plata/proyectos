import { useState, useEffect } from 'react';
import { ForumDesktop } from './ForumDesktop';
import { ForumMobile } from './ForumMobile';

export const ForumPage = () => {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile ? <ForumMobile /> : <ForumDesktop />;
};
