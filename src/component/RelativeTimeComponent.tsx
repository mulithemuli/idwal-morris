import React, {useEffect, useState} from 'react';
import {DateTime} from "luxon";

function RelativeTimeComponent(props: { time: string }) {
    const [absoluteTime, setAbsoluteTime] = useState<string>();
    const [relativeTime, setRelativeTime] = useState<string>();

    useEffect(() => {
        const timeObj = DateTime.fromISO(props.time);
        setAbsoluteTime(timeObj.toLocaleString({ minute: '2-digit', hour: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }));
        setRelativeTime(timeObj.toRelative({ locale: 'de' }) || '');
        setInterval(() => setRelativeTime(timeObj.toRelative({ locale: 'de' }) || ''), 1000);
    }, [props.time]);

    return (
        <div>
            <span title={absoluteTime}>{relativeTime}</span>
        </div>
    );
}

export default RelativeTimeComponent;