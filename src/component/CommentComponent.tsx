import React from 'react';
import {Comment} from "../service/commentsService";
import RelativeTimeComponent from "./RelativeTimeComponent";
import {Avatar, IconButton, ListItemAvatar, ListItemText} from "@mui/material";
import {CommentOutlined, Delete, Edit} from "@mui/icons-material";

function CommentComponent(props: { comment: Comment, editAction: (comment: Comment) => void, deleteAction: (comment: Comment) => void }) {
    return (
        <>
            <ListItemAvatar>
                <Avatar>
                    <CommentOutlined />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.comment.comment} secondary={<RelativeTimeComponent time={props.comment.dateAdd as string} />} />
            <div>
                <IconButton aria-label="Diesen Kommentar editieren" onClick={() => props.editAction(props.comment)}>
                    <Edit/>
                </IconButton>
                <IconButton aria-label="Diesen Kommentar löschen" onClick={() => props.deleteAction(props.comment)}>
                    <Delete />
                </IconButton>
            </div>
        </>
    );
}

export default CommentComponent;