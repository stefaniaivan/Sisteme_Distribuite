import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function Chart({ data }) {
    return (
        <BarChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" label={{ value: 'Hour', position: 'insideBottom' }} />
            <YAxis label={{ value: 'Consumption (kWh)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="consumption" fill="#8884d8" />
        </BarChart>
    );
}

export default Chart;