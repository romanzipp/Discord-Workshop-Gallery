import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import alertStyles from '@/styles/alert.module.css';
import UserPreview from '@/components/user-preview';
import {
    Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

function MessageDetails({
    selectedMessage, selectedMessageContent, selectedMessageAttachments, setSelectedMessage, onCarouselInit, onCarouselDestroy, selectMessagePrev,
    prevMessage,
    selectMessageNext,
    nextMessage, onClickAttachmentThumbnail,
}) {
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
