
export interface schemeChatbot {
    id: string
    title: string;
    description: string;
}

export interface ResultSearch {
    _index: string;
    _id: string;
    _score: number;
    _source: schemeChatbot
}