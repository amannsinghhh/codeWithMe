import React, { useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    }
    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('RoomID & username required');
            return;
        }
        navigate(`/compiler/${roomId}`, {
            state: {
                username,
            },
        })
    }

    const enterbutton = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    }

    return (
        <div className='homepage'>
            <div className='form'>
                <img src='/logo1.png' className='logo' alt='logo' />
                <h4 className='roomidlabel'>Enter the RoomId</h4>
                <div className='inputroomid'>
                    <input type='text' className='input' placeholder='Room ID' onChange={(e) => setRoomId(e.target.value)} value={roomId} onKeyUp={enterbutton} />
                    <input type='text' className='input' placeholder='Username' onChange={(e) => setUsername(e.target.value)} value={username} onKeyUp={enterbutton} />
                    <button className='btn joinbtn' onClick={joinRoom}>Join</button>
                    <span className='createRoom'>
                        Don't have a Room ID? Create one &nbsp;
                        <a onClick={createNewRoom} href='' className='newroomidbtn'>New Room</a>
                    </span>

                </div>
            </div>
            <footer>
                <h4>Built Simply by {''}
                    <a href='https://github.com/amannsinghhh'>AmannSinghhh</a></h4>
            </footer>

        </div>
    )
}

export default Home