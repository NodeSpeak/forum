
import React, { useState } from 'react';
import './Post.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faExchangeAlt, faChartSimple, faTrash } from '@fortawesome/free-solid-svg-icons';

const Post = ({ address, postList, omCommentRemove }) => {
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [isComments, setIsComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const handleLike = () => {
        setLiked(!liked);
        console.log(liked)
    };

    const handleAddComent = () => {
        setIsComments(true)
        console.log('quiero hacer un comentario');
    }

    const handleAddComment = (e) => {
        e.preventDefault();
        const updatedComments = [...comments, { content: newComment }];
        setComments(updatedComments);
        setNewComment('');
    };

    const handleRemoveComment = (index) => {
        const updatedComments = [...comments];
        updatedComments.splice(index, 1);
        setComments(updatedComments);
    };
    return (
        postList.map((comment, index) => {
            if (comment.isActive) {
                return (
                    <div className='post-container' key={index}>
                        <div className="post">
                            <div className="header-content">
                                <span className="username">{comment.user}</span>
                                <div className='muted'>
                                    <span className="date"> 22m.</span>
                                </div>
                            </div>

                            <div className="post-content">
                                <p>{comment.content}</p>
                                {comment.imageUrl && <img src={comment.imageUrl}
                                    alt="Post" className="post-image" />}
                            </div>

                            <hr className="divider" />

                            <div className="post-actions" >
                                <div onClick={handleLike}>
                                    {liked ? (
                                        <FontAwesomeIcon icon={faHeartSolid} className="heart-icon-filled" />
                                    ) : (
                                        <FontAwesomeIcon icon={faHeartOutline} />
                                    )}
                                </div>
                                <span className="icon-padding"></span>
                                <FontAwesomeIcon icon={faExchangeAlt} />
                                <span className="icon-padding"></span>

                                <div onClick={handleAddComent}>

                                    <FontAwesomeIcon icon={faCommentAlt} />
                                </div>
                                <span className="icon-padding"></span>
                                <FontAwesomeIcon icon={faChartSimple} />

                                <span className="icon-padding"></span>
                                <FontAwesomeIcon icon={faTrash} onClick={() => omCommentRemove(index)} />

                                {isComments ?
                                    (
                                        <form onSubmit={handleAddComment}>
                                            <input
                                                type="text"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Añadir un comentario..."
                                            />
                                            <button type="submit">Añadir</button>
                                        </form>
                                    ) : null
                                }
                                {comments.map((comment, index) => (
                                    <div key={index} className="comment">
                                        {/* Renderizar detalles del comentario */}
                                        <p>{comment.content}</p>
                                        {/* Otros elementos del comentario */}
                                        <FontAwesomeIcon icon={faTrash} onClick={() => handleRemoveComment(index)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            }
            return null;
        })
    );
};

export default Post;