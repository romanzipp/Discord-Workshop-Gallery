import React from 'react';
import { Inter } from 'next/font/google';
import classNames from 'classnames';
import Head from 'next/head';
import Footer from '@/components/footer';
import Navigation from '@/components/navigation';

const inter = Inter({ subsets: ['latin'] });

function Layout({ centered, children }) {
    let inner = children;

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
