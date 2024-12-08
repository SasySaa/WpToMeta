require('dotenv').config();
const axios = require('axios');

// Funzione principale per gestire il flusso
async function getRandomPostLink(categoryId) {
    const apiUrl = `https://maestragiulia.net/wp-json/wp/v2/posts?categories=${categoryId}`;
    try {
        const response = await axios.get(apiUrl);
        const posts = response.data;
        if (!posts.length) {
            console.log('Nessun post trovato per la categoria fornita.');
            return null;
        }
        const randomPost = posts[Math.floor(Math.random() * posts.length)];
        console.log(`Link recuperato ${randomPost.link}`);
        return randomPost.link;
    } catch (error) {
        console.error('Errore durante la richiesta API WP:', error.message);
        return null;
    }
}

async function getAuthToken(pageId,appSecret) {
    const apiUrl = `https://graph.facebook.com/oauth/access_token?client_id=${pageId}&client_secret=${appSecret}&grant_type=client_credentials`;
    try {
        const response = await axios.get(apiUrl);
        console.log(response.data);
    } catch (error) {
        console.log(error);
        console.error('Errore durante la richiesta API:', error.message);
        return null;
    }
    
}

async function publishToFacebook(pageAccessToken, pageId, message) {
    const apiUrl = `https://graph.facebook.com/v12.0/${pageId}/feed`;
    try {
        const response = await axios.post(apiUrl, {
            message: message,
            access_token: pageAccessToken,
        });
        console.log('Post pubblicato con successo:', response.data.id);
    } catch (error) {
        console.error('Errore durante la pubblicazione su Facebook:', error.response.data.error.message);
    }
}


(async () => {
    const categoryId = process.env.categoryId; // Legge la categoria da .env
    const appId=process.env.appId;
    const appSecret=process.env.appSecret;
    const pageId=process.env.pageId;

    const link = await getRandomPostLink(categoryId);
    const authToken=await getAuthToken(appId,appSecret);
    await publishToFacebook(authToken, pageId, link);
})();