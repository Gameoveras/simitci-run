import Phaser from "phaser";

class SimitciRun extends Phaser.Scene {
  constructor() {
    super("SimitciRun");
  }

  preload() {
    this.load.image("simitci", "assets/simitci.png");
    this.load.image("marti", "assets/marti.png");
    this.load.image("zemin", "assets/zemin.png");
    this.load.image("cay", "assets/cay.png");
  }

  create() {
    this.add.image(400, 300, "zemin");

    this.player = this.physics.add.sprite(100, 450, "simitci");
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.martilar = this.physics.add.group();
    this.zamanlayici = this.time.addEvent({
      delay: 2000,
      callback: () => this.spawnMarti(),
      loop: true
    });

    this.caylar = this.physics.add.group();
    this.time.addEvent({
      delay: 5000,
      callback: () => this.spawnCay(),
      loop: true
    });

    this.physics.add.overlap(this.player, this.martilar, this.hitMarti, null, this);
    this.physics.add.overlap(this.player, this.caylar, this.collectCay, null, this);

    this.skork = 0;
    this.scoreText = this.add.text(16, 16, 'Skor: 0', { fontSize: '24px', fill: '#fff' });
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  spawnMarti() {
    const marti = this.martilar.create(800, Phaser.Math.Between(300, 500), "marti");
    marti.setVelocityX(-200);
  }

  spawnCay() {
    const cay = this.caylar.create(800, Phaser.Math.Between(100, 500), "cay");
    cay.setVelocityX(-100);
  }

  hitMarti(player, marti) {
    this.physics.pause();
    player.setTint(0xff0000);
    this.add.text(300, 250, 'Game Over', { fontSize: '32px', fill: '#fff' });
  }

  collectCay(player, cay) {
    cay.disableBody(true, true);
    this.skork += 10;
    this.scoreText.setText('Skor: ' + this.skork);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#87CEEB",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: SimitciRun
};

const game = new Phaser.Game(config);
