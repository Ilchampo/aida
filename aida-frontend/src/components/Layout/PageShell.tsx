import React from 'react';

import AppHeader from '@components/Common/AppHeader';
import DecorativeBackground from '@components/Common/DecorativeBackground';

interface PageShellProps {
    children: React.ReactNode;
    className?: string;
    givenName?: string;
    pictureUrl?: string | null;
    onLogout?: VoidFunction;
    showNav?: boolean;
}

const PageShell: React.FC<PageShellProps> = (props) => {
    const {
        children,
        className = '',
        givenName,
        pictureUrl,
        onLogout,
        showNav = Boolean(givenName),
    } = props;

    return (
        <div className={`relative flex w-full flex-col ${className}`}>
            <DecorativeBackground />
            <AppHeader
                givenName={givenName}
                pictureUrl={pictureUrl}
                onLogout={onLogout}
                showNav={showNav}
            />
            {children}
        </div>
    );
};

export default PageShell;
