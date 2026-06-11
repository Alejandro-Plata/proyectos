import { useIsMobile } from '../../../../hooks/useIsMobile';
import { SettingsDesktop } from './SettingsDesktop';
import { SettingsMobile } from './SettingsMobile';

export const SettingsPage = () => {
    const isMobile = useIsMobile();
    return isMobile ? <SettingsMobile /> : <SettingsDesktop />;
};
