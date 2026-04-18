  (function() {
    const panel   = document.getElementById('vizPanel');
    const canvas3 = document.getElementById('three-canvas');
    const espCvs  = document.getElementById('esp-canvas');
    const hintCtn = document.getElementById('esp-bottom');
    const renderer = new THREE.WebGLRenderer({ canvas: canvas3, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    function resize() {
      const w = panel.clientWidth, h = panel.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      espCvs.width  = w * window.devicePixelRatio;
      espCvs.height = h * window.devicePixelRatio;
      espCvs.style.width = w + 'px'; espCvs.style.height = h + 'px';
    }
    resize();
    window.addEventListener('resize', resize);

    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const dl = new THREE.DirectionalLight(0x34c759, 2.2); dl.position.set(3,5,5); scene.add(dl);
    const dl2 = new THREE.DirectionalLight(0xffffff, 0.6); dl2.position.set(-5,-2,-4); scene.add(dl2);
    const pl = new THREE.PointLight(0x34c759, 3, 14); pl.position.set(0, 2, 3); scene.add(pl);
    const pl2 = new THREE.PointLight(0x82ff9e, 1.5, 10); pl2.position.set(-3, -2, 2); scene.add(pl2);

    const rawPts = [
      [442.493, 592],[687.802, 384.673],[687.802, 235.834],
      [811.937, 235.834],[1082, 50],[334.072, 50],
      [50, 235.834],[442.493, 235.834]
    ];
    const cx0 = 566, cy0 = 321, sc0 = 3.6 / 542;
    const shape = new THREE.Shape();
    rawPts.forEach(([x, y], i) => {
      const nx = (x - cx0) * sc0, ny = -(y - cy0) * sc0;
      i === 0 ? shape.moveTo(nx, ny) : shape.lineTo(nx, ny);
    });
    shape.closePath();

    const extrudeOpts = { depth: 0.4, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.05, bevelSegments: 4 };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeOpts);
    geo.center();

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0.72, roughness: 0.12, reflectivity: 0.9, clearcoat: 0.6, clearcoatRoughness: 0.1,
    });
    const logo = new THREE.Mesh(geo, mat);
    logo.scale.set(0.6, 0.6, 0.6);
    scene.add(logo);

    const egeo = new THREE.EdgesGeometry(geo);
    const emat = new THREE.LineBasicMaterial({ color: 0x34c759, transparent: true, opacity: 0.5 });
    const edges = new THREE.LineSegments(egeo, emat);
    logo.add(edges);

    const wmat = new THREE.MeshBasicMaterial({ color: 0x34c759, wireframe: true, transparent: true, opacity: 0.04 });
    const wframe = new THREE.Mesh(geo, wmat);
    wframe.scale.set(0.6, 0.6, 0.6);
    scene.add(wframe);

    const PCount = 36;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PCount * 3);
    const pPhase = new Float32Array(PCount);
    for (let i = 0; i < PCount; i++) {
      const a = (i / PCount) * Math.PI * 2;
      const r = 2.4 + (Math.random() - 0.5) * 0.7;
      pPos[i*3]   = Math.cos(a) * r;
      pPos[i*3+1] = (Math.random() - 0.5) * 1.8;
      pPos[i*3+2] = Math.sin(a) * r;
      pPhase[i] = Math.random() * Math.PI * 2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pmat = new THREE.PointsMaterial({ color: 0x34c759, size: 0.04, transparent: true, opacity: 0.65 });
    const particles = new THREE.Points(pGeo, pmat);
    scene.add(particles);

    function makeRing(r, t, ox, oy, oz) {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.007, 2, 140),
        new THREE.MeshBasicMaterial({ color: 0x34c759, transparent: true, opacity: t })
      );
      m.rotation.set(ox, oy, oz); return m;
    }
    const rings = [
      makeRing(2.7, 0.15, Math.PI/2.5, 0, 0),
      makeRing(3.3, 0.08, Math.PI/3, 0.7, 0),
      makeRing(3.8, 0.05, Math.PI/1.8, 1.2, 0.3),
    ];
    rings.forEach(r => scene.add(r));

    let isDrag = false, px = 0, py = 0;
    let rotX = 0.18, rotY = 0, velX = 0, velY = 0.005;
    let autoRot = true;
    let resumeTimeout;

    function startDrag(clientX, clientY) {
      isDrag = true; px = clientX; py = clientY; autoRot = false; hintCtn.style.opacity = '0';
      clearTimeout(resumeTimeout);
    }
    function endDrag() {
      isDrag = false;
      resumeTimeout = setTimeout(() => { autoRot = true; }, 1500);
    }
    function moveDrag(clientX, clientY) {
      if (!isDrag) return;
      velY = (clientX - px) * 0.006; velX = (clientY - py) * 0.006;
      px = clientX; py = clientY;
    }

    canvas3.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
    canvas3.addEventListener('touchstart', e => startDrag(e.touches[0].clientX, e.touches[0].clientY), {passive:true});
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    window.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
    window.addEventListener('touchmove', e => moveDrag(e.touches[0].clientX, e.touches[0].clientY), {passive:true});

    const ctx = espCvs.getContext('2d');
    const dpr = window.devicePixelRatio;
    function W() { return espCvs.width / dpr; }
    function H() { return espCvs.height / dpr; }
    function projectPt(x, y, z) {
      const v = new THREE.Vector3(x, y, z).project(camera);
      return { x: (v.x * .5 + .5) * W(), y: (1 - (v.y * .5 + .5)) * H() };
    }
    function espBracket(cx, cy, w, h, arm, color, alpha) {
      ctx.save();
      ctx.strokeStyle = color; ctx.globalAlpha = alpha;
      ctx.lineWidth = 1.8; ctx.lineCap = 'round';
      const x = cx - w/2, y = cy - h/2;
      [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]].forEach(([bx,by,sx,sy]) => {
        ctx.beginPath();
        ctx.moveTo(bx+sx*arm, by); ctx.lineTo(bx, by); ctx.lineTo(bx, by+sy*arm);
        ctx.stroke();
      });
      ctx.restore();
    }
    function espLine(x1, y1, x2, y2, color, alpha) {
      ctx.save();
      ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      ctx.restore();
    }
    function espText(x, y, text, color, alpha, size) {
      ctx.save();
      ctx.fillStyle = color; ctx.globalAlpha = alpha;
      ctx.font = `600 ${size||10}px Outfit, monospace`;
      ctx.letterSpacing = '1px'; ctx.textAlign = 'center';
      ctx.fillText(text, x, y);
      ctx.restore();
    }
    function espDot(x, y, r, color, alpha) {
      ctx.save();
      ctx.fillStyle = color; ctx.globalAlpha = alpha;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }

    const floaters = [
      { r:2.0, phase:0,    speed:0.55, ry:0.5,  sz:20 },
      { r:2.4, phase:2.09, speed:0.42, ry:-0.7, sz:16 },
      { r:1.8, phase:4.18, speed:0.70, ry:0.9,  sz:14 },
    ];

    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.016;

      if (autoRot) {
        velY = velY * 0.95 + 0.005 * 0.05;
        velX *= 0.95;
      } else {
        velX *= 0.95;
        velY *= 0.95;
      }
      rotX += velX; rotY += velY;
      logo.rotation.x = rotX; logo.rotation.y = rotY;
      wframe.rotation.x = rotX; wframe.rotation.y = rotY;

      rings[0].rotation.z = t * 0.09;
      rings[1].rotation.y = t * 0.07;
      rings[2].rotation.x = t * 0.05;
      particles.rotation.y = t * 0.14;
      pl.position.x = Math.sin(t * 0.8) * 3.5;
      pl.position.y = Math.cos(t * 0.5) * 2;
      pl2.position.x = Math.cos(t * 0.6) * 3;
      pl2.position.y = Math.sin(t * 0.4) * 2;
      emat.opacity = 0.35 + 0.22 * Math.sin(t * 2.2);

      renderer.render(scene, camera);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W(), H());

      const box = new THREE.Box3().setFromObject(logo);
      const c8 = [
        [box.min.x,box.min.y,box.min.z],[box.max.x,box.min.y,box.min.z],
        [box.min.x,box.max.y,box.min.z],[box.max.x,box.max.y,box.min.z],
        [box.min.x,box.min.y,box.max.z],[box.max.x,box.min.y,box.max.z],
        [box.min.x,box.max.y,box.max.z],[box.max.x,box.max.y,box.max.z],
      ];
      let x1=Infinity,y1=Infinity,x2=-Infinity,y2=-Infinity;
      c8.forEach(([x,y,z]) => {
        const p = projectPt(x,y,z);
        if(p.x<x1)x1=p.x;if(p.x>x2)x2=p.x;
        if(p.y<y1)y1=p.y;if(p.y>y2)y2=p.y;
      });

      const bw = x2-x1, bh = y2-y1, bcx = x1+bw/2, bcy = y1+bh/2;
      const pad = 20;
      const pulse = 0.7 + 0.3 * Math.sin(t * 2.4);
      const bxp = x1-pad, byp = y1-pad, bwp = bw+pad*2, bhp = bh+pad*2;

      espBracket(bcx, bcy, bwp, bhp, 22, '#34c759', 0.9 * pulse);
      espBracket(bcx, bcy, bw+6, bh+6, 10, 'rgba(52,199,89,0.35)', 0.4*pulse);

      ctx.save();
      ctx.strokeStyle = '#34c759'; ctx.globalAlpha = 0.35 * pulse; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(bcx-7,bcy); ctx.lineTo(bcx+7,bcy);
      ctx.moveTo(bcx,bcy-7); ctx.lineTo(bcx,bcy+7); ctx.stroke();
      ctx.restore();

      espText(bcx, byp + bhp + 14, `TORNADO`, '#34c759', 0.55 * pulse);

      for (let i = 0; i < 5; i++) {
        const ty = byp + (bhp / 4) * i;
        espLine(bxp - 24, ty, bxp - 12, ty, '#34c759', 0.2 * pulse);
        ctx.save();
        ctx.globalAlpha = 0.3 * pulse; ctx.fillStyle = '#34c759';
        ctx.font = '8px Outfit, monospace'; ctx.textAlign = 'right';
        ctx.fillText((i*25)+'%', bxp - 14, ty + 3);
        ctx.restore();
      }

      espLine(bxp, byp - 10, bxp + bwp*.35, byp - 10, '#34c759', 0.18*pulse);
      espLine(bxp + bwp*.65, byp - 10, bxp + bwp, byp - 10, '#34c759', 0.18*pulse);

      floaters.forEach((f, fi) => {
        const angle = t * f.speed + f.phase;
        const wx = f.r * Math.cos(angle);
        const wy = f.ry + 0.4 * Math.sin(t * 0.8 + f.phase);
        const wz = f.r * Math.sin(angle);
        const sp = projectPt(wx, wy, wz);
        const fa = 0.3 + 0.2 * Math.sin(t * 1.8 + fi);
        espBracket(sp.x, sp.y, f.sz, f.sz * 0.65, 5, '#34c759', fa);
        espDot(sp.x, sp.y, 1.5, '#34c759', fa + 0.1);
        espLine(sp.x, sp.y, bcx + (sp.x-bcx)*0.15, bcy + (sp.y-bcy)*0.15, 'rgba(52,199,89,0.12)', fa*0.5);
      });
    }

    animate();
  })();

    window.onCaptchaSuccess = function(token) {
      if (window.setCaptchaSolved) window.setCaptchaSolved(true);
    };

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => document.getElementById('cardWindow').classList.add('ready'), 80);

        const form = document.getElementById('loginForm');
        const btn = document.getElementById('loginBtn');
        const errDiv = document.getElementById('error-msg');
        let captchaSolved = !document.getElementById('captcha-box').querySelector('.cf-turnstile, .smart-captcha');

    function showError(msg) {
      errDiv.textContent = msg;
      errDiv.style.display = 'block';
      errDiv.style.opacity = '1';
      setTimeout(() => {
        errDiv.style.opacity = '0';
        setTimeout(() => {
          errDiv.style.display = 'none';
          errDiv.style.opacity = '1';
        }, 300);
      }, 3500);
    }

    function checkFormValidity() {
      const inputsFilled = [...form.querySelectorAll('input[required]')].every(i => i.value.trim());
      const isReady = inputsFilled && captchaSolved;
      btn.classList.toggle('locked', !isReady);
      btn.disabled = !isReady;
    }

    window.setCaptchaSolved = (val) => {
      captchaSolved = val;
      checkFormValidity();
    };

    form.addEventListener('input', checkFormValidity);
    checkFormValidity();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (btn.classList.contains('locked')) return;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const origText = btn.querySelector('span').textContent;

      btn.querySelector('span').textContent = 'Загрузка...';
      btn.classList.add('locked');

      try {
        const res = await fetch('/login' + window.location.search, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const r = await res.json();

        if (r.success) {
          window.location.href = r.redirect;
        } else {
          showError(r.message || 'Неверный логин или пароль');
          btn.querySelector('span').textContent = origText;

          if (window.turnstile) {
            turnstile.reset();
          } else if (window.smartCaptcha) {
            window.smartCaptcha.reset();
          }

          captchaSolved = false;
          checkFormValidity();
        }
      } catch (err) {
        showError('Ошибка соединения с сервером');
        btn.querySelector('span').textContent = origText;
        btn.classList.remove('locked');
      }
    });
  });