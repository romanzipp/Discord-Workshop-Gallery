import React from 'react';
import PropTypes from 'prop-types';
import { Inter } from 'next/font/google';
import classNames from 'classnames';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

function Layout({ children }) {
    return (
        <main className={classNames(
            'bg-black text-white',
            inter.className,
        )}
        >

            <nav className="flex min-h-10 justify-between border-b border-white/30">
                <div className="flex items-center px-3 font-bold">
                    Workshop Gallery
                </div>

                <Link
                    href="https://romanzipp.com"
                    target="_blank"
                    className="flex items-center px-3 text-sm font-medium text-gray-300 transition-colors hover:text-gray-200"
                >
                    Made by @romanzipp
                </Link>
            </nav>

            {children}
        </main>
    );
}

Layout.propTypes = {

};

Layout.defaultProps = {};

export default Layout;
