import { get, Writable, writable } from "svelte/store";
import type { OwlyState } from "../types/toggleTypes";

export const owlyCurrentState: Writable<OwlyState> =
  writable<OwlyState>("steady");