import { useEffect, useState } from 'react';
import { getLocale, type Locale } from '../constants/ui';

export const useLocale = (): Locale => {
    const [locale, setLocaleState] = useState<Locale>(getLocale());

    useEffect(() => {
        const handleLocaleChanged = (event: Event) => {
            const customEvent = event as CustomEvent<Locale>;
            if (customEvent.detail) {
                setLocaleState(customEvent.detail);
            } else {
                setLocaleState(getLocale());
            }
        };

        window.addEventListener('locale-changed', handleLocaleChanged);
        return () => window.removeEventListener('locale-changed', handleLocaleChanged);
    }, []);

    return locale;
};
