import React,{useState} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Game from "./Game";
import Home from "./Home";
import LoadingPage from "./LoadingPage";




export const GameContext=React.createContext();

function App() {
 

  function changeGameState(e){
  
    setGameState((prev)=>{
      if(e.target.name==="name"){
        return {
          name:e.target.value,
          gameID:prev.gameID,
          playerID:prev.playerID,
          played:prev.played,
          changeGameState:prev.changeGameState,
          setPlayerID:prev.setPlayerID,
          clearGameID:prev.clearGameID,
          setPlayed:prev.setPlayed
        };
      }else if(e.target.name==="gameID"){
        return {
          name:prev.name,
          gameID:e.target.value,
          playerID:prev.playerID,
          played:prev.played,
          changeGameState:prev.changeGameState,
          setPlayerID:prev.setPlayerID,
          clearGameID:prev.clearGameID,
          setPlayed:prev.setPlayed
        };
      }
    })
    
    
  }

  function setPlayerID(id){
    setGameState((prev)=>{
      return {
        name:prev.name,
        gameID:prev.gameID,
        playerID:id,
        played:prev.played,
        changeGameState:prev.changeGameState,
        setPlayerID:prev.setPlayerID,
        clearGameID:prev.clearGameID,
        setPlayed:prev.setPlayed
      }
    }) 
  }

  function clearGameID(){
    setGameState((prev)=>{
      return {
        name:prev.name,
        gameID:"",
        playerID:prev.playerID,
        played:prev.played,
        changeGameState:prev.changeGameState,
        setPlayerID:prev.setPlayerID,
        clearGameID:prev.clearGameID,
        setPlayed:prev.setPlayed
      }
    }) 
  }

  function setPlayed(){
    setGameState((prev)=>{
      return {
        name:prev.name,
        gameID:"",
        playerID:prev.playerID,
        played:true,
        changeGameState:prev.changeGameState,
        setPlayerID:prev.setPlayerID,
        clearGameID:prev.clearGameID,
        setPlayed:prev.setPlayed
      }
    }) 
  }

  const [gameState, setGameState]=useState({
                                            name:"",
                                            gameID:"",
                                            playerID:"",
                                            played:false,//To not bring up help modal after a game played
                                            changeGameState:changeGameState,
                                            setPlayerID:setPlayerID,
                                            clearGameID:clearGameID,
                                            setPlayed:setPlayed})

  return(
    <div>

    <GameContext.Provider value={gameState}>
      <Router>     
            
        <Switch>
            <Route exact path="/" component={Home}> 
            
            </Route>
            {/* put in componrnt to have access to history */}
            <Route exact path="/game" component={Game}> 
            </Route>
            <Route exact path="/load"> 
                <LoadingPage/> 
            </Route>
            {/* Get this 404 to work */}
            <Route path="/" render={()=>{
              <div>
                <h1>404</h1>
              </div>
            }}>

            </Route>
        </Switch>
        
      </Router>
    </GameContext.Provider>
      
    </div>
    
  )  
}

export default App;
