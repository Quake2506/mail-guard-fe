export type EmailUser = {
    email: string;
    id: number;
}

export type Email = {
    subject: string;
    body: string;
    id: number;
    sender_id: number;
    reciever_id: number;
    timestamp: string;
    is_read: boolean;
    is_spam: boolean;
    sender: EmailUser;
    reciever: EmailUser;
}