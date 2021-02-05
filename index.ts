const GRID_SIDE: number = 8;
const BLACK_CELL_CLASS: string = "blackCell";
const WHITE_CELL_CLASS: string = "whiteCell";
const LIT_CELL_CLASS: string = "litCell";
const CELL_CLASS: string = "cell";
const ROW_CLASS: string = "row";
const PIECE_CLASS: string = "piece";
const CHESS_PIECES_CHARS: string[] = [, "K", "Q", "R", "N", "B", "P"];
const PIECE_COLOR_CLASS: string[] = [, "whitePiece", "blackPiece"];

enum Piece {
  BLACK_PAWN = -6,
  BLACK_BISHOP,
  BLACK_KNIGHT,
  BLACK_ROOK,
  BLACK_QUEEN,
  BLACK_KING,
  WHITE_KING = 1,
  WHITE_QUEEN,
  WHITE_ROOK,
  WHITE_KNIGHT,
  WHITE_BISHOP,
  WHITE_PAWN
}

let htmlGrid: HTMLDivElement = <HTMLDivElement>document.getElementById("grid");
let grid: number[][] = [];

let movingCell: number[] = [];
let currentPlayerTurn: number = 1;

function generateGrid(grid: number[][]): void {
  for (let i: number = 0 ; i < GRID_SIDE ; i++) {
    grid.push([]);
    for (let j: number = 0 ; j < GRID_SIDE ; j++) {
      grid[i].push(0);
    }
  }
}

function generateHTMLGrid(htmlGrid:HTMLDivElement): void {
  for (let i: number = 0 ; i < GRID_SIDE ; i++) {
    let row: HTMLDivElement = document.createElement("div");
    row.classList.add(ROW_CLASS);
    for (let j: number = 0 ; j < GRID_SIDE ; j++) {
      let cell: HTMLDivElement = document.createElement("div");
      if ((i+j) % 2 == 0) {
        cell.classList.add(WHITE_CELL_CLASS);
      } else {
        cell.classList.add(BLACK_CELL_CLASS);
      }
      cell.classList.add(CELL_CLASS);
      cell.id = `${j},${i}`;
      cell.addEventListener("click", onCellClick);
      row.appendChild(cell);
    }
    htmlGrid.appendChild(row);
  }
}

function generateDefaultBoardState(grid: number[][], htmlGrid: HTMLDivElement): void {
  for (let x: number = 0 ; x < GRID_SIDE ; x++) {
    for (let y: number = 0 ; y < GRID_SIDE ; y++) {
      grid[y][x] = 0;
      let cell = document.getElementById(convertCoordsToId([x, y]));
      cell.innerHTML = "";
    }
  }
  initPieceTo(Piece.BLACK_ROOK, [0, 0]);
  initPieceTo(Piece.BLACK_ROOK, [7, 0]);

  initPieceTo(Piece.BLACK_KNIGHT, [1, 0]);
  initPieceTo(Piece.BLACK_KNIGHT, [6, 0]);

  initPieceTo(Piece.BLACK_BISHOP, [2, 0]);
  initPieceTo(Piece.BLACK_BISHOP, [5, 0]);

  initPieceTo(Piece.BLACK_QUEEN, [3, 0]);
  initPieceTo(Piece.BLACK_KING, [4, 0]);

  for (let i: number = 0 ; i < GRID_SIDE ; i++) {
    initPieceTo(Piece.BLACK_PAWN, [i, 1]);
  }

  initPieceTo(Piece.WHITE_ROOK, [0, 7]);
  initPieceTo(Piece.WHITE_ROOK, [7, 7]);

  initPieceTo(Piece.WHITE_KNIGHT, [1, 7]);
  initPieceTo(Piece.WHITE_KNIGHT, [6, 7]);

  initPieceTo(Piece.WHITE_BISHOP, [2, 7]);
  initPieceTo(Piece.WHITE_BISHOP, [5, 7]);

  initPieceTo(Piece.WHITE_QUEEN, [3, 7]);
  initPieceTo(Piece.WHITE_KING, [4, 7]);

  for (let i: number = 0 ; i < GRID_SIDE ; i++) {
    initPieceTo(Piece.WHITE_PAWN, [i, 6]);
  }

}

function convertCoordsToId(coords: number[]): string {
  return `${coords[0]},${coords[1]}`;
}

function convertIdToCoords(id: string) {
  return id.split(',').map(string => parseInt(string));
}

function getPiecePlayer(pieceType: number): number {
  if (pieceType > 0) {
    return 1;
  }
  return 2;
}

function getPieceColor(pieceType: number): string {
  return PIECE_COLOR_CLASS[getPiecePlayer(pieceType)];
}

function createHTMLPiece(pieceType: number): HTMLParagraphElement {
  let piece: HTMLParagraphElement = document.createElement("p");
  piece.classList.add(getPieceColor(pieceType));
  piece.classList.add(PIECE_CLASS);
  piece.innerHTML = CHESS_PIECES_CHARS[Math.abs(pieceType)];

  return piece;
}

function setHTMLPieceTo(piece:HTMLParagraphElement, coords: number[]) {
  let cell: HTMLDivElement = <HTMLDivElement>document.getElementById(convertCoordsToId(coords));
  cell.appendChild(piece);
}

function removeHTMLPieceFrom(piece:HTMLParagraphElement, coords: number[]): HTMLParagraphElement {
  if (!piece) {
    return;
  }

  let cell: HTMLDivElement = <HTMLDivElement>document.getElementById(convertCoordsToId(coords));
  return cell.removeChild(piece);
}

function getHTMLPieceAt(coords: number[]): HTMLParagraphElement {
  let cell: HTMLDivElement = <HTMLDivElement>document.getElementById(convertCoordsToId(coords));
  return <HTMLParagraphElement>cell.firstChild;
}

function initPieceTo(piece: number, coords: number[]): void {
  grid[coords[1]][coords[0]] = piece;
  let HTMLpiece: HTMLParagraphElement = createHTMLPiece(piece);
  setHTMLPieceTo(HTMLpiece, [coords[0], coords[1]]);
}

function lightCell(id: string): void {
  let cell: HTMLDivElement = <HTMLDivElement>document.getElementById(id);
  cell.classList.remove(BLACK_CELL_CLASS);
  cell.classList.remove(WHITE_CELL_CLASS);
  cell.classList.add(LIT_CELL_CLASS);
}

function unlightCell(id: string): void {
  let cell: HTMLDivElement = <HTMLDivElement>document.getElementById(id);
  let coords: number[] = convertIdToCoords(id);
  cell.classList.remove(LIT_CELL_CLASS);
  if (coords[0] + coords[1] % 2 == 0) {
    cell.classList.add(BLACK_CELL_CLASS);
  } else {
    cell.classList.add(WHITE_CELL_CLASS);
  }
}

function onCellClick(event) {
  if (!event.currentTarget.hasChildNodes() && !movingCell.length) {
    return
  }

  let coords: number[] = convertIdToCoords(event.currentTarget.id);

  if (!movingCell.length) {
    let piece: number = grid[coords[1]][coords[0]];
    if (getPiecePlayer(piece) != currentPlayerTurn) {
      return
    }
    movingCell = coords;
    // TODO: Light cases
    lightCell(convertCoordsToId([5, 5]));
  } else if (event.currentTarget.classList.contains(LIT_CELL_CLASS)) {
    let piece: number = grid[movingCell[0]][movingCell[1]];
    grid[coords[0]][coords[1]] = piece;
    removeHTMLPieceFrom(getHTMLPieceAt(coords), coords);
    let HTMLPiece: HTMLParagraphElement = removeHTMLPieceFrom(getHTMLPieceAt(movingCell), movingCell);
    setHTMLPieceTo(HTMLPiece, coords);
    movingCell = [];
    unlightCell(convertCoordsToId([5, 5]));
  }
}

generateGrid(grid);
generateHTMLGrid(htmlGrid);
generateDefaultBoardState(grid, htmlGrid);
