window.addEventListener('load', function(){
	const canvas = document.getElementById('canvas1');
	const ctx = canvas.getContext('2d');
	canvas.width = 1400;
	canvas.height = 720;
	let enemies = [];
	let score = 0;
	let gameOver = false;
	const fullScreenButton = document.getElementById('fullScreenButton');
	
	class InputHandler {
		constructor(){
			this.keys = [ ];
			this.touchY = ' ';
			this.touchX = ' ';
			this.touchTreshold = 30;
			window.addEventListener('keydown', e => {
				if ((		e.key === 'ArrowDown' ||
							e.key === 'ArrowUp' ||
							e.key === 'ArrowLeft' ||
							e.key === 'ArrowRight')
							&& this.keys.indexOf(e.key) === -1){
					this.keys.push(e.key);
				}
			});
			window.addEventListener('keyup', e => {
				if (		e.key === 'ArrowDown' ||
							e.key === 'ArrowUp' ||
							e.key === 'ArrowLeft' ||
							e.key === 'ArrowRight'){
					this.keys.splice(this.keys.indexOf(e.key), 1);
				}
			});
			window.addEventListener('touchstart', e => {
				this.touchY = e.changedTouches[0].pageY
				this.touchX = e.changedTouches[0].pageX
			});
			window.addEventListener('touchmove', e => {
				const swipeDistance = e.changedTouches[0].pageY - this.touchY;
				const swipeDistances = e.changedTouches[0].pageX - this.touchX;
				if (swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
				else if (swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1) {
					this.keys.push('swipe down');
					if (gameOver) restartGame();
				}
				if (swipeDistances < -this.touchTreshold && this.keys.indexOf('swipe right') === -1) this.keys.push('swipe right');
				else if (swipeDistances > this.touchTreshold && this.keys.indexOf('swipe left') === -1) {
					this.keys.push('swipe left');
					//if (gameOver) restartGame();
				}
			});
			window.addEventListener('touchend', e => {
				this.keys.splice(this.keys.indexOf('swipe up'), 1);
				this.keys.splice(this.keys.indexOf('swipe down'), 1);
			});
		}
	}
	
	class Player {
		constructor(gameWidth, gameHeight){
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 200;
			this.height = 200;
			this.x = 50;
			this.y = this.gameHeight - this.height;
			this.image = document.getElementById('playerImage');
			this.frameX = 0;
			this.maxFrame = 8;
			this.frameY = 0;
			this.fps = 20;
			this.frameTimer = 0;
			this.frameInterval = 1000/this.fps;
			this.speed = 0;
			this.vy = 0;
			this.weight = 1;
			this.particles = []; //experimental
		}
		restart(){
			this.x = 50;
			this.y = this.gameHeight - this.height;
			this.maxFrame = 8;
			this.frameY = 0;
		}
		draw(context){
			
		//	context.fillStyle = 'white';
		//	context.fillRect(this.x, this.y, this.width, this.height);
			context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
		}
		update(input, deltaTime, enemies){
			enemies.forEach(enemy => {
				const dx =(enemy.x + enemy.width/2)  - (this.x + this.width/2);
				const dy = (enemy.y + enemy.height/2) -(this.y + this.height/2);
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < enemy.width/2 + this.width/2){
					gameOver = true;
				}
			});
			if (this.frameTimer > this.frameInterval){
				if (this.frameX >= this.maxFrame) this.frameX = 0;
				else this.frameX++;
				this.frameTimer = 0;
			} else {
				this.frameTimer += deltaTime;
			}
			if (input.keys.indexOf('ArrowRight') > -1 || input.keys.indexOf('swipe left') > -1 ){
				this.speed = 10;
			}  else if (input.keys.indexOf('ArrowLeft') > -1 || input.keys.indexOf('swipe right') > -1 ){
				this.speed = -10;
			}  else if (input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1 && this.onGround()){
				this.vy -= 28;
			} 
				
			else if (input.keys.indexOf('ArrowDown') > -1 || input.keys.indexOf('swipe down') > -1 && this.onGround()){
				this.vy += 28;
			} 	
			else {
				this.speed = 0;
				this.vy = 0;
			}
			//horizontal movement 
			this.x += this.speed;
			if (this.x < 0) this.x = 0;
			else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
			//vertical movement
			
			this.y += this.vy;
			if (!this.onGround()){
				this.vy += this.weight;
				this.maxFrame = 6;
				this.frameY = 1;
			} else {
				this.vy = 0;
				this.maxFrame = 8;
				this.frameY = 0;
			}
			if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
		}
		onGround(){
			return this.y >= this.gameHeight - this.height;
		}
	}
	
	class Background1 {
		constructor(gameWidth, gameHeight){
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.image = document.getElementById('backgroundImage1');
			this.x = 0;
			this.y = 2;
			this.width = 2400;
			this.height = 670;
			this.speed = 8;
		}
		draw(context){
			context.drawImage(this.image, this.x, this.y);
			context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height - 3);
		}
		update(){
			this.x -= this.speed;
			if (this.x < 0 - this.width) this.x = 0;
			if (player.speed = 0) {
				this.speed = 8;
			} else {
				this.speed = 16;
			}
		}
		restart(){
			this.x =0;
		}
	}
	
	class Background3 {
		constructor(gameWidth, gameHeight){
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight - 5;
			this.image = document.getElementById('backgroundImage3');
			this.x = 0;
			this.y = 0;
			this.width = 1300;
			this.height = 700;
			this.speed = 7;
		}
		draw(context){
			context.drawImage(this.image, this.x, this.y);
			context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
		}
		update(){
			this.x -= this.speed;
			if (this.x < 20 - this.width) this.x = 0;
			if (player.speed = 0) {
				this.speed = 12;
			} else {
				this.speed = 7;
			}
		}
		restart(){
			this.x = 0;
		}
	}
	
	class Background9 {
		constructor(gameWidth, gameHeight){
			this.gameWidth = gameWidth/2 + gameWidth;
			this.gameHeight = gameHeight + gameHeight ;
			this.image = document.getElementById('cloud3');
			this.x = 14.05;
			this.y = -14.05;
			this.width = 960;
			this.height = 709;
			this.speed = 8;
		}
		draw(context){
			context.drawImage(this.image, this.x, this.y);
			context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
		}
		update(){
			this.x -= this.speed;
			if (this.x < 20 - this.width) this.x = 0;
			if (player.speed = 0) {
				this.speed = 4;
			} else {
				this.speed = 9;
			}
		}
		restart(){
			this.x = 0;
		}
	}
	
	class Background2 {
		constructor(gameWidth, gameHeight){
			this.gameWidth = gameWidth + 5 ;
			this.gameHeight = gameHeight;
			this.image = document.getElementById('backgroundImage2');
			this.x = 0;
			this.y = -6;
			this.width = 2400;
			this.height = 750;
			this.speed = 5;
		}
		draw(context){
			context.drawImage(this.image, this.x, this.y);
			context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
		}
		update(){
			this.x -= this.speed;
			if (this.x < 1 - this.width) this.x = 0;
			if (player.speed = 0) {
				this.speed = 2;
			} else {
				this.speed = 7;
			}
		}
		restart(){
			this.x = 0;
		}
	}
	
	class Background {
		constructor(gameWidth, gameHeight){
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.image = document.getElementById('backgroundImage');
			this.x = 0;
			this.y = 0;
			this.width = 2400;
			this.height = 700;
			this.speed = 3;
		}
		draw(context){
			context.drawImage(this.image, this.x, this.y);
			context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
		}
		update(){
			this.x -= this.speed;
			if (this.x < 0 - this.width) this.x = 0;
			if (player.speed = 0) {
				this.speed = 3;
			} else {
				this.speed = 8;
			}
		}
		restart(){
			this.x = 0;
		}
	}
	
	class Enemy {
		constructor(gameWidth, gameHeight){
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 160;
			this.height = 119;
			this.image = document.getElementById('enemyImage');
			this.x = this.gameWidth;
			this.y = this.gameHeight - this.height;
			this.frameX = 0;
			this.maxFrame = 5;
			this.fps = 30;
			this.frameTimer = 0;
			this.frameInterval = 1000/this.fps;
			this.speed = 5;
			this.markedForDeletion = false;
		}
		draw(context){
			
			context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
		}
		update(deltaTime){
			if (this.frameTimer > this.frameInterval){
				if (this.frameX >= this.maxFrame) this.frameX = 0;
				else this.frameX++;
				this.frameTimer = 0;
			} else {
				this.frameTimer += deltaTime;
			}
			this.x -= this.speed;
			if (this.x < 0 - this.width) {
				this.markedForDeletion = true;
				score++;
			}
		}
	}
	//
	function handleEnemies(deltaTime){
		if (enemyTimer > enemyInterval + randomEnemyInterval){
			enemies.push(new Enemy(canvas.width, canvas.height));
			randomEnemyInterval = Math.random() * 1000 + 500;
			enemyTimer = 0;
		} else {
			enemyTimer += deltaTime;
		}
		enemies.forEach(enemy => {
			enemy.draw(ctx);
			enemy.update(deltaTime);
		})
		enemies = enemies.filter(enemy => !enemy.markedForDeletion);
	}
	
	function displayStatusText(context){
		context.textAlign = 'left';
		context.font = '40px Helvetica';
		context.fillStyle = 'yellow';
		context.fillText('🐺  Score: ' + score +'⭐',20, 57);
		context.fillStyle = 'red';
		context.fillText('🐺  Score: ' + score + '⭐', 22, 59);
	//	if (Math.random(0, 9) < 1) context.fillText('🐺💬', player.position.x, player.position.y);
		if (gameOver){
			context.textAlign = 'center';
			context.fillStyle = 'yellow';
			context.fillText('GAME🖕#dclxviclan OVER,🖕try again!', canvas.width/2, 200);
			context.fillStyle = 'purple';
			context.fillText('GAME🖕#dclxviclan OVER,🖕try again!', canvas.width/2 +3, 203);
		}
	}
	
	function restartGame(){
		player.restart();
		background.restart();
		enemies = [];
		score = 0;
		gameOver = false;
		animate(0);
	}
	
	function toggleFullScreen(){
		if (!document.fullscreenElement) {
			canvas.requestFullscreen().catch(err => {
				alert('not fullscreen 🖕 ${err.message} ');
			});
		} else {
			document.exitFullscreen();
		}
	}
	fullScreenButton.addEventListener('click', toggleFullScreen());
//	toggleFullScreen();
	
	const input = new InputHandler();
	const player = new Player(canvas.width, canvas.height);
	const background = new Background(canvas.width, canvas.height);
	const background1 = new Background1(canvas.width, canvas.height);
	const background2 = new Background2(canvas.width, canvas.height);
	const background3 = new Background3(canvas.width, canvas.height);
	const background9 = new Background9(canvas.width, canvas.height);
	const enemy1 = new Enemy(canvas.width, canvas.height);
	
	let lastTime = 0;
	let enemyTimer = 0;
	let enemyInterval = 2800;
	let randomEnemyInterval = Math.random() * 1000 + 500;
	
	function animate(timeStamp){
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		background.draw(ctx);
		background.update();
		background1.draw(ctx);
		background1.update();
		if (Math.random(0,17) < 1) background2.draw(ctx);
		background2.update();
	//	if (Math.random(0, 8) < 1) handleEnemies(deltaTime);
		background2.draw(ctx);
		background2.update();
		player.draw(ctx);
		player.update(input, deltaTime, enemies);
		background3.draw(ctx);
		background3.update();
		handleEnemies(deltaTime);
		if (Math.random(0, 25) < 1) background9.draw(ctx);
		if (Math.random(0, 25) < 1) background9.update();
		displayStatusText(ctx);
		if (!gameOver) requestAnimationFrame(animate);
	}
	animate(0);
});
