import React,{useEffect,useRef} from 'react';
import "./LoadingPage.css";
import {gsap} from "gsap";

function LoadingPage(props) {
    const spiral=useRef();

    useEffect(()=>{
        gsap.to(spiral.current,{rotation:'+=360', repeat:-1, duration:2, ease:'none'})
    },[])
    return (
        <div className="loading-page">
            <h5>Send name of game to a friend so they can join:<input spellCheck='false' readonly value={props.roomID}></input></h5>
            <img className="spiral" ref={spiral} src="images/spiral (1).png"></img>
            <h2 className="text">Waiting for other players...</h2>
        </div>
        
    )
}

export default LoadingPage;
