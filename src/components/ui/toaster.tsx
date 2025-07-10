'use client';

import { Toaster as HotToaster, toast } from 'react-hot-toast';

export const Toaster = () => {
    return (
        <HotToaster
            position="bottom-right"
            toastOptions={{
                className: '',
                duration: 5000,
                style: {
                    background: '#ffffff',
                    color: '#333333',
                    border: '1px solid #E0E0E0',
                },
                success: {
                    style: {
                        background: '#F0FFF4',
                        color: '#2F855A',
                        border: '1px solid #9AE6B4',
                    },
                },
                error: {
                    style: {
                        background: '#FFF5F5',
                        color: '#C53030',
                        border: '1px solid #FC8181',
                    },
                },
            }}
        />
    );
};

interface ToastProps {
    title: string;
    description: string;
}

export const toaster = {
    success: ({ title, description }: ToastProps) => {
        toast.success(
            (t) => (
                <div onClick={() => toast.dismiss(t.id)}>
                    <p className="font-bold">{title}</p>
                    <p>{description}</p>
                </div>
            )
        );
    },
    error: ({ title, description }: ToastProps) => {
        toast.error(
            (t) => (
                <div onClick={() => toast.dismiss(t.id)}>
                    <p className="font-bold">{title}</p>
                    <p>{description}</p>
                </div>
            )
        );
    },
};
