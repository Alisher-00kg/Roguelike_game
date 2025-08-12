// render.js

class Renderer {
  constructor(fieldElement, tileSize) {
    this.fieldElement = fieldElement;
    this.tileSize = tileSize;
  }

  //   renderMap(map) {
  //     this.fieldElement.innerHTML = "";
  //     for (let y = 0; y < map.length; y++) {
  //       for (let x = 0; x < map[y].length; x++) {
  //         const tileType = map[y][x];
  //         const tileDiv = document.createElement("div");
  //         tileDiv.classList.add("tile");
  //         switch (tileType) {
  //           case "tileW-tl":
  //           case "tileW-tr":
  //           case "tileW-bl":
  //           case "tileW-br":
  //           case "tileW-h":
  //           case "tileW-v":
  //             tileDiv.classList.add("tileW", tileType);
  //             break;
  //           case "tileP":
  //             tileDiv.classList.add("tileP");
  //             break;
  //           case "tileE":
  //             tileDiv.classList.add("tileE");
  //             break;
  //           case "tileSW":
  //             tileDiv.classList.add("tileSW");
  //             break;
  //           case "tileHP":
  //             tileDiv.classList.add("tileHP");
  //             break;
  //           case "empty":
  //             // пусто, просто "tile"
  //             break;
  //           default:
  //             // на всякий случай, если что-то не распознали
  //             break;
  //         }

  //         tileDiv.style.left = x * this.tileSize + "px";
  //         tileDiv.style.top = y * this.tileSize + "px";
  //         tileDiv.style.width = this.tileSize + "px";
  //         tileDiv.style.height = this.tileSize + "px";

  //         this.fieldElement.appendChild(tileDiv);
  //       }
  //     }
  //   }
  renderMap(map) {
    const field = document.querySelector(".field");
    field.innerHTML = "";

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tileType = map[y][x];
        const tileDiv = document.createElement("div");
        tileDiv.classList.add("tile");
        tileDiv.style.left = x * 50 + "px";
        tileDiv.style.top = y * 50 + "px";

        switch (tileType) {
          case "empty":
            tileDiv.classList.add("tile-empty");
            break;
          case "tileW":
            tileDiv.classList.add("tileW");
            break;
          case "tileP":
            tileDiv.classList.add("tileP");
            break;
          case "tileE":
            tileDiv.classList.add("tileE");
            break;
          case "tileHP":
            tileDiv.classList.add("tileHP");
            break;
          case "tileSW":
            tileDiv.classList.add("tileSW");
            break;
          default:
            // Если нужно, добавить дефолтный стиль
            tileDiv.classList.add("tile-empty");
            break;
        }

        field.appendChild(tileDiv);
      }
    }
  }
}
