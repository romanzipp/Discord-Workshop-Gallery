import {
    useState, Fragment, useMemo, useEffect,
} from 'react';
import confetti from 'canvas-confetti';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkBreaks from 'remark-breaks';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import classNames from 'classnames';
import moment from 'moment/moment';
import UserPreview from '@/components/user-preview';
import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import alertStyles from '@/styles/alert.module.css';
import {
    Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import MessageDetails from '@/components/message-details';

function findClosestMessage(el) {
    // eslint-disable-next-line no-undef
    while (el && el !== document) {
        if (el.dataset.message) {
            return el;
        }
        el = el.parentNode;
    }
    return null;
}

function Gallery({ galleryData }) {
    // Awards

    const awards = [
        {
            id: 'top-1',
            title: '1.',
            unique: true,
            appliedClassName: 'bg-yellow-800',
            badgeClassName: 'bg-gradient-to-br from-yellow-700 via-yellow-600 to-yellow-900 shadow-lg shadow-yellow-800/60 border-2 border-white/20',
            onApplied() {
                confetti({
                    particleCount: 200,
                    angle: 60,
                    spread: 70,
                    origin: { x: -0.05 },
                });
                confetti({
                    particleCount: 200,
                    angle: 120,
                    spread: 70,
                    origin: { x: 1.05 },
                });
            },
        },
        {
            id: 'top-2',
            title: '2.',
            unique: true,
            appliedClassName: 'bg-neutral-500',
            badgeClassName: 'bg-gradient-to-br from-neutral-500 via-neutral-400 to-neutral-700 shadow-md shadow-neutral-700/70 border-2 border-white/20',
        },
        {
            id: 'top-3',
            title: '3.',
            unique: true,
            appliedClassName: 'bg-amber-900',
            badgeClassName: 'bg-gradient-to-br from-amber-800 via-amber-700 to-amber-950 shadow-md shadow-amber-900/60 border-2 border-white/20',
        },
        {
            id: 'top-4',
            title: '4.',
            unique: true,
            appliedClassName: 'bg-emerald-950',
            badgeClassName: 'bg-emerald-800',
        },
        {
            id: 'top-5',
            title: '5.',
            unique: true,
            appliedClassName: 'bg-sky-950',
            badgeClassName: 'bg-sky-800',
        },
        {
            id: 'additional',
            title: '❤️',
            unique: false,
            appliedClassName: 'bg-gray-950',
            badgeClassName: 'bg-gray-900',
        },
    ];

    const [itemAwards, setItemAwards] = useState([]);

    function resetAwards() {
        setItemAwards([]);
    }

    function addAwardToMessage(messageId, awardId) {
        console.log('addAwardToMessage', messageId, awardId);

        const award = awards.find((a) => a.id === awardId);

        // dragged any element but not an award
        if (!award) {
            return;
        }

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

        if (award.onApplied) {
            award.onApplied();
        }
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

    const computedMessages = useMemo(() => galleryData?.data?.map((message) => ({
        ...message,
        award: itemAwards.find((itemAward) => itemAward.messageId === message.id)?.award,
    })), [galleryData, itemAwards, awards]);

    // Selected messages

    const [selectedMessage, setSelectedMessage] = useState(null);

    const [selectedMessageCarousel, setSelectedMessageCarousel] = useState(null);
    const [selectedMessageCarouselCurrentSlide, setSelectedMessageCarouselCurrentSlide] = useState(null);

    function onCarouselSettle(api) {
        const slideInView = api.slidesInView().find(() => true);

        setSelectedMessageCarouselCurrentSlide(slideInView);
    }

    const selectedMessageAttachments = useMemo(() => {
        if (!selectedMessage) {
            return [];
        }

        const { attachments } = selectedMessage;

        if (!selectedMessageCarousel) {
            return attachments;
        }

        return attachments.map((attachment, index) => ({
            ...attachment,
            active: selectedMessageCarouselCurrentSlide === index,
        }));
    }, [selectedMessageCarousel, selectedMessage, selectedMessageCarouselCurrentSlide]);

    function onCarouselDestroy() {
        if (!selectedMessageCarousel) {
            return;
        }

        selectedMessageCarousel.off('settle', onCarouselSettle);
    }

    function onCarouselInit(api) {
        api.on('settle', onCarouselSettle);

        setSelectedMessageCarouselCurrentSlide(0);
        setSelectedMessageCarousel(api);
    }

    function onClickAttachmentThumbnail(attachment, index) {
        if (!selectedMessageCarousel) {
            return;
        }

        selectedMessageCarousel.scrollTo(index);
    }

    const [nextMessage, prevMessage] = useMemo(() => {
        if (!selectedMessage) {
            return [null, null];
        }

        let hasPrev = false;
        let prev = null;
        let getNext = false;
        let next = null;

        for (const message of computedMessages) {
            if (getNext && !next) {
                next = message;
            }

            if (message.id === selectedMessage.id) {
                hasPrev = true;
                getNext = true;
            }

            if (!hasPrev) {
                prev = message;
            }
        }

        return [next, prev];
    }, [selectedMessage, computedMessages]);

    function selectMessagePrev() {
        setSelectedMessage(prevMessage);
    }

    function selectMessageNext() {
        setSelectedMessage(nextMessage);
    }

    return (
        <>
            <div className="fixed right-0 flex h-full w-24 items-center">
                <div className="w-full rounded-l-md border border-r-0 border-white/20 p-4 shadow-lg shadow-white/10">
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

            <div className="grid grid-cols-1 gap-4 p-4 pr-32 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                {computedMessages.map((message) => (
                    <div
                        key={message.id}
                        onDragOver={(event) => onItemAllowDrop(event)}
                        onDrop={(event) => onItemDrop(event)}
                        onClick={() => setSelectedMessage(message)}
                        data-message={message.id}
                        className={classNames(
                            message.award ? [message.award.appliedClassName] : 'hover:bg-white/10',
                            'relative flex flex-col justify-between gap-4 rounded border border-white/20 p-2 transition-colors hover:shadow-lg hover:shadow-white/10',
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
                            <div className="flex items-center justify-between gap-3 text-sm font-medium">
                                <UserPreview author={message.author} />
                                <div className="truncate text-xs text-white/60">
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
                <MessageDetails
                    selectedMessage={selectedMessage}
                    selectedMessageAttachments={selectedMessageAttachments}
                    setSelectedMessage={setSelectedMessage}
                    onCarouselInit={onCarouselInit}
                    nextMessage={nextMessage}
                    prevMessage={prevMessage}
                    onClickAttachmentThumbnail={onClickAttachmentThumbnail}
                    onCarouselDestroy={onCarouselDestroy}
                    selectMessagePrev={selectMessagePrev}
                    selectMessageNext={selectMessageNext}
                />
            )}
        </>
    );
}

Gallery.propTypes = {

};

Gallery.defaultProps = {};

export default Gallery;
