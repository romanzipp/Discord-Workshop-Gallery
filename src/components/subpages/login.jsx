import React from 'react';
import { signIn } from 'next-auth/react';
import Layout from '@/components/layout';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

function Login() {
    return (
        <Layout centered>
            <div className="flex max-w-xl flex-col gap-6">
                <Alert>
                    <AlertTitle>You are not signed in</AlertTitle>
                    <AlertDescription>
                        You can only use this tool if you&apos;re signed in with your Discord account.
                    </AlertDescription>
                </Alert>
                <p className="text-sm">
                    Note that this tool does not save your information. Once you clear your browser cache, all data is deleted.
                </p>
                <Button
                    onClick={() => signIn()}
                >
                    Sign in
                </Button>
            </div>
        </Layout>
    );
}

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
