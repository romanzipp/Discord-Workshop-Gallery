import React, { Fragment } from 'react';
import Layout from '@/components/layout';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

function SelectChannel({
    channelsData, isLoading, onSelect, onBack,
}) {
    if (isLoading) {
        return (
            <Layout loading>
                loading channels...
            </Layout>
        );
    }

    return (
        <Layout centered>
            <div className="flex flex-col items-center gap-5">
                <Alert>
                    <AlertTitle>Select the Channel</AlertTitle>
                    <AlertDescription>
                        <p>
                            You need to select channel server for which you want to see the gallery.
                        </p>
                    </AlertDescription>
                </Alert>
                {(channelsData && channelsData?.data) ? (
                    <div>
                        <Select onValueChange={(value) => onSelect(value)}>
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
                        <div className="mt-4">
                            <Button
                                variant="link"
                                size="sm"
                                className="mx-auto"
                                onClick={(() => onBack())}
                            >
                                Back to server selection
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>
                        loading channels...
                    </div>
                )}
            </div>
        </Layout>
    );
}

SelectChannel.propTypes = {};

SelectChannel.defaultProps = {};

export default SelectChannel;
