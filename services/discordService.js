import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const NOTIFICATION_TEMPLATES = {
    PATIENT: {
        CREATE: (name, id) => `🏥 New Patient Added: ${name} (ID: ${id})`,
        UPDATE: (name, id) => `🔄 Patient Updated: ${name} (ID: ${id})`,
        DELETE: (name, id) => `❌ Patient Deleted: ${name} (ID: ${id})`,
        GET: (id) => `📋 Patient Record Accessed (ID: ${id})`
    },
    INTERVENTION: {
        CREATE: (patientId, desc) => `💉 New Intervention for Patient ${patientId}: ${desc}`,
        UPDATE: (patientId, desc) => `🔄 Updated Intervention for Patient ${patientId}: ${desc}`,
        DELETE: (patientId) => `❌ Intervention Deleted for Patient ${patientId}`,
        GET: (patientId) => `📋 Interventions Accessed for Patient ${patientId}`
    }
};

export const sendDiscordNotification = async (message) => {
    try {
        if (!DISCORD_WEBHOOK_URL) {
            console.error('Discord webhook URL not configured');
            return;
        }

        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: message,
                username: 'Hospital API Bot'
            })
        });
    } catch (error) {
        console.error('Discord notification error:', error);
    }
};

export { NOTIFICATION_TEMPLATES };