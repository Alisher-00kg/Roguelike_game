// game.js

class Game {
  constructor() {
    this.fieldElement = document.querySelector(".field");
    this.tileSize = 50;
    this.tilesX = 20;
    this.tilesY = 12;
    this.map = [];
    this.player = {
      x: 0,
      y: 0,
      health: 100,
      maxHealth: 100,
      attack: 10,
      hasSword: false,
    };
    this.enemies = [];
    this.renderer = new Renderer(
      document.querySelector(".field"),
      50,
      this.player,
      this.findEnemyAt.bind(this)
    );
  }

  init() {
    this.createMap();
    this.generateRooms();
    this.connectRooms();
    this.placeItems();
    this.placeEnemies(10);
    this.placePlayer();
    this.renderer.renderMap(this.map);
    this.setupControls();

    this.startEnemyMovement();
  }
  startEnemyMovement() {
    this.enemyMoveInterval = setInterval(() => {
      this.moveEnemies();
    }, 1500); // враги двигаются раз в 1.5 секунды
  }

  placeItems() {
    // Мечи
    for (let i = 0; i < 2; i++) {
      this.placeRandom("tileSW");
    }
    // Зелья здоровья
    for (let i = 0; i < 10; i++) {
      this.placeRandom("tileHP");
    }
  }
  placeEnemies(count) {
    let placed = 0;
    while (placed < count) {
      const x = 1 + Math.floor(Math.random() * (this.tilesX - 2));
      const y = 1 + Math.floor(Math.random() * (this.tilesY - 2));
      if (this.map[y][x] === "empty") {
        this.map[y][x] = "tileE";
        this.enemies.push({ x, y, health: 30, maxHealth: 30 });
        placed++;
      }
    }
  }
  moveEnemies() {
    this.enemies.forEach((enemy) => {
      const directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
        [0, 0],
      ];
      const [dx, dy] =
        directions[Math.floor(Math.random() * directions.length)];
      const newX = enemy.x + dx;
      const newY = enemy.y + dy;

      if (
        newX > 0 &&
        newX < this.tilesX - 1 &&
        newY > 0 &&
        newY < this.tilesY - 1 &&
        this.map[newY][newX] === "empty" &&
        !(newX === this.player.x && newY === this.player.y)
      ) {
        this.map[enemy.y][enemy.x] = "empty";
        enemy.x = newX;
        enemy.y = newY;
        this.map[newY][newX] = "tileE";
      } else if (
        Math.abs(newX - this.player.x) <= 1 &&
        Math.abs(newY - this.player.y) <= 1
      ) {
        this.attackPlayer();
      }
    });
    this.renderer.renderMap(this.map);
  }

  attackPlayer() {
    this.player.health -= 5;
    console.log("Враг атакует! Здоровье игрока:", this.player.health);
    if (this.player.health <= 0) {
      alert("Игра окончена! Вы проиграли.");
      clearInterval(this.enemyMoveInterval);
      // Можно добавить рестарт или что-то еще
    }
  }
  placeRandom(tileType) {
    while (true) {
      const x = 1 + Math.floor(Math.random() * (this.tilesX - 2));
      const y = 1 + Math.floor(Math.random() * (this.tilesY - 2));
      if (this.map[y][x] === "empty") {
        this.map[y][x] = tileType;
        break;
      }
    }
  }
  placeRandomItems(type, count) {
    let placed = 0;
    while (placed < count) {
      const x = 1 + Math.floor(Math.random() * (this.tilesX - 2));
      const y = 1 + Math.floor(Math.random() * (this.tilesY - 2));
      if (this.map[y][x] === "empty") {
        this.map[y][x] = type;
        placed++;
      }
    }
  }
  createMap() {
    for (let y = 0; y < this.tilesY; y++) {
      this.map[y] = [];
      for (let x = 0; x < this.tilesX; x++) {
        if (y === 0 && x === 0) {
          this.map[y][x] = "tileW-tl"; // верхний левый угол
        } else if (y === 0 && x === this.tilesX - 1) {
          this.map[y][x] = "tileW-tr"; // верхний правый угол
        } else if (y === this.tilesY - 1 && x === 0) {
          this.map[y][x] = "tileW-bl"; // нижний левый угол
        } else if (y === this.tilesY - 1 && x === this.tilesX - 1) {
          this.map[y][x] = "tileW-br"; // нижний правый угол
        } else if (y === 0 || y === this.tilesY - 1) {
          this.map[y][x] = "tileW-h"; // горизонтальная стена
        } else if (x === 0 || x === this.tilesX - 1) {
          this.map[y][x] = "tileW-v"; // вертикальная стена
        } else {
          this.map[y][x] = "empty";
        }
      }
    }
  }

  placePlayer() {
    this.player.x = Math.floor(this.tilesX / 2);
    this.player.y = Math.floor(this.tilesY / 2);
    this.player.health = 100;
    this.player.maxHealth = 100;
    this.player.attack = 10;
    this.map[this.player.y][this.player.x] = "tileP"; // игрок
  }

  generateRooms() {
    const roomCount = 3 + Math.floor(Math.random() * 3);
    this.rooms = [];

    for (let i = 0; i < roomCount; i++) {
      const roomWidth = 3 + Math.floor(Math.random() * 6);
      const roomHeight = 3 + Math.floor(Math.random() * 6);

      const roomX =
        1 + Math.floor(Math.random() * (this.tilesX - roomWidth - 2));
      const roomY =
        1 + Math.floor(Math.random() * (this.tilesY - roomHeight - 2));

      // Сначала ставим стены по периметру комнаты
      for (let y = roomY; y < roomY + roomHeight; y++) {
        for (let x = roomX; x < roomX + roomWidth; x++) {
          // Внешние границы комнаты — стены
          if (
            y === roomY || // верхняя стена
            y === roomY + roomHeight - 1 || // нижняя стена
            x === roomX || // левая стена
            x === roomX + roomWidth - 1 // правая стена
          ) {
            this.map[y][x] = "tileW"; // или можно более конкретно "tileW-v" или "tileW-h"
          } else {
            this.map[y][x] = "empty"; // внутреннее пространство комнаты
          }
        }
      }

      this.rooms.push({
        x: roomX,
        y: roomY,
        width: roomWidth,
        height: roomHeight,
      });
    }
  }

  connectRooms() {
    for (let i = 1; i < this.rooms.length; i++) {
      const prev = this.rooms[i - 1];
      const curr = this.rooms[i];

      const prevCenterX = Math.floor(prev.x + prev.width / 2);
      const prevCenterY = Math.floor(prev.y + prev.height / 2);
      const currCenterX = Math.floor(curr.x + curr.width / 2);
      const currCenterY = Math.floor(curr.y + curr.height / 2);

      for (
        let x = Math.min(prevCenterX, currCenterX);
        x <= Math.max(prevCenterX, currCenterX);
        x++
      ) {
        this.map[prevCenterY][x] = "empty";
      }
      for (
        let y = Math.min(prevCenterY, currCenterY);
        y <= Math.max(prevCenterY, currCenterY);
        y++
      ) {
        this.map[y][currCenterX] = "empty";
      }
    }
  }
  findEnemyAt(x, y) {
    return this.enemies.find((enemy) => enemy.x === x && enemy.y === y) || null;
  }

  setupControls() {
    document.addEventListener("keydown", (e) => {
      let newX = this.player.x;
      let newY = this.player.y;

      switch (e.key.toLowerCase()) {
        case "w":
          newY--;
          break;
        case "s":
          newY++;
          break;
        case "a":
          newX--;
          break;
        case "d":
          newX++;
          break;
        case " ":
          this.attackEnemies();
          return;
      }

      if (
        newX >= 0 &&
        newX < this.tilesX &&
        newY >= 0 &&
        newY < this.tilesY &&
        !this.map[newY][newX].startsWith("tileW")
      ) {
        const tile = this.map[newY][newX];

        if (tile === "tileHP") {
          this.player.health = Math.min(
            this.player.health + 20,
            this.player.maxHealth
          );
          console.log("Собрали зелье, здоровье:", this.player.health);
        } else if (tile === "tileSW") {
          this.player.attack += 5;
          this.player.hasSword = true;
          console.log("Собрали меч, атака:", this.player.attack);
        } else if (tile === "tileE") {
          this.fightEnemy(newX, newY);
          return;
        }

        this.map[this.player.y][this.player.x] = "empty";
        this.player.x = newX;
        this.player.y = newY;
        this.map[newY][newX] = "tileP";

        this.renderer.renderMap(this.map);

        // После движения игрока вызываем движение врагов:
        this.moveEnemies();
      }
    });
  }

  fightEnemy(enemyX, enemyY) {
    // Простейшая логика боя
    console.log("Встреча с врагом!");
    // Можно реализовать урон и логику позже
  }

  attackEnemies() {
    const directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ];

    directions.forEach(([dx, dy]) => {
      const x = this.player.x + dx;
      const y = this.player.y + dy;
      if (
        x >= 0 &&
        x < this.tilesX &&
        y >= 0 &&
        y < this.tilesY &&
        this.map[y][x] === "tileE"
      ) {
        const enemy = this.findEnemyAt(x, y);
        if (enemy) {
          enemy.health -= this.player.attack;
          console.log(`Враг получил урон! Здоровье: ${enemy.health}`);

          if (enemy.health <= 0) {
            // убираем врага с карты
            this.map[y][x] = "empty";
            this.enemies = this.enemies.filter((e) => e !== enemy);
            console.log("Враг повержен!");
          }
        }
      }
    });

    this.renderer.renderMap(this.map);
  }
}

window.onload = () => {
  const game = new Game();
  game.init();
};
