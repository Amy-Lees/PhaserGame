// Конфигурация игры
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// Создаём объект игры
const game = new Phaser.Game(config);

let player;
let platforms;
let cursors;
let stars;
let score = 0;
let scoreText;

function preload() {
  // Загружаем ресурсы
  this.load.image('sky', 'https://assets.onecompiler.app/433usxv92/433utxh8x/sky.png');
  this.load.image('ground', 'https://assets.onecompiler.app/433usxv92/433utxh8x/platform.png');
  this.load.image('star', 'https://assets.onecompiler.app/433usxv92/433utxh8x/star.png');
  this.load.spritesheet('dude', 'https://assets.onecompiler.app/433usxv92/433utxh8x/dude.png', {
    frameWidth: 32,
    frameHeight: 48,
  });
}

function create() {
  // Добавляем фон
  this.add.image(400, 300, 'sky');

  // Создаём группу платформ
  platforms = this.physics.add.staticGroup();

  // Земля
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  // Плавающие платформы
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  // Создаём игрока
  player = this.physics.add.sprite(100, 450, 'dude');

  // Добавляем физику игрока
  player.setBounce(0.2); // пружинистость
  player.setCollideWorldBounds(true); // границы мира

  // Анимации игрока
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  // Добавляем столкновение игрока с платформами
  this.physics.add.collider(player, platforms);

  // Создаём звёзды
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 },
  });

  // Добавляем физику звёздам
  stars.children.iterate((child) => {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  // Добавляем столкновение звёзд с платформами
  this.physics.add.collider(stars, platforms);

  // Проверяем, если игрок собирает звёзды
  this.physics.add.overlap(player, stars, collectStar, null, this);

  // Добавляем текст счёта
  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#ffffff',
  });

  // Настраиваем управление
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  // Логика управления
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function collectStar(player, star) {
  // Убираем звезду, когда игрок её собирает
  star.disableBody(true, true);

  // Увеличиваем счёт
  score += 10;
  scoreText.setText('Score: ' + score);
}