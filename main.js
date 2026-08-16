/* ═══════════════════════════════════════════════════════════════
   TORREY PINES SCIENCE OLYMPIAD, behaviour

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
     Shown once until dismissed. localStorage, not a cookie, which is
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

  /* ── NAV: pin on scroll ──
     Pages with no hero (about, faq) ship `class="nav pinned"` in the markup
     because there is no tall coloured band for the bar to sit over. This
     used to strip that class on load at scrollY 0, so those pages visibly
     flashed from pinned to transparent and back on the first scroll. The
     pinned state is now unconditional wherever there is no hero. */
  var nav = document.getElementById('nav');
  var hasHero = !!document.querySelector('.hero');
  function onScroll(){ nav.classList.toggle('pinned', !hasHero || window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ── NAV: the mobile menu ──
     Below 900px the link list used to be display:none with nothing in its
     place, so About, Calendar, How to join and the FAQ were unreachable on
     a phone. This is a real disclosure: a labelled button, aria-expanded,
     Escape to close, close on navigate, and it releases on resize so a
     rotation never leaves the panel stuck open. */
  (function(){
    var btn   = document.getElementById('navToggle');
    var links = document.getElementById('navPanel');
    if(!nav || !btn || !links) return;

    function set(open){
      nav.setAttribute('data-menu', open ? 'open' : 'closed');
      btn.setAttribute('aria-expanded', String(open));
    }
    function isOpen(){ return btn.getAttribute('aria-expanded') === 'true'; }
    set(false);

    btn.addEventListener('click', function(){ set(!isOpen()); });

    /* Any link tap closes it, so arriving at an anchor never leaves the
       panel covering what it just scrolled to. */
    links.addEventListener('click', function(e){
      if(e.target.closest('a')) set(false);
    });

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && isOpen()){ set(false); btn.focus(); }
    });

    window.addEventListener('resize', function(){
      if(window.innerWidth > 900 && isOpen()) set(false);
    }, {passive:true});
  })();

  /* ── SMOOTH ANCHOR SCROLL ──
     CSS `scroll-behavior:smooth` is deliberately not used. Native smooth
     scroll has no duration control, so with a tall sticky runway in the page
     a jump from the hero to the FAQ crawls through the whole thing. This
     glides on a capped duration instead: a five-screen jump takes about as
     long as a one-screen jump.

     It also lands the target below the fixed bar rather than underneath it,
     moves focus so keyboard and screen-reader users actually arrive where
     the link said, and bails out the moment the reader touches the wheel or
     the screen, because a page that fights your scroll is worse than one
     that jumps. Reduced motion gets the instant jump, with the same offset
     and the same focus move. */
  (function(){
    var reduceQ = window.matchMedia('(prefers-reduced-motion: reduce)');

    function targetTop(el){
      var barH = nav ? nav.getBoundingClientRect().height : 0;
      var y = window.scrollY + el.getBoundingClientRect().top;
      return Math.max(0, Math.round(y - barH - 10));
    }

    /* Without this the link fires, the page moves, and focus is still back
       where it started, so the next Tab resumes from the wrong place. */
    function land(el, hash){
      if(hash && history.replaceState) history.replaceState(null, '', hash);
      if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      try { el.focus({preventScroll:true}); } catch(e) { el.focus(); }
    }

    function glide(el, hash){
      var start = window.scrollY;
      var dist  = targetTop(el) - start;
      if(Math.abs(dist) < 2){ land(el, hash); return; }

      /* Capped, so distance changes the feel very little. */
      var dur = Math.min(900, Math.max(420, Math.abs(dist) * 0.32));
      var t0 = null, stopped = false;
      var events = ['wheel','touchstart','keydown'];

      function release(){
        stopped = true;
        events.forEach(function(t){ window.removeEventListener(t, release); });
      }
      events.forEach(function(t){ window.addEventListener(t, release, {passive:true}); });

      requestAnimationFrame(function step(now){
        if(stopped){ land(el, hash); return; }
        if(t0 === null) t0 = now;
        var p = Math.min(1, (now - t0) / dur);
        /* easeOutQuint: the same fast-out, long-settle shape as --ease */
        window.scrollTo(0, start + dist * (1 - Math.pow(1 - p, 5)));
        if(p < 1){ requestAnimationFrame(step); }
        else { release(); land(el, hash); }
      });
    }

    document.addEventListener('click', function(e){
      if(e.defaultPrevented || e.button !== 0) return;
      if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;   /* new tab, download */
      var a = e.target.closest('a[href]');
      if(!a || (a.target && a.target !== '_self')) return;

      var href = a.getAttribute('href');
      if(!href || href.charAt(0) !== '#' || href.length < 2) return;  /* same-page only */

      var el = document.getElementById(href.slice(1));
      if(!el) return;

      e.preventDefault();
      if(reduceQ.matches){ window.scrollTo(0, targetTop(el)); land(el, href); return; }
      glide(el, href);
    });
  })();

  /* ── HERO: the keep-scrolling cue ──
     The runway holds the copy still for 1.6 viewports. Without a signal that
     the hold is deliberate, a reader flicking a phone reads it as a stuck
     page and leaves. The cue is a chain stitch running off the fold: it
     plays three times at most and is removed for good on the first scroll,
     so nothing loops in peripheral vision once it has done its job. */
  (function(){
    var hero = document.querySelector('.hero');
    if(!hero || reduced) return;
    if(window.scrollY > 0) return;          /* already scrolled, never show it */
    hero.setAttribute('data-cue','on');
    window.addEventListener('scroll', function(){
      hero.removeAttribute('data-cue');
    }, {passive:true, once:true});
  })();

  /* ── HERO: the one orchestrated moment, the patch gets stitched on ──
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
     FALCON, scroll-scrubbed flight, Apple product-page mechanic.

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

    /* The flying mark is the school logo itself, drawn to the canvas each
       frame, never traced or recoloured. */
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
      /* `base` is where the arc's ends sit, `lift` how high it crests.
         The whole flight stays in the top band of the hero, above the
         badge, the ends are high enough that the bird never drops into
         the badge's row on its way in or out. */
      var base = small ? .13 : .15;
      var lift = small ? .11 : .12;

      var w    = Math.min(W, H) * (small ? .21 : .17);
      // ratio falls back until the image has loaded, so the arc is placed correctly from frame one
      var ratio = logoReady && logo.naturalWidth ? logo.naturalHeight / logo.naturalWidth : .55;
      var tall = w * ratio;
      var wob  = H * .022;

      /* The whole arc is shifted so its crest sits a fixed gap below the nav
        , high in the hero, above the badge. The curve itself is untouched;
         it just rides higher or lower as a unit. `reach` is half the bird's
         diagonal, so a banked bird still clears the nav. */
      var reach   = Math.sqrt(w * w + tall * tall) / 2;
      var navH    = nav ? nav.getBoundingClientRect().height : 64;
      var wantTop = navH + reach + wob - 12;    // the gap below the nav
      var rawPeak = H * (base - lift);          // where the sine would crest
      var drop    = wantTop - rawPeak;          // shift (either direction)

      function pathX(t){ return W * (-.12 + t * 1.24); }
      function pathY(t){ return H * (base - Math.sin(t * Math.PI) * lift) + drop; }

      var x = pathX(p);
      var y = pathY(p) + beat * wob;

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

      /* The beat drives a slight vertical squash so it reads as flying,
         not sliding. (w and tall are computed above, for the clamp.) */
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

    /* The hero copy starts high, where it looks right at rest, and yields
       downward only while the falcon is overhead, then returns. The shift
       peaks with the arc's crest, so the two movements are one gesture
       rather than the copy sitting permanently low to make room. */
    var body = document.querySelector('.hero-body');
    function yieldCopy(p){
      if(!body) return;
      // 0 at the edges, 1 at mid-flight, same shape as the arc itself
      var over = Math.sin(Math.max(0, Math.min(1, p)) * Math.PI);
      body.style.setProperty('--yield', (over * over).toFixed(3));
    }

    /* scrub the flight against scroll position over the runway */
    var fTicking = false;
    function falconScroll(){
      var r = runway.getBoundingClientRect();
      var total = runway.offsetHeight - window.innerHeight;
      var p = total > 0 ? (-r.top) / total : 0;
      p = Math.max(0, Math.min(1, p));
      draw(p);
      yieldCopy(p);
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
    /* Keep in step with the #season list in index.html. These are the same
       stops in the same order; there is no shared source for them yet. */
    var stops = [
      ['Sep 9',   'Information meeting'],
      ['Sep 23',  'Application deadline'],
      ['Sep 27',  'Teams released'],
      ['Jan',     'USC Invitational'],
      ['Feb',     'Golden Gate Invitational'],
      ['TBD',     'UCSD Triton Invitational'],
      ['Feb',     'San Diego Regionals'],
      ['Apr',     'Southern California State']
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
      /* The word wipe IS this heading's entrance. Drop the block reveal so
         the two don't run at once, a fading, rising box whose words are
         also fading and rising reads as mush, not as one gesture. This runs
         before the .rv observer is wired below, so the heading is never
         picked up by it. */
      h.classList.remove('rv');
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

  /* ── AWARD counters ──
     Plain cardinals count up: every intermediate value is a smaller true
     number. Prefixed values do NOT count. "3–4" is a range and "Top 20" is a
     threshold, so ticking them renders "3–1" and "Top 7", not smaller
     numbers but false statements, held on screen for over a second. Those
     arrive whole, with a stitch-in that matches the patch instead. */
  var cio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target, target = parseInt(el.dataset.count, 10);
      var pre = el.dataset.prefix || '';
      cio.unobserve(el);

      /* the true value is in the DOM from the first frame either way */
      el.textContent = pre + target;
      if(reduced) return;

      if(pre){
        el.animate(
          [{opacity:0, transform:'translateY(9px) scale(.96)'},
           {opacity:1, transform:'none'}],
          {duration:520, easing:'cubic-bezier(.22,1,.36,1)', fill:'both'}
        );
        return;
      }

      var dur = 1300, t0 = performance.now();
      requestAnimationFrame(function tick(now){
        var p = Math.min(1, (now - t0) / dur);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
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
  /* First discipline opens by default so the section is never empty. Set
     directly rather than synthesizing a click, so this never fires anything
     else listening for a real user click on that button. */
  var first = document.querySelector('.disc-row');
  if(first){
    first.setAttribute('aria-expanded','true');
    var firstPanel = document.getElementById(first.getAttribute('aria-controls'));
    if(firstPanel) firstPanel.setAttribute('data-open','');
  }

  /* ── HALFTONE DOT FIELD ──
     A printer's screen laid over the sleeve leather: a fixed grid whose dot
     radius swells toward a focal point, the way a halftone image carries
     tone through dot size rather than colour. The focal point rides the
     section's scroll progress, so the tone sweeps across as it comes into
     view. Purely decorative, aria-hidden, and skipped under reduced
     motion, where a single still screen is drawn instead. */
  (function(){
    var cv = document.getElementById('dotField');
    if(!cv) return;
    var host = cv.parentElement;
    var ctx  = cv.getContext('2d');
    var W = 0, H = 0;
    var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

    var GAP = 20;            // grid pitch in CSS px
    var RMAX = 3.9;          // biggest dot at the focus
    var RMIN = .35;          // faintest dot at the far edge

    function size(){
      var r = host.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function paint(prog){
      if(!W || !H) return;
      ctx.clearRect(0, 0, W, H);

      /* focus travels left→right and dips, so the swell reads as a pass of
         light over the felt rather than a pulsing blob */
      var fx = W * (-.15 + prog * 1.30);
      var fy = H * (.30 + Math.sin(prog * Math.PI) * .42);
      var span = Math.hypot(W, H) * .55;

      for(var y = GAP / 2; y < H; y += GAP){
        for(var x = GAP / 2; x < W; x += GAP){
          var d = Math.hypot(x - fx, y - fy) / span;
          var t = d > 1 ? 0 : (1 - d) * (1 - d);        // eased falloff
          var r = RMIN + (RMAX - RMIN) * t;
          if(r <= RMIN + .02) continue;                  // skip invisible dots
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          // bullion at the focus fading to bone at the edges
          ctx.fillStyle = 'rgba(224,163,60,' + (.07 + t * .50).toFixed(3) + ')';
          ctx.fill();
        }
      }
    }

    function progress(){
      var r = host.getBoundingClientRect();
      var vh = window.innerHeight;
      // 0 as the section enters the viewport, 1 as it leaves
      var p = (vh - r.top) / (vh + r.height);
      return Math.max(0, Math.min(1, p));
    }

    var ticking = false;
    function onScroll(){
      if(ticking || reduce) return;
      ticking = true;
      requestAnimationFrame(function(){ paint(progress()); ticking = false; });
    }

    size();
    paint(reduce ? .5 : progress());
    if(!reduce) window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', function(){
      size(); paint(reduce ? .5 : progress());
    }, {passive:true});
  })();

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
