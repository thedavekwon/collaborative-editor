const axios = require('axios');

// console.log(window.location.href)

const server = process.env.SERVER_ADDR || "127.0.0.1";

export async function createDoc(userId) {
    const url = `http://${server}:8080/doc/create/` + userId;
    const response = await axios.get(url);
    return response;
}

export async function getDoc(docId) {
    const url = `http://${server}:8080/doc/get/` + docId;
    const response = await axios.get(url);
    return response;
}

export async function getDocList(userId) {
    const url = `http://${server}:8080/doc/getlist/` + userId;
    const response = await axios.get(url);
    return response;
}

export async function deleteDoc(docId) {
    const url = `http://${server}:8080/doc/delete/` + docId;
    const response = await axios.get(url);
    return response;
}

export async function updateDocTitle(docId, title) {
    const url = `http://${server}:8080/doc/updatetitle/` + docId + '-' + title;
    const response = await axios.get(url);
    return response;
}

export async function shareDoc(userId, docId) {
    const url = `http://${server}:8080/doc/share/` + userId + '-' + docId;
    const response = await axios.get(url);
    return response;
}