import { lazy } from 'react';

const Pages = {
    Chat: lazy(() => import('./chat')),
    DocsChat: lazy(() => import('./chat/docs')),
    ChatWithFile: lazy(() => import('./chat_with_file')),
} as IPages;

export default Pages





 