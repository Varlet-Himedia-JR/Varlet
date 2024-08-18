import React, { useState, useEffect, useMemo } from 'react';
import axios from '../../util/jwtUtil';
import { useNavigate, useParams } from 'react-router-dom';
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
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
    const editor = useMemo(() => withReact(createEditor()), []);
    const [value, setValue] = useState([
      {
        type: "paragraph",
        children: [{ text: "We have some base content." }]
      }
    ]);
    return (

        <div className="App">
        <h1>React Editors</h1 >
        <h2>Start editing to see Slate in action!</h2>
        <Slate
          editor={editor}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <Editable style={{ border: "1px solid black" }}/>
        </Slate>
      </div>
     );
}

export default RcCommunityWrite;
