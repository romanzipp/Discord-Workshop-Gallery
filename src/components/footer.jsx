import React from 'react';
import Link from 'next/link';

function Footer() {
    return (

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
    );
}

Footer.propTypes = {};

Footer.defaultProps = {};

export default Footer;
