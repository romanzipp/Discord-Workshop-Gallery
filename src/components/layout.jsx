import React from 'react';
import { Inter } from 'next/font/google';
import classNames from 'classnames';
import Head from 'next/head';
import Footer from '@/components/footer';
import Navigation from '@/components/navigation';

const inter = Inter({ subsets: ['latin'] });

function Layout({ centered, loading, children }) {
    let inner = children;

    if (loading) {
        inner = (
            <div className="flex h-screen w-screen items-center justify-center">

                <div>
                    <div className="mb-4 flex justify-center">
                        <svg
                            className="-ml-1 mr-3 size-8 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>

                    <div className="text-sm text-white/60">
                        {children}
                    </div>
                </div>
            </div>
        );
    }

    if (centered) {
        inner = (
            <div className="flex h-screen w-screen items-center justify-center">
                {children}
            </div>
        );
    }

    return (
        <main className={classNames(
            'bg-black text-white min-h-screen w-full',
            inter.className,
        )}
        >
            <Head>
                <title>Workshop Gallery</title>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <script
                    defer
                    data-domain="workshop-gallery.ich.wtf"
                    src="https://p.ich.wtf/js/script.js"
                />
            </Head>

            <Navigation />

            <article className="relative">
                {inner}
            </article>

            <Footer />
        </main>
    );
}

Layout.propTypes = {};

Layout.defaultProps = {};

export default Layout;
