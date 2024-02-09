import React from 'react';
import PropTypes from 'prop-types';
import { Inter } from 'next/font/google';
import classNames from 'classnames';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const inter = Inter({ subsets: ['latin'] });

function Layout({ children }) {
    const { data: session } = useSession();

    console.log(session);

    return (
        <main className={classNames(
            'dark bg-black text-white min-h-screen w-full',
            inter.className,
        )}
        >

            <nav className="flex min-h-10 justify-between border-b border-white/30">
                <div className="flex items-center px-3 font-bold">
                    Workshop Gallery
                </div>

                <div className="flex gap-6 px-4 text-sm text-gray-300">
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
                                <div>
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

            {children}
        </main>
    );
}

Layout.propTypes = {

};

Layout.defaultProps = {};

export default Layout;
