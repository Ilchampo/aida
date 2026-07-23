import React from 'react';

import { NavLink } from 'react-router-dom';
import { BriefcaseIcon, ChartColumnIcon, HistoryIcon } from 'lucide-react';

import Wordmark from '@components/Common/WordMark';
import UserMenu from '@components/Common/UserMenu';

interface AppHeaderProps {
    givenName?: string;
    pictureUrl?: string | null;
    onLogout?: VoidFunction;
    showNav?: boolean;
}

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    [
        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition focus:outline-none focus:ring-2 focus:ring-cyan-400/40',
        isActive
            ? 'border border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
            : 'text-slate-400 hover:bg-indigo-500/10 hover:text-cyan-300',
    ].join(' ');

const AppHeader: React.FC<AppHeaderProps> = (props) => {
    const { givenName, pictureUrl, onLogout, showNav = false } = props;

    return (
        <header className="relative z-40 w-full border-b border-indigo-500/20 bg-void-900/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-6">
                    <Wordmark />

                    {showNav && (
                        <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
                            <NavLink to="/" end className={navLinkClass}>
                                <BriefcaseIcon className="h-3.5 w-3.5" aria-hidden="true" />
                                Interviews
                            </NavLink>
                            <NavLink to="/progress" className={navLinkClass}>
                                <HistoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
                                Progress
                            </NavLink>
                            <NavLink to="/leaderboard" className={navLinkClass}>
                                <ChartColumnIcon className="h-3.5 w-3.5" aria-hidden="true" />
                                Leaderboard
                            </NavLink>
                        </nav>
                    )}
                </div>

                {givenName && (
                    <UserMenu givenName={givenName} pictureUrl={pictureUrl} onLogout={onLogout} />
                )}
            </div>
        </header>
    );
};

export default AppHeader;
