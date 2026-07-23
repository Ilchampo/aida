import React from 'react';

import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

interface BackLinkProps {
    to: string;
    children: React.ReactNode;
}

const BackLink: React.FC<BackLinkProps> = (props) => {
    const { to, children } = props;

    return (
        <Link
            to={to}
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-slate-400 transition hover:text-cyan-300"
        >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            {children}
        </Link>
    );
};

export default BackLink;
