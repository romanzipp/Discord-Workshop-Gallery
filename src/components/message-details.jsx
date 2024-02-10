import React, {
    Fragment, useEffect, useState, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkBreaks from 'remark-breaks';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { Button } from '@/components/ui/button';
import {
    Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext,
} from '@/components/ui/carousel';
import UserPreview from '@/components/user-preview';
import alertStyles from '@/styles/alert.module.css';
import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel,
} from '@/components/ui/alert-dialog';

function MessageDetails({
    selectedMessage,
    setSelectedMessage,
    selectMessagePrev,
    prevMessage,
    selectMessageNext,
    nextMessage,
}) {
    const [selectedMessageContent, setSelectedMessageContent] = useState(null);

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

    return (
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
                        <div className="mx-auto max-h-48 max-w-4xl overflow-y-auto px-4">
                            {selectedMessageContent && (
                                <div dangerouslySetInnerHTML={{ __html: selectedMessageContent }} />
                            )}
                        </div>
                    </div>
                </AlertDialogHeader>
                <div className="flex grow flex-col px-10">
                    <Carousel
                        onInit={(api) => onCarouselInit(api)}
                        onDestroy={(api) => onCarouselDestroy(api)}
                        className="grow"
                    >
                        <CarouselContent className="h-full">
                            {selectedMessage.attachments?.map((attachment) => (
                                <Fragment key={attachment.id}>
                                    <CarouselItem className="relative h-full">
                                        <a
                                            href={attachment.url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                src={attachment.url}
                                                className="absolute size-full object-contain"
                                                alt=""
                                            />
                                        </a>
                                    </CarouselItem>
                                </Fragment>
                            ))}
                        </CarouselContent>

                        {selectedMessage.attachments?.length > 1 && (
                            <>
                                <CarouselPrevious />
                                <CarouselNext />
                            </>
                        )}
                    </Carousel>

                    {selectedMessageAttachments?.length > 1 && (
                        <div className="mb-2 flex h-24 justify-center gap-4 pt-6">
                            {selectedMessageAttachments?.map((attachment, index) => (
                                <Fragment key={attachment.id}>
                                    <button
                                        onClick={() => onClickAttachmentThumbnail(attachment, index)}
                                        type="button"
                                        className="block h-full"
                                    >
                                        <img
                                            src={attachment.url}
                                            className={classNames(
                                                attachment.active ? '' : 'opacity-60',
                                                'h-full rounded-md object-contain',
                                            )}
                                            alt=""
                                        />
                                    </button>
                                </Fragment>
                            ))}
                        </div>
                    )}
                </div>
                <AlertDialogFooter className="gap-4">
                    <Button
                        onClick={() => selectMessagePrev()}
                        disabled={!prevMessage}
                        className="min-w-24"
                    >
                        Previous
                    </Button>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <Button
                        onClick={() => selectMessageNext()}
                        disabled={!nextMessage}
                        className="min-w-24"
                    >
                        Next
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

MessageDetails.propTypes = {

};

MessageDetails.defaultProps = {};

export default MessageDetails;
