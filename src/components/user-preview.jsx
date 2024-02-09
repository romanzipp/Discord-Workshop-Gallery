import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import moment from 'moment/moment';

function UserPreview({ author }) {
    return (
        <div className="flex items-center gap-2 text-white/90">
            <Image
                src={author.avatarURL}
                alt={author.username}
                height={24}
                width={24}
                className="rounded-full"
            />
            {author.globalName}
        </div>
    );
}

UserPreview.propTypes = {};

UserPreview.defaultProps = {};

export default UserPreview;
