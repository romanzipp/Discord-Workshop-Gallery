import React from 'react';
import { Inter } from 'next/font/google';
import classNames from 'classnames';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

function Layout({ centered, children }) {
    const { data: session } = useSession();

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

            <div className="h-10 w-full" />

            <nav className="fixed left-0 top-0 z-50 flex h-10 w-full justify-between border-b border-white/20 bg-black shadow-md">
                <div className="flex items-center px-3 font-bold">
                    <span className="block md:hidden">WG</span>
                    <span className="hidden md:block">Workshop Gallery</span>
                </div>

                <div className="flex gap-4 px-3 text-sm text-gray-300 md:gap-6 md:px-4">
                    {session && (
                        <>
                            <div className="flex items-center gap-3">
                                {session.user.image && (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name}
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                )}
                                <div className="hidden md:block">
                                    Signed in as
                                    {' '}
                                    <span className="font-medium">
                                        {session.user.name}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    className="font-medium"
                                    onClick={() => signOut()}
                                >
                                    Sign out
                                </button>
                            </div>
                        </>
                    )}
                    <Link
                        href="https://www.instagram.com/romanzipp/"
                        target="_blank"
                        className="flex items-center text-sm font-medium transition-colors hover:text-gray-200"
                    >
                        Made by @romanzipp
                    </Link>
                </div>
            </nav>

            <article className="relative">
                {inner}
            </article>

            <footer className="mt-32 pb-8">
                <div className="mx-auto max-w-4xl border-t border-white/20 px-6 pt-6 text-center">
                    <div className="flex flex-wrap justify-center gap-6 text-xs text-white/60">
                        <Link
                            href="https://romanzipp.com"
                            target="_blank"
                        >
                            ❤️
                            Made by
                            {' '}
                            <span className="font-semibold">Roman Zipp</span>
                        </Link>
                        <Link
                            href="https://www.instagram.com/romanzipp/"
                            target="_blank"
                        >
                            📸
                            Instagram
                            {' '}
                            <span className="font-semibold">@romanzipp</span>
                        </Link>
                        <Link
                            href="https://github.com/romanzipp/Discord-Workshop-Gallery"
                            target="_blank"
                        >
                            Open Source on Github
                        </Link>
                        <Link
                            href="https://romanzipp.com/imprint"
                            target="_blank"
                        >
                            Imprint
                        </Link>
                        <Link
                            href="https://romanzipp.com/privacy"
                            target="_blank"
                        >
                            Privacy
                        </Link>
                        <Link href="/">
                            Reset server & channel
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}

Layout.propTypes = {

};

Layout.defaultProps = {};

export default Layout;
