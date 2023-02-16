export class CommentsService {

    private static readonly instance: CommentsService = new CommentsService();

    public static getInstance() {
        return CommentsService.instance;
    }

    private constructor() {
    }

    listComments() {
        return fetch('http://localhost:8080/api/comment').then(response => {
            this.handleErrorResponse(response);
            return response.json() as Promise<Comment[]>;
        });
    }

    addComment(comment: Comment) {
        return fetch('http://localhost:8080/api/comment', { method: 'PUT', body: JSON.stringify(comment), headers: { 'content-type': 'application/json'} })
            .then(response => {
                this.handleErrorResponse(response);
                return response.json() as Promise<Comment>;
            });
    }

    updateComment(comment: Comment) {
        return fetch(`http://localhost:8080/api/comment/${comment.id}`, { method: 'POST', body: JSON.stringify(comment), headers: { 'content-type': 'application/json' } })
            .then(response => {
                this.handleErrorResponse(response);
                return response.json() as Promise<Comment>;
            })
    }

    deleteComment(comment: Comment) {
        return fetch(`http://localhost:8080/api/comment/${comment.id}`, { method: 'DELETE' })
            .then(response => {
                this.handleErrorResponse(response);
                return response.json() as Promise<Comment>;
            })
    }

    private handleErrorResponse(response: Response) {
        if (response.status !== 200) {
            throw {
                response: response
            };
        }
    }
}

export interface Comment {

    id?: string;

    comment: string;

    dateAdd?: string;
}

export interface HttpError {

    response: Response;

    message?: string;
}