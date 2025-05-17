import { page } from "$app/state";
import { writable, type Writable } from "svelte/store";

export const superUsers = ["2b5c3202-96ca-4ce2-b9dc-b4c4661e6f7b", "bb6b222d-c0c1-426e-bd7e-447c5089f675", "ca860e56-c5ae-4cb2-8b47-7195c5ee17f4", "d7f62e3e-9dad-4551-9aff-5ad5e24c3577"];
export const globalPopupState: Writable<"none" | "headernav" | "profile" | "signup" | "login" | "sorts" | "filters" | "checkout"> = writable("none");

export const filtersList: Writable<{ [key: string]: { name: string; value: string }[] }> = writable({});
