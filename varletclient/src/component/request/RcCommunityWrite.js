import React, { useState, useEffect } from 'react';
import axios from '../../util/jwtUtil';
import { useNavigate, useParams } from 'react-router-dom';
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';

function RcCommunityWrite() {
    const { rnum } = useParams(); // URL에서 rnum 파라미터를 추출합니다.
    const [files, setFiles] = useState([]); // 파일 객체와 미리보기 URL을 관리
    const [formData, setFormData] = useState({
        content: '',
        image: '',
        saveimages: '',
        rnum: rnum || 1, // rnum을 URL에서 가져오고, 없으면 1로 설정합니다.
    });
    const [post, setPost] = useState(null); // 게시글 정보를 저장하는 상태
    const navigate = useNavigate();

    useEffect(() => {
        // 컴포넌트가 마운트되거나 rnum이 변경될 때 게시글 정보를 가져옵니다.
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/recommend/getPost/${rnum}`);
                setPost(response.data);
            } catch (error) {
                console.error("게시글 정보를 가져오는 데 실패했습니다.", error);
            }
        };

        fetchPost();
    }, [rnum]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        const newPreviews = [];

        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                newPreviews.push({ src: e.target.result, file });
                if (newPreviews.length === newFiles.length) {
                    setFiles(prevFiles => [...prevFiles, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveFile = (fileToRemove) => {
        setFiles(prevFiles => prevFiles.filter(file => file.file !== fileToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = new FormData();
        postData.append('content', formData.content);
        postData.append('image', formData.image);
        postData.append('saveimages', formData.saveimages);
        postData.append('rnum', formData.rnum);

        for (let i = 0; i < files.length; i++) {
            postData.append('files', files[i]);
        }

        try {
            const response = await axios.post(`/api/recommend/writeRecommend/${formData.rnum}`, postData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            navigate(`/RcommunityView/${rnum}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (


                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 mb-6 md:grid-cols-2 mt-4">
                        <div>
                            <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
                            <input
                                type="text"
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter content"
                                required
                            />
                        </div>
                        {/* 나머지 폼 필드들 */}
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="multiple_files">파일 업로드</label>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="multiple_files"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <label>파일 미리보기</label>
                        <div className="preview-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
                            {files.map(({ src, file }, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <img
                                        src={src}
                                        alt={`preview ${index}`}
                                        style={{ width: '300px', height: '300px', objectFit: 'cover', border: '1px solid #ddd' }}
                                    />
                                    <button
                                        onClick={() => handleRemoveFile(file)}
                                        style={{ position: 'absolute', top: '0', right: '0', backgroundColor: 'red', color: 'white', border: 'none', padding: '5px', borderRadius: '0 0 0 5px' }}
                                    >
                                        ✖
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
     );
}

export default RcCommunityWrite;
