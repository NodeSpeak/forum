import React, { useState, useEffect } from 'react';
import Post from './components/Post';
import Web3 from 'web3';
import './App.css';
import contractAbi from './contractAbi';
import PostForm from './components/PostForm';

function App() {

    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [postText, setPostText] = useState('');
    const [posts, setPosts] = useState([]);
    const [contract, setContract] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const deployedContract = '0x7709FB782C32607e95Ab64cD975735FC933C02Cb';
    const [showForm, setShowForm] = useState(false);

    const handlePostSubmit = async (commentText, imageUrl) => {
        const hardCodedTopic = 'General';
        try {
            if (contract) {
                await contract.methods.postComment(commentText, imageUrl, hardCodedTopic).send({ from: accounts[0] });

                const newComment = { comment: commentText, imageUrl , topic : hardCodedTopic};

                setPosts((oldComments) => [...oldComments, newComment]);

                setPostText('');
                setImageUrl('');
            }
        } catch (error) {
            console.error('Error al enviar el comentario al contrato:', error);
        }
    };

    const initWeb3 = async () => {
        try {
            if (window.ethereum) {
                const newWeb3 = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setWeb3(newWeb3);
            } else if (window.web3) {
                const newWeb3 = new Web3(window.web3.currentProvider);
                setWeb3(newWeb3);
            } else {
                console.error('Instancia de Web3 no detectada');
            }
        } catch (error) {
            console.error('Error al conectar con MetaMask:', error.message);
        }
    };

    const initContract = () => {
        if (web3) {
            const newContract = new web3.eth.Contract(contractAbi, deployedContract);
            setContract(newContract);

        }
    };

    const updateAccounts = async () => {
        if (web3) {
            try {
                const accounts = await web3.eth.getAccounts();
                setAccounts(accounts);
            } catch (error) {
                console.error('Error al obtener cuentas:', error.message);
            }
        }
    };

    const handleLogout = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });

                if (accounts.length > 0) {
                    await window.ethereum.request({
                        method: 'eth_requestAccounts',
                        params: [{ eth_accounts: {} }],
                    });
                }
            }

            setWeb3(null);
            setAccounts([]);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const getComments = async () => {
        try {
            if (contract && accounts.length > 0) {
                const commentsArray = await contract.methods.getAllComments().call();
                setPosts(commentsArray);
            }
        } catch (error) {
            console.error('Error al obtener comentarios del contrato:', error.message);
        }
    };

    const handleDeleteComment = async (index) => {
        try {
            if (contract && accounts.length > 0) {
                await contract.methods.deleteComment(index).send({ from: accounts[0] });
                getComments();
            }
        } catch (error) {
            console.error('Error al eliminar el comentario del contrato:', error);
        }
    };

    const handleConnectClick = () => {
        initWeb3();
    };



    useEffect(() => {
        initWeb3();
    }, []);

    useEffect(() => {
        updateAccounts();
    }, [web3]);

    useEffect(() => {
        initContract();
    }, [web3]);

    useEffect(() => {
        getComments();
    }, [contract, accounts]);

    return (
        <div className="App">
            <header className="header">
                {web3 ? (
                    <div className="user-info">
                        <p>Cuenta conectada: {accounts.length > 0 ? accounts[0] : 'No conectado'}</p>
                        <hr className="divider" />
                        <p>Contrato deployado: {accounts.length > 0 ? deployedContract : 'No deployado'}</p>
                        <button className="logout-button" onClick={handleLogout}>
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <button className="connect-button" onClick={handleConnectClick}>
                        Conectar con MetaMask
                    </button>
                )}
            </header>

            <main>
                <div className="toggle-buttons">
                    <button onClick={() => setShowForm(true)}>Crear Post</button>
                    <button onClick={() => setShowForm(false)}>Posts</button>
                </div>

                {web3 && (
                    <>
                        {showForm && (
                            <PostForm
                                contract={contract}
                                accounts={accounts}
                                onCommentSubmit={handlePostSubmit}
                                setPostText={setPostText}
                                postText={postText}
                            />
                        )}
                        {!showForm && (
                            <Post
                                address={accounts[0]}
                                postList={posts}
                                omCommentRemove={handleDeleteComment}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default App;