import React from 'react';
import { useNavigate } from "react-router-dom";
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/mypage.css';

function MyPage() {
    const navigate = useNavigate();

    return (
        <>
        <Heading/>
        <div className='background'><img src="http://localhost:8070/images/oceans.jpg" alt="background"/></div>
        <div className='reviewList' style={{ flex: "4" }} >
            <div className='mypage'>
            <h1>My Page</h1>
            </div>
            <div className='mybtns'>
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
    width: '100%',
    height: '4cm',  // Sets the height of the button to 7cm
    padding: '10px 20px',
    fontSize: '34px',
    cursor: 'pointer',
    backgroundColor: 'skyblue',
    color: 'white',
    border: 'none',
    margin:'0 auto',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
    marginBottom: '3cm',  // Adds 5cm spacing between buttons
};

export default MyPage;
