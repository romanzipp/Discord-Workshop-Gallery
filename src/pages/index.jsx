import { useSession } from 'next-auth/react';
import {
    useState, useMemo, useEffect,
} from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import { useGallery, useGuilds, useChannels } from '@/lib/api';
import BookmarkAlert from '@/components/bookmark-alert';
import Login from '@/components/subpages/login';
import SelectGuild from '@/components/subpages/select-guild';
import SelectChannel from '@/components/subpages/select-channel';
import Gallery from '@/components/subpages/gallery';

export async function getServerSideProps({ query }) {
    return {
        props: {
            hasChannel: !!query.channel,
        },
    };
}

export default function Home({ hasChannel }) {
    const { publicRuntimeConfig } = getConfig();
    const { data: session } = useSession();
    const router = useRouter();

    const [originFromBookmark] = useState(hasChannel);

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

    const { data: galleryData, isLoading: isLoadingGallery, error: galleryError } = useGallery({
        session,
        selectedGuild,
        selectedChannel,
    });

    const { data: guildsData, isLoading: isLoadingGuilds } = useGuilds({
        session,
        selectedGuild,
    });

    const { data: channelsData, isLoading: isLoadingChannels } = useChannels({
        session,
        selectedGuild,
        selectedChannel,
    });

    // Preselect guild

    useEffect(() => {
        if (selectedGuild || !guildsData || !publicRuntimeConfig.preselectGuildId) {
            return;
        }

        const foundPreselectGuild = guildsData?.data?.find((guild) => guild.id === publicRuntimeConfig.preselectGuildId);

        if (foundPreselectGuild) {
            onSelectGuild(foundPreselectGuild.id);
        }
    }, [guildsData, selectedGuild, publicRuntimeConfig]);

    const [showBookmarkAlert, setShowBookmarkAlert] = useState(false);

    // Preselect chanel

    useEffect(() => {
        if (selectedChannel || !channelsData || !publicRuntimeConfig.preselectChannelId) {
            return;
        }

        const foundPreselectChannel = channelsData?.data?.find((channel) => channel.id === publicRuntimeConfig.preselectChannelId);

        if (foundPreselectChannel) {
            onSelectChannel(foundPreselectChannel.id);
        }
    }, [channelsData, selectedChannel, publicRuntimeConfig]);

    // Show bookmark alert

    useEffect(() => {
        if (!originFromBookmark && !!selectedChannel) {
            setShowBookmarkAlert(true);
        }
    }, [selectedChannel]);

    if (!session) {
        return <Login />;
    }

    if (!selectedGuild) {
        return (
            <SelectGuild
                isLoading={isLoadingGuilds}
                guildsData={guildsData}
                onSelect={(value) => onSelectGuild(value)}
            />
        );
    }

    if (!selectedChannel) {
        return (
            <SelectChannel
                isLoading={isLoadingChannels}
                channelsData={channelsData}
                onSelect={(value) => onSelectChannel(value)}
                onBack={() => onSelectGuild(undefined)}
            />
        );
    }

    if (isLoadingGallery) {
        return (
            <Layout loading>
                loading images...
            </Layout>
        );
    }

    if (galleryError) {
        console.error(galleryError);

        return (
            <Layout centered>
                error loading images. see console for more information.
            </Layout>
        );
    }

    if (!galleryData || !galleryData.data || galleryData.data.length === 0) {
        return (
            <Layout centered>
                no images found.
            </Layout>
        );
    }

    return (
        <Layout>
            {(showBookmarkAlert) && (
                <BookmarkAlert
                    show={showBookmarkAlert}
                    onClose={() => setShowBookmarkAlert(false)}
                />
            )}

            <Gallery galleryData={galleryData} />
        </Layout>
    );
}
