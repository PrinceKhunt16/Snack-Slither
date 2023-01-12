import React, { createRef, useEffect } from 'react'
import FoodSound from "../assets/music/food.mp3" 
import GameOverSound from "../assets/music/gameover.mp3" 
import MoveSound from "../assets/music/move.mp3" 

const SnackPlayGround = () => {
  const foodSound = new Audio(FoodSound)
  const gameOverSound = new Audio(GameOverSound)
  const moveSound = new Audio(MoveSound)
  const board = createRef()
  let lastTime = 0
  let snack = [{x: 4, y: 4}]
  let valocity = {x: 0, y: 0}
  let foodXY = {x: 10, y: 10}

  function main(currentTime){
    window.requestAnimationFrame(main);
    
    if((currentTime - lastTime) / 1000 < 1 / 5){
      return
    }

    lastTime = currentTime
    gameEngine()
  }

  function isCollide(){
    if(snack[0].x >= 16 || snack[0].x <= 0 || snack[0].y >= 16 || snack[0].y <= 0){
      return true
    }

    for(let i = 1; i < snack.length; i++){
      if(snack[i].x === snack[0].x && snack[i].y === snack[0].y){
        return true
      }
    }

    return false
  } 
  
  function gameEngine(){
    board.current.innerHTML = ''

    if(isCollide()){
      gameOverSound.play()
      snack = [{x: 4, y: 4}]
      valocity = {x: 0, y: 0}
    }

    if(snack[0].x === foodXY.x && snack[0].y === foodXY.y){
      foodSound.play()
      snack.unshift({x: snack[0].x + valocity.x, y: snack[0].y + valocity.y})
      foodXY = {x: 1 + Math.round(1 + (14 - 1) * Math.random()), y: 1 + Math.round(1 + (14 - 1) * Math.random())}
    }

    for(let i = snack.length - 2; i >= 0; i--){
      snack[i + 1] = {...snack[i]}
    }

    snack[0].x += valocity.x
    snack[0].y += valocity.y
 
    snack.forEach((e, index) => {
      let snack = document.createElement('div')
      snack.style.gridRowStart = e.y
      snack.style.gridColumnStart = e.x
      
      if(index){
        snack.classList.add('snack') 
      } else {
        snack.classList.add('head')
      }
      
      board.current?.appendChild(snack)
    })   
    
    let food = document.createElement('div')
    food.style.gridRowStart = foodXY.y
    food.style.gridColumnStart = foodXY.x
    food.classList.add('food')
    board.current?.appendChild(food)
  }

  window.addEventListener('keydown', (e) => {
    moveSound.play()

    switch (e.key) { 
      case 'ArrowUp':
        valocity = {x: 0, y: -1}
        break;
      case 'ArrowDown':
        valocity = {x: 0, y: 1}
        break;
      case 'ArrowLeft':
        valocity = {x: -1, y: 0}
        break;
      case 'ArrowRight':
        valocity = {x: 1, y: 0}
        break;
      default:
        break;
    }    
  }) 

  useEffect(() => {  
    window.requestAnimationFrame(main)
  })
 
  return (
    <div className='body'>
      <div className='board' ref={board}></div>
    </div>
  )
}

export default SnackPlayGround