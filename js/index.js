const tableGame = document.getElementById("game_box");
let cobrinha = {
  corpo: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ],
  direcao: "direita",
  tamanho: 3,
};
let pause = true;
let time = 300;
let bloqueado = false;
let bolinha;

document.addEventListener("keydown", mudar_direcao, false);
document.addEventListener("keydown", pausar_jogo, false);

function pausar_jogo(e) {
  if (e.code === "Space") {
    pause = !pause;
    pausa_iniciar();
  }
}

function mudar_direcao(e) {
  if (!bloqueado) {
    if (e.code === "ArrowRight" && cobrinha.direcao !== "esquerda") {
      cobrinha.direcao = "direita";
    } else if (e.code === "ArrowDown" && cobrinha.direcao !== "cima") {
      cobrinha.direcao = "baixo";
    } else if (e.code === "ArrowLeft" && cobrinha.direcao !== "direita") {
      cobrinha.direcao = "esquerda";
    } else if (e.code === "ArrowUp" && cobrinha.direcao !== "baixo") {
      cobrinha.direcao = "cima";
    }
    bloqueado = true;
  }
}

let array_jogo = [];
function criar_array_jogo(tamanho = 30) {
  for (let i = 0; i < tamanho; i++) {
    array_jogo[i] = [];
    for (let j = 0; j < tamanho; j++) {
      array_jogo[i][j] = 0;
    }
  }

  return array_jogo;
}

function criar_caixas_jogo(array_jogo) {
  for (let c = 0; c < array_jogo.length; c++) {
    let coluna = document.createElement("span");

    for (let l = 0; l < array_jogo[c].length; l++) {
      let linha = document.createElement("div");
      linha.classList.add(`linha${l}0${c}`);
      linha.classList.add("linha");

      coluna.appendChild(linha);
    }
    tableGame.appendChild(coluna);
  }
  gerar_bolinha_aleatoria();
}
function gerar_bolinha_aleatoria() {
  let x = Math.floor(Math.random() * array_jogo.length);
  let y = Math.floor(Math.random() * array_jogo.length);

  if (bolinha) {
    linha = document.querySelector(`.linha${bolinha.y}0${bolinha.x}`);
    linha.classList.remove("bola");
  }
  bolinha = { x, y };

  posicao = document.querySelector(`.linha${y}0${x}`);
  posicao.classList.add("bola");
}

function desenhar_cobrinha() {
  verificar_colisao()
  try{

    for (let l = 0; l < cobrinha.corpo.length; l++) {
      let posicao = `${cobrinha.corpo[l].y}0${cobrinha.corpo[l].x}`;
      let linha = document.querySelector(`.linha${posicao}`);
      linha.classList.add(`cobrinha`);
      linha.classList.add(`cobrinha${posicao}`);
    }
  }catch(e){
    pause = true;
  }
}

function remover_rabo(posi) {
  let posicao = `.linha${posi.y}0${posi.x}`;

  let linha = document.querySelector(posicao);
  linha.classList.remove(`cobrinha${posicao}`);
  linha.classList.remove(`cobrinha`);
}
function verificar_colisao() {
  let ultimo = cobrinha.corpo.at(-1);
  if (
    cobrinha.corpo.at(-1).x === bolinha.x &&
    cobrinha.corpo.at(-1).y === bolinha.y
  ) {
    gerar_bolinha_aleatoria();
    nova_celula = { x: cobrinha.corpo[0].x, y: cobrinha.corpo[0].y };
    cobrinha.corpo.unshift(nova_celula);
  }

  console.log(ultimo);
  if (
    cobrinha.corpo.filter((ele) => ele.x === ultimo.x && ele.y === ultimo.y)
      .length > 1
  || ultimo.x < 0 || ultimo.x > 29 || ultimo.y < 0 || ultimo.y > 29) {
    pause = true;
  }
}

function criar_cobrinha() {
  let primeiro = cobrinha.corpo.shift();
  let ultimo = cobrinha.corpo.at(-1);
  if (cobrinha.direcao === "direita") {
    cobrinha.corpo.push({ x: ultimo.x + 1, y: ultimo.y });
  } else if (cobrinha.direcao === "baixo") {
    cobrinha.corpo.push({ x: ultimo.x, y: ultimo.y + 1 });
  } else if (cobrinha.direcao === "esquerda") {
    cobrinha.corpo.push({ x: ultimo.x - 1, y: ultimo.y });
  } else if (cobrinha.direcao === "cima") {
    cobrinha.corpo.push({ x: ultimo.x, y: ultimo.y - 1 });
  }
  if(!pause){

    // verificar_colisao();
    remover_rabo(primeiro);
    desenhar_cobrinha();
  }

  bloqueado = false;
}

function renderizar_game() {
  criar_caixas_jogo(criar_array_jogo(30));
  desenhar_cobrinha();
}

function pausa_iniciar() {
  if (!pause) {
    let int = setInterval(() => {
      criar_cobrinha();

      if (pause) {
        clearInterval(int);
      }
    }, time);
  }
}
renderizar_game();
pausa_iniciar();
