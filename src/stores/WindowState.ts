export const enum WindowVisibility { Normal, Maximized, Minimized }

export type WindowListState = WindowState[]; //Ordered from back to front

export interface WindowState {
    windowId: number,
    component: string,
    visibility: WindowVisibility,
    pos: [number, number],
    size: [number, number]
}