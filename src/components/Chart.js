import React, { useEffect, useState } from "react";
import { getTokens } from "@velarprotocol/velar-sdk"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { curveCardinal } from 'd3-shape';
import axios from "axios";
import moment from "moment";

function Chart() {
  const [data,setData] = useState([]);
  const [price,setPrice] = useState(0);

  const cardinal = curveCardinal.tension(0.2);
  const fetchData = async () => {
    try {
      axios({
        method:"GET",
        url:"https://api.velar.co/prices/historical/SPXW8BXG2S88SX7C1CJ3BVFEGR51SFGRF8DMYC93.pnuts-freedom-farm-stxcity?interval=week"
      }).then((res)=>{
        const response  =  res.data;
        setPrice(response.priceChange);
        const chartData = response.data;
        chartData.reverse();
        setData(chartData);
      })

    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };
  useEffect(() => {
    fetchData()
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p >{`Price: $${payload[0].value.toFixed(6)}`}</p>
          <p >{`Date: ${moment(payload[0].payload.datetime).format("DD MMM YYYY")}`}</p>
        </div>
      );
    }
  
    return null;
  };
  return (
    <div>
      <h2>Chart (Weekly)</h2>
      <div className="chartSection">
        <ResponsiveContainer width={700} height={350}style={{margin:50}}>
          <AreaChart
            width={700}
            height={350}
            data={data}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <YAxis />
            <XAxis tick={false}/>
            <Tooltip content={<CustomTooltip />} />
            <Area type={cardinal} dataKey="value" stroke="#836f5f" fill="#564024" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Chart;
