export class CommentsService {

    private static readonly instance: CommentsService = new CommentsService();

    public static getInstance() {
        return CommentsService.instance;
    }

    private constructor() {
    }

    listComments() {
        return fetch('http://localhost:8080/api/comment').then(response => {
            if (response.status !== 200) {
                console.warn('error fetching comments: ' + response.status);
                // TODO errorhandling …
            }
            return response.json() as Promise<Comment[]>;
        });
    }

    addComment(comment: Comment) {
        return fetch('http://localhost:8080/api/comment', { method: 'PUT', body: JSON.stringify(comment), headers: { 'content-type': 'application/json'} })
            .then(response => {
                if (response.status !== 200) {
                    console.warn('error adding new comment ' + response.status);
                }
                return response.json() as Promise<Comment>;
            });
    }

    updateComment(comment: Comment) {
        return fetch(`http://localhost:8080/api/comment/${comment.id}`, { method: 'POST', body: JSON.stringify(comment), headers: { 'content-type': 'application/json' } })
            .then(response => {
                if (response.status !== 200) {
                    console.warn('error updating comment ' + response.status);
                }
                return response.json() as Promise<Comment>;
            })
    }

    deleteComment(comment: Comment) {
        return fetch(`http://localhost:8080/api/comment/${comment.id}`, { method: 'DELETE' })
            .then(response => {
                if (response.status !== 200) {
                    console.warn('error deleting comment ' + response.status);
                }
                return response.json() as Promise<Comment>;
            })
    }
}

export interface Comment {

    id?: string;

    comment: string;

    dateAdd?: string;
}