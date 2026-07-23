import React from 'react';

import type { InterviewStatus } from '@lib/interfaces/interview.interface';

import { STATUS_STYLES } from '@lib/constants/interview.constants';

interface InterviewStatusBadgeProps {
    status: InterviewStatus;
    className?: string;
}

const InterviewStatusBadge: React.FC<InterviewStatusBadgeProps> = (props) => {
    const { status, className = '' } = props;

    return (
        <span className={`rounded uppercase tracking-wider ${STATUS_STYLES[status]} ${className}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

export default InterviewStatusBadge;
