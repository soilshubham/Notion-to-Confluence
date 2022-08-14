const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8000;

dotenv.config();

app.use(cors());
app.use(bodyParser.json());


const parsePageContent = (data) => {
    const content = []
    data.map((block) => {
        switch (block.type) {
            case 'paragraph':
                content.push({
                    text: block.paragraph.rich_text[0].plain_text,
                    type: 'paragraph'
                })
                break;
            case 'numbered_list_item':
                content.push({
                    text: block.numbered_list_item.rich_text[0].plain_text,
                    type: 'numbered_list_item'
                })
                break;
            case 'bulleted_list_item':
                content.push({
                    text: block.bulleted_list_item.rich_text[0].plain_text,
                    type: 'bulleted_list_item'
                })
                break;
        }
    })
    return content;
}


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/oauth/notion', async (req, res) => {
    if (req.query.code) {
        try {
            const response = await axios.post('https://api.notion.com/v1/oauth/token', {
                grant_type: 'authorization_code',
                code: req.query.code,
                redirect_uri: "http://localhost:3000/redirect_url"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`)
                }
            })
            console.log(response.data);
            res.json({
                token: response.data.access_token,
                owner: response.data.owner
            });
        }
        catch (err) {
            res.json({
                error: err.message
            });
        }


    }
    else {
        res.json({ msg: 'No code found' });
    }
});

app.get('/api/oauth/conf', async (req, res) => {
    if (req.query.code) {
        try {
            const response = await axios.post('https://auth.atlassian.com/oauth/token', {
                grant_type: 'authorization_code',
                client_id: process.env.CONF_CLIENT_ID,
                client_secret: process.env.CONF_CLIENT_SECRET,
                code: req.query.code,
                redirect_uri: "http://localhost:3000/redirect_url_conf"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            console.log(response.data);
            res.json({
                token: response.data.access_token
            });
        }
        catch (err) {
            res.json({
                error: err.message
            });
        }


    }
    else {
        res.json({ msg: 'No code found' });
    }
});

app.post('/api/page/details', async (req, res) => {
    if (req.body.pageId && req.body.token) {
        try {
            const response = await axios.get(`https://api.notion.com/v1/pages/${req.body.pageId}/properties/title`, {
                headers: {
                    'Notion-Version': '2022-06-28',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${req.body.token}`
                }
            })
            res.json(response.data);
        }
        catch (err) {
            res.json({
                error: err.message
            });
        }
    }
    else {
        res.json({ msg: 'No pageId found' });
    }
})

app.post('/api/page/content', async (req, res) => {
    if (req.body.pageId && req.body.token) {
        try {
            const response = await axios.get(`https://api.notion.com/v1/blocks/${req.body.pageId}/children`, {
                headers: {
                    'Notion-Version': '2022-06-28',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${req.body.token}`
                }
            })
            const data = parsePageContent(response.data.results);
            res.json(data);
        }
        catch (err) {
            res.json({
                error: err.message
            });
        }
    }
    else {
        res.json({ msg: 'No pageId found' });
    }
})

app.post('api/conf/space', async (req, res) => {
    try {
        const response = await axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${req.body.token}`
            }
        })

        const cloudId = response.data[0]?.id

        const space = await axios.post(`https://api.atlassian.com/ex/confluence/${cloudId}/rest/api/space`, {
            key: "notion2conf",
            name: "Notion2Confluence",
            type: "global",
            description: {
                plain: {
                    value: "Notion2Confluence Space",
                    representation: "plain"
                }
            }
        })
        const spaceKey = ''
        if (space.status === 200) {
            spaceKey = space.data.key;
        }
        else {
            spaceKey = "notion2conf"
        }
    }
    catch (err) {
        res.json({
            error: err.message
        });
    }
})

app.post('api/conf/page', async (req, res) => {
    try {
        const response = await axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
            type: "page",
            title: req.body.title,
            space: {
                key: "notion2conf"
            },
            body: {
                storage: {
                    value: req.body.content,
                    representation: "storage"
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${req.body.token}`
            }
        })

        res.json({
            status: 200,
            msg: "Page created successfully"
        });
    }
    catch (err) {
        res.json({
            error: err.message
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
}
);