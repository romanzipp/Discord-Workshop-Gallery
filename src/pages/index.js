import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import Layout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function Home() {
    const { data: session } = useSession();

    if (!session) {
        return (
            <Layout>
                <div className="flex h-screen w-screen items-center justify-center">
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
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            hello
        </Layout>
    );
}
