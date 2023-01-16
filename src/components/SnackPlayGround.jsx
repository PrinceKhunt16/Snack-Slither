import React, { useCallback, useEffect, useRef, useState } from 'react'
import FoodSound from "../assets/music/food.mp3" 
import GameOverSound from "../assets/music/gameover.mp3" 
import MoveSound from "../assets/music/move.mp3" 

export default function SnackPlayGround() {
  const board = useRef(null)
  const frame = useRef(0)
  const food = useRef({x: 10, y: 10})
  const [lastTime, setLastTime] = useState(0)
  const [snack, setSnack] = useState([{x: 4, y: 4}])
  const [valocity, setValocity] = useState({x: 0, y: 0})

  const isCollide = useCallback(() => {
    if(snack[0].x >= 16 || snack[0].x <= 0 || snack[0].y >= 16 || snack[0].y <= 0){
      return true
    }

    for(let i = 1; i < snack.length; i++){
      if(snack[i].x === snack[0].x && snack[i].y === snack[0].y){
        return true
      }
    }

    return false
  }, [snack])

  const gameEngine = useCallback(() => {
    const foodSound = new Audio(FoodSound)
    const gameOverSound = new Audio(GameOverSound)
    board.current.innerHTML = ''

    if(isCollide()){
      gameOverSound.play()
      setSnack([{x: 4, y: 4}])
      setValocity({x: 0, y: 0})
    } 
    
    if(snack[0].x === food.current.x && snack[0].y === food.current.y){
      foodSound.play()
      
      snack.push({x: snack[0].x + valocity.x, y: snack[0].y + valocity.y})

      food.current.x = 1 + Math.round(1 + (14 - 1) * Math.random())
      food.current.y = 1 + Math.round(1 + (14 - 1) * Math.random())
    }    

    for(let i = snack.length - 2; i >= 0; i--){
      snack[i + 1] = {...snack[i]}
    }

    snack[0].x += valocity.x
    snack[0].y += valocity.y
    
    snack.forEach((e, index) => {
      let newSnack = document.createElement('div')
      newSnack.style.gridRowStart = e.y
      newSnack.style.gridColumnStart = e.x
      
      if(index){
        newSnack.classList.add('snack') 
      } else {
        newSnack.classList.add('head')
      }
      
      board.current.appendChild(newSnack)
    })   
    
    let newFood = document.createElement('div')
    newFood.style.gridRowStart = food.current.y
    newFood.style.gridColumnStart = food.current.x
    newFood.classList.add('food')
    board.current.appendChild(newFood)
  }, [snack, valocity, food, isCollide])

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      const moveSound = new Audio(MoveSound)
      moveSound.play()

      switch (e.key) { 
        case 'ArrowUp':
          setValocity({x: 0, y: -1})
          break;
        case 'ArrowDown':
          setValocity({x: 0, y: 1})
          break;
        case 'ArrowLeft':
          setValocity({x: -1, y: 0})
          break;
        case 'ArrowRight':
          setValocity({x: 1, y: 0})
          break;
        default:
          break;
      }
    })
  }, [])

  const animate = useCallback((currentTime) => {
    frame.current = requestAnimationFrame(animate)
    
    if((currentTime - lastTime) / 1000 < 1 / 5){
      return
    }

    setLastTime(currentTime)
    gameEngine()
  }, [lastTime, gameEngine])

  useEffect(() => {
    frame.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame.current)
  }, [animate])
 
  return (
    <div className='body'>
      <div className='board' ref={board}></div>
    </div>
  )
}