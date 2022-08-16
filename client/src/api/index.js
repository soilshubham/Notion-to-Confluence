import axios from "axios";

export const getAuthToken = async (code) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/oauth?code=${code}`)
        console.log(response);
        if (response.data.token) {
            sessionStorage.setItem('token_notion', response.data.token);
            sessionStorage.setItem('owner', JSON.stringify(response.data.owner));
        }
        window.location.href = '/';
    }
    catch (err) {
        console.log(err);
    }
}

export const getPageData = async (pageId) => {
    try {
        const response = await axios.post(`http://localhost:8000/api/page/details`, {
            pageId: pageId,
            token: sessionStorage.getItem('token_notion')
        })
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export const getPageContent = async (pageId) => {
    try {
        const response = await axios.post(`http://localhost:8000/api/page/content`, {
            pageId: pageId,
            token: sessionStorage.getItem('token_notion')
        })
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export const createSpace = async () => {
    try {
        const response = await axios.post(`http://localhost:8000/api/conf/space`, {
            token: sessionStorage.getItem('token_conf')
        })
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export const createPage = async (title, content) => {
    try {
        const response = await axios.post(`http://localhost:8000/api/conf/page`, {
            title: title,
            content: content,
            token: sessionStorage.getItem('token_conf')
        })
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}
