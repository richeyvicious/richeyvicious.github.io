document.addEventListener("DOMContentLoaded", function() {
  const gameContainer = document.getElementById("game-container");
  const ball = document.getElementById("ball");

  let isJumping = false;
  let gameIsOver = false;
  let score = 0;
  let obstacleSpeed = 10;
  let obstacleInterval;
  let jumpCount = 0;
  let jumpHeight = 0; // 将jumpHeight定义为全局变量
  let jumpSpeed = 5; // 将jumpSpeed定义为全局变量
  let targetHeight = 200;
  let jumpAgain = false;
  let obstacleFrequency = 9000; 
  
  function startGame() {
      document.addEventListener("keydown", jump);
      gameIsOver = false;
      score = 0;
      obstacleSpeed = 5;
      createObstacle();
      setTimeout(createObstacle, Math.random() * obstacleFrequency + 5000);
  }

  function increaseObstacleSpeed() {
    if (score % 50 === 0) { // 每10秒（得分增加50分）增加障碍物速度
      obstacleSpeed += 0.05;
      obstacleFrequency -= 500; // 每10秒（得分增加50分）减少障碍物出现频率
    }
  }
  
  function jump(event) {
    if (event.code === "Space" && jumpCount < 2 && !gameIsOver) {
      isJumping = true;
      jumpCount++;
      let jumpSpeed = 5; 
      let isCloseInterval = false;

      if(jumpHeight > 0){
        targetHeight += jumpHeight; 
        jumpAgain = true; 
        isCloseInterval = true; 
      }
      var upInterval = setInterval(function() {
        if (jumpHeight < targetHeight) {
          ball.style.bottom = jumpHeight + "px";
          jumpHeight += jumpSpeed;
        } else {
          if(jumpHeight === targetHeight){
            jumpAgain = false;
          }
          var downInterval = setInterval(function() {
            if (jumpHeight > 0) {
                if(jumpAgain)clearInterval(downInterval);
                ball.style.bottom = jumpHeight + "px";
                jumpHeight -= jumpSpeed;
            } else {
                clearInterval(upInterval);
                clearInterval(downInterval);
                isJumping = false;
                jumpCount = 0; 
                targetHeight = 200; 
                jumpAgain = false; 
            }
          }, 10);
        }
      }, 10);
      if(isCloseInterval){
        clearInterval(upInterval);
      }
    }
  }


  function createObstacle() {
    if (!gameIsOver) {
        const obstacle = document.createElement("div");
        obstacle.classList.add("obstacle");
        obstacle.style.left = gameContainer.offsetWidth + "px";;
        obstacle.style.bottom = "0px"; // 障碍物在底部出现
        gameContainer.appendChild(obstacle);

        let obstacleInterval = setInterval(function() {
          if (!gameIsOver) {
            obstacle.style.left = parseInt(obstacle.style.left) - obstacleSpeed + "px";
    
            if (checkCollision(obstacle)) {
              gameOver();
              clearInterval(obstacleInterval);
            }
            
            if (parseInt(obstacle.style.left) < 0) {
              obstacle.remove();
              increaseScore();
              increaseObstacleSpeed();
              clearInterval(obstacleInterval);
              createObstacle();
            }
          } else {
            clearInterval(obstacleInterval);
          }
        }, 10);
      }
      setTimeout(createObstacle, Math.random() * obstacleFrequency + 5000);
    }

  function checkCollision(obstacle) {
      const ballRect = ball.getBoundingClientRect();
      const obstacleRect = obstacle.getBoundingClientRect();

      return (
          ballRect.bottom >= obstacleRect.top &&
          ballRect.top <= obstacleRect.bottom &&
          ballRect.right >= obstacleRect.left &&
          ballRect.left <= obstacleRect.right
      );
  }

  function increaseScore() {
      score += 5;
    document.getElementById('score').innerText = '得分：' + score;
  }

  function gameOver() {
      gameIsOver = true;
      clearInterval(obstacleInterval);
      alert("游戏结束！得分：" + score);
  }

  startGame();

});