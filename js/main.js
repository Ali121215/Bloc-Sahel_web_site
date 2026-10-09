/* Logique de la page. Lit window.SITE (js/content.js). */
(function () {
  'use strict';
  var C = window.SITE, PHONE = C.phones[0].wa;
  var $ = function (id) { return document.getElementById(id); };
  var wa = function (text) { return 'https://wa.me/' + PHONE + (text ? '?text=' + encodeURIComponent(text) : ''); };

  // Liste des produits du formulaire
  var sel = $('produit');
  C.products.forEach(function (p) { var o = document.createElement('option'); o.textContent = p; sel.appendChild(o); });

  // Numéros affichés
  document.querySelectorAll('[data-phone]').forEach(function (el) { el.textContent = C.phones[+el.dataset.phone].label; });
  document.querySelectorAll('[data-phone-copy]').forEach(function (b) { b.dataset.copy = C.phones[+b.dataset.phoneCopy].label; });
  document.querySelectorAll('[data-wa]').forEach(function (a) { a.href = wa(C.messages.info); });

  // Message de devis
  var f = $('qf'), send = $('send');
  function quote() {
    var g = function (id) { return ($(id).value || '').trim(); };
    var t = C.messages.quoteIntro + '\n';
    if (g('nom')) t += 'Nom : ' + g('nom') + '\n';
    t += 'Produit : ' + g('produit') + '\n';
    if (g('qte')) t += 'Quantité : ' + g('qte') + ' pièces\n';
    if (g('lieu')) t += 'Livraison à : ' + g('lieu') + '\n';
    if (g('msg')) t += 'Précisions : ' + g('msg') + '\n';
    return t + C.messages.quoteOutro;
  }
  function update() { send.href = wa(quote()); }
  f.addEventListener('input', update);
  f.addEventListener('change', update);
  f.addEventListener('submit', function (e) { e.preventDefault(); });
  update();

  // Boutons "Devis" des fiches produit
  document.querySelectorAll('.pick').forEach(function (b) {
    b.addEventListener('click', function () {
      var name = b.closest('.prod').getAttribute('data-p');
      for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === name) { sel.selectedIndex = i; break; }
      update();
      $('devis').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Copier un numéro
  document.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.dataset.copy;
      var ok = function () { b.textContent = 'Copié'; setTimeout(function () { b.textContent = 'Copier'; }, 1600); };
      var fb = function () { var r = document.createRange(); r.selectNodeContents(b.previousElementSibling); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(ok, fb); else fb();
    });
  });
})();
