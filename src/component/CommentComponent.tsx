import React from 'react';
import {Comment} from "../service/commentsService";
import RelativeTimeComponent from "./RelativeTimeComponent";

function CommentComponent(props: { comment: Comment, editAction: (comment: Comment) => void, deleteAction: (comment: Comment) => void }) {
    return (
        <>
            <div>{props.comment.comment}</div>
            <RelativeTimeComponent time={props.comment.dateAdd as string} />
            <div>
                <button type="button" aria-label="Editieren" onClick={() => props.editAction(props.comment)}>Editieren</button>
                <button type="button" aria-label="Löschen" onClick={() => props.deleteAction(props.comment)}>Löschen</button>
            </div>
        </>
    );
}

export default CommentComponent;