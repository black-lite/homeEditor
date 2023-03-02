$(function () {
	let svgPath;

	let svg = document.querySelector('#svgCanvas');
	let _wall = document.querySelector('div.wall');
	let _partition = document.querySelector('div.partition');
	_wall.addEventListener('click', wall);
	_partition.addEventListener('click', partition);
	function wall() { if (svg) svgPath.setAttribute("stroke-width", "20"); }
	function partition() { if (svg) svgPath.setAttribute("stroke-width", "10");}

	let lastCoord;
	let isMove = false;
	svg.addEventListener('mousedown',  start);
	svg.addEventListener("mousemove", _continue);
	svg.addEventListener("mouseup", end);

	function start(event)
	{
		isMove = true;
		svgPath = createSvgElement("path");
		svgPath.setAttribute("fill", "none");
		svgPath.setAttribute("shape-rendering", "geometricPrecision");
		svgPath.setAttribute("stroke-linejoin", "miter");
		svgPath.setAttribute("stroke", "#000000");
		svgPath.setAttribute("stroke-width", "20");
		svgPath.setAttribute("d", "M" + event.clientX + "," + event.clientY);
		svg.append(svgPath);
	}

	function _continue(event)
	{
		if (isMove)
		{
			if (!lastCoord)
			{
				if (svgPath)
				{
					let pathData = svgPath.getAttribute("d");
					let  M= pathData.slice(0, 8);
					svgPath.setAttribute("d", M + ' L' + event.clientX + "," + event.clientY);
				}
			}
			else {
				let M = ' M' + lastCoord.x + ',' + lastCoord.y;
				let pathData = svgPath.getAttribute("d");
				svgPath.setAttribute("d", pathData + M +' L' + event.clientX + "," + event.clientY);
			}
		}
	}

	function end(event)
	{
		isMove = false;
		if (svgPath) {
			let pathData = svgPath.getAttribute("d");
			pathData = pathData + " L" + event.clientX + "," + event.clientY +'Z';
			svgPath.setAttribute("d", pathData);
			svgPath = null;
		}
		lastCoord = { x: event.clientX, y: event.clientY }
	}

	function createSvgElement(tagName) { return document.createElementNS("http://www.w3.org/2000/svg", tagName); }
});