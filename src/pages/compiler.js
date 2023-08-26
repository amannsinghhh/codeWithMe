import React, { useState, useRef, useEffect } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../action';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast';
const Compiler = () => {
    const socket = ('http://localhost:5000');
    const socketRef = useRef(null);
    const location = useLocation();
    const reactNavigator = useNavigate();
    const { roomId } = useParams();
    const [clients, setClients] = useState([

    ]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
            }
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room`)
                }
                setClients(clients);
            })
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId }) => {
                toast.success(`Someone left`)
                setClients((prev) => {
                    return prev.filter(
                        (client) => client.socketId !== socketId
                    );
                })
            })
        };
        init();
        return () => {
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);

        }
    }, []);

    function leaveroom() {
        reactNavigator('/')
    }

    async function copyroomid() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID copied')
        }
        catch (err) {
            toast.error('Not Copied')
        }
    }

    if (!location.state) {
        return < Navigate to="/" />;
    }

    return <div className='mainblock'>
        <div className='sidebar'>
            <div className='innersidebar'>
                <div className='logo'>
                    <img src='/logo1.png' alt='logo' className='logoimg' />
                </div>
                <h3>Connected</h3>
                <div className='clientsList'>
                    {
                        clients.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))
                    }
                </div>
            </div>
            <button className='btn copybtn' onClick={copyroomid}>Copy Room ID</button>
            <button className='btn leavebtn' onClick={leaveroom}>Leave</button>
        </div>
        <div className='editorblock'>
            <Editor socketRef={socketRef} roomId={roomId} />
        </div>
    </div>
};

export default Compiler;