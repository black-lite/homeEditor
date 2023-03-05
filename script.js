document.addEventListener('DOMContentLoaded', function()
{
	let svgPath;

	let startCoord = {}
	let lastCoord = {};

	let circle = null;

	let isEnd = false;
	let isCurrent = false;
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

	function wall() { if (svg) { svgPath = null; strokeWidth = 20; } }
	function partition() { if (svg) { svgPath = null; strokeWidth = 10; } }
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

		// TODO Сделать проверку замыкания контура и начать рисовать как с самого начала

		if (!isMove) isMove = true;

		if (isEnd)
		{
			let pathData = svgPath.getAttribute("d");
			let M = pathData.slice(0, 8);
			svgPath.setAttribute("d", M + ' L' + startCoord.x0 + "," + startCoord.y0);
			svgPath = null;
			startCoord = {};
			lastCoord = {};

			isMove = false;
			circle.remove();
			// document.getElementsByTagName('circle')[0].remove();
		}

		if (JSON.stringify(startCoord) === '{}')
		{
			startCoord = {
				x0: event.clientX, x1: event.clientX + radiusX, x2: event.clientX - radiusX,
				y0: event.clientY, y1: event.clientY + radiusY, y2: event.clientY - radiusY,
			};
		}
	}

	function draw(event)
	{
		if (!isMove) return;

		/** Проверяет, рисовалали первую линию или нет */
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
					'd': "M" + startCoord.x0 + "," + startCoord.y0,
				});
			}

			let pathData = svgPath.getAttribute("d");
			let M = pathData.slice(0, 8);
			svgPath.setAttribute("d", M + ' L' + event.clientX + "," + event.clientY);
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

			let pathData = svgPath.getAttribute("d");
			let M = pathData.slice(0, 8);
			svgPath.setAttribute("d", M + ' L' + event.clientX + "," + event.clientY);
		}

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

			// if (!circleCreate)
			// {
			// 	let circle = createSvgElement("circle");
			// 	// _circle = circle;
			// 	circle.setAttribute("cx", startCoord.x0);
			// 	circle.setAttribute("cy", startCoord.y0);
			// 	circle.setAttribute("r", 5);
			// 	circle.setAttribute("fill", 'red');
			// 	svg.append(circle);
			// 	circleCreate = true;
			// }
		}
		else
		{
			// if (circleCreate) circleCreate = false;
			if (isEnd)
			{
				isEnd = false;

				circle.remove();

				console.log(isEnd);
			}
		}

		// if (JSON.stringify(lastCoord) === '{}')
		// {
		// 	if (svgPath)
		// 	{
		// 		let pathData = svgPath.getAttribute("d");
		// 		let M = pathData.slice(0, 8);
		// 		svgPath.setAttribute("d", M + ' L' + event.clientX + "," + event.clientY);
		// 	}
		// }
		// else
		// {
		// 	if (!svgPath)
		// 	{
		// 		svgPath = createSvgElement("path");
		// 		svgPath.setAttribute("fill", "none");
		// 		svgPath.setAttribute("shape-rendering", "geometricPrecision");
		// 		svgPath.setAttribute("stroke-linejoin", "miter");
		// 		svgPath.setAttribute("stroke", "#000000");
		// 		svgPath.setAttribute("stroke-width", strokeWidth);
		// 		// svgPath.setAttribute("d", "M" + event.clientX + "," + event.clientY);
		// 		svg.append(svgPath);
		// 	}
		//
		// 	let M = 'M' + lastCoord.x + ',' + lastCoord.y;
		// 	svgPath.setAttribute("d", M +' L' + event.clientX + "," + event.clientY);
		// }
	}

	function end(event)
	{
		// isMove = false;
		if (svgPath)
		{
			let pathData = svgPath.getAttribute("d");
			pathData = pathData + " L" + event.clientX + "," + event.clientY +'Z';
			svgPath.setAttribute("d", pathData);
			svgPath = null;
			// isCurrent = false;
			lastCoord = { x: event.clientX, y: event.clientY }
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

});