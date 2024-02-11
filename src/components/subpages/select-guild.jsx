import React, { Fragment } from 'react';
import Image from 'next/image';
import Layout from '@/components/layout';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';

function SelectGuild({ guildsData, isLoading, onSelect }) {
    if (isLoading) {
        return (
            <Layout loading>
                loading servers...
            </Layout>
        );
    }

    return (
        <Layout centered>
            <div className="flex flex-col items-center gap-5">
                <Alert>
                    <AlertTitle>Select the Server</AlertTitle>
                    <AlertDescription>
                        You need to select the server for which you want to see the gallery.
                    </AlertDescription>
                </Alert>
                {(guildsData && guildsData?.data) && (
                    <Select onValueChange={(value) => onSelect(value)}>
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
            </div>
        </Layout>
    );
}

SelectGuild.propTypes = {

};

SelectGuild.defaultProps = {};

export default SelectGuild;
