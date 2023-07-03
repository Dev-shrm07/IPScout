//import { MapContainer, TileLayer } from 'react-leaflet'
import "./App.css";
import icon from "./icon";
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import arrow from "./images/icon-arrow.svg";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import img from "./images/pattern-bg.png";
import Markerposition from "./Markerposition";
import { Popup, Marker } from "react-leaflet";

function App() {
  const ad = {location: {lat : 56.6, lng: 87.6} }
  
  const [ipAddress, setIpAddress] = useState(null);
  const [address, setAddress] = useState("");
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `http://ip-api.com/json/8.8.8.8`
        );
        const data = await res.json();
        setAddress(data);
      };

      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, []);

  const getEnteredData = async () => {
    const res = await fetch(
      `http://ip-api.com/json/${
        checkIpAddress.test(ipAddress)
          ? `${ipAddress}`
          : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : "8.8.8.8"
      }`
      // https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=8.8.8.8&domain=google.com
    );
    const data = await res.json();
    setAddress(data);
  };

  const getip = () => {
    //e.preventDefault();
    getEnteredData();
    setIpAddress("");
  };
  return (
    <div className="App">
      <header>
        <div id="mainimg">
          <img src={img} alt="" />
        </div>
      </header>
      {address && (<div id="map">
        <MapContainer
          center={[address.lat, address.lon]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "70vh", width: "100vw" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
         <Markerposition address={address} />
        </MapContainer>
      </div>)}
      <div id="search-box">
        <h1 style={{color:"#fff" , fontSize:"3.23rem"}}>IP SCOUT</h1>
        <div id="input-box">
          <input
            type="text"
            id="inp"
            placeholder="Search for any IP address or domain"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
          />
          <img src={arrow} alt="" id="arrow" onClick={getip} />
        </div>
        {address &&(

        <div id="srch-results">
          <div className="data-box" id="box-1">
            <p className="data-heading">IP ADDRESS</p>
            <p className="data-text" id="ip">
              {address.query}
              
            </p>
          </div>
          <div className="data-box" id="box-2">
            <p className="data-heading">Location</p>
            <p className="data-text" id="ip">
              {address.city}, {address.countryCode}
              
            </p>
          </div>
          <div className="data-box" id="box-3">
            <p className="data-heading">TimeZone</p>
            <p className="data-text" id="ip">
              {address.timezone}

            </p>
          </div>
          <div className="data-box" id="box-3">
            <p className="data-heading">ISP</p>
            <p className="data-text" id="ip">
              {address.isp}
             
            </p>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default App;
