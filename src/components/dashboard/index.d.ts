export type CollapsibleControls = [boolean, (val: boolean) => void];
export type ModalControls = [boolean, (val: boolean) => void];
export type TaskViewOptions = "priority" | "standard";
export type TimerViewOptions = "day" | "standard";
export type ViewControls<T> = [T, (val: T) => void];
export interface GenericQuery<T> {
  isLoading: boolean;
  isRefetching: boolean;
  data?: T;
}
export interface DashboardCollapsibleProps {
  areItemsLoading: boolean;
  collapsibleControls: CollapsibleControls;
  modalControls: ModalControls;
  prefix: string;
  title: string;
}
