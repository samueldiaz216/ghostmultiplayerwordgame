import React,{useRef,useEffect} from 'react';
import {gsap} from 'gsap';
import "./Header.css";

function Header() {

    const header=useRef();

    useEffect(()=>{
        gsap.fromTo(header.current,{y:0},{y:20,duration:2,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});
        gsap.fromTo(header.current,{opacity:1},{opacity:.5,duration:3,repeat:-1,yoyo:true,ease:"power1",yoyoEase:"power1"});

    },[])

    return (
        <div ref={header} className="header">
            <h1>GHOST</h1>
        </div>
    )
}

export default Header;
