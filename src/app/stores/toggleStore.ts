import { get, Writable, writable } from "svelte/store";
import type { OwlieState } from "../types/toggleTypes";

export const owlieCurrentState: Writable<OwlieState> =
  writable<OwlieState>("steady");

export const isToggleVisible: Writable<boolean> = writable<boolean>(false);

export const setOwlieState = (state: OwlieState) => {
  owlieCurrentState.set(state);
};
