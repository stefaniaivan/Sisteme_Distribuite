import React from "react";
import { useEffect, useState } from 'react';
import * as API_USERS from "../user/user/api/user-api";
import { Client } from "@stomp/stompjs"; 
import SockJS from "sockjs-client";
import './chat.css'
import { jwtDecode } from "jwt-decode";

function Chat(){
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]); 
    const [currentMessage, setCurrentMessage] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [typingNotification, setTypingNotification] = useState(null);

    const currentConversationMessages = messages[selectedAdmin?.firstName] || [];

    const [userData, setUserData] = useState({
        id: "",
        firstName: "",
        role:"",
        receiverName: "",
        connected: false,
        message: ""
    });

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub;
        fetchAdmins();
        if(decodedToken.role === "admin"){
            fetchUsers();
        }
        fetchUserDetails(email);
        // const savedMessages = localStorage.getItem('messages');
        // if (savedMessages) {
        //     setMessages(JSON.parse(savedMessages));
        // }
    
        const savedSelectedAdmin = localStorage.getItem('selectedAdmin');
        if (savedSelectedAdmin) {
            setSelectedAdmin(JSON.parse(savedSelectedAdmin));
        }
    }, []);

    useEffect(() => {
        const Sock = new SockJS('http://chat.localhost/ws', null, {
            transports: ['websocket', 'xhr-streaming'],
            withCredentials: true, 
          });
        const stompClient = new Client({
            webSocketFactory: () => Sock,
            onConnect: () => {
                console.log("Connected to WebSocket");
                stompClient.subscribe(`/user/${userData.firstName}/private`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    console.log("Received private message:", newMessage);
                    if (newMessage.type === "MESSAGE") {
                        if (newMessage.receiverName === userData.firstName) {
                
                        setMessages((prevMessages) => ({
                            ...prevMessages,
                            [newMessage.senderName]: [...(prevMessages[newMessage.senderName] || []), newMessage]
                        }));
                    }
                        setNotifications((prevNotifications) => [
                            ...prevNotifications,
                            newMessage.senderName 
                        ]);
                    
                    }if (newMessage.type === "TYPING") {
                        setTypingNotification(newMessage.senderName);
                        console.log(typingNotification);
                    } if (newMessage.type === "STOP_TYPING") {
                        setTypingNotification(null);
                    }else if (newMessage.type === "READ") {
                        console.log(`${newMessage.receiverName} has read your messages.`);
                        alert(`${newMessage.receiverName} has read your messages.`);
                    }
                });
            },
        });
        stompClient.activate();
        
        setSocket(stompClient);
        return () => {
            stompClient.deactivate();
        };
    }, [userData.firstName, typingNotification]);
    
    // useEffect(() => {
    //     localStorage.setItem('messages', JSON.stringify(messages));
    // }, [messages]);
    
    useEffect(() => {
        if (selectedAdmin) {
            localStorage.setItem('selectedAdmin', JSON.stringify(selectedAdmin));
        }
    }, [selectedAdmin]);


    function fetchAdmins() {
        return API_USERS.getAdmins((result, status, err) => {
            if (result !== null && status === 200) {
                console.log(result);
                setAdmins(result);
            } else {
                console.error("Error:", err);
            }
        });
    }

    function fetchUsers() {
        return API_USERS.getUsers((result, status, err) => {
            if (result !== null && status === 200) {
                setUsers(result);
            } else {
                console.error("Error:", err);
            }
        });
    }

    function fetchUserDetails(email){
        API_USERS.getUserByEmail(email, (result, status, error) => {
            if (result !== null && status === 200) {
                setUserData((prev) => ({
                    ...prev,
                    firstName: result.firstName, 
                    id: result.id,
                    role: result.role
                }));
                console.log("User data fetched successfully:", result);
            } else {
                console.error("Error fetching user data:", error);
            }
        });
    }

    const handleAdminClick = (admin) => {
        console.log(`Clicked on admin: ${admin.firstName} ${admin.lastName}`);
        setSelectedAdmin(admin);
        setUserData((prev) => ({
            ...prev,
            receiverName: admin.firstName
        }));
    };

    const sendMessage = () => {
        if (socket && socket.connected && currentMessage.trim() !== "") {
            console.log("Message to send:", currentMessage);
            const message = {
                senderName: userData.firstName,
                receiverName: selectedAdmin.firstName,
                message: currentMessage,
                date: new Date().toISOString(),
            };

            console.log(message);

            socket.publish({
                destination: "/app/private-message", 
                body: JSON.stringify(message),
            });

            setMessages((prevMessages) => ({
                ...prevMessages,
                [selectedAdmin.firstName]: [
                    ...(prevMessages[selectedAdmin.firstName] || []),
                    message,
                ],
            }));

            setCurrentMessage(""); 

            const stopMessage = {
                senderName: userData.firstName,
                receiverName: selectedAdmin.firstName,
                type: "STOP_TYPING"
            };
        
            socket.publish({
                destination: "/app/stop-typing",  
                body: JSON.stringify(stopMessage)
            });
        }
    };

    const handleNotificationClick = (sender) => {
        const user = users.find((user) => user.firstName === sender);
        if (user) {
            handleAdminClick(user);
            if (socket) {
                socket.publish({
                    destination: `/app/read-message`,
                    body: JSON.stringify({
                        senderName: sender,
                        receiverName: userData.firstName,
                    }),
                });
            }
        }
        setNotifications((prevNotifications) =>
            prevNotifications.filter((name) => name !== sender)
        );
    };

    const handleTyping = () => {
        const message = {
            senderName: userData.firstName,
            receiverName: selectedAdmin.firstName, 
            type: "TYPING",
        };
    
        if (socket) {
            socket.publish({
                destination: "/app/typing",  
                body: JSON.stringify(message), 
            });
        }
    };

    const handleMessageInput = () => {
        if (selectedAdmin && notifications.includes(selectedAdmin.firstName)) {
            setNotifications((prevNotifications) =>
                prevNotifications.filter((name) => name !== selectedAdmin.firstName)
            );
    
            if (socket) {
                const readNotification = {
                    senderName: selectedAdmin.firstName,
                    receiverName: userData.firstName,
                    type: "READ",
                };
    
                socket.publish({
                    destination: "/app/read-message",
                    body: JSON.stringify(readNotification),
                });
            }
        }
    }

    return (
        <div>
            <div style={{ flex: 2, padding: "20px", position: "relative" }}>
            <h2>{userData.role === "client" ? "Admins" : "Users"}</h2>
                {(userData.role === "client" ? admins : users)
                    .filter((user) => user.id !== userData.id) 
                    .map((user) => (
                        <button
                            key={user.id}
                            onClick={() => handleAdminClick(user)}
                            style={{
                                backgroundColor: 'dodgerblue',
                                color: 'white',
                                border: 'red',
                                margin: '5px',
                                borderRadius: '35px',
                                padding: '10px',
                            }}
                        >
                            {user.firstName} {user.lastName}
                        </button>
                    ))}
            </div>

            <div style={{ flex: 2, padding: "20px", position: "relative" }}>
                <i
                    className="fa-solid fa-bell"
                    style={{ fontSize: '24px', color: 'black', cursor: 'pointer', marginRight: '30px' }}
                />
                {notifications.length > 0 ? (
                notifications.map((sender, index) => (
                    <div key={index} style={{ marginBottom: '5px' }}>
                        <button
                            onClick={() => handleNotificationClick(sender)}
                            style={{
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'red',
                                margin: '5px',
                                borderRadius: '35px',
                                padding: '10px',
                            }}
                        >
                            New message from {sender}
                        </button>
                    </div>
                ))) : (
                    <p>No notifications.</p>
                )}
            </div>

            {selectedAdmin && (
                <div style={{ flex: 2, padding: "20px", position: "relative" }}>
                    <h2>Chat with {selectedAdmin.firstName} {selectedAdmin.lastName}</h2>
                    <div
                        style={{
                            height: "70vh",
                            border: "3px solid skyblue",
                            borderRadius: "5px",
                            padding: "10px",
                            marginBottom: "20px",
                            overflowY: "scroll",
                            backgroundColor: "#f0f8ff",
                        }}
                    >
                        {currentConversationMessages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                justifyContent: msg.senderName === userData.firstName ? "flex-end" : "flex-start",
                                marginBottom: "10px",
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: "60%",
                                    padding: "10px",
                                    borderRadius: "15px",
                                    backgroundColor: msg.senderName === userData.firstName ? "dodgerblue" : "lightgray",
                                    color: msg.senderName === userData.firstName ? "white" : "black",
                                    wordWrap: "break-word",
                                }}
                            >
                                <p style={{ margin: 0 }}>{msg.message}</p>
                                    <small style={{ fontSize: "0.8em", color: "#ddd" }}>{new Date(msg.date).toLocaleString()}</small>
                                </div>
                            </div>
                        ))}
                        {typingNotification &&
                            typingNotification !== userData.firstName && ( 
                                <div className="typing">
                                    <div className="typing__dot"></div>
                                    <div className="typing__dot"></div>
                                    <div className="typing__dot"></div>
                                </div>
                            )}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <input
                            type="text"
                            value={currentMessage}
                            onChange={(e) => {
                                setCurrentMessage(e.target.value);
                                handleTyping();
                            }}
                            onFocus={handleMessageInput}
                            placeholder="Type your message..."
                            style={{
                                flex: 1,
                                padding: "10px",
                                border: '3px solid skyblue',
                                borderRadius: "35px",
                                backgroundColor: "#f0f8ff",
                            }}
                            onBlur={() => {
                                if (socket && selectedAdmin) {
                                    const stopTypingMessage = {
                                        senderName: userData.firstName,
                                        receiverName: selectedAdmin.firstName,
                                        type: "STOP_TYPING",
                                    };
                        
                                    socket.publish({
                                        destination: "/app/stop-typing",
                                        body: JSON.stringify(stopTypingMessage),
                                    });
                                }
                            }} 
                        />
                        <button
                            onClick={sendMessage}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: 'dodgerblue',
                                color: "white",
                                border: "none",
                                borderRadius: "35px",
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;