import React from 'react';

export default function Page() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted px-4">

            <div className="w-full max-w-md p-8 mx-auto bg-card rounded-lg shadow-md">
                <div className="text-center mb-8">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        {/* Replace with your own logo or use a placeholder */}
                        <svg className="w-full h-full text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-card-foreground mb-2">We will be back soon!</h1>
                    <p className="text-muted-foreground mb-6">
                        Our site is currently undergoing scheduled maintenance. We apologize for any inconvenience.
                    </p>

                </div>

                <div className="text-center mt-8 text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Christoph Chan, Joshua Ng, Xingzhi Lu. All rights reserved.
                </div>
            </div>
        </div>
    );
}