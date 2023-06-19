export function generateBlueNoise(container, numDots, dotSizeMin, dotSizeMax) {
  const dots = [];

  function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function isValidPoint(x, y, size) {
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      const minDistance = dotSizeMax + dot.size + size;
      if (distance(x, y, dot.x, dot.y) < minDistance) {
        return false;
      }
    }
    return true;
  }

  function getRandomDotSize() {
    const threshold = 1.2; // Adjust this value to control the probability distribution
    const randomValue = Math.random();
    if (randomValue < threshold) {
      return Math.random() * (2 - dotSizeMin + 1) + dotSizeMin; // Include dotSizeMin in the range
    } else {
      return Math.random() * (dotSizeMax - 2) + 2;
    }
  }

  while (dots.length < numDots) {
    const dot = {
      x: Math.random() * container.offsetWidth,
      y: Math.random() * container.offsetHeight,
      size: getRandomDotSize(),
    };

    if (isValidPoint(dot.x, dot.y, dot.size)) {
      dots.push(dot);
    }
  }

  dots.forEach((dot) => {
    const dotElement = document.createElement("div");
    dotElement.classList.add("dot");
    dotElement.style.left = `${dot.x}px`;
    dotElement.style.top = `${dot.y}px`;
    dotElement.style.width = `${dot.size}px`;
    dotElement.style.height = `${dot.size}px`;
    container.appendChild(dotElement);
  });
}
