import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Link 임포트
import jaxios from '../../util/jwtUtil';
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import { location1Data, location2Data } from '../request/LocaionData';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import { useSelector } from 'react-redux';

const MyRequest = () => {
    // const loginUser = useSelector(state => state.user);
    // const userid = getCookie('user');
    // const [posts, setPosts] = useState([]);
    // const [isLocation2Visible, setIsLocation2Visible] = useState(false);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);

    // const fetchAllPosts = () => {
    //     axios.get('/api/rcommunity/getPostList')
    //       .then(response => {
    //         setPosts(response.data.postlist);
    //         console.log('Fetched posts:', response.data); // 로그 추가
    //       })
    //       .then(response => {setPosts(response.data.postlist); console.log(response.data)})
    //       .catch(error => console.error('Error fetching posts:', error));
    //   };



    // const cancelSearch = () => {
    //     setLocation('');
    //     setLocation2('');
    //     setIsLocation2Visible(false);
    //     setPosts([]);
    // };



    return (
        <>
            <Heading />


            <Footer />
        </>
    );
};

export default MyRequest;
