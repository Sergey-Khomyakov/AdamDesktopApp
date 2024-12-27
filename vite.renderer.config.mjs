import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                authorization: resolve(__dirname, 'authorization.html'), // добавьте дополнительные страницы по мере необходимости
                userCards: resolve(__dirname, 'userCards.html'),
                polls: resolve(__dirname, 'polls.html'),
                birthdays: resolve(__dirname, 'birthdays.html'),
                catalogNews: resolve(__dirname, 'catalogNews.html'),
                notifications: resolve(__dirname, 'notifications.html'),
                dokumentooborot: resolve(__dirname, 'dokumentooborot.html'),
            },
        },
    },
});
