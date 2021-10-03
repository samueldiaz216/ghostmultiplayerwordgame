import React,{useEffect, useContext, useRef} from 'react';
import {io} from "socket.io-client";
import {gsap} from "gsap";
import './Home.css'
import Header from "./Header"
import {GameContext} from "./App";

function Home({history}) {

    const socket=io('https://ghostwordgameapp.herokuapp.com/');

    const gameInfo=useContext(GameContext);

    const flyingghost1=useRef();
    const flyingghost1a=useRef();

    const flyingghost2=useRef();
    const flyingghost2a=useRef();
    const flyingghost2b=useRef();

    const flyingghost3=useRef();
    const flyingghost3a=useRef();
    const flyingghost3b=useRef();

    const flyingghost4=useRef();
    const flyingghost4a=useRef();
    const flyingghost4b=useRef();

    const flyingghost5=useRef();
    const flyingghost5a=useRef();
    const flyingghost5b=useRef();

    const flyingghost6=useRef();
    
    const flyingghost7=useRef();


    const createGameModal=useRef();
    const joinGameModal=useRef();
    const helpModal=useRef();
    const overlay=useRef();

    const createInput=useRef();
    const createError=useRef();
    const joinInput=useRef();
    const joinError=useRef();
    
    
    


    useEffect(()=>{
        socket.on('connect',()=>{
            gameInfo.setPlayerID(socket.id); 
        })

        console.log(window.innerWidth);

        if(window.innerWidth<=641){
            gsap.fromTo(flyingghost1.current,{x:-30,y:-30},{x:window.innerWidth+100,y:-window.innerWidth-100, duration:2.5, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost1a.current,{x:-30,y:-30,opacity:1},{x:window.innerWidth+100,y:-window.innerWidth-100, opacity:0, duration:2, repeat:-1, ease:"none"});

            gsap.fromTo(flyingghost2.current,{x:window.innerWidth,y:-window.innerWidth,opacity:1},{x:0,y:0, opacity:0, duration:1, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost2a.current,{x:(window.innerWidth+200),y:(-window.innerWidth-200)},{x:0,y:0, duration:1.5, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost2b.current,{x:(window.innerWidth+300),y:(-window.innerWidth-300)},{x:0,y:0, duration:2.5, repeat:-1, ease:"none"});

            gsap.fromTo(flyingghost3.current,{x:0,y:0,opacity:0},{x:window.innerWidth,y:-window.innerWidth,opacity:1, duration:1, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost3a.current,{x:-30,y:-30},{x:window.innerWidth+300,y:-window.innerWidth-300, duration:2, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost3b.current,{x:-30,y:-30},{x:window.innerWidth+400,y:-window.innerWidth-400, duration:3, repeat:-1, ease:"none"});

            gsap.fromTo(flyingghost4.current,{x:window.innerWidth,y:-window.innerWidth,opacity:1},{x:0,y:0,opacity:0, duration:1, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost4a.current,{x:(window.innerWidth+200),y:(-window.innerWidth-200)},{x:0,y:0, duration:1.5, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost4b.current,{x:(window.innerWidth+300),y:(-window.innerWidth-300)},{x:0,y:0, duration:1.5, repeat:-1, ease:"none"});

            gsap.fromTo(flyingghost5.current,{x:0,y:0, opacity:1},{x:window.innerWidth,y:-window.innerWidth, opacity:0, duration:2, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost5a.current,{x:-100,y:-100},{x:window.innerWidth+300,y:-window.innerWidth-300, duration:1.5, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost5b.current,{x:-100,y:-100},{x:window.innerWidth+400,y:-window.innerWidth-400, duration:1.5, repeat:-1, ease:"none"});

            gsap.fromTo(flyingghost6.current,{x:window.innerWidth,y:-window.innerWidth,opacity:1},{x:0,y:0, opacity:0, duration:2, repeat:-1, ease:"none"});

            gsap.fromTo(flyingghost7.current,{x:0,y:0,opacity:0},{x:window.innerWidth,y:-window.innerWidth, opacity:1,duration:2, repeat:-1, ease:"none"});
        }else{
            gsap.fromTo(flyingghost1.current,{x:-30,y:-30},{x:window.innerWidth+100,y:-window.innerWidth-100, duration:5, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost1a.current,{x:-30,y:-30,opacity:1},{x:window.innerWidth+100,y:-window.innerWidth-100, opacity:0, duration:2, repeat:-1, ease:"none"});

            gsap.fromTo(flyingghost2.current,{x:window.innerWidth,y:-window.innerWidth,opacity:1},{x:0,y:0, opacity:0, duration:2, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost2a.current,{x:(window.innerWidth+200),y:(-window.innerWidth-200)},{x:0,y:0, duration:3, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost2b.current,{x:(window.innerWidth+300),y:(-window.innerWidth-300)},{x:0,y:0, duration:5, repeat:-1, ease:"none"});

            gsap.fromTo(flyingghost3.current,{x:0,y:0,opacity:0},{x:window.innerWidth,y:-window.innerWidth,opacity:1, duration:1, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost3a.current,{x:-30,y:-30},{x:window.innerWidth+300,y:-window.innerWidth-300, duration:4, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost3b.current,{x:-30,y:-30},{x:window.innerWidth+400,y:-window.innerWidth-400, duration:6, repeat:-1, ease:"none"});

            gsap.fromTo(flyingghost4.current,{x:window.innerWidth,y:-window.innerWidth,opacity:1},{x:0,y:0,opacity:0, duration:1, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost4a.current,{x:(window.innerWidth+200),y:(-window.innerWidth-200)},{x:0,y:0, duration:4, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost4b.current,{x:(window.innerWidth+300),y:(-window.innerWidth-300)},{x:0,y:0, duration:5, repeat:-1, ease:"none"});

            gsap.fromTo(flyingghost5.current,{x:0,y:0, opacity:1},{x:window.innerWidth,y:-window.innerWidth, opacity:0, duration:2, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost5a.current,{x:-100,y:-100},{x:window.innerWidth+300,y:-window.innerWidth-300, duration:8, repeat:-1, ease:"none"});
            gsap.fromTo(flyingghost5b.current,{x:-100,y:-100},{x:window.innerWidth+400,y:-window.innerWidth-400, duration:8, repeat:-1, ease:"none"});

            gsap.fromTo(flyingghost6.current,{x:window.innerWidth,y:-window.innerWidth,opacity:1},{x:0,y:0, opacity:0, duration:4, repeat:-1, ease:"none"});

            gsap.fromTo(flyingghost7.current,{x:0,y:0,opacity:0},{x:window.innerWidth,y:-window.innerWidth, opacity:1,duration:4, repeat:-1, ease:"none"});

        }
        if(!gameInfo.played){
            overlay.current.classList.add('active');
            helpModal.current.classList.add('active');
        }
        
    },[])

    useEffect(()=>{
        console.log(gameInfo);
    },[gameInfo])

    function handlePlay(e){
        e.preventDefault();
        history.push("/game");
        
    }

    return (

        
        
        <div className="home">
            <Header/>

            <form onSubmit={handlePlay}>
                <input 
                    spellcheck="false"
                    className="big-input"
                    onChange={(e)=>{
                        console.log(e.nativeEvent.inputType);
                        if(e.nativeEvent.inputType==="deleteContentBackward"){
                            gameInfo.changeGameState(e);
                        }else{
                            if(gameInfo.name.length<15)
                            gameInfo.changeGameState(e);
                        }
                        

                        
                    }}
                    type="text"
                    placeholder="Username"
                    name="name"
                    value={gameInfo.name}
                />


                {/* Play random will be a feature in v2, once we figure out matchmaking */}
                {/* <button name="play-random" type="submit" onClick={()=>{

                }} class="playButton">Play Random</button>  */}


                <button type="button" onClick={()=>{
                    overlay.current.classList.add('active');
                    createGameModal.current.classList.add('active');
                }} class="playButton">New Game</button> 
                <button onClick={()=>{
                    overlay.current.classList.add('active');
                    joinGameModal.current.classList.add('active');
                }} type="button" class="playButton">Join Game</button> 
                
            </form>

            <img ref={flyingghost1} className="flyingghost1" src="images/flyingghost.png"/>
            <img ref={flyingghost1a} className="flyingghost1a" src="images/flyingghost.png"/>

            <img ref={flyingghost2} className="flyingghost2" src="images/flyingghost.png"/>
            <img ref={flyingghost2a} className="flyingghost2a" src="images/flyingghost.png"/>
            <img ref={flyingghost2b} className="flyingghost2b" src="images/flyingghost.png"/>

            <img ref={flyingghost3} className="flyingghost3" src="images/flyingghost.png"/>
            <img ref={flyingghost3a} className="flyingghost3a" src="images/flyingghost.png"/>
            <img ref={flyingghost3b} className="flyingghost3b" src="images/flyingghost.png"/>

            <img ref={flyingghost4} className="flyingghost4" src="images/flyingghost.png"/>
            <img ref={flyingghost4a} className="flyingghost4a" src="images/flyingghost.png"/>
            <img ref={flyingghost4b} className="flyingghost4b" src="images/flyingghost.png"/>

            <img ref={flyingghost5} className="flyingghost5" src="images/flyingghost.png"/>
            <img ref={flyingghost5a} className="flyingghost5a" src="images/flyingghost.png"/>
            <img ref={flyingghost5b} className="flyingghost5b" src="images/flyingghost.png"/>

            <img ref={flyingghost6} className="flyingghost6" src="images/flyingghost.png"/>

            <img ref={flyingghost7} className="flyingghost7" src="images/flyingghost.png"/>

            <div ref={createGameModal} className="create-game-modal">
                <div className="create-game-modal-header">
                    <h3>New Game</h3>
                    <img onClick={()=>{
                        overlay.current.classList.remove('active');
                        createGameModal.current.classList.remove('active');
                        //Clear the input
                        gameInfo.clearGameID();
                    }} src="images/icon-close.svg"/>
                </div>
                <div className="create-game-modal-buttons">
                    
                    <form>
                    <input 
                        //If we want to style the input
                        ref={createInput}
                        spellcheck="false"
                        className="big-input"
                        onChange={(e)=>{
                            gameInfo.changeGameState(e);
                            
                        }}
                        type="text"
                        placeholder="Game Name"
                        name="gameID"
                        value={gameInfo.gameID}
                    />
                        <p ref={createError} className="translucent"></p>
                        <button type="button" onClick={()=>{
                            //only do this after check if name is available
                            
                            socket.emit('check-room', 'create-game', gameInfo.gameID, availability=>{
                                if(availability.available){
                                    console.log("available:"+availability.available+" message:"+availability.message);
                                    history.push('/game');
                                }else{
                                    createError.current.innerText=availability.message;
                                    gsap.fromTo(createError.current,{opacity:0},{opacity:1, duration:1.5, ease:"none"});
                                    gsap.fromTo(createError.current,{opacity:1},{opacity:0, duration:1.5, ease:"none"});
                                }
                            })
                            
                        }}>New Game</button>
                    </form>     
                    
                </div>   
            </div>

            <div ref={joinGameModal} className="create-game-modal">
                <div className="create-game-modal-header">
                    <h3>Join Game</h3>
                    <img onClick={()=>{
                        overlay.current.classList.remove('active');
                        joinGameModal.current.classList.remove('active');
                        //Clear the input
                        gameInfo.clearGameID();
                    }} src="images/icon-close.svg"/>
                </div>
                <div className="create-game-modal-buttons">
                    
                    <form>
                    <input 
                        //If we want to style the input
                        ref={joinInput}
                        spellcheck="false"
                        className="big-input"
                        onChange={(e)=>{
                            gameInfo.changeGameState(e);
                            
                        }}
                        type="text"
                        placeholder="Game Name"
                        name="gameID"
                        value={gameInfo.gameID}
                    />
                    <p ref={joinError} className="translucent"></p>
                        <button type="button" onClick={()=>{
                            socket.emit('check-room', 'join-game', gameInfo.gameID, availability=>{
                                
                                console.log("available:"+availability.available+" message:"+availability.message);
                                if(availability.available){
                                    history.push('/game');
                                }else{
                                    joinError.current.innerText=availability.message;
                                    gsap.fromTo(joinError.current,{opacity:0},{opacity:1, duration:1.5, ease:"none"});
                                    gsap.fromTo(joinError.current,{opacity:1},{opacity:0, duration:1.5, ease:"none"});
                                }
                            })
                            
                        }}>Join Game</button>
                    </form>     
                    
                </div>   
            </div>

            <div ref={joinGameModal} className="create-game-modal">
                <div className="create-game-modal-header">
                    <h3>Join Game</h3>
                    <img onClick={()=>{
                        overlay.current.classList.remove('active');
                        joinGameModal.current.classList.remove('active');
                        //Clear the input
                        gameInfo.clearGameID();
                    }} src="images/icon-close.svg"/>
                </div>
                <div className="create-game-modal-buttons">
                    
                    <form>
                    <input 
                        //If we want to style the input
                        ref={joinInput}
                        spellcheck="false"
                        className="big-input"
                        onChange={(e)=>{
                            gameInfo.changeGameState(e);
                            
                        }}
                        type="text"
                        placeholder="Game Name"
                        name="gameID"
                        value={gameInfo.gameID}
                    />
                    <p ref={joinError} className="translucent"></p>
                        <button type="button" onClick={()=>{
                            socket.emit('check-room', 'join-game', gameInfo.gameID, availability=>{
                                
                                console.log("available:"+availability.available+" message:"+availability.message);
                                if(availability.available){
                                    history.push('/game');
                                }else{
                                    joinError.current.innerText=availability.message;
                                    gsap.fromTo(joinError.current,{opacity:0},{opacity:1, duration:1.5, ease:"none"});
                                    gsap.fromTo(joinError.current,{opacity:1},{opacity:0, duration:1.5, ease:"none"});
                                }
                            })
                            
                        }}>Join Game</button>
                    </form>     
                    
                </div>   
            </div>

            <div ref={helpModal} className="rules-modal">
                <div className="rules-modal-header">
                    <h3>Rules</h3>
                    <img onClick={()=>{
                        overlay.current.classList.remove('active');
                        helpModal.current.classList.remove('active');
                    }} src="images/icon-close.svg"/>
                </div>

                <div className="rules-info">
                    <p>-Ghost is a word game in which 
                    players take turns adding letters to a growing 
                    word fragment, trying not to be the one to 
                    complete a valid word. </p>

                    <p>-The player who completes a word loses the round 
                    and loses a life.</p>

                    <p>-In order for a word to count, it must be at least
                    4 letters long.</p>

                    <p>-Each fragment must be the beginning of 
                    an actual word. otherwise, the player
                    that makes the invalid word fragment loses a life.</p>

                    <p>-Each player has 5 lives. The first player
                    to lose all their 5 lives, loses the game.</p>

                    <p>-To create a new game, just click on the new
                    game button. Enter the name for your new game and send that 
                    name to a friend so they can join. </p>

                    <p>-To join a game, just click the join game button
                    and enter the name of the game you want to join.</p>

                </div>
                
                
            </div>

            <div ref={overlay} className="overlay">
        
    </div>            
            
            
    <button className="helpButton"><h4  onClick={()=>{
        overlay.current.classList.add('active');
        helpModal.current.classList.add('active');
    }}>?</h4></button>
            
            
    </div>
    )
}

export default Home
