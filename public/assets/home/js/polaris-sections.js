/* Polaris shared section behaviour: FAQ accordion, fact counters,
   hardware grade tabs and the live cloud mining scene. */
(function () {
  'use strict';

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- FAQ accordion ---------------- */
  function setAnswerHeight(item, open) {
    var answer = item.querySelector('.pf-faq-answer');
    var button = item.querySelector('.pf-faq-question');
    if (!answer || !button) return;

    if (open) {
      answer.style.height = answer.scrollHeight + 'px';
      item.classList.add('is-open');
    } else {
      // Pin the current height first so the collapse animates from it
      answer.style.height = answer.scrollHeight + 'px';
      answer.offsetHeight; // eslint-disable-line no-unused-expressions
      answer.style.height = '0px';
      item.classList.remove('is-open');
    }
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function initFaq(root) {
    var items = root.querySelectorAll('.pf-faq-item');

    Array.prototype.forEach.call(items, function (item) {
      var answer = item.querySelector('.pf-faq-answer');
      var button = item.querySelector('.pf-faq-question');
      if (!answer || !button) return;

      answer.addEventListener('transitionend', function () {
        if (item.classList.contains('is-open')) answer.style.height = 'auto';
      });

      button.addEventListener('click', function () {
        var willOpen = !item.classList.contains('is-open');
        Array.prototype.forEach.call(items, function (other) {
          if (other !== item && other.classList.contains('is-open')) {
            setAnswerHeight(other, false);
          }
        });
        setAnswerHeight(item, willOpen);
      });

      if (item.classList.contains('is-open')) answer.style.height = 'auto';
    });
  }

  /* ---------------- Fact counters ---------------- */
  function formatCount(value, decimals) {
    return Number(value).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000;
    var start = null;

    if (reduceMotion) {
      el.textContent = prefix + formatCount(target, decimals) + suffix;
      return;
    }

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + formatCount(target * eased, decimals) + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  function initFacts() {
    var facts = document.querySelectorAll('.pf-fact');
    if (!facts.length) return;

    function reveal(fact) {
      if (fact.classList.contains('is-visible')) return;
      fact.classList.add('is-visible');
      var counter = fact.querySelector('[data-count]');
      if (counter) runCounter(counter);
    }

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(facts, reveal);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    Array.prototype.forEach.call(facts, function (fact) {
      observer.observe(fact);
    });
  }

  /* ---------------- Hardware grade tabs ---------------- */
  function initGradeTabs() {
    var tabs = document.querySelectorAll('.pf-grade-tab');
    if (!tabs.length) return;

    Array.prototype.forEach.call(tabs, function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('aria-controls');
        Array.prototype.forEach.call(tabs, function (other) {
          var active = other === tab;
          other.classList.toggle('is-active', active);
          other.setAttribute('aria-selected', active ? 'true' : 'false');
          var panel = document.getElementById(other.getAttribute('aria-controls'));
          if (panel) panel.hidden = other.getAttribute('aria-controls') !== target;
        });
      });
    });
  }

  /* ---------------- Live cloud mining scene ---------------- */
  // Bitcoin targets one block every ten minutes; anchor on the April 2024 halving
  var HALVING_HEIGHT = 840000;
  var HALVING_TIME = Date.UTC(2024, 3, 20, 0, 9, 0);

  function currentBlockHeight() {
    return HALVING_HEIGHT + Math.floor((Date.now() - HALVING_TIME) / 600000);
  }

  function randomHex(length) {
    var chars = '0123456789abcdef';
    var out = '';
    for (var i = 0; i < length; i += 1) {
      out += chars.charAt(Math.floor(Math.random() * 16));
    }
    return out;
  }

  function blockHash() {
    return '0000000000000000000' + randomHex(45);
  }

  function buildLeds(container) {
    var count = window.innerWidth < 576 ? 26 : 46;
    for (var i = 0; i < count; i += 1) {
      var led = document.createElement('i');
      led.style.left = (Math.random() * 96).toFixed(1) + '%';
      led.style.top = (Math.random() * 96).toFixed(1) + '%';
      led.style.animationDelay = (Math.random() * 2).toFixed(2) + 's';
      led.style.animationDuration = (0.8 + Math.random() * 1.8).toFixed(2) + 's';
      if (Math.random() < 0.12) led.className = 'is-amber';
      container.appendChild(led);
    }
  }

  function initScene(scene) {
    var leds = scene.querySelector('.pf-scene-leds');
    if (leds) buildLeds(leds);

    var hashrateEl = scene.querySelector('[data-hashrate]');
    var tempEl = scene.querySelector('[data-temp]');
    var hashEl = scene.querySelector('.pf-scene-hash');
    var feed = scene.querySelector('.pf-scene-feed');
    var line = scene.querySelector('.pf-chart-line');
    var area = scene.querySelector('.pf-chart-area');
    var minersEls = document.querySelectorAll('[data-live-miners]');
    var poolEls = document.querySelectorAll('[data-live-pool]');

    var base = parseFloat(scene.getAttribute('data-base-hashrate')) || 6.42;
    var points = [];
    for (var p = 0; p < 32; p += 1) {
      points.push(base + (Math.random() - 0.5) * 0.24);
    }
    function drawChart() {
      if (!line) return;
      var min = Math.min.apply(null, points) - 0.05;
      var max = Math.max.apply(null, points) + 0.05;
      var w = 200;
      var h = 46;
      var coords = points.map(function (v, i) {
        var x = (i / (points.length - 1)) * w;
        var y = h - ((v - min) / (max - min)) * (h - 6) - 3;
        return x.toFixed(1) + ',' + y.toFixed(1);
      });
      line.setAttribute('points', coords.join(' '));
      if (area) area.setAttribute('points', '0,' + h + ' ' + coords.join(' ') + ' ' + w + ',' + h);
    }

    function tickHashrate() {
      var last = points[points.length - 1];
      var next = last + (Math.random() - 0.5) * 0.12 + (base - last) * 0.15;
      points.push(next);
      points.shift();
      drawChart();
      if (hashrateEl) hashrateEl.textContent = next.toFixed(2);
      if (poolEls.length) {
        Array.prototype.forEach.call(poolEls, function (el) {
          el.textContent = next.toFixed(2) + ' EH/s';
        });
      }
      if (tempEl) tempEl.textContent = (63 + Math.random() * 4).toFixed(1);
      if (minersEls.length) {
        Array.prototype.forEach.call(minersEls, function (el) {
          var current = parseInt(el.getAttribute('data-live-miners'), 10);
          var updated = current + Math.round((Math.random() - 0.4) * 6);
          el.setAttribute('data-live-miners', updated);
          el.textContent = updated.toLocaleString('en-US');
        });
      }
    }

    var workers = ['S21-A14', 'S21XP-H07', 'M60S-B22', 'S21P-C03', 'S19XP-D18', 'M50S-E09'];

    function addShare(age) {
      if (!feed) return;
      var item = document.createElement('li');
      var hash = blockHash();
      var worker = workers[Math.floor(Math.random() * workers.length)];
      var diff = (40 + Math.random() * 90).toFixed(1);
      item.innerHTML =
        '<span class="pf-feed-block">' + worker + '</span>' +
        '<span class="pf-feed-hash">' + hash.slice(0, 8) + '\u2026' + hash.slice(-10) + '</span>' +
        '<span class="pf-feed-reward">' + diff + 'K \u00b7 ' + age + '</span>';
      feed.insertBefore(item, feed.firstChild);
      while (feed.children.length > 5) feed.removeChild(feed.lastChild);
    }

    function tickHash() {
      if (hashEl) hashEl.textContent = 'nonce 0x' + randomHex(8) + '\n' + blockHash();
    }

    function showHeight() {
      Array.prototype.forEach.call(scene.querySelectorAll('[data-block-height]'), function (el) {
        el.textContent = '#' + currentBlockHeight().toLocaleString('en-US');
      });
    }

    drawChart();
    tickHash();
    showHeight();
    for (var b = 4; b >= 1; b -= 1) {
      addShare(b * 3 + 's ago');
    }
    addShare('now');

    if (reduceMotion) return;

    setInterval(tickHashrate, 1500);
    setInterval(tickHash, 140);
    setInterval(function () {
      addShare('now');
    }, 2600);
    setInterval(showHeight, 30000);
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('.pf-faq'), initFaq);
    initFacts();
    initGradeTabs();
    Array.prototype.forEach.call(document.querySelectorAll('.pf-scene'), initScene);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
