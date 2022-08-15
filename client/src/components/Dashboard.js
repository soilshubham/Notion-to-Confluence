import { useEffect, useState } from 'react';
import './Dashboard.scss';
import Navbar from './Navbar';
import { getPageData } from '../api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [pageID, setPageID] = useState('');
    const [pageTitle, setPageTitle] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const pageData = await getPageData(pageID);
        setPageTitle(pageData?.results[0]?.title?.plain_text);
        console.log(pageData);
    }


    useEffect(() => {

        if (!sessionStorage.getItem('token_notion')) {
            window.location.href = '/';
        }
        document.title = 'Dashboard';

    }, []);

    return (
        <>
            <Navbar />
            <div id="dash">
                <div className="header">Notion2Confluence</div>
                <div className="content">
                    <div className="title">
                        Add the Notion Page ID below to get started with the conversion.
                    </div>
                    <input
                        type="text"
                        className="page-inp"
                        placeholder='Page ID...'
                        value={pageID}
                        onChange={(e) => setPageID(e.target.value)}
                    />
                    <button className="add-btn" onClick={handleSubmit}>ADD</button>
                </div>
                {
                    pageTitle !== '' &&
                    <div className="page-container">
                        <div className="page">
                            <img className="page-icon" src={'https://cdn.icon-icons.com/icons2/2389/PNG/512/notion_logo_icon_145025.png'} />
                            <div className="page-content">
                                <div className="page-title">{pageTitle}</div>
                                <div className="page-desc">This is a Notion page</div>
                            </div>
                        </div>
                        <Link to={`/page/${pageID}?title=${pageTitle}`}>
                            <button className="convert-btn">Continue 🡢</button>
                        </Link>
                    </div>
                }
            </div>
        </>
    );
}

export default Dashboard;