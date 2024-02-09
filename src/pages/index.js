import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import {
    useState, Fragment, useMemo, useEffect,
} from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import classNames from 'classnames';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import remarkBreaks from 'remark-breaks';
import Layout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useGallery, useGuilds, useChannels } from '@/lib/api';
import {
    SelectTrigger, Select, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import UserPreview from '@/components/user-preview';
import {
    Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from '@/components/ui/carousel';
import alertStyles from '@/styles/alert.module.css';

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

function findClosestMessage(el) {
    while (el && el !== document) {
        if (el.dataset.message) {
            return el;
        }
        el = el.parentNode;
    }
    return null;
}

function GalleryPage({ galleryData }) {
    // Awards

    const awards = [
        {
            id: 'top-1', title: '1.', unique: true, appliedClassName: 'bg-red-950', badgeClassName: 'bg-red-900',
        },
        {
            id: 'top-2', title: '2.', unique: true, appliedClassName: 'bg-orange-950', badgeClassName: 'bg-orange-900',
        },
        {
            id: 'top-3', title: '3.', unique: true, appliedClassName: 'bg-yellow-950', badgeClassName: 'bg-yellow-900',
        },
        {
            id: 'top-4', title: '4.', unique: true, appliedClassName: 'bg-green-950', badgeClassName: 'bg-green-900',
        },
        {
            id: 'top-5', title: '5.', unique: true, appliedClassName: 'bg-blue-950', badgeClassName: 'bg-blue-900',
        },
        {
            id: 'additional', title: '❤️', unique: false, appliedClassName: 'bg-gray-950', badgeClassName: 'bg-gray-900',
        },
    ];

    const [itemAwards, setItemAwards] = useState([]);

    function resetAwards() {
        setItemAwards([]);
    }

    function addAwardToMessage(messageId, awardId) {
        console.log('addAwardToMessage', messageId, awardId);

        const award = awards.find((a) => a.id === awardId);

        setItemAwards((prevItemAwards) => {
            let tmp = [...prevItemAwards];

            if (award.unique) {
                tmp = tmp.filter((awardItem) => awardItem.award.id !== award.id);
            }

            const messageAlreadyHasAward = tmp.filter((awardItem) => awardItem.messageId === messageId).length > 0;

            if (messageAlreadyHasAward) {
                tmp = tmp.filter((awardItem) => awardItem.messageId !== messageId);
            }

            return [
                ...tmp,
                { messageId, award },
            ];
        });
    }

    const awardBadges = useMemo(() => awards.map((award) => ({
        ...award,
        used: award.unique && itemAwards.find((a) => a.award.id === award.id),
    })), [itemAwards]);

    // Drag event

    const [draggingAward, setDraggingAward] = useState(null);

    function onStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);

        console.log('DRAG >', 'dragging', event.target.dataset.award);

        setDraggingAward(event.target.dataset.award);
    }

    // Gallery items

    const onItemAllowDrop = (event) => {
        event.preventDefault();
    };

    const onItemDrop = (event) => {
        event.preventDefault();

        const messageElement = findClosestMessage(event.target);
        if (!messageElement) {
            return;
        }

        const messageId = messageElement?.dataset?.message;

        console.log('DRAG <', 'drop', { message: messageId, award: draggingAward });

        addAwardToMessage(messageId, draggingAward);
    };

    // Component

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [selectedMessageContent, setSelectedMessageContent] = useState(null);

    useEffect(() => {
        (async () => {
            if (!selectedMessage) {
                return;
            }

            const contentHtml = await unified()
                .use(remarkParse)
                .use(remarkRehype)
                .use(remarkBreaks)
                .use(rehypeSanitize)
                .use(rehypeStringify)
                .process(selectedMessage.content);

            setSelectedMessageContent(
                String(contentHtml),
            );
        })();
    }, [selectedMessage]);

    const computedMessages = useMemo(() => galleryData?.data?.map((message) => ({
        ...message,
        award: itemAwards.find((itemAward) => itemAward.messageId === message.id)?.award,
    })), [galleryData, itemAwards, awards]);

    return (
        <Layout>
            <div className="fixed right-0 flex h-full w-24 items-center">
                <div className="w-full rounded-l-md border border-r-0 border-white/30 p-4 shadow-lg shadow-white/10">
                    <div className="text-center text-sm font-semibold uppercase">
                        Awards
                    </div>

                    <div className="mt-4 flex select-none flex-col gap-4">
                        {awardBadges.map((award) => (
                            <div
                                key={award.id}
                                className="pointer-events-auto relative size-16"
                            >
                                <div
                                    onDragStart={(event) => onStart(event)}
                                    data-award={award.id}
                                    draggable="true"
                                >
                                    <div className={classNames(
                                        award.badgeClassName,
                                        award.used && 'opacity-30',
                                        'fixed flex size-16 items-center justify-center rounded-full p-6 transition-transform hover:scale-105 cursor-pointer font-bold',
                                    )}
                                    >
                                        {award.title}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => resetAwards()}
                        className="mt-4 block w-full text-center text-xs font-semibold uppercase text-white/60 transition-colors hover:text-wrap"
                    >
                        Reset
                    </button>

                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 pr-32 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                {computedMessages.map((message) => (
                    <div
                        key={message.id}
                        onDragOver={(event) => onItemAllowDrop(event)}
                        onDrop={(event) => onItemDrop(event)}
                        onClick={() => setSelectedMessage(message)}
                        data-message={message.id}
                        className={classNames(
                            message.award ? [message.award.appliedClassName] : 'hover:bg-white/10',
                            'relative flex flex-col justify-between gap-4 rounded border border-white/30 p-2 transition-colors hover:shadow-lg hover:shadow-white/10',
                        )}
                    >
                        {message.attachments?.length > 0 && (
                            <div>
                                {message.attachments?.filter((attachment, index) => index < 1)?.map((attachment) => (
                                    <div key={attachment.id}>
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
                                <UserPreview author={message.author} />
                                <div className="text-xs text-white/60">
                                    {moment(message.createdTimestamp).fromNow()}
                                </div>
                            </div>
                        )}

                        {message.award && (
                            <div className={classNames(
                                message.award.badgeClassName,
                                'absolute right-0 top-0 size-12 rounded-full -mr-2 -mt-2 flex items-center justify-center font-bold',
                            )}
                            >
                                {message.award.title}
                            </div>
                        )}
                    </div>

                ))}
            </div>

            {selectedMessage && (
                <AlertDialog
                    defaultOpen
                    onOpenChange={(open) => !open && setSelectedMessage(null)}
                >
                    <AlertDialogTrigger>Open</AlertDialogTrigger>
                    <AlertDialogContent className={classNames(alertStyles.alert, 'my-4 flex flex-col')}>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex justify-center">
                                <UserPreview author={selectedMessage.author} />
                            </AlertDialogTitle>
                            <div className="text-sm text-muted-foreground">
                                <div className="mx-auto max-w-4xl px-4">
                                    {selectedMessageContent && (
                                        <div dangerouslySetInnerHTML={{ __html: selectedMessageContent }} />
                                    )}
                                </div>
                            </div>
                        </AlertDialogHeader>
                        <div className="grow px-10">
                            <Carousel className="h-full">
                                <CarouselContent className="h-full">
                                    {selectedMessage.attachments?.map((attachment) => (
                                        <Fragment key={attachment.id}>
                                            <CarouselItem className="relative h-full">
                                                <img
                                                    src={attachment.url}
                                                    className="absolute size-full object-contain"
                                                    alt=""
                                                />
                                            </CarouselItem>
                                        </Fragment>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>

                        </div>
                        <AlertDialogFooter className="flex justify-center">
                            <AlertDialogCancel>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </Layout>
    );
}

export default function Home() {
    const { data: session } = useSession();
    const router = useRouter();

    const [originFromBookmark, setOriginFromBookmark] = useState(!!router.query.channel);

    console.log(originFromBookmark);

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

    return <GalleryPage galleryData={galleryData} />;
}
