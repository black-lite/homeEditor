document.addEventListener('DOMContentLoaded', function()
{
	let svgPath;

	/** Координаты начала самой первой линии контура */
	let startCoord = {}

	/** */
	let lastCoord = {};

	/** Координаты начала текущей линии */
	let currentStartCoord = {};

	const MODE_WALL = 0;
	const MODE_PARTITION = 1;

	let mode = MODE_WALL;

	let circle = null;

	let isEnd = false;
	let isCurrent = false;
	let isFirst = true;
	// let circleCreate = false;


	const radiusX = 30;
	const radiusY = 30;
	let strokeWidth = 20;

	let svg = document.querySelector('#svgCanvas');
	let _wall = document.querySelector('div.wall');
	let _partition = document.querySelector('div.partition');
	let clear = document.querySelector('div.clear');

	_wall.addEventListener('click', wall);
	_partition.addEventListener('click', partition);
	clear.addEventListener('click', clearSvg);

	function wall() { if (svg) { svgPath = null; strokeWidth = 20; mode = MODE_WALL; } }
	function partition() { if (svg) { svgPath = null; strokeWidth = 10; mode = MODE_PARTITION; } }
	function clearSvg() { if (svg) { svg.innerHTML = ''; lastCoord = {}; } }


	svg.addEventListener('mousedown', start);
	svg.addEventListener("mousemove", draw);
	svg.addEventListener("mouseup", end);

	let isMove = false;

	function start(event)
	{
		// isCurrent = true;
		// if (isEnd)
		// {
		// 	let pathData = svgPath.getAttribute("d");
		// 	let M = pathData.slice(0, 8);
		// 	svgPath.setAttribute("d", M + ' L' + startCoord.x0 + "," + startCoord.y0);
		// 	svgPath = null;
		// 	startCoord = {};
		// 	lastCoord = {};
		// 	// document.getElementsByTagName('circle')[0].remove();
		// }
		// else
		// {
		// 	if (JSON.stringify(lastCoord) === '{}' && !svgPath)
		// 	{
		// 		// svgPath = createSvgElement("path");
		// 		// svgPath.setAttribute("fill", "none");
		// 		// svgPath.setAttribute("shape-rendering", "geometricPrecision");
		// 		// svgPath.setAttribute("stroke-linejoin", "miter");
		// 		// svgPath.setAttribute("stroke", "#000000");
		// 		// svgPath.setAttribute("stroke-width", strokeWidth);
		// 		// svgPath.setAttribute("d", "M" + event.clientX + "," + event.clientY);
		// 		// svg.append(svgPath);
		//
		// 		startCoord = {
		// 			x0: event.clientX, x1: event.clientX + radiusX, x2: event.clientX - radiusX,
		// 			y0: event.clientY, y1: event.clientY + radiusY, y2: event.clientY - radiusY,
		// 		};
		// 	}
		// }

		// TODO Прорработать режимы рисования

		if (!isMove) isMove = true;

		currentStartCoord = { x: event.clientX, y: event.clientY }

		// if (isEnd)
		// {
		// 	let pathData = svgPath.getAttribute("d");
		// 	let M = pathData.slice(0, 8);
		// 	svgPath.setAttribute("d", M + ' L' + startCoord.x0 + "," + startCoord.y0);
		//
		// 	svgPath = null;
		// 	clearCoord();
		//
		// 	isMove = false;
		// 	isEnd = false;
		// 	isFirst = true;
		// 	circle.remove();
		// }

		if (JSON.stringify(startCoord) === '{}' && isFirst)
		{
			startCoord = {
				x0: event.clientX, x1: event.clientX + radiusX, x2: event.clientX - radiusX,
				y0: event.clientY, y1: event.clientY + radiusY, y2: event.clientY - radiusY,
			};
			isFirst = false;
		}
	}

	function draw(event)
	{
		if (!isMove) return;

		/** Это отработает, когда рисуем первую линию контура */
		if (JSON.stringify(lastCoord) === '{}')
		{
			if (!svgPath)
			{
				svgPath = createSvgElement('path', svg, {
					'fill': 'none',
					'shape-rendering': 'geometricPrecision',
					'stroke-linejoin': 'miter',
					'stroke': '#000000',
					'stroke-width': strokeWidth,
					'd': `M${startCoord.x0},${startCoord.y0}`
				});
			}
			svgPath.setAttribute("d", `M${currentStartCoord.x},${currentStartCoord.y} L${event.clientX},${event.clientY}`);
		}
		else
		{
			if (!svgPath)
			{
				svgPath = createSvgElement('path', svg, {
					'fill': 'none',
					'shape-rendering': 'geometricPrecision',
					'stroke-linejoin': 'miter',
					'stroke': '#000000',
					'stroke-width': strokeWidth,
					'd': "M" + lastCoord.x + "," + lastCoord.y,
				});
			}
			svgPath.setAttribute("d", `M${lastCoord.x},${lastCoord.y} L${event.clientX},${event.clientY}`);
		}

		if (mode === MODE_WALL)
		{
			if ((event.clientX > startCoord.x2 && event.clientX < startCoord.x1) && (event.clientY > startCoord.y2 && event.clientY < startCoord.y1))
			{
				if (!isEnd)
				{
					isEnd = true;

					circle = createSvgElement('circle', svg, {
						'cx': startCoord.x0,
						'cy': startCoord.y0,
						'r': 5,
						'fill': 'red',
					})

					console.log(isEnd);
				}
			}
			else
			{
				if (isEnd)
				{
					isEnd = false;
					circle.remove();
					console.log(isEnd);
				}
			}
		}
	}

	function end(event)
	{
		if (svgPath)
		{
			if (mode === MODE_WALL)
			{
				if (isEnd)
				{
					let pathData = svgPath.getAttribute("d");
					let M = pathData.slice(0, 8);
					svgPath.setAttribute("d", M + ' L' + startCoord.x0 + "," + startCoord.y0);

					svgPath = null;
					clearCoord();

					isMove = false;
					isEnd = false;
					isFirst = true;
					circle.remove();
				}
			}

			if (!isFirst)
			{
				let pathData = svgPath.getAttribute("d");
				pathData = pathData + " L" + event.clientX + "," + event.clientY +'Z';
				svgPath.setAttribute("d", pathData);
				svgPath = null;
				// isCurrent = false;
				lastCoord = { x: event.clientX, y: event.clientY }
				currentStartCoord = { x: event.clientX, y: event.clientY }
			}
		}
	}


	/** ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ */

	function createSvgElement(tag, container, attrs)
	{
		let shape = document.createElementNS("http://www.w3.org/2000/svg", tag);

		for (let k in attrs) { if (attrs.hasOwnProperty(k)) shape.setAttribute(k, attrs[k]); }
		if (container) { container.appendChild(shape); }

		return shape;
	}

	function clearCoord()
	{
		startCoord = {};
		lastCoord = {};
		currentStartCoord = {};
	}

});