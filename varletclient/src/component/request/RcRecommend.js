import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtUtil';
import { location1Data, location2Data } from '../request/LocaionData';
import { setCookie, getCookie } from "../../util/cookieUtil";
import Footer from '../headerfooter/Footer';
import Heading from '../headerfooter/Heading';

import { useInView } from "react-intersection-observer";

function RcRecommend() {

    const { rnum } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({});
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [files, setFiles] = useState([]);
    const [content, setContent] = useState('');
    const [ setImage] = useState([]);
    const [saveimages, setSaveImages] = useState([]);
    const [setImgSrc] = useState([]);
    const [removedFiles, setRemovedFiles] = useState([]);
    const [replies, setReplies] = useState([]); 
    const replyFormRef = useRef(null);
    // 상태 변수 선언
    const [userCookie, setUserCookie] = useState(getCookie('user'));
    const [size] = useState(5); // 한 번에 가져올 답글 수
    const [page, setPage] = useState(1); // 현재 페이지 상태 추가
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [setTotalReplies] = useState(0); // 전체 답글 수

    const handleSubmitRec = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('userid', userCookie.userid);
        formData.append('content', content);
    
        // 숙소 파일 추가
        accommodationFiles.forEach(fileObj => {
            formData.append('accommodationFiles', fileObj.file);
        });
    
        // 관광지 파일 추가
        touristSpotFiles.forEach(fileObj => {
            formData.append('touristSpotFiles', fileObj.file);
        });
    
        // 기존의 일반 파일 추가
        saveimages.forEach((filename) => {
            formData.append('saveimages', filename);
        });
    
        removedFiles.forEach((filename) => {
            formData.append('removedimages', filename);
        });
    
        jaxios.post(`/api/rcrecommend/writeRecommend/${rnum}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
            alert("답글 작성에 성공했습니다.");
            setShowReplyForm(false);
            setContent('');
            setFiles([]);
            setImage([]);
            setSaveImages([]);
            setImgSrc([]);
            setRemovedFiles([]);
    
            window.location.reload();
        })
        .catch(error => {
            alert('답글 작성에 실패했습니다.');
            console.error(error);
        });
    };
    

    
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const filePreviews = selectedFiles.map(file => ({
        file,
        src: URL.createObjectURL(file)
    }));
    setFiles(filePreviews);

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('image', file));

    jaxios.post('/api/rcrecommend/fileup', formData)
        .then((result) => {
            const { image, savefilenames } = result.data;
            setImage(result.data.image);
            setSaveImages(result.data.savefilenames);
            setImgSrc(savefilenames.map(filename => `http://localhost:8070/uploads/${filename}`));
        })
        .catch((err) => {
            console.error(err);
        });
};
    
const handleRemoveFile = (fileToRemove) => {
    setFiles(prevFiles => prevFiles.filter(file => file.file !== fileToRemove));
    setRemovedFiles(prevRemoved => [...prevRemoved, fileToRemove.name]); // 삭제된 파일 이름을 추가
};

const [accommodationFiles, setAccommodationFiles] = useState([]);
const [touristSpotFiles, setTouristSpotFiles] = useState([]);

const handleAccommodationFileChange = (event) => {
  const files = Array.from(event.target.files).map(file => ({
    file,
    src: URL.createObjectURL(file),
  }));
  setAccommodationFiles(files);
};

const handleTouristSpotFileChange = (event) => {
  const files = Array.from(event.target.files).map(file => ({
    file,
    src: URL.createObjectURL(file),
  }));
  setTouristSpotFiles(files);
};

const handleRemoveAccommodationFile = (file) => {
  setAccommodationFiles(accommodationFiles.filter(fileObj => fileObj.file !== file));
};

const handleRemoveTouristSpotFile = (file) => {
  setTouristSpotFiles(touristSpotFiles.filter(fileObj => fileObj.file !== file));
};


return (
    <>
        <Heading />
        <form onSubmit={handleSubmitRec} className="mt-6 w-full" ref={replyFormRef} >
            <div className='w-full max-w-7xl mx-auto px-1 min-h-screen'>
                <div className="bg-white bg-opacity-90 p-8 shadow-lg min-h-screen mt-[80px]">
                    <div>답글 작성</div>
                    <div className="p-4">
                        <div className="grid gap-6 mb-6 md:grid-cols-1">
                            <div>
                                <label htmlFor="accommodation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">숙소 이름</label>
                                <input
                                    type="text"
                                    id="accommodation"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="숙소 이름"
                                    required
                                />
                                <input
                                    id="accommodation_files"
                                    type="file"
                                    multiple
                                    onChange={handleAccommodationFileChange}
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                />
                                <label className="block mt-2">파일 미리보기</label>
                                <div className="flex flex-wrap mt-4">
                                    {accommodationFiles.map((fileObj, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={fileObj.src}
                                                alt="preview"
                                                style={{ width: '300px', height: '300px', objectFit: 'cover', border: '1px solid #ddd' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAccommodationFile(fileObj.file)}
                                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 여행지 */}
                            <div>
                                <label htmlFor="tourist_spot" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">관광지</label>
                                <input
                                    type="text"
                                    id="tourist_spot"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="관광지 이름"
                                    required
                                />
                                <input
                                    id="tourist_spot_files"
                                    type="file"
                                    multiple
                                    onChange={handleTouristSpotFileChange}
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                />
                                <label className="block mt-2">파일 미리보기</label>
                                <div className="flex flex-wrap mt-4">
                                    {touristSpotFiles.map((fileObj, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={fileObj.src}
                                                alt="preview"
                                                style={{ width: '300px', height: '300px', objectFit: 'cover', border: '1px solid #ddd' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTouristSpotFile(fileObj.file)}
                                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 추가 입력 필드 */}
                        <div>
                            <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company</label>
                            <textarea
                          rows="4"
                          placeholder="답글 내용을 입력하세요"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                      ></textarea>
                        </div>  
                        
                </div>
            </div>
            </div>
        </form>
        <Footer />
    </>
);

}

export default RcRecommend