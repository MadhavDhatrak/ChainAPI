import fetch from 'node-fetch';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export const sendDiscordNotification = async (message) => {
    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: message
            })
        });
    } catch (error) {
        console.error('Discord notification error:', error);
    }
};