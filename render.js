class Renderer {
  constructor(fieldElement, tileSize, player, findEnemyAt) {
    this.fieldElement = fieldElement;
    this.tileSize = tileSize;
    this.player = player;
    this.findEnemyAt = findEnemyAt; // функция для поиска врага
  }

  renderMap(map) {
    const field = this.fieldElement;
    field.innerHTML = "";

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tileType = map[y][x];
        const tileDiv = document.createElement("div");
        tileDiv.classList.add("tile");
        tileDiv.style.left = x * this.tileSize + "px";
        tileDiv.style.top = y * this.tileSize + "px";
        tileDiv.style.position = "absolute";
        tileDiv.setAttribute("data-x", x);
        tileDiv.setAttribute("data-y", y);

        switch (tileType) {
          case "empty":
            tileDiv.classList.add("tile-empty");
            break;
          case "tileW":
            tileDiv.classList.add("tileW");
            break;
          case "tileP":
            tileDiv.classList.add("tileP");

            // Шкала здоровья игрока
            const playerHealthBar = document.createElement("div");
            playerHealthBar.classList.add("health");
            playerHealthBar.style.width =
              (this.player.health / this.player.maxHealth) * 100 + "%";
            playerHealthBar.style.backgroundColor = "#00ff00";
            tileDiv.appendChild(playerHealthBar);

            // Если у игрока есть меч — добавляем иконку
            if (this.player.hasSword) {
              const swordIcon = document.createElement("div");
              swordIcon.style.backgroundImage =
                "url(./assets/images/tile-SW.png)";
              swordIcon.style.backgroundSize = "contain";
              swordIcon.style.backgroundRepeat = "no-repeat";
              swordIcon.style.width = "20px";
              swordIcon.style.height = "20px";
              swordIcon.style.position = "absolute";
              swordIcon.style.bottom = "20px";
              swordIcon.style.right = "-10px";
              tileDiv.appendChild(swordIcon);
            }
            break;
          case "tileE":
            tileDiv.classList.add("tileE");

            // Шкала здоровья врага
            const enemy = this.findEnemyAt(x, y);
            if (enemy) {
              const enemyHealthBar = document.createElement("div");
              enemyHealthBar.classList.add("health");
              enemyHealthBar.style.width =
                (enemy.health / enemy.maxHealth) * 100 + "%";
              enemyHealthBar.style.backgroundColor = "#ff0000";
              enemyHealthBar.style.height = "5px";
              enemyHealthBar.style.position = "absolute";
              enemyHealthBar.style.top = "-6px";
              tileDiv.appendChild(enemyHealthBar);
            }
            break;
          case "tileHP":
            tileDiv.classList.add("tileHP");
            break;
          case "tileSW":
            tileDiv.classList.add("tileSW");
            break;
          default:
            tileDiv.classList.add("tile-empty");
            break;
        }

        field.appendChild(tileDiv);
      }
    }
  }
  updateTile(x, y, tileType) {
    const tileElem = this.fieldElement.querySelector(
      `[data-x='${x}'][data-y='${y}']`
    );
    if (!tileElem) return;

    tileElem.className = "tile " + tileType;
    tileElem.innerHTML = ""; // очищаем содержимое

    switch (tileType) {
      case "tileP":
        // Шкала здоровья игрока
        const playerHealthBar = document.createElement("div");
        playerHealthBar.classList.add("health");
        playerHealthBar.style.width =
          (this.player.health / this.player.maxHealth) * 100 + "%";
        playerHealthBar.style.backgroundColor = "#00ff00";
        tileElem.appendChild(playerHealthBar);

        // Иконка меча, если есть
        if (this.player.hasSword) {
          const swordIcon = document.createElement("div");
          swordIcon.style.backgroundImage = "url(./assets/images/tile-SW.png)";
          swordIcon.style.backgroundSize = "contain";
          swordIcon.style.backgroundRepeat = "no-repeat";
          swordIcon.style.width = "20px";
          swordIcon.style.height = "20px";
          swordIcon.style.position = "absolute";
          swordIcon.style.bottom = "0";
          swordIcon.style.right = "0";
          tileElem.appendChild(swordIcon);
        }
        break;

      case "tileE":
        const enemy = this.findEnemyAt(x, y);
        if (enemy) {
          const enemyHealthBar = document.createElement("div");
          enemyHealthBar.classList.add("health");
          enemyHealthBar.style.width =
            (enemy.health / enemy.maxHealth) * 100 + "%";
          enemyHealthBar.style.backgroundColor = "#ff0000";
          enemyHealthBar.style.height = "5px";
          enemyHealthBar.style.position = "absolute";
          enemyHealthBar.style.top = "0";
          tileElem.appendChild(enemyHealthBar);
        }
        break;

      // Можно добавить обновление для других типов тайлов, если нужно
      case "tileHP":
      case "tileSW":
        // оставляем только класс
        break;

      default:
        // пустой тайл
        break;
    }
  }
}
