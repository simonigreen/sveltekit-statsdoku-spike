export function createDelayedLoadingState(delay: number = 100) {
	let showLoading = false;

	setTimeout(() => {
		showLoading = true;
	}, delay);

	return {
		showLoading
	};
}
