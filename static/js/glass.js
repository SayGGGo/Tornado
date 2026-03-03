const svgFilter = `
<svg style="position: absolute; width: 0; height: 0;" xmlns="http://www.w3.org/2000/svg">
  <filter id="liquid-glass-filter" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
    <feImage xlink:href="data:image/svg+xml,%3Csvg width='500' height='500' viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CradialGradient id='g'%3E%3Cstop offset='0%25' stop-color='%237f7f7f'/%3E%3Cstop offset='100%25' stop-color='%23000'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='500' height='500' fill='url(%23g)'/%3E%3C/svg%3E" 
             result="lens-map" preserveAspectRatio="none" />

    <feTurbulence id="noise" type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="92" result="noise" />
    
    <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="preblur" />

    <feDisplacementMap in="preblur" in2="lens-map" scale="30" xChannelSelector="R" yChannelSelector="G" result="dispR" />
    <feColorMatrix in="dispR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />

    <feDisplacementMap in="preblur" in2="lens-map" scale="35" xChannelSelector="R" yChannelSelector="G" result="dispG" />
    <feColorMatrix in="dispG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />

    <feDisplacementMap in="preblur" in2="lens-map" scale="40" xChannelSelector="R" yChannelSelector="G" result="dispB" />
    <feColorMatrix in="dispB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />

    <feBlend in="r" in2="g" mode="screen" result="rg" />
    <feBlend in="rg" in2="b" mode="screen" result="chroma" />

    <feFlood flood-color="black" flood-opacity="0.2" result="shadow-color" />
    <feComposite in="shadow-color" in2="SourceGraphic" operator="in" result="shadow-base" />
    
    <feBlend in="chroma" in2="shadow-base" mode="multiply" />
    
    <feComposite in2="SourceGraphic" operator="in" />
  </filter>
</svg>`;

(function() {
  const isChromium = /chrome|edg|opr|opera/.test(navigator.userAgent.toLowerCase());
  const elements = document.querySelectorAll('.liquid-glass');

  if (elements.length > 0 && isChromium) {
    document.body.insertAdjacentHTML('afterbegin', svgFilter);

    const filter = document.getElementById('liquid-glass-filter');
    const turbulence = filter.querySelector('#noise');

    let seedVal = 92;
    let lastTime = Date.now();

    function animateLiquid() {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      seedVal += 0.5 * deltaTime;
      turbulence.setAttribute('seed', seedVal);
      requestAnimationFrame(animateLiquid);
    }

    animateLiquid();
  }

  elements.forEach(el => {
    if (!isChromium) {
      el.classList.remove('liquid-glass');
      el.classList.add('liquid-glass-fallback');
    }
  });
})();