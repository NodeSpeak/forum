import React, { useState } from 'react';
import './PostForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faSpinner } from '@fortawesome/free-solid-svg-icons';


const PostForm = ({ contract, accounts, onCommentSubmit, setPostText, postText }) => {
    const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1MGY5MmY4My1iYjk1LTRkMTUtYTg5YS04Mzc5MWQ4ZDQyNmIiLCJlbWFpbCI6ImFyaWVsLnJhbWlyZXpAcjJzb2Z0d2FyZS5uZXQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNzJlOGU5MmJkOWE2ZjNmMTE1NTgiLCJzY29wZWRLZXlTZWNyZXQiOiI1ZGZhYTU5NGZjMmZhMWY1YzlkOWNjMWEzYjdmZjU0N2FmYTMzNDJmNTc5OThjZmE5N2FlM2ViODE3MTBhMmM5IiwiaWF0IjoxNzAzMzM3MzY1fQ.u47eTexFaslyVuxpBakuhbNhqJ03a7TYS8LYS2D0NwU'

    const [userImage, setUserImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0]; 
        setUserImage(file);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        try {

            if (contract && accounts.length > 0 && userImage) {
                setIsSubmitting(true);

                const reader = new FileReader();
                reader.readAsArrayBuffer(userImage);

                reader.onloadend = async () => {
                    const imageBuffer = new Uint8Array(reader.result);

                    const pinataData = new FormData();
                    pinataData.append('file', new Blob([imageBuffer], { type: userImage.type }), userImage.name);
                    pinataData.append('pinataMetadata', JSON.stringify({
                        name: userImage.name,
                    }));
                    pinataData.append('pinataOptions', JSON.stringify({
                        cidVersion: 0,
                    }));

                    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${JWT}`,                        },
                        body: pinataData,
                    });

                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.statusText}`);
                    }

                    const data = await response.json();
                    const imageUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
                    onCommentSubmit(postText, imageUrl);
                };
            } else {
                console.error('No se ha seleccionado ninguna imagen.');
            }
        } catch (error) {
            console.error('Error al enviar el formulario', error.message);

        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChangeInput = (e) => {
        setPostText(e.target.value);
    };

    return (
        <form className="CommentForm" onSubmit={handleCommentSubmit}>
            <label htmlFor="comment">Contenido:</label>
            <input type="text" id="comment" name="comment" value={postText} onChange={handleChangeInput} />

            <label htmlFor="ipfsImage">Imagen:</label>
            <input type="file" id="ipfsImage" name="ipfsImage" accept="image/*" onChange={handleImageChange} />

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '5px' }} />
                        Enviando...
                    </>
                ) : (
                    <>
                        <span className="icon-padding">
                            <FontAwesomeIcon icon={faChartSimple} />
                        </span>
                        Enviar
                    </>
                )}
            </button>
        </form>
    );
}

export default PostForm;