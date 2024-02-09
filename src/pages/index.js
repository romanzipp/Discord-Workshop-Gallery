import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, Fragment, useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useGallery, useGuilds, useChannels } from '@/lib/api';
import {
    SelectTrigger, Select, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';

function LoginPage() {
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

export default function Home() {
    const { data: session } = useSession();
    const router = useRouter();

    const selectedGuild = useMemo(() => router.query.guild, [router]);
    const selectedChannel = useMemo(() => router.query.channel, [router]);

    function onSelectGuild(value) {
        router.push({
            query: { guild: value },
        });
    }

    function onSelectChannel(value) {
        router.push({
            query: { ...router.query, channel: value },
        });
    }

    const { data: galleryData } = useGallery({
        session,
        selectedGuild,
        selectedChannel,
    });

    const { data: guildsData, isLoading, isGuildsLoading } = useGuilds({
        session,
        selectedGuild,
    });

    const { data: channelsData } = useChannels({
        session,
        selectedGuild,
        selectedChannel,
    });

    if (!session) {
        return <LoginPage />;
    }

    if (!selectedGuild) {
        return (
            <Layout centered>
                {(guildsData && guildsData?.data) && (
                    <Select onValueChange={(value) => onSelectGuild(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Server" />
                        </SelectTrigger>
                        <SelectContent>
                            {guildsData?.data?.map((guild) => (
                                <Fragment key={guild.id}>
                                    <SelectItem value={guild.id}>
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                                                alt={guild.name}
                                                height={24}
                                                width={24}
                                                className="rounded-full"
                                            />
                                            {guild.name}
                                        </div>
                                    </SelectItem>
                                </Fragment>
                            ))}
                        </SelectContent>
                    </Select>
                )}

            </Layout>
        );
    }

    if (!selectedChannel) {
        return (
            <Layout centered>
                {(channelsData && channelsData?.data) ? (
                    <div>
                        <Select onValueChange={(value) => onSelectChannel(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Channel" />
                            </SelectTrigger>
                            <SelectContent>
                                {channelsData?.data?.map((channel) => (
                                    <Fragment key={channel.id}>
                                        <SelectItem value={channel.id}>
                                            <div className="flex items-center gap-2">
                                                {channel.name}
                                            </div>
                                        </SelectItem>
                                    </Fragment>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ) : (
                    <div>
                        loading channels...
                    </div>
                )}
            </Layout>
        );
    }

    return (
        <Layout>
            hello
        </Layout>
    );
}
