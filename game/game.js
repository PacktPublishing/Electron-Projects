const screenWidth = 800;
const screenHeight = 600;
const shipSpeed = 4;

var config = {
  type: Phaser.AUTO,
  width: screenWidth,
  height: screenHeight,
  backgroundColor: '#03187D',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);
let ship;
let cursors;

function preload() {
  this.load.setBaseURL('.');
  this.load.image('background', 'assets/background.jpg');
  this.load.image('ship', 'assets/phaser-ship.png');
}

function create() {
  // Create background
  const image = this.add.image(
    this.cameras.main.width / 2,
    this.cameras.main.height / 2,
    'background'
  );
  let scaleX = this.cameras.main.width / image.width;
  let scaleY = this.cameras.main.height / image.height;
  let scale = Math.max(scaleX, scaleY);
  image.setScale(scale).setScrollFactor(0);

  // Create ship
  ship = this.add.sprite(100, 100, 'ship');
  ship.setScale(4, 4);

  // Create cursors
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  // RIGHT button
  if (cursors.right.isDown) {
    ship.x += shipSpeed;
    if (ship.x >= screenWidth) {
      ship.x = 0;
    }
    ship.flipX = false;
  }
  // LEFT button
  else if (cursors.left.isDown) {
    ship.x -= shipSpeed;
    if (ship.x <= 0) {
      ship.x = screenWidth;
    }
    ship.flipX = true;
  }
  // UP button
  else if (cursors.up.isDown) {
    ship.y -= shipSpeed;
    if (ship.y <= 0) {
      ship.y = screenHeight;
    }
  }
  // DOWN button
  else if (cursors.down.isDown) {
    ship.y += shipSpeed;
    if (ship.y >= screenHeight) {
      ship.y = 0;
    }
  }
}
