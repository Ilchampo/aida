import React, { useEffect, useRef, useState } from 'react';

import { LogOutIcon } from 'lucide-react';

interface UserMenuProps {
    givenName: string;
    pictureUrl?: string | null;
    onLogout?: VoidFunction;
}

const UserMenu: React.FC<UserMenuProps> = (props) => {
    const { givenName, pictureUrl, onLogout } = props;

    const [open, setOpen] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);
    const [prevPictureUrl, setPrevPictureUrl] = useState(pictureUrl);
    const containerRef = useRef<HTMLDivElement>(null);

    if (pictureUrl !== prevPictureUrl) {
        setPrevPictureUrl(pictureUrl);
        setImageFailed(false);
    }

    const initial = givenName.trim().charAt(0).toUpperCase() || 'U';
    const showImage = Boolean(pictureUrl) && !imageFailed;

    const avatarClasses =
        'flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-cyan-400/40 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 font-display text-sm font-bold text-white shadow-glow';

    useEffect(() => {
        if (!open) {
            return;
        }

        const handlePointer = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointer);
        document.addEventListener('keydown', handleKey);

        return () => {
            document.removeEventListener('mousedown', handlePointer);
            document.removeEventListener('keydown', handleKey);
        };
    }, [open]);

    const avatar = (
        <span className={avatarClasses} aria-hidden="true">
            {showImage ? (
                <img
                    src={pictureUrl!}
                    alt=""
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                initial
            )}
        </span>
    );

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={`Account menu for ${givenName}`}
                className="rounded-full transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:ring-offset-2 focus:ring-offset-void-900"
            >
                {avatar}
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-lg border border-indigo-500/30 bg-void-900 shadow-glow"
                    style={{ backgroundColor: '#0a0f1e' }}
                >
                    <div className="flex items-center gap-3 border-b border-indigo-500/20 px-4 py-3">
                        {avatar}
                        <div className="min-w-0">
                            <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/80">
                                Operator
                            </p>
                            <p className="truncate font-medium text-slate-100">{givenName}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                            setOpen(false);
                            onLogout?.();
                        }}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium uppercase tracking-wide text-slate-300 transition hover:bg-indigo-500/10 hover:text-cyan-300 focus:bg-indigo-500/10 focus:outline-none"
                    >
                        <LogOutIcon className="h-4 w-4" aria-hidden="true" />
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
