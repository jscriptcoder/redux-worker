// generates unique ids
export const uid = (() => {
	let inc = 0;
	return (): number => ++inc;
})()

// generates random integers between min and max (inclusive)
export const random = (min, max): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}