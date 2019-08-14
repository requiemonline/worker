import processTimeSeries from './processTimeSeries.js'

const d = document

const firefly = d.getElementById('firefly')
window.onmousemove = ({ clientX: x, clientY: y }) => {
	firefly.style.transform = `translate(${x}px, ${y}px)`
}

const lengthInput = d.getElementById('length')
lengthInput.value = '25000'

const randomCoord = () => Math.random() * 10000
const oneDay = 1000 * 60 * 60 * 24
const sequentDate = i => new Date(i * oneDay).getTime()

const generateTimeSeries = () => {
	const timeSeries = [[], []]

	const len = +d.getElementById('length').value 

	Object.keys([...Array(len)]).forEach(j => {
		const x = sequentDate(j)
		;[0, 1].forEach(i => {
			timeSeries[i].push({ x, y: randomCoord() })
		})
	})

	console.log('raw time series', timeSeries)
	return timeSeries
}

const worker = new Worker('worker.js')

const iterators = {
	native: timeSeries => processTimeSeries(...timeSeries),
	worker: async timeSeries => {
		const postData = await JSON.stringify(timeSeries)

		await worker.postMessage(postData)

		return new Promise(res => (worker.onmessage = e => res(e.data)))
	},
}

Object.entries(iterators).forEach(([id, action]) => {
	const elem = d.getElementById(id)
	const button = elem.firstElementChild
	const paragraph = elem.lastElementChild
	const setText = time => paragraph.innerText = time

	button.onclick = async () => {
		setText('_')
		const timeSeries = generateTimeSeries()
		const start = performance.now()
		const result = await action(timeSeries)
		const time = Math.floor(performance.now() - start) / 1000
		setText(`${time}s`)
		console.log(id, time, result)
	}
})
