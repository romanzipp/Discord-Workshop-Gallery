import React from 'react';
import Image from 'next/image';

function UserPreview({ author }) {
    return (
        <div className="flex items-center gap-2 text-white/90">
            <Image
                src={author.avatarURL}
                alt={author.username}
                height={24}
                width={24}
                className="whitespace-nowrap rounded-full"
            />
            {author.globalName}
        </div>
    );
}

UserPreview.propTypes = {};

UserPreview.defaultProps = {};

export default UserPreview;
