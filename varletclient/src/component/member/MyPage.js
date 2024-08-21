import React from 'react';
import { useNavigate } from "react-router-dom";
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';

function MyPage() {
    const navigate = useNavigate();

    return (
        <>
        <Heading/>
        <div style={{paddingTop:'100px'}}>
            <h1>My Page</h1>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <button onClick={() => navigate('/myQNA')} style={buttonStyle}>
                    My QNA
                </button>
                <button onClick={() => navigate('/checkPwd')} style={buttonStyle}>
                    My INFO
                </button>
                <button onClick={() => navigate('/myREVIEW')} style={buttonStyle}>
                    My REVIEW
                </button>
                <button onClick={() => navigate('/myREQUEST')} style={buttonStyle}>
                    My REQUEST
                </button>
            </div>
        </div>
        <Footer/>
        </>
    );
}

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: 'skyblue',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
};

export default MyPage;
