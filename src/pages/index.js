import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, Fragment, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
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

    if (!galleryData || !galleryData?.data) {
        return (
            <Layout centered>
                loading messages...
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="fixed right-0 flex h-full w-24 items-center">
                <div className="w-full rounded-l-md border border-r-0 border-white/30 p-4 shadow-lg shadow-white/10">
                    <div className="text-center text-sm font-semibold uppercase">
                        Awards
                    </div>

                    <div className="mt-4 flex flex-col gap-4">
                        <div className="flex size-16 items-center justify-center rounded-full bg-red-900/60 p-6 transition-transform hover:scale-105">1.</div>
                        <div className="flex size-16 items-center justify-center rounded-full bg-orange-900/60 p-6 transition-transform hover:scale-105">2.</div>
                        <div className="flex size-16 items-center justify-center rounded-full bg-yellow-900/60 p-6 transition-transform hover:scale-105">3.</div>
                        <div className="flex size-16 items-center justify-center rounded-full bg-green-900/60 p-6 transition-transform hover:scale-105">4.</div>
                        <div className="flex size-16 items-center justify-center rounded-full bg-blue-900/60 p-6 transition-transform hover:scale-105">5.</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-6 gap-4 p-4">
                {galleryData.data.map((message) => (
                    <div
                        key={message.id}
                        className="flex flex-col justify-between gap-4 rounded border border-white/30 p-2"
                    >
                        {message.attachments?.length > 0 && (
                            <div>
                                {message.attachments?.filter((attachment, index) => index < 1)?.map((attachment) => (
                                    <div>
                                        <img
                                            src={attachment.url}
                                            alt=""
                                        />
                                    </div>
                                ))}
                                {message.attachments.length > 1 && (
                                    <div className="mt-2 text-xs font-medium text-white/60">
                                        +
                                        {message.attachments.length - 1}
                                        {' '}
                                        more
                                    </div>
                                )}
                            </div>
                        )}
                        {message.author && (
                            <div className="flex items-center justify-between gap-2 text-sm font-medium">
                                <div className="flex items-center gap-2 text-white/90">
                                    <Image
                                        src={message.author.avatarURL}
                                        alt={message.author.username}
                                        height={24}
                                        width={24}
                                        className="rounded-full"
                                    />
                                    {message.author.globalName}
                                </div>
                                <div className="text-xs text-white/60">
                                    {moment(message.createdTimestamp).fromNow()}
                                </div>
                            </div>
                        )}
                    </div>

                ))}
            </div>
        </Layout>
    );
}
