import { type User } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { writable, type Writable } from "svelte/store";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export const loadedAuth: Writable<boolean> = writable(false);
export const currentUser: Writable<User | null> = writable(null);

export const fetchCurrentUser = async () => {
	const { data } = await supabase.auth.getUser();

	currentUser.set(data.user);
	loadedAuth.set(true);
};

export const isSuperUser = (user: User | null) => {
	return user != null && ["2b5c3202-96ca-4ce2-b9dc-b4c4661e6f7b", "bb6b222d-c0c1-426e-bd7e-447c5089f675", "ca860e56-c5ae-4cb2-8b47-7195c5ee17f4", "d7f62e3e-9dad-4551-9aff-5ad5e24c3577"].includes(user.id);
};
