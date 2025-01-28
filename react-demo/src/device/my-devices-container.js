import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeviceTable from './components/device-table';
import * as API_DEVICES from './api/device-api';
import { Button, Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { jwtDecode } from 'jwt-decode';
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs"; 
import * as API_MONITORING from "../monitoring/api/monitoring-api";
import Chart from "../monitoring/Chart"

function MyDevicesContainer() {
    const [deviceIds, setDeviceIds] = useState([]);  
    const [devices, setDevices] = useState([]);      
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(sessionStorage.getItem('role') || '');
    const [notifications, setNotifications] = useState([]);
    const [deviceId, setDeviceId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub;

        API_DEVICES.getDevicesByEmail(email, token, (deviceIds, status, error) => {
            if (status === 200 && deviceIds) {
                setDeviceIds(deviceIds);  
            } else {
                console.error("Error fetching device IDs:", error);
                setError("Failed to fetch device IDs."); 
            }
            setLoading(false); 
        });
    }, []);

    useEffect(() => {
        if (deviceIds.length === 0) return; 

        deviceIds.forEach((id) => {
            API_DEVICES.getDeviceById({ id }, (device, status, error) => {
                if (status === 200 && device) {
                    setDevices((prevDevices) => [...prevDevices, device]);  
                } else {
                    console.error(`Error fetching device for ID ${id}:`, error);
                    setError(`Failed to fetch device with ID ${id}`); 
                }
            });
        });
    }, [deviceIds]);

    useEffect(() => {
        // const Sock = new SockJS('http://localhost:8083/monitoring/ws');
        const Sock = new SockJS('http://monitoring.localhost/monitoring/ws');
        const stompClient = new Client({
            webSocketFactory: () => Sock,
            onConnect: () => {
                console.log("Connected to WebSocket");
                stompClient.subscribe('/topic/alerts', (message) => {
                    const notification = JSON.parse(message.body);
                    setNotifications((prev) => [...prev, notification]);
                });
            },
            onStompError: (error) => {
                console.error('WebSocket error:', error);
            },
        });
        
        stompClient.activate();
    }, []);

    useEffect(() => {
        if (selectedDeviceId && selectedDate) {
            const formattedDate = formatDate(selectedDate);
            console.log("Formatted Date:", formattedDate);
            API_MONITORING.getMonitoring(selectedDeviceId, formattedDate, (response) => {
                setChartData(response || []);
            });
        }
    }, [selectedDeviceId, selectedDate]);

    const filteredNotifications = notifications.filter(
        (notification) =>
            devices.some((device) => device.id === notification.deviceId) 
    );

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0]; 
    };

    const handleShowChart = (deviceId) => {
        console.log("Selected Device ID:", deviceId);
        setSelectedDeviceId(deviceId); 
    };

    if (loading) {
        return <p>Loading devices...</p>;
    }

    return (
        <div>
            <CardHeader style={{ fontSize: '24px', fontWeight: 'bold' }}>
                <strong> My Devices </strong>
            </CardHeader>
            <Card>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        <DeviceTable tableData={devices} role={role} showCheckButton={true} onShowChart={handleShowChart} />
                    </Col>
                </Row>
            </Card>
            <Card>
                <Row className="mt-3">
                    <Col sm={{ size: '8', offset: 1 }}>
                        <h4>Notifications</h4>
                        <ul>
                            {filteredNotifications.map((n, index) => (
                                <li key={index}>{n.message}</li>
                            ))}
                        </ul>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={{ size: '8', offset: 1 }}>
                        <h5>Select Date</h5>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                console.log("Selected Date:", e.target.value);
                                setSelectedDate(e.target.value);
                            }}
                            className="form-control"
                        />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={{ size: '8', offset: 1 }}>
                        {selectedDeviceId && chartData.length > 0 && (
                            <Card>
                                <CardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                    Energy Consumption Chart
                                </CardHeader>
                                <Chart data={chartData} />
                            </Card>
                        )}
                    </Col>
                </Row>
            </Card>
        </div>
    );
}

export default MyDevicesContainer;
