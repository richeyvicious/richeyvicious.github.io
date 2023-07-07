document.addEventListener("DOMContentLoaded", function() {
  const gameContainer = document.getElementById("game-container");
  const ball = document.getElementById("ball");

  let isJumping = false;
  let gameIsOver = false;
  let score = 0;
  let obstacleSpeed = 10;
  let obstacleInterval;

  function startGame() {
      document.addEventListener("keydown", jump);
      gameIsOver = false;
      score = 0;
      obstacleSpeed = 5;
      createObstacle();
      setTimeout(createObstacle, Math.random() * 4000 + 3000);
  }

  function jump(event) {
      if (event.code === "Space" && !isJumping && !gameIsOver) {
          isJumping = true;
          let jumpHeight = 0; // 设置初始跳跃高度为0
          let jumpSpeed = 5; // 设置跳跃速度
  

          let upInterval = setInterval(function() {
              if (jumpHeight <=200) {
                  ball.style.bottom = jumpHeight + "px";
                  jumpHeight += jumpSpeed;
              } else {
                  clearInterval(upInterval);

                  let downInterval = setInterval(function() {
                      if (jumpHeight > 0) {
                          ball.style.bottom = jumpHeight + "px";
                          jumpHeight -= jumpSpeed;
                      } else {
                          clearInterval(downInterval);
                          isJumping = false;
                      }
                  }, 10);
              }
          }, 10);
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
    
            if (parseInt(obstacle.style.left) < -50) {
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

  function increaseObstacleSpeed() {
    
    if (score % 50 === 0) { // 每10秒（得分增加50分）增加障碍物速度
        obstacleSpeed += 0.2;
    }

  }

  function gameOver() {
      gameIsOver = true;
      clearInterval(obstacleInterval);
      alert("游戏结束！得分：" + score);
  }

  startGame();

});