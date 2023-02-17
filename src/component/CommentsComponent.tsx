import React, {useEffect, useState} from 'react';
import {CommentsService, Comment, HttpError} from "../service/commentsService";
import CommentComponent from "./CommentComponent";
import {DateTime} from "luxon";

const commentsService = CommentsService.getInstance();

function CommentsComponent() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [editComment, setEditComment] = useState<Comment>({ comment: '' });
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        commentsService
            .listComments()
            .then((comments: Comment[]) => {
                setComments(sort(comments));
            });
    }, []);

    const resetEditComment = () => {
        setEditComment({ comment: '' });
    }

    const doSaveComment = () => {
        if (!editComment || editComment.comment === '') {
            return;
        }
        if (editComment.id) {
            commentsService.updateComment(editComment).then(comment => {
                const index = comments.findIndex(existingComment => existingComment.id === comment.id);
                const newComments = [...comments];
                newComments.splice(index, 1);
                newComments.push(comment);
                resetEditComment();
                setComments(sort(newComments));
            }).catch((error: HttpError) => {
                console.warn(`Unable to modify comment. Server responded with status code ${error.response.status}`);
            });
        } else {
            commentsService.addComment(editComment).then(comment => {
                setComments(sort([...comments, comment]));
                resetEditComment();
            }).catch((error: HttpError) => {
                console.warn(`Unable to add comment. Server responded with status code ${error.response.status}`);
            });
        }
    }

    const doDeleteComment = (comment: Comment) => {
        commentsService.deleteComment(comment).then(comment => {
            comments.splice(comments.findIndex(existingComment => existingComment.id === comment.id), 1);
            resetEditComment();
        }).catch((error: HttpError) => {
            console.warn(`Unable to delete comment. Server responded with status code ${error.response.status}`);
        });
    }

    const doEditComment = (comment: Comment) => setEditComment({ id: comment.id, comment: comment.comment, dateAdd: comment.dateAdd });

    const sort = (comments: Comment[], newSortDirection?: 'asc' | 'desc') => {
        if (!newSortDirection) {
            newSortDirection = sortDirection;
        } else {
            setSortDirection(newSortDirection);
        }
        let sortedComments = comments.sort((c1, c2) => DateTime.fromISO(c1.dateAdd as string).toMillis() - DateTime.fromISO(c2.dateAdd as string).toMillis());
        if (newSortDirection === 'desc') {
            sortedComments = comments.reverse();
        }
        return sortedComments;
    }

    return (
        <>
            <textarea value={editComment.comment} onChange={e => setEditComment({ id: editComment.id, dateAdd: editComment.dateAdd, comment: e.currentTarget.value })}></textarea>
            <button type="button" aria-label="Speichern" onClick={() => doSaveComment()} disabled={!editComment || editComment.comment === ''}>Speichern</button>
            {
                editComment.comment !== '' ? (
                    <button type="button" aria-label="Zurücksetzen" onClick={() => resetEditComment()}>Zurücksetzen</button>
                ) : (<></>)
            }
            {
                editComment.id ? (<button type="button" aria-label="Löschen" onClick={() => doDeleteComment(editComment)}>Löschen</button>) : (<></>)
            }
            <div>
                <button type="button" aria-label="Sortierung: neueste zuerst" onClick={() => { setComments(sort(comments, 'desc')); } }>Neueste zuerst</button>
                <button type="button" aria-label="Sortierung: älteste zuerst" onClick={() => { setComments(sort(comments, 'asc')); } }>Älteste zuerst</button>
            </div>
            <ul>
                {
                    comments.map(comment => (
                        <li key={comment.id}>
                            <CommentComponent comment={comment} editAction={doEditComment} deleteAction={doDeleteComment} />
                        </li>
                    ))
                }
            </ul>
        </>
    );
}

export default CommentsComponent;