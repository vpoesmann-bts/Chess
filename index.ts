const GRID_SIDE: number = 8;
const BLACK_CELL_CLASS: string = "blackCell";
const WHITE_CELL_CLASS: string = "whiteCell";
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
      row.appendChild(cell);
    }
    htmlGrid.appendChild(row);
  }
}

function convertCoordsToId(coords: number[]): string {
  return `${coords[0]},${coords[1]}`;
}

function convertIdToCoords(id: string) {
  return id.split(',');
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
  let cell: HTMLDivElement = <HTMLDivElement>document.getElementById(convertCoordsToId(coords));
  return cell.removeChild(piece);
}

function getHTMLPieceAt(coords: number[]): HTMLParagraphElement {
  let cell: HTMLDivElement = <HTMLDivElement>document.getElementById(convertCoordsToId(coords));
  return <HTMLParagraphElement>cell.firstChild;
}

generateGrid(grid);
generateHTMLGrid(htmlGrid);
