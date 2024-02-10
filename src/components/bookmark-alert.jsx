import React from 'react';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';

function BookmarkAlert({ show, onClose }) {
    return (
        <AlertDialog
            open={show}
            onOpenChange={(open) => !open && onClose()}
        >
            <AlertDialogTrigger>Open</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        You should bookmark this page now.
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        You will not have to select your server & channel next time if you bookmark this page now!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction>Ok done, thank you</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

BookmarkAlert.propTypes = {};

BookmarkAlert.defaultProps = {};

export default BookmarkAlert;
