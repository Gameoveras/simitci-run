// Oyun konfigürasyonu
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#87CEEB",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// Oyun değişkenleri
let player;
let cursors;
let martilar;
let caylar;
let skork = 0;
let scoreText;
let highScore = 0;
let highScoreText;
let zamanlayici;

// Oyun örneği
const game = new Phaser.Game(config);

function preload() {
  this.load.image("simitci", "https://img.icons8.com/ios/452/bagel.png");
  this.load.image("marti", "https://img.icons8.com/ios/452/seagull.png");
  this.load.image("zemin", "https://img.icons8.com/ios/452/road.png");
  this.load.image("cay", "https://img.icons8.com/ios/452/tea.png");
}

function create() {
  // Zemin ekleme
  this.add.image(400, 300, "zemin").setScale(2);

  // Oyuncu oluşturma
  player = this.physics.add.sprite(100, 450, "simitci");
  player.setCollideWorldBounds(true);

  // Kontroller
  cursors = this.input.keyboard.createCursorKeys();

  // Martı grubu oluşturma
  martilar = this.physics.add.group();
  zamanlayici = this.time.addEvent({
    delay: 2000,
    callback: spawnMarti,
    callbackScope: this,
    loop: true
  });

  // Çay grubu oluşturma
  caylar = this.physics.add.group();
  this.time.addEvent({
    delay: 5000,
    callback: spawnCay,
    callbackScope: this,
    loop: true
  });

  // Çarpışma kontrolü
  this.physics.add.overlap(player, martilar, hitMarti, null, this);
  this.physics.add.overlap(player, caylar, collectCay, null, this);

  // Skor başlangıcı
  skork = 0;
  scoreText = this.add.text(16, 16, 'Skor: 0', { fontSize: '24px', fill: '#fff' });

  // Yüksek skor
  highScore = localStorage.getItem('highScore') || 0;
  highScoreText = this.add.text(16, 50, 'Yüksek Skor: ' + highScore, { fontSize: '24px', fill: '#fff' });
}

function update() {
  // Oyuncu hareketleri
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  } else {
    player.setVelocityX(0);
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function spawnMarti() {
  const marti = martilar.create(800, Phaser.Math.Between(300, 500), "marti");
  marti.setVelocityX(-200);
}

function spawnCay() {
  const cay = caylar.create(800, Phaser.Math.Between(100, 500), "cay");
  cay.setVelocityX(-100);
}

function hitMarti(player, marti) {
  this.physics.pause();
  player.setTint(0xff0000);
  this.add.text(300, 250, 'Game Over', { fontSize: '32px', fill: '#fff' });

  // Skor kaydetme
  if (skork > highScore) {
    localStorage.setItem('highScore', skork);
    highScore = skork;
    highScoreText.setText('Yüksek Skor: ' + highScore);
  }
}

function collectCay(player, cay) {
  cay.disableBody(true, true);
  skork += 10;
  scoreText.setText('Skor: ' + skork);
}
