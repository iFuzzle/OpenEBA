// ==UserScript==
// @name           openEBA
// @namespace      openEBA
// @description    openEBA
// @include        http://eatenbyants.de/*
// @include        http://*.eatenbyants.de/*
// @include        https://eatenbyants.de/*
// @include        https://*.eatenbyants.de/*
// @exclude        http://forum.eatenbyants.de/*
// @version        31
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_xmlhttpRequest
// ==/UserScript==

const configItems = {
  "eba_disable_reload"                       : [disableReloadOnFinish, "Auto-Reload ausschalten", "Nach Ende eines Jobs, einer Forschung usw. wird die Seite nicht mehr neu geladen."],
  "eba_enable_sound_on_job_end"              : [enableSoundOnJobEnd, "Am Ende des Countdowns einen Sound abspielen"],
  "eba_enable_note"                          : [insertNote, "Notitzblock", "Der Inhalt wird lokal auf dem Computer gespeichert."],
  "eba_sort_filter_options"                  : [sortAndFilterOptions, "Alle Auswahllisten sortieren und zusammenfassen", "Sortierung nach Alphabet. Gleiche Eintr&auml;ge werden zu einer Zeile zusammengefasst und die Anzahl dahintergeh&auml;ngt."],
  "eba_enable_shop_filter_by_category"       : [shopFilterList, "Auswahllisten in den Kleinanzeigen nach Kategorie filtern", "Wird unter <i>Kleinanzeigen</i>/<i>Ameisen</i> die Unterkategorie <i>exotische</i> gew&auml;hlt, dann wird auch die Auswahlliste auf exotische Arten eingeschr&auml;nkt. Analog f&uuml;r <i>Kleinanzeigen</i>/<i>Sonstige</i>."],
  "eba_enable_shop_filter"                   : [enableShopFilter, "Kleinanzeigen filtern", "Pflege der Suchbegriffe in der Liste unten. In den Kleinanzeigen wird die jeweils erste (das Angebot) und vorletzte Spalte (der Anbieter) gepr&uuml;ft, ob sie einen der Suchbegriffe enth&auml;llt. Falls ja, wird die Zeile ausgeblendet.<br>Z.B. blendet der Eintrag <i>Lasius</i> alle Lasius-Arten aus, aber auch die Angebote eines Spielers namens \"Lasiusz&uuml;chter\"."],
  "eba_enable_shop_move_form"                : [shopMoveForm, "Formular in den Kleinanzeigen &uuml;ber die Tabelle schieben"],
  "eba_enable_shop_move_selection"           : [shopMoveSelection, "Selektierte Kleinanzeigen-Eintr&auml;ge nach oben schieben", "Auswahl eines Eintrags in der Auswahlliste bef&ouml;rdert alle entsprechenden Zeilen an den Anfang der Tabelle."],
  "eba_enable_shop_sumMultipleShopLines"     : [sumMultipleShopLines, "Gleichartige Kleinanzeigen-Eintr&auml;ge zusammenfassen", "Exakt gleiche Angebote eines Verk&auml;ufers werden zusammengefasst und die Anzahl wird dem Verk&auml;ufer vorangestellt. Z.B. &quot;(3x)&quot;, also 3 identische Angebote. Ein Klick darauf f&uuml;gt die ausgeblendeten Angebote wieder ein."],
  "eba_enable_shop_filterAdditionalShopLines": [filterAdditionalShopLines, "Nur das jeweils erste Angebot eines Verk&auml;ufers anzeigen (Sortierung beachten!)", "Weitere Angebote eines Verk&auml;ufers f&uuml;r die gleiche Sache (inkl. Anzahl) zu verschiedenen Preisen werden ausgeblendet und die Anzahl wird dem Verk&auml;ufer vorangestellt. Z.B. &quot;[+4]&quot;, also 4 weitere Angebote derselben Sache. Ein Klick darauf f&uuml;gt die ausgeblendeten Angebote wieder ein.<br><b>Achtung:</b> Es wird das erste Angebot behalten entsprechend der Sortierung, also ggf. nicht das billigste."],
  "eba_enable_shop_remember_prices"          : [rememberShopPrices, "Preise im Shop wiederverwenden", ""],
  "eba_enable_shop_separator"                : [shopSeparator, "Kleinanzeigen-Eintr&auml;ge trennen", "Optische Trennung in der Tabelle."],
  "eba_enable_stock_filter"                  : [processStock, "Ameisen im Lager zusammenfassen"],
  "eba_enable_copy_percentages"              : [copyHungerPercentages, "Hunger-Prozente mit Nachkommastelle"],
  "eba_enable_formi_move_form"               : [processSingleFormicariumView, "F&uuml;tterformular &uuml;ber die Futtertabelle schieben"],
  "eba_enable_key_navi"                      : [enableKeyNavi, "Mit v und n (bzw. q und e) zwischen Formicarien navigieren, mit z bzw. p f&uuml;ttern"],
  "eba_enable_always_show_shop_prices"       : [alwaysShowShopPrices, "Ameisenshop-Preise immer zeigen", "Links neben dem Ameisenshop-Men&uuml;eintrag. Kann sein, dass nicht jeder Browser das richtig (verkleinert) darstellt."],
  "eba_enable_highlight_shop_prices"         : [highlightShopPrices, "Ameisenshop-Preise f&auml;rben", "Hohe Preise gelb, auf (fast) Maximum rot."],
  "eba_enable_stat_beautify"                 : [statBeautify, "Statistik verbessern", "Einf&uuml;gen von 1.000er-Trennzeichen und Tooltips, die die Differenz zu den eigenen Punkten anzeigen. Das Avatar-Bild oben rechts bekommt als Tooltip die eigene Punkte-Entwicklung pro Stunde."],
  "eba_enable_process_jobs"                  : [processJobOffers, "Jobs/Forschungen mit Informationen anreichern", "Stundenlohn und Dauer (nach Abschluss der aktuellen Aktion) anzeigen."],
  "eba_enable_formi_statistic"               : [updateFormiStatistic, "Formicarien-Statistik", "Wird aktualisiert bei jedem Aufruf der Formicarien-&Uuml;bersicht. Aufzurufen dort mit dem Link <i>Statistik</i> bei jedem Formicarium. Optimiert zum Kopieren und Einf&uuml;gen in Excel und Co. Die Werte werden auch genutzt, um die Entwicklung von Eiern, Larven, Puppen, Ameisen und Punkten pro Stunde als jeweiligen Tooltip anzuzeigen."],
  "eba_enable_food_snapshot"                 : [function(){}, "Futterbestand pro Tick festhalten", "Beim ersten Aufruf der Formicarien-&Uuml;bersicht nach einem Tick wird die Futtertabelle jedes Formicariums im Hintergrund aus der Detailansicht geholt und in der Formicarien-Statistik erg&auml;nzt. Funktioniert nur zusammen mit der Formicarien-Statistik."],
  "eba_enable_mark_shop_messages"            : [enableMarkShopMessages, "Option zum Markieren von Kleinanzeigen-Nachrichten einblenden"],
  "eba_enable_sum_multiple_messages"         : [sumMultipleMessages, "Gleichartige Nachrichten zusammenfassen", "Nachrichten desselben Benutzers mit demselben Betreff werden zusamengefasst. Der Haken zum L&ouml;schen bezieht sich auf alle zusammengefassten Nachrichten!"],
  "eba_enable_message_filter"                : [enableMessageFilter, "Nachrichten nach Absendern filtern", "Pflege der Suchbegriffe in der Liste unten. In den Nachrichten wird der Absender gepr&uuml;ft, ob er einen der Suchbegriffe enth&auml;llt. Falls ja, wird die Zeile ausgeblendet.<br>Z.B. blendet der Eintrag <i>Pepper</i> alle Nachrichten von Pepper aus, aber auch die Nachrichten eines Spielers namens \"Pepperoni\"."],
  "eba_enable_research_level"                : [researchLevelCorrection, "Forschungsstufe um 1 verringern", "Korrigiert die angezeigte Stufe um 1 nach unten, auf die Stufe die man tatsächlich erforscht hat."],
  "eba_modify_gui"                           : [modifyGUI, "GUI anpassen", "- Breitenanpassungen<br>- Zeilenumbruch in den Kleinanzeigen verhindern<br>- Meldungen in den Kopf verschieben, damit sie nicht das Layout st&ouml;ren."],
  "eba_enableBookmarks"                      : [enableBookmarks, "Bookmarks einblenden", "Pflege der Bookmarks in der Liste unten. Sie werden an das Navigationsmen&uuml; links gehangen."],
  "eba_snow"                                 : [initSnow, "Schnee"],
  "eba_enable_food_move_form"                : [foodMoveForm, "Dialog 'Futtertierzucht einrichten' an den Anfang der Seite schieben"],
  "eba_enable_form_move_form"                : [formiMoveForm, "Dialog 'Formicarium einrichten' an den Anfang der Seite schieben"],
  "eba_enable_stock_sort"                    : [sortStock, "Nester und Formicarien im Lager nach Größe statt alphabetisch ordnen"],
  "eba_enable_show_inventory"                : [showInventory, "Inventar in der Seitenleiste Anzeigen", "Bestimmte Items aus dem Lager in der linken Seitenleiste Anzeigen. Begriffe werden in der unteren Liste gepflegt"]
}
const shopPriceLimits = {
  "Camponotus ligniperda": 6.34,
  "Formica fusca": 4.39,
  "Lasius flavus": 2.44,
  "Lasius niger": 1.47,
  "Myrmica rubra": 3.03,
  "Crematogaster scutellaris": 10.24,
  "Messor barbarus": 8.29,
  "Pheidole pallidula": 12.19,
  "Camponotus substitutus": 23.89,
  "Polyrhachis dives": 43.39,
  "Acromyrmex spec.": 49.24
}
const nonfood = ["Arena", "Formicarium", "Anlage", "Reagenzglas", "Nest", "Ausbruchschutz", "Zuchtbeh", "Kommode"];
const antcat = {
  "Camponotus herculeanus": 1,
  "Camponotus ligniperda": 1,
  "Formica fusca": 1,
  "Formica sanguinea": 1,
  "Lasius emarginatus": 1,
  "Lasius flavus": 1,
  "Lasius fuliginosus": 1,
  "Lasius niger": 1,
  "Myrmica rubra": 1,
  "Myrmica ruginodis": 1,
  "Ponera coarctata": 1,
  "Solenopsis fugax": 1,
  "Temnothorax nylanderi": 1,
  "Anochetus ghilianii": 2,
  "Aphaenogaster senilis": 2,
  "Camponotus cruentatus": 2,
  "Camponotus lateralis": 2,
  "Cataglyphis velox": 2,
  "Crematogaster scutellaris": 2,
  "Lasius grandis": 2,
  "Messor barbarus": 2,
  "Messor structor": 2,
  "Pheidole pallidula": 2,
  "Plagiolepis pygmaea": 2,
  "Acromyrmex spec.": 3,
  "Acromyrmex versicolor": 3,
  "Camponotus sericeus": 3,
  "Camponotus substitutus": 3,
  "Messor alexandri": 3,
  "Myrmecia chrysogaster": 3,
  "Myrmecia pavida": 3,
  "Myrmecocystus mexicanus": 3,
  "Pheidologeton diversus": 3,
  "Polyrhachis dives": 3,
  "Marsameise": 3
}

// Zustand der Futter-Warteschlange. Muss VOR der Init-Schleife unten stehen,
// weil updateFormiStatistic() schon beim Start darauf zugreift.
var foodQueue = [];
var foodQueueRunning = false;
var foodQueued = {};

enableConfig();
$.each(configItems, function(k, v) {
  var timer = new Date().getTime();
  GM_getValue(k, false) && v[0]();
  var time = new Date().getTime()-timer;
});
function showInventory(){
  var doInsert = function(rowsHTML) {
    $("body").append(rowsHTML);
  };
  var storedData = GM_getValue("eba_inv", "0\nx").split("\n", 2);
  var hours = Math.floor($.now()/3600000);
  //get schaben
  if (hours!=storedData[0]) {
    GM_xmlhttpRequest({
      method: "GET",
      url: document.URL.substring(0, document.URL.indexOf("/", 9))+"/ameisenzimmer.php?cat=2",
      onload: function(response) {

          var items = GM_getValue("eba_stock_items", "").split("\n");
          var length = 0;
          for(i = 0; i < items.length; i++){
              length = items[i].length > length ? items[i].length : length;
          }
          var eba_inv = "<p style=\"color:white;font-family:monospace\">";
          for(i = 0; i < items.length; i++){
              var item = items[i]+":&nbsp;";
              for(j = 0; j < length - items[i].length; j++){
                  item += "&nbsp;";
              }
              if(items[i].length == 0){
                  eba_inv += "<br>";
              }else{
                  var str_regex = items[i]+"<\/td><td class=liste><center>[0-9]+";
                  var regex = new RegExp(str_regex, "g");

                  try{
                      var item_amount = response.responseText.match(str_regex)[0].replace(items[i]+"</td><td class=liste><center>", "");
                  }catch(err){
                      item_amount = 0;
                  }
                  eba_inv += "&nbsp;"+item+item_amount+"<br>"
              }
          }
          eba_inv += "</p>";
        doInsert(eba_inv);
        GM_setValue("eba_inventory", ""+hours+"\n"+eba_inv);
      }
    });
  } else {
    doInsert(storedData[1]);
  }
}
function researchLevelCorrection () {
  if(!$("h3:contains('Forschung')").length){return}
  $("form b:first-of-type").each(function (i) {
     var x = (/(.+)\(Stufe (\d+)\)/).exec($(this).html());
     $(this).text(x[1]+"(Stufe "+(parseInt(x[2])-1)+")");
  });
}
function enableMarkShopMessages() {
  if(!$("h3:contains('Private Nachrichten : Posteingang')").length){return}
  $("input[type='submit']").before("<input id='eba_mark_shop_messages' type='button' value='Kleinanzeigen markieren'><br>");
  $("#eba_mark_shop_messages").on("click", function(e) {
    $("table.liste td:contains('Kleinanzeigen Markt') ~ td input").prop("checked", true);
  });
}
function sumMultipleMessages() {
  if(!$("h3:contains('Private Nachrichten :')").length){return}
  var trs = $("table.liste").first().find("tr").slice(1);
  var lookup = new Object();
  trs.each(function() {
    var tr = $(this);
    var tds = tr.find("td");
    var trTxt = tds.eq(2).text(); //subject
    if (trTxt.indexOf("Re: ")==0) {
      trTxt = trTxt.substr(4);
    }
    trTxt += tds.eq(1).text(); //sender
    if (typeof(lookup[trTxt])==="undefined") {
      lookup[trTxt]=[tr, new Array()];
    } else {
      lookup[trTxt][1].push(tr);
      tr.css("display", "none");
    }
  });
  var counter=0;
  $.each(lookup, function(k,v){
    if (v[1].length>0) {
      var id = "reinsert_"+(counter++);
      v[0].find("td").eq(2).append("<span> (<a href='javascript: void(0)' id='"+id+"'>+"+(v[1].length)+"</a>)</span>");
      v[0].find("input.check").on("click", function(){
        $.each(v[1], function(i, e) {
          e.find("input.check").prop("checked", v[0].find("input.check").prop("checked"));
        });
      });
      $("#"+id).on("click", function(){
        $.each(v[1], function(i, e) {
          e.css("display", "");
        });
        $(this).parent().remove();
      });
    }
  });
}
function highlightShopPrices() {
  var colorize = function() {
    var rows = $("#eba_shop_prices tr");
    // Ankauf-Seite: Die Überschrift "Ameisen verkaufen" gibt es nur vor der Preisanfrage.
    // "Königinnen werden momentan ..." steht dagegen vor und nach der Anfrage da.
    if ($("center b:contains('Königinnen werden momentan')").length){
      rows = rows.add("table.liste tr");
    }
    rows.each(function () {
      var row = $(this);
      var ant = row.find("td").eq(0).text();
      var price = parseFloat(row.find("td").eq(1).text().replace(/,/, "."));
      var color = "";
      if (shopPriceLimits[ant]*0.99<=price) {
        color = "#FF5555";
      } else if (shopPriceLimits[ant]*0.95<=price) {
        color = "#FFFF00";
      }
      // nur färben, wenn sich die Farbe ändert (verhindert Endlosschleife mit dem Observer
      // und entfernt die Farbe wieder, wenn der Preis gefallen ist)
      if (row.data("eba_color") !== color) {
        row.data("eba_color", color);
        row.css("color", color);
      }
    });
  };
  colorize();
  // Nach einer AJAX-Aktion (Füttern, Preisanfrage) baut das Spiel Teile der Seite neu auf
  // und die Farben sind weg, daher nach jeder DOM-Änderung erneut einfärben.
  // Nur ein Observer, weil alwaysShowShopPrices() diese Funktion ebenfalls aufruft.
  if (!highlightShopPrices.observer) {
    highlightShopPrices.observer = new MutationObserver(colorize);
    highlightShopPrices.observer.observe(document.body, {childList: true, subtree: true});
  }
}
function alwaysShowShopPrices() {
  var isMobile = function() { return window.matchMedia("(max-width: 959px)").matches; };

  // Mobile: Preise sitzen IM Button (a), Button wächst mit Inhalt
  $("head").append("<style>@media screen and (max-width: 959px){" +
    "#eba_shop_link{display:inline-flex !important;align-items:center;gap:6px;" +
      "width:auto !important;min-width:max-content !important;white-space:nowrap;text-align:left !important}" +
    "#eba_shop_prices{position:static !important;transform:none !important;zoom:0.15;" +
      "border:none !important;margin:0 !important;flex:none;pointer-events:none}" +
  "}</style>");

  var priceDiv = "<div id='eba_shop_prices' style='border:1px solid #3CAC56;z-index:100;margin-top:1px;color:white;transform:scale(0.15);position:absolute;transform-origin: left top;'></div>";
  var priceRows = null;   // Preiszeilen, sobald sie aus Cache oder Abfrage vorliegen
  var observer = null;

  // Preisblock an den Menüeintrag hängen. Beliebig oft aufrufbar: solange der Block
  // noch im DOM steht, passiert nichts (verhindert Endlosschleife mit dem Observer).
  var insertPrices = function() {
    if (priceRows == null || $("#eba_shop_prices").length) {return}
    // Den Link jedes Mal neu suchen, nach einem DOM-Neuaufbau ist das alte Element weg.
    var link = $("a:contains('Ameisenshop')").first();
    if (!link.length) {
      // Kein Ameisenshop-Menüeintrag auf dieser Seite, dann gibt es auch nichts einzuhängen.
      if (observer) {observer.disconnect();}
      return;
    }
    link.attr("id", "eba_shop_link");
    if (isMobile()) {
      link.prepend(priceDiv);   // Preise in den Button
    } else {
      link.css("text-align", "right").css("width", "122px").before(priceDiv);   // Desktop wie bisher
    }
    $("#eba_shop_prices").hover(
      function () { if (!isMobile()) { $(this).css('transform', 'none'); } },
      function () { if (!isMobile()) { $(this).css('transform', 'scale(0.15)'); } }
    ).append("<table style='border-collapse:collapse'>"+priceRows+"</table>");
    //highlight if enabled
    GM_getValue("eba_enable_highlight_shop_prices", false) && highlightShopPrices();
  };
  var doInsert = function(rowsHTML) {
    priceRows = rowsHTML;
    insertPrices();
  };
  var storedData = GM_getValue("eba_shop_prices", "0\nx").split("\n", 2);
  var hours = Math.floor($.now()/3600000);
  if (hours!=storedData[0]) {
    GM_xmlhttpRequest({
      method: "GET",
      url: document.URL.substring(0, document.URL.indexOf("/", 9))+"/shop.php?cat=99",
      onload: function(response) {
        //find "<table class=liste>...</table>"
        var regexp = /<table class=liste>(.*?)<\/table>/g;
        var rows = regexp.exec(response.responseText)[1];
        doInsert(rows);
        GM_setValue("eba_shop_prices", ""+hours+"\n"+rows);
      }
    });
  } else {
    doInsert(storedData[1]);
  }
  // Nach einer AJAX-Aktion (z.B. Füttern) baut das Spiel Teile der Seite neu auf und der
  // Preisblock verschwindet mit dem Menüeintrag, daher nach jeder DOM-Änderung erneut einhängen.
  observer = new MutationObserver(insertPrices);
  observer.observe(document.body, {childList: true, subtree: true});
}

// ---------------------------------------------------------------------------
// Formicarien-Statistik: Tick-Erkennung, Serverzeit, Futter-Snapshots
// ---------------------------------------------------------------------------

function formatStatTime(ms) {
  var d = new Date(ms);
  var p = function(n) { return (n < 10 ? "0" : "") + n; };
  return p(d.getDate()) + "." + p(d.getMonth() + 1) + "." + d.getFullYear() + " " + p(d.getHours()) + ":" + p(d.getMinutes());
}

// Serveruhr: Offset zwischen #servertime (Footer) und PC-Uhr
function getServerNow() {
  var t = /(\d+):(\d+):(\d+)/.exec($("#servertime").text());
  var d = new Date();
  if (!t) { return d.getTime(); } // Fallback: PC-Uhr
  var srv = (parseInt(t[1])*3600 + parseInt(t[2])*60 + parseInt(t[3])) * 1000;
  var loc = ((d.getHours()*60 + d.getMinutes())*60 + d.getSeconds())*1000 + d.getMilliseconds();
  var day = 86400000;
  var diff = (((srv - loc + day/2) % day) + day) % day - day/2; // in [-12h, +12h)
  return d.getTime() + diff;
}

function isSpeedServer() { return /speed/i.test(location.hostname); }
// Tick-Länge in Minuten: Normal = 60, Speed = 12
function getTickMinutes() { return isSpeedServer() ? 12 : 60; }
// GM-Werte gelten für alle Subdomains, daher eigener Präfix für den Speed-Server
function srvKey() { return isSpeedServer() ? "speed_" : ""; }

// Dauer des letzten Ticks: pro Tick einmal von der Serverstatistik holen
function refreshTickDuration() {
  var tickMs = getTickMinutes() * 60000;
  var tick = Math.floor(getServerNow() / tickMs);
  var k = "eba_tickdur_" + srvKey();
  if (GM_getValue(k + "tick", 0) == tick) { return; }
  GM_xmlhttpRequest({
    method: "GET",
    url: location.origin + "/stats.php?s=serverstats",
    onload: function(response) {
      var m = /Dauer des letzten Tick\s*<\/td>\s*<td[^>]*>\s*([\d.,]+)\s*s/.exec(response.responseText);
      if (m) {
        GM_setValue(k + "ms", Math.round(parseFloat(m[1].replace(",", ".")) * 1000));
        GM_setValue(k + "tick", tick);
      }
    }
  });
}
function getTickDurationMs() { return GM_getValue("eba_tickdur_" + srvKey() + "ms", 30000); } // Fallback 30 s

// Aktueller Tick (Serverzeit): Beginn in ms und ob er abgeschlossen ist
function getTickInfo() {
  var tickMs = getTickMinutes() * 60000;
  var serverNow = getServerNow();
  var nowTick = Math.floor(serverNow / tickMs) * tickMs;
  return { nowTick: nowTick, done: (serverNow - nowTick) > getTickDurationMs() + 3000 };
}
// Stunden seit Basis-Stunde (Epoch-Stunden) bis Tick-Beginn, 2 Nachkommastellen
function elapsedHours(baseHour, tickStartMs) {
  return Math.round((tickStartMs - baseHour * 3600000) / 36000) / 100;
}

// Futter-Snapshots im Hintergrund holen (sequentiell, um den Server zu schonen)
function hasFoodSnapshot(id, tickMin) {
  var saved = GM_getValue("eba_food_" + srvKey() + id, "");
  if (!saved) { return false; }
  var last = saved.substr(saved.lastIndexOf("\n") + 1);
  return parseInt(last.split("\t")[0]) >= tickMin;
}
function queueFoodSnapshot(id, url, tickMin) {
  var k = srvKey() + id + "_" + tickMin;
  if (foodQueued[k] || hasFoodSnapshot(id, tickMin)) { return; }
  foodQueued[k] = true;
  foodQueue.push({id: id, url: url, tickMin: tickMin, qk: k});
  if (!foodQueueRunning) { runFoodQueue(); }
}
function runFoodQueue() {
  var job = foodQueue.shift();
  if (!job) { foodQueueRunning = false; return; }
  foodQueueRunning = true;
  var next = function() { setTimeout(runFoodQueue, 300); };
  var fail = function() { delete foodQueued[job.qk]; next(); }; // Retry beim nächsten Aufruf erlauben
  GM_xmlhttpRequest({
    method: "GET",
    url: job.url,
    overrideMimeType: "text/html; charset=windows-1252",
    onload: function(response) {
      try {
        var doc = new DOMParser().parseFromString(response.responseText, "text/html");
        var box = $(doc).find("div[data-formi='food']");
        if (!box.length) { fail(); return; } // z.B. ausgeloggt
        if (!hasFoodSnapshot(job.id, job.tickMin)) {
          var entries = [];
          box.find("table.liste tr").slice(1).each(function() {
            var td = $(this).children("td");
            var name = $.trim(td.eq(0).text());
            if (!name) { return; }
            var gram = $.trim(td.eq(1).text()).replace(".", ",");
            var cond = $.trim(td.eq(3).text());
            entries.push(name + " " + gram + "g " + cond);
          });
          var srv = /(\d+:\d+:\d+)/.exec($("#servertime").text());
          var key = "eba_food_" + srvKey() + job.id;
          var saved = GM_getValue(key, "");
          var line = job.tickMin + "\t" + (srv ? srv[1] : "") + "\t" + (entries.length ? entries.join(" | ") : "leer");
          GM_setValue(key, saved ? saved + "\n" + line : line);
        }
        next();
      } catch (err) { fail(); }
    },
    onerror: fail,
    ontimeout: fail
  });
}

function updateFormiStatistic() {
  if(!$("h3:contains('Deine Formicarien')").length){return}
  refreshTickDuration();
  var tk = getTickInfo();
  var tickMin = getTickMinutes();
  var tickHours = tickMin / 60;
  $("div[id='shopitem']:contains('Larven')").each(function(i, e) {
    var div = $(this);
    var long_str = ["Reagenzglas", "Mini Arena", "kleines Formicarium", "mittleres Formicarium", "großes Formicarium", "mittlere Anlage",
              "große Anlage", "riesige Anlage", "kleines Nest", "großes Nest", "mittleres YTong Nest", "großes YTong Nest", "riesiges YTong Nest"];
    var short_str = ["Reagenzglas", "Mini Arena", "kleines Formi", "mittl. Formi", "großes Formi", "mittl. Anlage",
                 "große Anlage", "ries. Anlage", "kleines Nest", "großes Nest", "mittl. YTong", "großes YTong", "ries. YTong"];
    var cells = div.find("table.liste td").add(div.find("div[id='group'] table.inner td")).filter(":odd");
    var queens = parseInt(cells.eq(0).text());
    var ants = parseInt(cells.eq(1).text());
    var eggs = parseInt(cells.eq(2).text());
    var larvae = parseInt(cells.eq(3).text());
    var cocoons = parseInt(cells.eq(4).text());
    var kind = cells.eq(5).text();
    var points = parseInt(cells.eq(6).text());
    var nest = cells.eq(7).text();
    var formicarium = cells.eq(8).text();
    var id = cells.eq(9).find("span").attr("id").substr(11);
    var sugarHunger = parseFloat(cells.eq(9).get(0).childNodes[2].nodeValue).toString().replace(/\./, ",");
    var proteinHunger = parseFloat(cells.eq(10).get(0).childNodes[2].nodeValue).toString().replace(/\./, ",");
    for(var n = 0; n < long_str.length; n++){
      if(long_str[n] == nest){ nest = short_str[n]; }
      if(long_str[n] == formicarium){ formicarium = short_str[n]; }
    }
    // Bezeichnung der "Pr(%)"-Spalte aus der Seite lesen: "Hunger (Proteine)" (0% gut)
    // oder z.B. "Pilzstatus" (100% gut). Wird nur bei der Anzeige genutzt, nicht gespeichert.
    var protLabel = "";
    try {
      var lblA = cells.eq(10).closest("tr").children("td").first().find("a").get(0);
      if (lblA) { protLabel = $.trim(lblA.childNodes[0].nodeValue).replace(/:$/, ""); }
    } catch (err) {}
    var protMeaning = protLabel ? protLabel + (/Hunger/i.test(protLabel) ? " (gut: 0%)" : " (gut: 100%)") : "";

    var dataLine = queens+"\t"+ants+"\t"+eggs+"\t"+larvae+"\t"+cocoons+"\t"+points+"\t"+nest+"\t"+formicarium+"\t"+sugarHunger+"\t"+proteinHunger;
    var key = "eba_statistic_" + srvKey() + id;
    var timeStr = formatStatTime(tk.nowTick);
    var savedData = GM_getValue(key, null);

    // allererste Erfassung (erst nach Tick-Ende)
    if (savedData == null && tk.done) {
      var startHour = Math.floor(tk.nowTick / 3600000);
      savedData = startHour+"\t"+kind+"\n"+elapsedHours(startHour, tk.nowTick)+"\t"+dataLine+"\t"+timeStr;
      GM_setValue(key, savedData);
    }
    if (savedData == null) { return; } // Tick läuft noch, noch keine Daten

    var baseHour = parseInt(savedData.substring(0, savedData.indexOf("\t")));
    var nowElapsed = elapsedHours(baseHour, tk.nowTick);
    var lines = savedData.split("\n"); // lines[0] = Kopfzeile
    var lastElapsed = parseFloat(lines[lines.length - 1].split("\t")[0]);

    // neuer Tick seit der letzten Zeile? Ausgefallene Ticks dazwischen werden nicht aufgefüllt.
    if (tk.done && nowElapsed > lastElapsed) {
      lines.push(nowElapsed+"\t"+dataLine+"\t"+timeStr);
      savedData = lines.join("\n");
      GM_setValue(key, savedData);
    }

    // Futter-Snapshot im Hintergrund holen (einmal pro Tick und Formicarium)
    if (tk.done && GM_getValue("eba_enable_food_snapshot", false)) {
      var href = div.find("a:contains('Formicarium anschauen')").attr("href");
      var detailUrl = href ? new URL(href, location.href).href
                           : location.origin + "/ameisenzimmer.php?cat=9&id=" + id;
      queueFoodSnapshot(id, detailUrl, tk.nowTick / 60000);
    }

    // Entwicklung (Tooltips): Vergleich mit der letzten Zeile aus einem früheren Tick
    if (tk.done) {
      var prev = null;
      for (var j = lines.length - 1; j >= 1; j--) {
        var f = lines[j].split("\t");
        if (parseFloat(f[0]) < nowElapsed) { prev = f; break; }
      }
      if (prev) {
        var gap = nowElapsed - parseFloat(prev[0]);
        var applier = function(pos, index, newVal) {
          var rate = Math.round((newVal - parseInt(prev[index])) / gap * 10) / 10;
          var txt = rate < 0 ? ""+rate : "+"+rate;
          if (gap > tickHours * 1.5) { txt += " (Ø über " + (Math.round(gap * 10) / 10) + " h)"; }
          cells.eq(pos).attr("title", txt);
        };
        applier(1, 2, ants);
        applier(2, 3, eggs);
        applier(3, 4, larvae);
        applier(4, 5, cocoons);
        applier(6, 6, points);
      }
    }

    // Statistik anzeigen
    div.find("div[id='group'] center").append("<br><a id='eba_statistic_show_"+id+"' href='javascript:void(0)'>Statistik</a>");
    $("#eba_statistic_show_"+id).on("click", function(e) {
      var mainArea = $("td[width='700px']");
      mainArea.empty();
      var statisticHTML = "<div id='shopitem'><textarea id='eba_statistic_area' style='height:300px;width:100%;padding:0;border:1px solid #3aab54;font-family:monospace;'></textarea>";
      statisticHTML += "<button id='eba_statistic_ok' type='button'>OK</button></div>";
      mainArea.append(statisticHTML);

      // Futter-Snapshots nach Tick (Minuten seit Epoch) indexieren
      var foodMap = {};
      $.each(GM_getValue("eba_food_" + srvKey() + id, "").split("\n"), function(k, line) {
        if (!line) { return; }
        var ff = line.split("\t");
        foodMap[ff[0]] = [ff[1], ff[2]];
      });

      var headLines = savedData.substring(0, savedData.indexOf("\n"))+"\nZeit(h)\tKön.\tArb.\tEier\tLarven\tPuppen\tPunkte\tNest       \tFormicarium\tZu(%)\tPr(%)\tUhrzeit\tFutter erfasst\tFutter\tPr-Bedeutung\n";
      var rows = savedData.substr(savedData.indexOf("\n")+1).split("\n");
      var body = $.map(rows, function(line) {
        var r = line.split("\t");
        var elapsed = parseFloat(r[0]);
        if (r.length < 12) { // alte Zeile ohne Uhrzeit
          r.push(formatStatTime((baseHour + elapsed) * 3600000));
        }
        var tickKey = Math.round((baseHour * 60 + elapsed * 60) / tickMin) * tickMin;
        var fd = foodMap[tickKey];
        r.push(fd ? fd[0] : "", fd ? fd[1] : "", protMeaning);
        r[0] = r[0].replace(".", ",");
        return r.join("\t");
      }).join("\n");
      $("#eba_statistic_area").val(headLines+body).select();
      $("#eba_statistic_ok").on("click", function(e) {
        window.location.href = window.location.href.replace(/\?.*/, '');
      });
    });
  });
}

// ---------------------------------------------------------------------------

function disableReloadOnFinish() {
  //change original script do prevent auto reload
  var script = $("script:contains('function taskcounter')");
  //only if present
  if (!script.length) {return}
  var t = script.html();
  var pre = t.substr(0, 556); var post = t.substr(t.length-798);
  if (pre.charAt(pre.length-1)==';' && post.charAt(0)=='}') { //only if unchanged
    var result = pre+"return;"+post;
//do it old style because jquery breaks on this:
//    $("body").append("<script type='text/javascript'>"+result+"</script>");
    var newS = document.createElement("script");
    newS.type = "application/javascript";
    newS.text = result;
    document.body.appendChild(newS);
    //remove original
    script.remove();
  } else {
    alert("Function changed!"); //cancel!
    return;
  }
}
function enableSoundOnJobEnd() {
  //establish own action on job finish
  var fishedReceived = false;
  $("#status").on("DOMNodeInserted", "#headercountdown", function(e){
    if ($("#headercountdown").text().indexOf("fertig")>=0 && !fishedReceived) {
      fishedReceived = true;
      var a = document.createElement('audio');
      a.src='http://d.zaix.ru/jqHc.mp3';
      a.load();
      a.play();
    }
  });
}
function copyHungerPercentages() {
  if (!($("h3:contains('Formicarium')").length || $("h3:contains('Deine Formicarien')").length) || ($("h3:contains('einrichten')").length)) {return;}
//  $("div[id='shopitem']").css("width", 650);
  // genauen Wert aus dem Fortschrittsbalken-Skript hinter dem Span übernehmen
  var copyPercentage = function(span) {
    var m = /.*\s+([\d\.]+),/.exec(span.next().html() || "");
    var textNode = span.parent().get(0) && span.parent().get(0).childNodes[2];
    if (!m || !textNode) {return}
    var text = " "+parseFloat(m[1])+"%";
    if (textNode.nodeValue != text) {textNode.nodeValue = text;}
  };
  var copyAll = function() {
    $("div[id='shopitem']:contains('Larven')").each(function(i, e) {
      var div = $(this);
      copyPercentage(div.find("span[id^='sugarhunger']"));
      copyPercentage(div.find("span[id^='proteinhunger']"));
    });
  };
  copyAll();
  // Beim Füttern per Button lädt die Seite den Block per AJAX neu (gerundete Prozente),
  // daher nach jeder DOM-Änderung erneut anwenden.
  new MutationObserver(copyAll).observe(document.body, {childList: true, subtree: true});
}
function enableKeyNavi() {
  if (!$("h3:contains('Formicarium')").length || ($("h3:contains('einrichten')").length)) {return;}
  $(document).keypress(function(e) {
    var link;
    if (e.which==110 || e.which==101) { //next
      link = $("a:contains('chstes')").attr('href');
    } else if (e.which==118 || e.which==113) { //prev
      link = $("a:contains('voriges')").attr('href');
    } else if (e.which==122) { //feed sugar
      $("select[name='foodid']").eq(0).parent().submit();
    } else if (e.which==112) { //feed protein
      $("select[name='foodid']").eq(1).parent().submit();
    }
    if (link!=null) window.location.href = link;
  });
}
function processSingleFormicariumView() {
  if (!$("h3:contains('Formicarium')").length || ($("h3:contains('einrichten')").length)) {return}
  //move food table
  var moveFoodTable = function() {
    var foodTable = $("div[id='shopitem'] b:contains('Futter') ~ div[id='text'] > table.liste");
    // nur verschieben, wenn noch ein Formular dahinter steht (verhindert Endlosschleife mit dem Observer)
    if (foodTable.nextAll("form").length) {
      foodTable.appendTo(foodTable.parent());
    }
  };
  moveFoodTable();
  // Beim Füttern per Button lädt die Seite den Futter-Block per AJAX neu (Originalreihenfolge),
  // daher nach jeder DOM-Änderung erneut anwenden.
  new MutationObserver(moveFoodTable).observe(document.body, {childList: true, subtree: true});
}
function rememberShopPrices() {
  if (!$("center > b:contains('Kleinanzeigen')").length){return}
  //remember price
  $("#shopitem form").on("submit", function(e){
    var text = $("#shopitem option:selected").text();
    text = text.substring(0, text.indexOf(" ("));
    var amount = $("#shopitem input[name='amount']").val();
    var price = $("#shopitem input[name='price_cent']").val().replace(",", ".");
    GM_setValue("eba_enable_shop_remember_prices_"+text, amount+"|"+price);
  });
  //use price
  $("#shopitem select").on("change", function(e){
    var text = $("#shopitem option:selected").text();
    text = text.substring(0, text.indexOf(" ("));
    var values = GM_getValue("eba_enable_shop_remember_prices_"+text, "1|1.00").split("|");
    var amount = values[0];
    var price = values[1];
    if (!$("#shopitem input[name='amount']").length) {
      $("#shopitem input[name='price_cent']").val(parseFloat(price).toFixed(2).toString().replace(".", ","));
    } else {
      $("#shopitem input[name='amount']").val(amount);
      $("#shopitem input[name='amount']").off(".open_eba").on("keyup.open_eba", function(e) {
        var a = parseFloat($("#shopitem input[name='amount']").val());
        var r = (parseFloat(price) * a / parseFloat(amount)).toFixed(2).toString().replace(".", ",");
        $("#shopitem input[name='price_cent']").val(r);
      });
      $("#shopitem input[name='amount']").keyup();
    }
  });
  $("#shopitem select").change();
}
function foodMoveForm() {
  if (!$("h3:contains('Futtertierzucht')").length) {return}
  if($("#shopitem > table").parent().last().text() != "neue Futtertierzucht einrichten") {return}
  $("#shopitem > table").parent().last().insertBefore($("#shopitem > table").parent().first()).css({"margin-bottom":"7px"});
}
function formiMoveForm() {
  if (!$("h3:contains('Deine Formicarien')").length) {return}
  if($("#shopitem > table").parent().last().text() != "neues Formicarium einrichten") {return}
  $("#shopitem > table").parent().last().insertBefore($("#shopitem > table").parent().first()).css({"margin-bottom":"7px"});
}
function shopMoveForm() {
  if (!$("center > b:contains('Kleinanzeigen')").length){return}
  $("#shopitem").insertBefore($("table.liste")).css({"margin-bottom":"7px"});
}
function enableShopFilter() {
  if (!$("center b:contains('Kleinanzeigen')").length){return}
  var filters = $.grep(GM_getValue("eba_shopfilter", "").split("\n"), function(e,i){
    return e.length;
  });
  var trs = $("table.liste").first().find("tr").slice(1);
  trs.each(function() {
    var tr = $(this);
    var tds = $(this).children();
    var trTxt = tds.first().text() + ";" + tds.last().prev().text();
    $.each(filters, function(i,f) {
      if (trTxt.indexOf(f)>=0) {
        tr.remove();
      }
    });
  });
}
function enableMessageFilter() {
  if(!$("h3:contains('Private Nachrichten :')").length){return}
  var filters = $.grep(GM_getValue("eba_shopfilter", "").split("\n"), function(e,i){
    return e.length;
  });
  var trs = $("table.liste").first().find("tr").slice(1);
  trs.each(function() {
    var tr = $(this);
    var tds = $(this).children();
    var trTxt = tds.first().next().text();
    $.each(filters, function(i,f) {
      if (trTxt.indexOf(f)>=0) {
        tr.remove();
      }
    });
  });
}
function shopSeparator() {
  if (!$("center > b:contains('Kleinanzeigen')").length){return}
  var last = "Name";
  $("table.liste").find("tr").each(function() {
    var text = $(this).children().first().text();
    if (text!=last) {
      last = text;
      $(this).children().css({"padding-top":2, "border-top":"1px solid #3CAC56"});
    }
  });
}
function shopMoveSelection() {
  if (!$("center > b:contains('Kleinanzeigen')").length){return}
//  var inMisc = $("#shopitem").find("h3:contains('Sonstiges')").length;
  $("#shopitem select").on("change", function(e){
    var text = $("#shopitem option:selected").text();
    text = text.substring(0, text.indexOf("(")-1);
//    GM_setValue("eba_last_small_ads_"+inMisc, text); //remember last
    var trs = $("table.liste").find("tr");
    trs.filter(function(i){
      return $(this).html().indexOf(">"+text)>0;
    }).insertAfter(trs.eq(0));
  });
  //select a default
//  var last = GM_getValue("eba_last_small_ads_"+inMisc);
//  $("#shopitem option:contains('"+last+"')").prop("selected", true);
  $("#shopitem select").change();
}
function sortStock() {
  if (!$("h3:contains('Dein Lager')").length) {return}
  var table = $("table.liste").eq(3);
  var rows = table.find("tr");
  var header = rows.first();
  //header.append("<td class='liste'><b>Anzahl</b></td>");
  //header.find("td").first().css("min-width", "");

  var data = new Object();
  var regexp = /<td class="liste">(.*)<\/td><td class="liste"><center>(.*)<\/center><\/td>/;
  rows.slice(1).each(function(){
    var html = $(this).html();
    var result = regexp.exec(html);
    var key = result[1]+":"+result[2];
    if (typeof(data[key])==="undefined") {
      data[key]=1;
    } else {
      data[key]++;
    }
  });

  var results = new Array();
  $.each(data, function(k,v){
    var result = new Object();
    var values=k.split(":");
    result.kind=values[0];
    result.amount=values[1];
    results.push(result);
  });

  var items = ["Mini Arena", "kleines Formicarium", "mittleres Formicarium", "großes Formicarium", "mittlere Anlage", "große Anlage",
               "riesige Anlage", "kleines Nest", "mittleres Nest", "großes Nest", "mittleres YTong Nest", "großes YTong Nest", "riesiges Ytong Nest"];

  var html = "";
  for(i = 0; i < items.length; i++){
    var idx = -1;
    for (j = 0; j < results.length; j++) {
      if (results[j].kind === items[i]) {
        idx = j;
        break;
      }
    }
    if(idx != -1){
      html += "<tr class=color1><td class=liste>"+results[idx].kind+"</td><td class=liste><center>"+results[idx].amount+"</center></td></tr>";
    }
  }

  // fast variant like with the dropboxes
  // table.empty();//400
  var t = table.get(0); var ct = t.cloneNode(false); t.parentNode.replaceChild(ct, t);table=$(ct);//6

  rows = table.append(header).append(html).find("tr").slice(1);
  rows.filter(":odd").addClass("color2");
  rows.filter(":even").addClass("color1");
}

function processStock() {
  if (!$("h3:contains('Dein Lager')").length) {return}
  var table = $("table.liste").first();
  var rows = table.find("tr");
  var header = rows.first();
  header.append("<td class='liste'><b>Anzahl</b></td>");
  header.find("td").first().css("min-width", "");

  var data = new Object();
  //<td class="liste">Myrmecia chrysogaster</td><td class="liste"><center>1</center></td><td class="liste"><center>0</center></td><td class="liste"><center>Reagenzglas</center></td>
  var regexp = /<td class="liste">(.*)<\/td><td class="liste"><center>(.*)<\/center><\/td><td class="liste"><center>(.*)<\/center><\/td><td class="liste"><center>(.*)<\/center><\/td>/;
  rows.slice(1).each(function(){
    var html = $(this).html();
    var result = regexp.exec(html);
    var key = result[1]+":"+result[2]+":"+result[3]+":"+result[4];
    if (typeof(data[key])==="undefined") {
      data[key]=1;
    } else {
      data[key]++;
    }
  });

  var results = new Array();
  $.each(data, function(k,v){
    var result = new Object();
    var values=k.split(":");
    result.kind=values[0];
    result.queens=values[1];
    result.ants=values[2];
    result.nest=values[3];
    result.count=v;
    results.push(result);
  });

  results.sort(function(a,b){
    if (a.kind > b.kind) return 1;
    if (a.kind < b.kind) return -1;
    var diff = a.queens - b.queens;
    if (diff!=0) return diff;
    diff = a.ants - b.ants;
    if (diff!=0) return diff;
    return (a.nest > b.nest)? 1 : -1;
  });

  // fast variant like with the dropboxes
  // table.empty();//400
  var t = table.get(0); var ct = t.cloneNode(false); t.parentNode.replaceChild(ct, t);table=$(ct);//6

  var html = "";
  $.each(results, function(i,e){
    html +=
      "<tr><td class='liste'>"+e.kind+"</td>"+
      "<td class='liste'><center>"+e.queens+"</center></td>"+
      "<td class='liste'><center>"+e.ants+"</center></td>"+
      "<td class='liste'><center>"+e.nest+"</center></td>"+
      "<td class='liste'><center>"+e.count+"</center></td></tr>";
  });
  rows = table.append(header).append(html).find("tr").slice(1);
  rows.filter(":odd").addClass("color2");
  rows.filter(":even").addClass("color1");
}
function sortAndFilterOptions() {
  $("select.dropdown").each(function (index){
    var select = $(this);
    var data = new Object();

    var options = select.find("option").each(function(){
      var key = this.text;
      if (typeof(data[key])==="undefined") {
        data[key]=[1, this.value];
      } else {
        data[key][0]++;
      }
    });

    var results = new Array();
    $.each(data, function(k,v){
      var result = new Object();
      result.text=k;
      result.val=v[1];
      result.count=v[0];
      results.push(result);
    });

    results.sort(function(a,b) {
      if (a.text.toUpperCase() > b.text.toUpperCase()) return 1;
      if (a.text.toUpperCase() < b.text.toUpperCase()) return -1;
      return 0;
    });

    var html = "";
    $.each(results, function(i,e){
      html += "<option value='"+e.val+"'>"+e.text;
      if (e.count>1) {
        html += " ("+e.count+"x)";
      }
      html += "</option>";
    });

    // various possibilities with significant different runtimes
    // var newSelect = $(this.cloneNode(false));select.replaceWith(newSelect);select = newSelect;//20
    var cs = this.cloneNode(false); this.parentNode.replaceChild(cs, this);select=$(cs);//2
    // this.innerHTML = "";//150
    // select.empty();//220
    // select.html("");//150
    // options.remove();//300

    select.append(html);

    //select the last active item
    var key = "eba_saved_state_"+select.attr("name")+"_"+index;
    var last = GM_getValue(key, "null");
    var opt = null;
    do {
      opt = select.find("option:contains('"+last+"')");
      last = last.substring(0, last.length-1);
    } while(opt.length==0 && last.length>0);
    opt.prop("selected", true);

    //remember selections
    select.on("change", function(){
      var text = select.find("option:selected").text();
      GM_setValue(key, text);
    });
  });
}
function shopFilterList() {
  if (!$("center > b:contains('Kleinanzeigen')").length){return}
  var result = /subcat=(\d)/.exec(document.location.href);
  var subcat = result==null? 0: result[1];
  if (subcat==0) {return}

  //store subcat in form URLs because otherwise it is not available after post
  $("form").each(function (){
    this.action += "?subcat="+subcat;
  });
  var inMisc = $("#shopitem").find("h3:contains('Sonstiges')").length;
  $("select.dropdown option").each(function (i, o) {
    var text = o.text.substring(0, o.text.indexOf("(")-1);
    if (inMisc) {
      var isFood = true;
      $.each(nonfood, function(i, e) {
        if (text.indexOf(e)>=0) {
          isFood = false; return false;
        }
      });
      if ((isFood && subcat==2) || (!isFood && subcat==1)) {
        $(o).remove();
      }
    } else {
      if (antcat[text]!=subcat) {
        $(o).remove();
      }
    }
  });
}
function sumMultipleShopLines() {
  if (!$("center > b:contains('Kleinanzeigen')").length){return}
  var column = $("#shopitem").find("h3:contains('Sonstiges')").length?4:5;
  var trs = $("table.liste").first().find("tr").slice(1);
  var lookup = new Object();
  trs.each(function() {
    var tr = $(this);
    var trTxt = tr.text();
    if (typeof(lookup[trTxt])==="undefined") {
      lookup[trTxt]=[tr, new Array()];
    } else {
      lookup[trTxt][1].push(tr);
      tr.remove();
    }
  });
  var counter=0;
  $.each(lookup, function(k,v){
    if (v[1].length>0) {
      var id = "spread_"+(counter++);
      v[0].find("td").eq(column).prepend("<span>(<a href='javascript: void(0)' id='"+id+"'>"+(v[1].length+1)+"x</a>) </span>");
      $("#"+id).on("click", function(){
        v[0].after(v[1]);
        $(this).parent().remove();
      });
    }
  });
}
function filterAdditionalShopLines() {
  if (!$("center > b:contains('Kleinanzeigen')").length){return}
  var column = $("#shopitem").find("h3:contains('Sonstiges')").length?4:5;
  var trs = $("table.liste").first().find("tr").slice(1);
  var lookup = new Object();
  trs.each(function() {
    var tr = $(this);
    var tds = tr.find("td");
    var trTxt;
    if (column==4){
      trTxt = tds.eq(0).text()+tds.eq(1).text()+tds.eq(4).find("a").last().text();
    } else {
      trTxt = tds.eq(0).text()+tds.eq(1).text()+tds.eq(2).text()+tds.eq(3).text()+tds.eq(5).find("a").last().text();
    }
    if (typeof(lookup[trTxt])==="undefined") {
      lookup[trTxt]=[tr, new Array()];
    } else {
      lookup[trTxt][1].push(tr);
      tr.css("display", "none");
    }
  });
  var counter=0;
  $.each(lookup, function(k,v){
    if (v[1].length>0) {
      var id = "reinsert_"+(counter++);
      v[0].find("td").eq(column).find("a").last().before("<span>[<a href='javascript: void(0)' id='"+id+"'>+"+(v[1].length)+"</a>] </span>");
      $("#"+id).on("click", function(){
        $.each(v[1], function(i, e) {
          e.css("display", "");
        });
        $(this).parent().remove();
      });
    }
  });
}
function modifyGUI() {
  var sheet= document.styleSheets[0];
  sheet.insertRule('#shopmenucats a{padding:6px 4px 6px 4px; height:auto; margin:0}', sheet.cssRules.length);
  sheet.insertRule('#shopmenucats br{display:none}', sheet.cssRules.length);
  sheet.insertRule('div#text{margin-top:0;padding:5px}', sheet.cssRules.length);
  if ($("center > b:contains('Kleinanzeigen')").length) {
    //prevent wrapping of cells
    sheet.insertRule('table.liste { white-space: nowrap; }', sheet.cssRules.length);
  }
  //message in formis are #error elsewhere #message
  var message = $("#message,#error");
  //only if one found
  if (message) {
    $("center #error").unwrap(); //only error ist wraped in <center>
    //remove <br> surrounding message
    message.siblings("br").remove();
    //move message to status
    $("#status").append(message).css("position", "relative");
    message.css({"position":"absolute", "color":"white", "background":"#004E12", "bottom":10, "right":300, "width":300});
  }
}
function insertNote() {
  if (!$("#shopmenucats").length){return}
  // gleicher Breakpoint wie mobile.css (max-width: 959px)
  var mobile = window.matchMedia("(max-width: 959px)").matches;
  $("head").append("<style>" +
    "#eba_note{height:750px;width:100%;padding:0;border:1px solid #3aab54;box-sizing:border-box}" +
    "#eba_note_box summary{cursor:pointer}" +
    "@media screen and (max-width: 959px){#eba_note{height:150px}}" +
    "</style>");
  $("table.shop").first().parent().append(
    "<br><details id='eba_note_box'" + (mobile ? "" : " open") + ">" +
    "<summary>Notizen</summary>" +
    "<textarea id='eba_note'></textarea></details>");
  $("#eba_note").on("blur", function(){
    GM_setValue("eba_note", $(this).val());
  }).val(GM_getValue("eba_note", ""));
}
function processJobOffers() {
  if(!($("h3:contains('Aktionen')").length || $("h3:contains('Forschung')").length || $("h3:contains('Arbeitsamt')").length)) {return}
  const weekday = new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");
  //start from now
  var starttime = new Date().getTime();
  //start from end of current if any
  var to = $("#headercountdown span").text();
  if (to!="") {
    var result = /(\d+).(\d+).(\d+) (\d+):(\d+):(\d+)/.exec(to.substring(4));
    var runTo = new Date(result[3], result[2]-1, result[1], result[4], result[5], result[6]);
    starttime = runTo.getTime();
  }
  $("form:contains('Dauer')").each(function() {
    var form = $(this);
    var nodes = form.contents().filter(function() {
      var result = this.nodeType === 3 && //text
        ((this.nodeValue.indexOf("Dauer")===0 && this.nextSibling!=null) || //starts with "Dauer", is not the current countdown
          this.nodeValue.indexOf(" Lohn")===0 || //starts with "Lohn"
          this.nodeValue.indexOf(" Kosten")===0); //starts with "Kosten"
      return result;
    }).get();
    if (nodes.length!=2) return true; //not found correctly => try next
    //duration nodes[0]
    var result = /(\d+):(\d+):(\d+)/.exec(nodes[0].nodeValue.substring(7));
    var sec = parseInt(result[1])*60*60 + parseInt(result[2])*60 + parseInt(result[3]);
    var end = new Date(starttime+sec*1000);
    var target = " [Endet "+weekday[end.getDay()]+", ";
    if (end.getHours()<10) target += "0";
    target += end.getHours() + ":";
    if (end.getMinutes()<10) target += "0";
    target += end.getMinutes() + "]";
    nodes[0].nodeValue = nodes[0].nodeValue+target;
    //earnings nodes[1], only with "Lohn"
    if (nodes[1].nodeValue.indexOf(" Lohn")==0) {
      result = /(\d+),(\d+) /.exec(nodes[1].nodeValue.substring(6));
      var mon = parseInt(result[1])*100 + parseInt(result[2]);
      var hourly = parseFloat(parseInt((mon)/(sec/3600)))/100;
      nodes[1].nodeValue = nodes[1].nodeValue+" [Stundenlohn "+hourly+"]";
    }
  });
}
function statBeautify() {
  insertPointsDiff();
  if (!$("#shopmenu:contains('Statistik')").length){return}
  //insert diff if on total points
  var ownPoints=null;
  if ($("#shopmenucats a b:contains('Gesamtpunktzahl')").length) {
    ownPoints = parseInt(/<br>Punkte: (.*?)<br>/.exec($("div#status").html())[1].replace(/\./g, ""));
  }
  //format 1000000 => 1.000.000
  $("table.liste td").each(function() {
    var td = $(this);
    var text = td.text();
    if (/^\d{4,}$/.test(text)) {
      if (ownPoints!=null) {
        var diff = parseInt(text)-ownPoints;
        td.attr("title", ((diff>0? "+":"")+diff).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."));
      }
      td.text(text.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."));
    }
  });
}
function insertPointsDiff() {
  //determine current hours
  var hours = parseInt((new Date().getTime()) / (1000*60*60));
  //find current value
  //div#status => Punkte xxx => first group => remove points => parseInt
  var status = $("div#status");
  var result = /Punkte:\s*([\.\d]*)/.exec(status.html());
  if (result==null) {return;} //reoccuring error for some users
  var currentPoints = parseInt(result[1].replace(/\./g, ""));
  var oldPoints1 = GM_getValue("eba_points1", 0);
  var oldPoints2 = GM_getValue("eba_points2", 0);
  var oldHours1 = GM_getValue("eba_hours1", 0);
  var oldHours2 = GM_getValue("eba_hours2", 0);

  if (hours>oldHours2) {
    //save new values and shift
    oldPoints1 = oldPoints2; GM_setValue("eba_points1", oldPoints1);
    oldPoints2 = currentPoints; GM_setValue("eba_points2", oldPoints2);
    oldHours1 = oldHours2; GM_setValue("eba_hours1", oldHours1);
    oldHours2 = hours; GM_setValue("eba_hours2", oldHours2);
  }
  var hourDiff = oldHours2 - oldHours1;
  var pointsDiff = oldPoints2 - oldPoints1;
  $("div#status img").attr("title", "+"+(pointsDiff/hourDiff).toFixed(1));
}
function enableBookmarks() {
  if (!$("#shopmenucats").length) {return}
  var html = "<hr>";
  var bookmarks = $.grep(GM_getValue("eba_bookmarks", "").split("\n"), function(e,i){
    return e.length;
  });
  $.each(bookmarks, function(i, bm) {
    var tl = bm.split(";");
    html+="<a href='"+tl[1]+"'>"+tl[0]+"</a>";
  });
  $("#shopmenucats").append(html);
}
function enableConfig() {
  if (!$("#shopmenu:contains('Statistik')").length) {return}
  //$("#shopmenucats").append("<a href='/stats.php?limitplayers=14'>14-Tage-Statistik</a>");
  $("#shopmenucats").append("<hr><a id='eba_config_start' href='javascript:void(0)'>openEBA</a>");
  $("#eba_config_start").on("click", function(e) {
    if($("#eba_config_cancel").length) {
      return;
    }
    var mainArea = $("td[width='700px']");
    //show config
    mainArea.empty();
    var configHTML = "<div id='shopitem'>";
    $.each(configItems, function(k, v) {
      configHTML += "<input type='checkbox' id='"+k+"'>"+v[1];
      if (v[2]) {
        configHTML+= " (<a class='tooltip' href='#'>Mehr Info<span>"+v[2]+"</span></a>)";
      }
      configHTML+="<br>";
    });
    configHTML += "<br>Kleinanzeigen- bzw. Nachrichten-Filter (ein Suchbegriff pro Zeile)<br><textarea id='eba_shopfilter' style='height:100px;width:90%'></textarea>";
    configHTML += "<br>Bookmarks in der Form <i>Text;Link</i><br><textarea id='eba_bookmarks' style='height:100px;width:90%'></textarea>";
    configHTML += "<br>Itemfilter für die linke Leiste (ein Begriff pro Zeile)<br><textarea id='eba_stock_items' style='height:100px;width:90%'></textarea>";
    configHTML += "<div style='text-align:right;'><button id='eba_config_reset' type='button'>Alle gespeicherten Daten l&ouml;schen</button></div>";
    configHTML += "</div>";
    mainArea.append(configHTML);

    //init config with current values
    $.each(configItems, function(k) {
      $("#"+k).prop("checked", GM_getValue(k, false)).change(function() {
        GM_setValue(k, $("#"+k).prop("checked"));
      });
    });
    $("#eba_shopfilter").val(GM_getValue("eba_shopfilter", "")).on("blur", function() {
      GM_setValue("eba_shopfilter", $("#eba_shopfilter").val());
    });
    $("#eba_bookmarks").val(GM_getValue("eba_bookmarks", "")).on("blur", function() {
      GM_setValue("eba_bookmarks", $("#eba_bookmarks").val());
    });
    $("#eba_stock_items").val(GM_getValue("eba_stock_items", "")).on("blur", function() {
      GM_setValue("eba_stock_items", $("#eba_stock_items").val());
    });
    //Reset
    $("#eba_config_reset").on("click", function(e) {
      $.each(GM_listValues(), function(i, e){
        GM_deleteValue(e);
      });
      window.location.href = window.location.href.replace(/\?.*/, '');
    });
  });
}
// Nach einer Idee von Fabian Schlieper (http://www.fabi.me/)
function randInt(from, to) { return from + Math.floor(Math.random() * (to - from)); }
function initSnow(){
  var header = $("#header").css("position", "relative");
  var bl = 22;
  var bt = 20;
  var br = bl + 590;
  var bb = bt + 140;

  var fonts  = ['Arial Black', 'Arial Narrow', 'Times', 'Comic Sans MS'];
  var colors = ['#AAAACC','#DDDDFF','#CCCCDD','#F3F3F3','#F0FFFF'];
  var flakesHTML=""; for (var i = 0; i < 30; i++) { flakesHTML+='<span class="snowflake">*</span>'; }
  header.append(flakesHTML);
  $("span.snowflake").each(function (i, flake){
    $(flake).css({
      position: "absolute",
      zIndex: 99,
      fontFamily: fonts[randInt(0, fonts.length)],
      fontSize: randInt(10, 22),
      color: colors[randInt(0, colors.length)],
      left: randInt(bl, br),
      top: randInt(bt, bb),
      marginLeft: 0
    });
  });
  window.setInterval(function() { return function() {
    $("span.snowflake").each(function (i, flake){
      var size = parseInt(flake.style.fontSize);
      var ym = Math.round(parseInt(flake.style.top) + 0.08 * size);
      var xm = Math.round(size * Math.sin(new Date().getTime()/(50*size)));
      if (ym > bb) {
        ym = bt;
      }
      flake.style.marginLeft = xm+"px";
      flake.style.top = ym+"px";
    });
  } }(), 50);
}
