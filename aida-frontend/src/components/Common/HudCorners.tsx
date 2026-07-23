import React from 'react';

interface HudCornersProps {
    className?: string;
    color?: string;
}

const HudCorners: React.FC<HudCornersProps> = (props) => {
    const { className = '', color = 'text-cyan-400/50' } = props;

    const base = `pointer-events-none absolute h-4 w-4 ${color}`;

    return (
        <div aria-hidden="true" className={`pointer-events-none ${className}`}>
            <span className={`${base} left-0 top-0 border-l-2 border-t-2 border-current`} />

            <span className={`${base} right-0 top-0 border-r-2 border-t-2 border-current`} />

            <span className={`${base} right-0 top-0 border-r-2 border-t-2 border-current`} />

            <span className={`${base} bottom-0 left-0 border-b-2 border-l-2 border-current`} />

            <span className={`${base} bottom-0 right-0 border-b-2 border-r-2 border-current`} />
        </div>
    );
};

export default HudCorners;
