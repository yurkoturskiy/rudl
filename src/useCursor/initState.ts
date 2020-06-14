export interface CursorState {
  isMouse: boolean;
  isTouch: boolean;
  isPress: boolean;
  isLongPress: boolean;
  isMove: boolean;
  isDrag: boolean;
  pos: Pos | null;
  initialPos: Pos | null;
  numOfCursors: number | null;
  // Item scope
  dragItemId: string | null;
  dragItemIndex: string | null;
  dragPoint: Pos | null;
  overItemId: string | null;
  overItemIndex: number | null;
  preventClick?: boolean;
  setOverItem?: (payload: any) => void;
}

export interface Pos {
  x: number;
  y: number;
}

export const initState = (state: CursorState): CursorState => ({
  ...state,
  isMouse: false,
  isTouch: false,
  isPress: false,
  isLongPress: false,
  isMove: false,
  isDrag: false,
  pos: null,
  initialPos: null,
  numOfCursors: null,
  // Item scope
  dragItemId: null,
  dragItemIndex: null,
  dragPoint: null,
  overItemId: null,
  overItemIndex: null,
});
