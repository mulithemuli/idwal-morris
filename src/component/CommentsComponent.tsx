import React, {useCallback, useEffect, useState} from 'react';
import {Comment, CommentsService, HttpError} from "../service/commentsService";
import CommentComponent from "./CommentComponent";
import {DateTime} from "luxon";
import {FormControl, IconButton, Input, InputAdornment, InputLabel, List, ListItemButton} from "@mui/material";
import {ArrowDownward, ArrowUpward, Delete, Save, Undo} from "@mui/icons-material";

const commentsService = CommentsService.getInstance();

function CommentsComponent() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [editComment, setEditComment] = useState<Comment>({ comment: '' });
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const sort = useCallback((comments: Comment[], newSortDirection?: 'asc' | 'desc') => {
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
  }, [sortDirection]);

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

  useEffect(() => {
    commentsService
    .listComments()
    .then((comments: Comment[]) => {
      setComments(sort(comments));
    });
  }, [sort]);

  return (
    <>
      <form className="comment-form">
        <FormControl variant="standard">
          <InputLabel htmlFor="comment">Kommentar</InputLabel>
          <Input
            id="comment"
            multiline
            rows={2}
            value={editComment.comment}
            onChange={e => setEditComment({ id: editComment.id, dateAdd: editComment.dateAdd, comment: e.currentTarget.value })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="Speichern" onClick={() => doSaveComment()} disabled={!editComment || editComment.comment === ''} color="primary">
                  <Save/>
                </IconButton>
                {
                  editComment.comment !== '' ? (
                    <IconButton aria-label="Zurücksetzen" onClick={() => resetEditComment()} color="secondary">
                      <Undo/>
                    </IconButton>
                  ) : (<></>)
                }
                {
                  editComment.id ? (
                    <IconButton aria-label="Löschen" onClick={() => doDeleteComment(editComment)} color="warning">
                      <Delete/>
                    </IconButton>
                  ) : (<></>)
                }
              </InputAdornment>
            } />
        </FormControl>
      </form>
      <div>
        <IconButton aria-label="Sortierung: neueste zuerst" onClick={() => setComments(sort(comments, 'desc'))} color="secondary">
          <ArrowDownward/>
        </IconButton>
        <IconButton aria-label="Sortierung: älteste zuerst" onClick={() => setComments(sort(comments, 'asc'))} color="secondary">
          <ArrowUpward/>
        </IconButton>
      </div>
      <List>
        {
          comments.map(comment => (
            <ListItemButton key={comment.id} selected={ editComment.id === comment.id } onClick={() => doEditComment(comment)}>
              <CommentComponent comment={comment} editAction={doEditComment} deleteAction={doDeleteComment} />
            </ListItemButton>
          ))
        }
      </List>
    </>
  );
}

export default CommentsComponent;