import React, {useEffect, useState} from 'react';
import {DateTime} from "luxon";
import {distinctUntilChanged, interval, map} from "rxjs";
import {Tooltip} from "@mui/material";

function RelativeTimeComponent(props: { time: string }) {
  const [absoluteTime, setAbsoluteTime] = useState<string>();
  const [relativeTime, setRelativeTime] = useState<string>();

  useEffect(() => {
    const timeObj = DateTime.fromISO(props.time);
    setAbsoluteTime(timeObj.toLocaleString({ minute: '2-digit', hour: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }));
    setRelativeTime(timeObj.toRelative({ locale: 'de' }) || '');
    const subscription = interval(1000).pipe(
      map(() => timeObj.toRelative({ locale: 'de' })),
      distinctUntilChanged()
    ).subscribe({
      next: relativeTime => setRelativeTime(relativeTime || '')
    });
    return () => subscription.unsubscribe()
  }, [props.time]);

  return (
    <>
      <Tooltip title={absoluteTime} enterDelay={300}>
        <span>{relativeTime}</span>
      </Tooltip>
    </>
  );
}

export default RelativeTimeComponent;