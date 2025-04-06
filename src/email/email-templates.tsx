import * as React from 'react';

interface ApprovedEmailTemplateProps {
    name: string;
    title: string;
    area: string;
}

export const ApprovedEmailTemplate: React.FC<Readonly<ApprovedEmailTemplateProps>> = ({
    name, title, area
}) => (
    <div>
        <p>Dear {name},</p>
        <p>We are delighted to inform you that your uploaded resource <b>{title}</b> for <b>{area}</b> has been <b>approved</b> and is now available to other fellow students and teachers.</p>
        <p>Thank you for your contribution to the College academic community.</p>
    </div>
);

interface RejectedEmailTemplateProps {
    name: string;
    title: string;
    area: string;
}

export const RejectedEmailTemplate: React.FC<Readonly<RejectedEmailTemplateProps>> = ({
    name, title, area
}) => (
    <div>
        <p>Dear {name},</p>
        <p>We regret to inform you that your uploaded resource <b>{title}</b> for <b>{area}</b> was <b>rejected</b>.</p>
    </div>
);