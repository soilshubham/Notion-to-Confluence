import { useEffect, useState } from 'react';
import './Page.scss';
import Navbar from './Navbar';
import { getPageContent, createSpace, createPage } from '../api';
import { Link, useParams, useSearchParams } from 'react-router-dom';

const Page = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const pageTitle = searchParams.get('title');
    const [pageContent, setPageContent] = useState('');

    const getPageContentArray = async (pageID) => {
        const res = await getPageContent(pageID);
        setPageContent(res);
        console.log(res);
    }

    const handleConvert = async (e) => {
        e.preventDefault();
        const space = await createSpace();
        const page = await createPage(pageTitle, pageContent, space.id);
    }

    useEffect(() => {

        if (!sessionStorage.getItem('token_notion')) {
            window.location.href = '/';
        }
        document.title = 'Edit Content';

        getPageContentArray(id)


    }, []);

    return (
        <>
            <Navbar />
            <div id="page">
                <div className="header">
                    Notion2Confluence
                    <div className="page-title">
                        {pageTitle}
                    </div>
                </div>
                <div className="content">
                    {
                        pageContent.map((item, index) => {
                            return (
                                <div key={index} className='block'>
                                    {item.text}
                                </div>
                            )
                        })
                    }
                </div>

                <div className="footer">
                    <button className="convert-btn">
                        Convert
                    </button>
                </div>
            </div>
        </>
    );
}

export default Page;