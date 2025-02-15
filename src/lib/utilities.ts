export const parseFormData = (target: HTMLElement | null) => {
	const data: { [key: string]: string } = {};

	for (let field of new FormData(target as HTMLFormElement)) {
		const [key, value] = field;
		data[key] = value.toString();
	}

	return data;
};
