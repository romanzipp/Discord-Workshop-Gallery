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
                                        width={30}
                                        height={30}
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
                        href="https://romanzipp.com"
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
        </main>
    );
}

Layout.propTypes = {

};

Layout.defaultProps = {};

export default Layout;
