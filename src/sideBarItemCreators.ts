export type SideBarItemCreators = {
  [name: string]: {
    creator: (container: HTMLDivElement) => HTMLElement,
    index: number,
    groupIndex?: number,
  },
};
