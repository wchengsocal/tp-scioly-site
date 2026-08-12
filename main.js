/* ═══════════════════════════════════════════════════════════════
   TORREY PINES SCIENCE OLYMPIAD — behaviour

   Loaded with `defer`, so the DOM is parsed before this runs.
   Everything is inside one IIFE; nothing touches the global scope.

   Contents, in order:
     1. Reveal arming ....... adds .js so no-JS renders fully visible
     2. Nav ................. pins a background on scroll
     3. Falcon flight ....... scroll-scrubbed logo on a canvas runway
     4. Season strip ........ builds the calendar, lights it once
     5. Patch stitch-on ..... the hero crest sewing itself together
     6. Hero parallax ....... the crest settling as you scroll away
     7. Scroll progress ..... bullion thread across the top
     8. Heading word wipe ... section headlines rising word by word
     9. Scroll reveals ...... IntersectionObserver, fire once
    10. Season thread ....... bullion line drawing down the calendar
    11. Counters ........... animated figures, supports data-prefix
    12. Roster accordion ... discipline panels
    13. Track panels ....... pointer-follow warm light (fine pointers)

   Every effect checks `reduced` and degrades to a static state.
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Arm the scroll reveals only now that JS is running to disarm them.
     Without this class the page renders fully visible. */
  document.documentElement.classList.add('js');

  /* ── PRIVACY NOTICE ──
     Shown once until dismissed. localStorage, not a cookie — which is
     itself consistent with what the notice says. */
  (function(){
    var bar = document.getElementById('cookieNotice');
    var ok  = document.getElementById('cookieOk');
    if(!bar || !ok) return;

    var KEY = 'tpso-privacy-ack';
    var seen;
    try { seen = localStorage.getItem(KEY); } catch(e) { seen = '1'; }
    if(seen) return;

    bar.hidden = false;
    // next frame, so the slide-up transition has a start state to animate from
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ bar.setAttribute('data-show',''); });
    });

    ok.addEventListener('click', function(){
      bar.removeAttribute('data-show');
      try { localStorage.setItem(KEY, '1'); } catch(e) {}
      window.setTimeout(function(){ bar.hidden = true; }, 600);
    });
  })();

  /* ── NAV: pin on scroll ── */
  var nav = document.getElementById('nav');
  function onScroll(){ nav.classList.toggle('pinned', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ── HERO: the one orchestrated moment — the patch gets stitched on ──
     Ring draws, letter drops in, lettering fades along its arc.        */
  (function stitchPatch(){
    var crest = document.querySelector('.crest');
    if(!crest) return;
    if(reduced) return;                     /* CSS already shows it */

    var rings   = crest.querySelectorAll('.ring');
    var letter  = crest.querySelector('.letter');
    var arcs    = crest.querySelectorAll('.arcpath');
    var yr      = crest.querySelector('.yr');

    /* The patch is laid down: felt backing first, then the merrow edge
       sewn around it, each layer a beat behind the last. */
    rings.forEach(function(r, i){
      r.animate(
        [{opacity:0, transform:'scale(.965)'},
         {opacity:1, transform:'none'}],
        {duration:900, delay:80 + i*130, easing:'cubic-bezier(.22,1,.36,1)',
         fill:'both', composite:'replace'}
      );
    });

    letter.animate(
      [{opacity:0, transform:'translateY(-16px) scale(.94)'},
       {opacity:1, transform:'none'}],
      {duration:800, delay:420, easing:'cubic-bezier(.22,1,.36,1)', fill:'both'}
    );

    arcs.forEach(function(a, i){
      a.animate([{opacity:0, letterSpacing:'14px'},{opacity:1}],
        {duration:900, delay:700 + i*130, easing:'cubic-bezier(.22,1,.36,1)', fill:'both'});
    });
    if(yr) yr.animate(
      [{opacity:0, transform:'scaleX(.4)'},{opacity:1, transform:'none'}],
      {duration:700, delay:1000, easing:'cubic-bezier(.22,1,.36,1)', fill:'both'});
  })();

  /* ═══════════════════════════════════════════════════════════════
     FALCON — scroll-scrubbed flight, Apple product-page mechanic.

     Apple ships a pre-rendered photo sequence and paints frame N to a
     canvas as you scroll. Same mechanic here, but the frames are drawn
     parametrically from one `phase` value instead of photographed, so
     the bird lives in this palette and costs no image payload.
     ═══════════════════════════════════════════════════════════════ */
  (function(){
    var canvas = document.getElementById('falconCanvas');
    /* The hero itself is the runway now: it is taller than the viewport,
       and that extra height is the distance the flight is scrubbed across. */
    var runway = document.getElementById('top');
    if(!canvas || !runway) return;
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, dpr = 1;

    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* The flying bird is `falconnew.png` — a full-body falcon in flight,
       black with dark-red accents. Used as-is: the dark silhouette reads
       cleanly against the wool ground and its red picks up the palette. */
    var logo = new Image();
    var logoReady = false;
    logo.onload = function(){ logoReady = true; falconScroll(); };
    logo.src = 'Torrey-Pines-High-School-Logo.png';

    function draw(p){
      if(!W || !H) return;
      ctx.clearRect(0, 0, W, H);

      var small = W < 700;
      var beat  = Math.sin(p * Math.PI * 2 * 3.5);

      /* The copy sits centred in the hero, so the flight arcs through the
         open air above and beside it rather than through the headline.
         On phones the copy fills more of the screen, so the arc flattens
         into the top band where there is still room. */
      var base = small ? .30 : .62;
      var lift = small ? .24 : .52;
      function pathX(t){ return W * (-.12 + t * 1.24); }
      function pathY(t){ return H * (base - Math.sin(t * Math.PI) * lift); }

      var x = pathX(p);
      var y = pathY(p) + beat * H * .022;

      /* the gold thread the falcon stitches behind it */
      ctx.beginPath();
      for(var i = 0; i <= 60; i++){
        var t = (i / 60) * p;
        i === 0 ? ctx.moveTo(pathX(t), pathY(t)) : ctx.lineTo(pathX(t), pathY(t));
      }
      ctx.strokeStyle = 'rgba(224,163,60,.45)';
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      if(!logoReady) return;

      /* The school mark is landscape, so it is sized off width. The beat
         drives a slight vertical squash so it reads as flying, not sliding. */
      var w    = Math.min(W, H) * (small ? .30 : .20);
      var tall = w * (logo.naturalHeight / logo.naturalWidth || .55);
      var bank = (-.26 + p * .48) + beat * .10;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(bank);
      ctx.scale(1 + beat * .020, 1 - beat * .050);
      ctx.shadowColor = 'rgba(36,21,18,.5)';
      ctx.shadowBlur = tall * .09;
      ctx.shadowOffsetY = tall * .03;
      ctx.drawImage(logo, -w / 2, -tall / 2, w, tall);
      ctx.restore();
    }

    /* scrub the flight against scroll position over the runway */
    var fTicking = false;
    function falconScroll(){
      var r = runway.getBoundingClientRect();
      var total = runway.offsetHeight - window.innerHeight;
      var p = total > 0 ? (-r.top) / total : 0;
      p = Math.max(0, Math.min(1, p));
      draw(p);
      fTicking = false;
    }

    if(reduced){
      resize(); draw(.5);
      window.addEventListener('resize', function(){ resize(); draw(.5); }, {passive:true});
      return;
    }

    resize(); falconScroll();
    window.addEventListener('scroll', function(){
      if(!fTicking){ fTicking = true; requestAnimationFrame(falconScroll); }
    }, {passive:true});
    window.addEventListener('resize', function(){ resize(); falconScroll(); }, {passive:true});
  })();

  /* ── TOURNAMENT MARQUEE: real calendar, running ── */
  (function(){
    var track = document.getElementById('marqueeTrack');
    if(!track) return;
    var stops = [
      ['Sep 9',  'Information meeting'],
      ['Sep 23', 'Application deadline'],
      ['Sep 27', 'Teams released'],
      ['Oct 10', 'BEARSO Invitational'],
      ['Dec 19', 'Yosemite Invitational'],
      ['Jan 16', 'Aggie Invitational · UC Davis'],
      ['Jan 30', 'Duke Invitational'],
      ['Feb 13', 'Regionals'],
      ['TBD',    'State tournament']
    ];
    track.innerHTML = stops.map(function(s){
      return '<span class="marquee-item"><b>' + s[0] + '</b>' + s[1] + '</span>';
    }).join('');

    /* one pass of light down the strip as it comes into view, then still */
    if(reduced) return;
    var items = track.querySelectorAll('.marquee-item');
    var sio = new IntersectionObserver(function(en){
      en.forEach(function(e){
        if(!e.isIntersecting) return;
        sio.disconnect();
        items.forEach(function(it, i){
          it.animate([{opacity:0, transform:'translateY(7px)'},{opacity:1, transform:'none'}],
            {duration:520, delay:i*70, easing:'cubic-bezier(.22,1,.36,1)', fill:'both'});
        });
      });
    }, {threshold:.35});
    sio.observe(track);
  })();

  /* ── HERO: the patch settles as you scroll away from it ── */
  (function(){
    var crest = document.querySelector('.crest');
    var hero  = document.querySelector('.hero');
    if(!crest || !hero || reduced) return;
    if(!window.matchMedia('(min-width: 700px)').matches) return;
    var ticking = false;
    function apply(){
      var y = window.scrollY;
      var h = hero.offsetHeight || 1;
      if(y < h){
        var p = y / h;
        crest.style.transform = 'translateY(' + (p * 46) + 'px) scale(' + (1 - p * .07) + ')';
        crest.style.opacity   = String(1 - p * .55);
      }
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if(!ticking){ ticking = true; requestAnimationFrame(apply); }
    }, {passive:true});
    apply();
  })();

  /* ── A bullion thread tracks reading progress down the page ── */
  (function(){
    if(reduced) return;
    var bar = document.createElement('div');
    bar.className = 'progress';
    bar.setAttribute('aria-hidden','true');
    document.body.appendChild(bar);
    var ticking = false;
    function apply(){
      var d = document.documentElement;
      var max = d.scrollHeight - d.clientHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if(!ticking){ ticking = true; requestAnimationFrame(apply); }
    }, {passive:true});
    window.addEventListener('resize', apply, {passive:true});
    apply();
  })();

  /* ── Section headings wipe in word by word ── */
  (function(){
    if(reduced) return;
    document.querySelectorAll('.h2').forEach(function(h){
      if(h.querySelector('.wd')) return;
      var frag = [];
      h.childNodes.forEach(function(n){
        if(n.nodeType === 3){
          n.textContent.split(/(\s+)/).forEach(function(t){
            if(!t.trim()){ frag.push(document.createTextNode(t)); return; }
            var s = document.createElement('span');
            s.className = 'wd'; s.textContent = t;
            frag.push(s);
          });
        } else {
          frag.push(n.cloneNode(true));
        }
      });
      h.replaceChildren.apply(h, frag);
    });
    var wio = new IntersectionObserver(function(en){
      en.forEach(function(e){
        if(!e.isIntersecting) return;
        wio.unobserve(e.target);
        e.target.querySelectorAll('.wd').forEach(function(w, i){
          w.animate(
            [{opacity:0, transform:'translateY(90%) rotate(2deg)'},
             {opacity:1, transform:'none'}],
            {duration:700, delay:i*55, easing:'cubic-bezier(.22,1,.36,1)', fill:'both'}
          );
        });
      });
    }, {threshold:.3});
    document.querySelectorAll('.h2').forEach(function(h){ wio.observe(h); });
  })();

  /* ── REVEAL on scroll ── */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.14, rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });

  /* ── SEASON: the bullion thread runs down the schedule ── */
  var legs = document.getElementById('legs');
  if(legs){
    var lio = new IntersectionObserver(function(en){
      en.forEach(function(e){ if(e.isIntersecting){ legs.classList.add('lit'); lio.unobserve(legs); } });
    }, {threshold:.25});
    lio.observe(legs);
  }

  /* ── AWARD counters ── */
  var cio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target, target = parseInt(el.dataset.count, 10);
      var pre = el.dataset.prefix || '';
      cio.unobserve(el);
      if(reduced){ el.textContent = pre + target; return; }
      var dur = 1300, t0 = performance.now();
      requestAnimationFrame(function tick(now){
        var p = Math.min(1, (now - t0) / dur);
        el.textContent = pre + Math.round(target * (1 - Math.pow(1 - p, 3)));
        if(p < 1) requestAnimationFrame(tick);
      });
    });
  }, {threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

  /* ── ROSTER: disciplines open ── */
  document.querySelectorAll('.disc-row').forEach(function(btn){
    btn.addEventListener('click', function(){
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var open  = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if(open) panel.removeAttribute('data-open');
      else     panel.setAttribute('data-open','');
    });
  });
  /* first discipline opens by default so the section is never empty */
  var first = document.querySelector('.disc-row');
  if(first) first.click();

  /* ── TRACK panels: warm light follows the pointer (fine pointers only) ── */
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.track').forEach(function(t){
      t.addEventListener('pointermove', function(e){
        var r = t.getBoundingClientRect();
        t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        t.style.setProperty('--my', (e.clientY - r.top)  + 'px');
      });
    });
  }
})();
