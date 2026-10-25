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

// Version des Speicherschemas der Historien.
// 0/1 = Altbestand (nur Formi- und Futter-Historie, ohne Versionsschlüssel)
// 2   = zusätzliche Zeitreihen für Geld, Punkte, Ticklänge sowie Futter-/Ameisensuchen
const EBA_SCHEMA_VERSION = 2;
// Obergrenze an Zeilen pro Zeitreihe, ab der ausgedünnt wird (nur mit aktivierter Kompaktierung)
const EBA_HIST_MAX_LINES = 2000;

// Bereichspräfixe aller servergetrennten Schlüssel. Direkt dahinter steht
// srvKey(), also "speed_" oder nichts. Siehe keyServer().
// Bewusst NICHT hier: Optionen (eba_enable_*, eba_disable_*, eba_sort_*),
// eba_shopfilter, eba_bookmarks, eba_note, eba_stock_items - die gelten für
// beide Server.
var EBA_SRV_PREFIXES = [
  "eba_hist_", "eba_statistic_", "eba_food_", "eba_tickdur_",
  "eba_schemaversion_", "eba_points_", "eba_hours_",
  "eba_inventory_", "eba_shop_prices_", "eba_saved_state_",
  "eba_shop_remember_price_"
];

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
  "eba_enable_show_inventory"                : [showInventory, "Inventar in der Seitenleiste Anzeigen", "Bestimmte Items aus dem Lager in der linken Seitenleiste Anzeigen. Begriffe werden in der unteren Liste gepflegt"],
  "eba_enable_global_statistic"              : [updateGlobalStatistic, "Geld, Punkte und Tickl&auml;nge historisieren", "Je Tick wird einmal der Geldbestand, die Punktzahl und die Dauer des letzten Ticks mit Zeitstempel festgehalten. Die Erfassung l&auml;uft auf jeder Spielseite (die Werte stehen in der Statusbox oben), aber immer nur einmal pro Tick."],
  "eba_enable_search_statistic"              : [updateSearchStatistic, "Futter- und Ameisensuchen vollst&auml;ndig historisieren", "Das Spiel zeigt nur die letzten Ergebnisse einer Futtersuche bzw. K&ouml;niginnensuche. Beim Aufruf der jeweiligen Seite wird die angezeigte Tabelle mit der gespeicherten Historie verschmolzen, sodass auch &auml;ltere Treffer erhalten bleiben."],
  "eba_enable_history_compaction"            : [function(){}, "Historien ausd&uuml;nnen, wenn sie zu gro&szlig; werden", "Ohne diese Option wachsen die Historien unbegrenzt (bisheriges Verhalten). Mit der Option wird in einer Reihe ab " + EBA_HIST_MAX_LINES + " Zeilen aus der <b>&auml;lteren H&auml;lfte</b> jede zweite Zeile entfernt. Die j&uuml;ngere H&auml;lfte und die Kopfzeile bleiben unangetastet. <b>Achtung:</b> Das entfernt alte Messpunkte unwiderruflich. Den aktuellen Speicherverbrauch zeigt die Zeile unten."],
  "eba_enable_max_points"                    : [showMaxPoints, "Maximale Punktzahl in der Formicarien-&Uuml;bersicht anzeigen", "Hinter den Punkten jedes Formicariums erscheint die maximal erreichbare Punktzahl, z.B. <i>12.340 / 50.000</i>. Bei monogynen Arten ist das ein harter Wert, bei polygynen Arten wird der Zuwachs je weiterer K&ouml;nigin eingerechnet (auf dem Speedserver mit anderen Werten als auf dem Normalserver). Der Tooltip zeigt Arbeiterinnen-Maximum, Auslastung in Prozent und die gemessenen Punkte je Arbeiterin. Quelle der Werte ist die Spielhilfe; f&uuml;r zwei Arten ist der polygyne Zuwachs auf dem Speedserver dort unbekannt, dann erscheint ab zwei K&ouml;niginnen ein <i>?</i>."]
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
// Maximalwerte je Ameisenart, Quelle: Spielhilfe-Excel, Blatt "Ameisen".
// Die Schlüssel sind identisch mit denen von antcat (Harness-Test sichert das ab).
//   p    = Punkte bei einer Königin und voller Kolonie        (Spalte B = C * P)
//   a    = Arbeiterinnen bei einer Königin                    (Spalte C)
//   poly = true: polygyn, weitere Königinnen erhöhen das Maximum (Spalte F)
//   pn   = polygyner Zuwachs an Arbeiterinnen je weiterer Königin, Normalserver (Spalte G)
//   ps   = dito Speedserver (Spalte H); null = in der Spielhilfe als "???" unbekannt
//   n    = Platzbedarf im Nest bei a Arbeiterinnen            (Spalte M = C * Q)
//   f    = Platzbedarf im Formicarium bei a Arbeiterinnen     (Spalte N = C * R)
//   b    = Platzbedarf der Brut je Arbeiterin im Nest         (Spalte O), derzeit nicht verwendet
// Punkte werden immer als Math.round(arbeiterinnen * p / a) gerechnet. Dadurch
// bleiben alle Werte Ganzzahlen aus dem Blatt; die krummen Float-Werte der
// Spalten Q/R (z.B. 7.0000000000000007E-2) kommen hier bewusst nicht vor.
const antmax = {
  // --- Einheimische Arten (Blatt "Ameisen", Zeile 2) ---
  "Camponotus herculeanus":    { p: 5000, a: 10000, poly: false, n: 4000, f: 4000 },
  "Camponotus ligniperda":     { p: 4000, a: 10000, poly: false, n: 4000, f: 4000 },
  "Formica fusca":             { p: 1250, a: 5000, poly: true, pn: 2000, ps: 3000, n: 1000, f: 1000 },
  "Formica sanguinea":         { p: 10000, a: 10000, poly: true, pn: 2000, ps: 2000, n: 3000, f: 3000 },
  "Lasius emarginatus":        { p: 15000, a: 50000, poly: false, n: 5000, f: 5500 },
  "Lasius flavus":             { p: 12000, a: 100000, poly: false, n: 10000, f: 2000 },
  "Lasius fuliginosus":        { p: 500000, a: 1000000, poly: true, pn: 50000, ps: null, n: 100000, f: 110000 },
  "Lasius niger":              { p: 5000, a: 50000, poly: false, n: 5000, f: 7500 },
  "Myrmica rubra":             { p: 4000, a: 20000, poly: true, pn: 5000, ps: 10000, n: 3000, f: 4000 },
  "Myrmica ruginodis":         { p: 30000, a: 100000, poly: true, pn: 10000, ps: 80000, n: 20000, f: 20000 },
  "Ponera coarctata":          { p: 2500, a: 125, poly: true, pn: 150, ps: 150, n: 6.25, f: 12.5 },
  "Solenopsis fugax":          { p: 125000, a: 250000, poly: false, n: 17500, f: 25000 },
  "Temnothorax nylanderi":     { p: 250, a: 250, poly: false, n: 12.5, f: 25 },
  // --- Südeuropäische Arten (Blatt "Ameisen", Zeile 17) ---
  "Aphaenogaster senilis":     { p: 5000, a: 10000, poly: false, n: 3000, f: 3000 },
  "Anochetus ghilianii":       { p: 10000, a: 100, poly: false, n: 12, f: 12 },
  "Camponotus cruentatus":     { p: 70000, a: 100000, poly: false, n: 45000, f: 45000 },
  "Camponotus lateralis":      { p: 75000, a: 10000, poly: false, n: 3500, f: 3500 },
  "Cataglyphis velox":         { p: 13000, a: 10000, poly: true, pn: 5000, ps: null, n: 4000, f: 6000 },
  "Crematogaster scutellaris": { p: 35000, a: 100000, poly: false, n: 10000, f: 20000 },
  "Lasius grandis":            { p: 80000, a: 100000, poly: false, n: 10000, f: 9000 },
  "Messor barbarus":           { p: 35000, a: 100000, poly: false, n: 40000, f: 40000 },
  "Messor structor":           { p: 45000, a: 100000, poly: true, pn: 10000, ps: 75000, n: 35000, f: 35000 },
  "Pheidole pallidula":        { p: 50000, a: 250000, poly: false, n: 25000, f: 50000 },
  "Plagiolepis pygmaea":       { p: 100000, a: 500000, poly: true, pn: 100000, ps: 300000, n: 12500, f: 12500, b: 0.02 },
  // --- Exotische Arten (Blatt "Ameisen", Zeile 30) ---
  "Acromyrmex spec.":          { p: 120000, a: 100000, poly: false, n: 55000, f: 45000, b: 0.4 },
  "Acromyrmex versicolor":     { p: 150000, a: 100000, poly: true, pn: 20000, ps: 80000, n: 55000, f: 45000, b: 0.4 },
  "Camponotus sericeus":       { p: 250000, a: 50000, poly: false, n: 30000, f: 30000 },
  "Camponotus substitutus":    { p: 80000, a: 80000, poly: false, n: 36000, f: 36000 },
  "Messor alexandri":          { p: 150000, a: 100000, poly: false, n: 40000, f: 40000 },
  "Myrmecia chrysogaster":     { p: 70000, a: 1000, poly: false, n: 300, f: 400 },
  "Myrmecia pavida":           { p: 50000, a: 1000, poly: false, n: 400, f: 500 },
  "Myrmecocystus mexicanus":   { p: 168000, a: 120000, poly: false, n: 36000, f: 60000, b: 0.25 },
  "Pheidologeton diversus":    { p: 130000, a: 100000, poly: true, pn: 25000, ps: 25000, n: 30000, f: 40000 },
  "Polyrhachis dives":         { p: 90000, a: 100000, poly: true, pn: 10000, ps: 75000, n: 30000, f: 50000, b: 0.25 },
  "Marsameise":                { p: 50000, a: 500, poly: false, n: 200, f: 200, b: 0.3 },
}
// Kapazität der Behausungen in Platzeinheiten, Quelle: Spielhilfe-Excel, Blatt
// "Ameisen". Schlüssel sind die Namen, wie das Spiel sie in der Übersicht
// ausgibt (vgl. sortStock()). Lookup klein geschrieben, weil der Bestand
// "YTong" und "Ytong" gemischt verwendet.
const nestCapacity = {
  "reagenzglas": 10, "kleines nest": 100, "mittleres nest": 500, "großes nest": 2500,
  "mittleres ytong nest": 15000, "großes ytong nest": 100000, "riesiges ytong nest": 200000
}
const formiCapacity = {
  "mini arena": 30, "kleines formicarium": 100, "mittleres formicarium": 500,
  "großes formicarium": 2500, "mittlere anlage": 15000, "große anlage": 100000,
  "riesige anlage": 200000
}

// Zustand der Futter-Warteschlange. Muss VOR der Init-Schleife unten stehen,
// weil updateFormiStatistic() schon beim Start darauf zugreift.
var foodQueue = [];
var foodQueueRunning = false;
var foodQueued = {};

// Einmalige Schema-Migration vor allen Features, damit der Versionsschlüssel
// auch gesetzt wird, wenn keine der neuen Optionen aktiv ist.
migrateHistorySchema();
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
  // Ein Schlüssel für Lesen und Schreiben, mit Server-Präfix: vorher wurde
  // eba_inv gelesen und eba_inventory geschrieben, der Cache griff also nie.
  var invKey = "eba_inventory_" + srvKey();
  var storedData = GM_getValue(invKey, "0\nx").split("\n", 2);
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
        GM_setValue(invKey, ""+hours+"\n"+eba_inv);
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
  // Preis-Cache pro Server: die Abfrage-URL ist serverlokal, der Schlüssel war
  // es nicht - wer zuerst lud, hat dem anderen Server seine Preise gezeigt.
  var priceKey = "eba_shop_prices_" + srvKey();
  var storedData = GM_getValue(priceKey, "0\nx").split("\n", 2);
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
        GM_setValue(priceKey, ""+hours+"\n"+rows);
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

// Nur die Subdomain speed.* ist der Speed-Server. Die frühere, unverankerte
// Prüfung hat jedes "speed" im Hostnamen erkannt (z.B. speedtest.eatenbyants.de).
function isSpeedServer() { return /^speed\./i.test(location.hostname); }
// Tick-Länge in Minuten: Normal = 60, Speed = 12
function getTickMinutes() { return isSpeedServer() ? 12 : 60; }
// GM-Werte gelten für alle Subdomains, daher eigener Präfix für den Speed-Server
function srvKey() { return isSpeedServer() ? "speed_" : ""; }
// Klartextname zu einem Server-Präfix, für Dialoge
function srvName(key) { return key === "speed_" ? "Speedserver" : "Normalserver"; }

// Zu welchem Server gehört ein gespeicherter Wert?
// Alle servergetrennten Schlüssel haben die Form "<bereich>" + srvKey() + "<rest>",
// der Server steckt also direkt hinter dem festen Bereichspräfix.
// Rückgabe: "" (Normalserver), "speed_" (Speedserver) oder null (gilt für beide).
function keyServer(k) {
  for (var i = 0; i < EBA_SRV_PREFIXES.length; i++) {
    var p = EBA_SRV_PREFIXES[i];
    if (k.indexOf(p) === 0) {
      return k.substr(p.length).indexOf("speed_") === 0 ? "speed_" : "";
    }
  }
  return null; // Optionen, Filter, Notizen, Bookmarks: bewusst für beide Server
}
// Gehört der Wert zum aktuellen Server (oder zu beiden)?
function isOwnServerKey(k) {
  var s = keyServer(k);
  return s === null || s === srvKey();
}

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
        var ms = Math.round(parseFloat(m[1].replace(",", ".")) * 1000);
        GM_setValue(k + "ms", ms);
        GM_setValue(k + "tick", tick);
        // Ticklänge zusätzlich historisieren: genau eine Messung pro Tick,
        // weil diese Funktion pro Tick nur einmal bis hierher kommt.
        if (GM_getValue("eba_enable_global_statistic", false)) {
          histAppend("tickdur", tick * getTickMinutes(), "" + ms, "ms");
        }
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
// Erweiterte Historisierung (Schema-Version 2)
//
// Speicherformat aller Zeitreihen (gleiches Muster wie die Formi-Historie):
//   Zeile 0  = Kopfzeile mit Metadaten, durch Tab getrennt
//   Zeile 1+ = eine Messung, Felder durch Tab getrennt, Feld 0 = Zeitschlüssel
// Vorteil gegenüber JSON-Objekten: keine wiederholten Schlüsselnamen, reines
// Anhängen ohne Umbau des gespeicherten Werts, direkt in Excel einfügbar.
//
// Zeitschlüssel:
//   eba_hist_*money/points/tickdur -> Tick-Beginn in Minuten seit Epoch (Serverzeit)
//   eba_hist_*foodsearch/antsearch -> Zeitpunkt der Erfassung in ms seit Epoch
//   eba_statistic_*                -> Stunden seit der Basis-Stunde aus Zeile 0
//   eba_food_*                     -> Tick-Beginn in Minuten seit Epoch
// ---------------------------------------------------------------------------

// Schlüssel einer Zeitreihe. Der Server-Präfix trennt Normal- und Speed-Server,
// weil GM-Werte für alle Subdomains gelten.
function histKey(name) { return "eba_hist_" + srvKey() + name; }

// Kopfzeile einer Zeitreihe: Schema, Name, Einheit, Ticklänge in Minuten
function histHead(name, unit) {
  return EBA_SCHEMA_VERSION + "\t" + name + "\t" + unit + "\t" + getTickMinutes();
}

// Messwert anhängen. Pro Zeitschlüssel landet nur ein Wert, geprüft an der
// letzten Zeile (gleiches Muster wie hasFoodSnapshot()). Gibt true zurück,
// wenn tatsächlich geschrieben wurde.
function histAppend(name, timeKey, fields, unit) {
  var key = histKey(name);
  var saved = GM_getValue(key, "");
  if (!saved) {
    saved = histHead(name, unit);
  } else {
    var last = saved.substr(saved.lastIndexOf("\n") + 1);
    var lastKey = parseFloat(last);
    // lastIndexOf liefert -1, solange nur die Kopfzeile da ist; dann ist das
    // erste Feld die Schema-Version und kleiner als jeder Zeitschlüssel.
    if (saved.indexOf("\n") >= 0 && !isNaN(lastKey) && lastKey >= timeKey) { return false; }
  }
  GM_setValue(key, compactHistory(saved + "\n" + timeKey + "\t" + fields));
  return true;
}

// Ausdünnen: Ist die Reihe zu lang, wird aus der ÄLTEREN Hälfte jede zweite
// Zeile entfernt. Kopfzeile und jüngere Hälfte bleiben unangetastet, damit die
// aktuelle Entwicklung in voller Auflösung erhalten bleibt. Nur aktiv, wenn der
// Nutzer die Kompaktierung eingeschaltet hat.
function compactHistory(data) {
  if (!GM_getValue("eba_enable_history_compaction", false)) { return data; }
  var lines = data.split("\n");
  if (lines.length <= EBA_HIST_MAX_LINES) { return data; }
  var half = 1 + Math.floor((lines.length - 1) / 2); // erste Zeile der jüngeren Hälfte
  var keep = [lines[0]];
  for (var i = 1; i < half; i++) {
    if ((i % 2) == 1) { keep.push(lines[i]); }
  }
  for (var j = half; j < lines.length; j++) { keep.push(lines[j]); }
  return keep.join("\n");
}

// Statusbox ohne eingeblendete Meldungen lesen. modifyGUI() verschiebt #message
// bzw. #error in die Statusbox; dort könnten ebenfalls Beträge stehen.
function statusText() {
  var box = $("div#status").clone();
  box.find("#message,#error,#headercountdown").remove();
  return box.text();
}
// Geldbestand in Cent (ganzzahlig und damit exakt), null wenn nicht gefunden
function readStatusMoney() {
  var m = /Geld:\s*([\d.]+)(?:,(\d{1,2}))?/.exec(statusText());
  if (!m) { return null; }
  var euro = parseInt(m[1].replace(/\./g, ""), 10);
  if (isNaN(euro)) { return null; }
  var cent = m[2] ? parseInt((m[2] + "0").substr(0, 2), 10) : 0;
  return euro * 100 + cent;
}
// Punktestand, null wenn nicht gefunden
function readStatusPoints() {
  var m = /Punkte:\s*([\d.]+)/.exec(statusText());
  if (!m) { return null; }
  var p = parseInt(m[1].replace(/\./g, ""), 10);
  return isNaN(p) ? null : p;
}

// Geld und Punkte je Tick festhalten. Läuft auf jeder Spielseite mit Statusbox,
// schreibt aber nur einmal pro Tick (kein Aufwand pro Rendering).
function updateGlobalStatistic() {
  if (!$("div#status").length) { return; }
  refreshTickDuration(); // historisiert die Ticklänge in seinem Callback
  var tk = getTickInfo();
  if (!tk.done) { return; } // Tick läuft noch, die Werte können sich noch ändern
  var timeKey = tk.nowTick / 60000;
  var money = readStatusMoney();
  if (money != null) { histAppend("money", timeKey, "" + money, "cent"); }
  var points = readStatusPoints();
  if (points != null) { histAppend("points", timeKey, "" + points, "punkte"); }
}

// ---------------------------------------------------------------------------
// Futter- und Ameisensuchen: Das Spiel zeigt nur die letzten Treffer (10).
// Bei jedem Seitenaufruf wird die angezeigte Tabelle mit der Historie
// verschmolzen, indem die längste Überlappung gesucht wird.
// ---------------------------------------------------------------------------

// Art der Suchseite anhand der Überschrift, sonst anhand einer Tabelle, die
// die Suche in der Kopfzeile nennt. Die Forschung nennt die Königinnensuche
// ebenfalls, hat aber eine andere Überschrift und keine passende Tabelle.
function searchPageKind() {
  var h = $("h3").text();
  if (/Futtersuche/i.test(h)) { return "foodsearch"; }
  if (/(Königinnensuche|Ameisensuche)/i.test(h)) { return "antsearch"; }
  // Forschung, Arbeitsamt und Aktionen listen die Suchen als Angebot auf,
  // enthalten aber keine Ergebnisse. Dort nie erfassen.
  if (/(Forschung|Arbeitsamt|Aktionen)/i.test(h)) { return null; }
  var found = null;
  $("table.liste").each(function() {
    var head = $(this).find("tr").first().text();
    if (/Futtersuche/i.test(head)) { found = "foodsearch"; return false; }
    if (/(Königinnensuche|Ameisensuche)/i.test(head)) { found = "antsearch"; return false; }
  });
  return found;
}

// Ergebnistabelle der Suche: die Liste mit den meisten Datenzeilen
function findSearchTable() {
  var best = null, bestRows = 0;
  $("table.liste").each(function() {
    var rows = $(this).find("tr").length;
    if (rows > bestRows) { bestRows = rows; best = $(this); }
  });
  return (bestRows >= 2) ? best : null;
}

// Zellen einer Zeile als Tab-getrennte Zeichenkette (Tabs/Umbrüche entschärft)
function rowCells(tr) {
  return $.map(tr.children("td,th").get(), function(td) {
    return $.trim($(td).text()).replace(/[\t\r\n]+/g, " ");
  }).join("\t");
}

// Zeitwert aus einer Zeile ziehen (Datum+Uhrzeit oder nur Uhrzeit), sonst null
function rowTimeValue(row) {
  var m = /(\d{1,2})\.(\d{1,2})\.(\d{2,4})(?:[\s,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/.exec(row);
  if (m) {
    var y = m[3].length == 2 ? 2000 + parseInt(m[3], 10) : parseInt(m[3], 10);
    return new Date(y, parseInt(m[2], 10) - 1, parseInt(m[1], 10),
                    parseInt(m[4] || "0", 10), parseInt(m[5] || "0", 10), parseInt(m[6] || "0", 10)).getTime();
  }
  var t = /(\d{1,2}):(\d{2}):(\d{2})/.exec(row);
  if (t) { return (parseInt(t[1], 10) * 3600 + parseInt(t[2], 10) * 60 + parseInt(t[3], 10)) * 1000; }
  return null;
}
// Läuft die Tabelle zeitlich aufwärts? Ohne erkennbare Zeitspalte wird die
// Anzeigereihenfolge übernommen.
function rowsAscending(rows) {
  var first = null, last = null;
  for (var i = 0; i < rows.length; i++) {
    var v = rowTimeValue(rows[i]);
    if (v == null) { continue; }
    if (first == null) { first = v; }
    last = v;
  }
  if (first == null || first === last) { return true; }
  return first <= last;
}

// Längste Überlappung zwischen dem Ende der Historie und dem Anfang der neu
// gelesenen Zeilen bestimmen und nur den Rest zurückgeben. Positionsbezogen,
// damit auch mehrere gleich aussehende Treffer hintereinander erhalten bleiben.
function mergeRollingRows(oldRows, newRows) {
  var max = Math.min(oldRows.length, newRows.length);
  for (var k = max; k > 0; k--) {
    var ok = true;
    for (var i = 0; i < k; i++) {
      if (oldRows[oldRows.length - k + i] !== newRows[i]) { ok = false; break; }
    }
    if (ok) { return newRows.slice(k); }
  }
  return newRows; // keine Überlappung: alles ist neu
}

function updateSearchStatistic() {
  var kind = searchPageKind();
  if (!kind) { return; }
  var tbl = findSearchTable();
  if (!tbl) { return; }
  var trs = tbl.find("tr");
  if (trs.length < 2) { return; }

  var header = rowCells(trs.eq(0));
  var rows = $.grep($.map(trs.slice(1).get(), function(tr) { return rowCells($(tr)); }), function(r) {
    return /[^\t\s]/.test(r);
  });
  if (!rows.length) { return; }
  if (!rowsAscending(rows)) { rows.reverse(); }

  var key = histKey(kind);
  var saved = GM_getValue(key, "");
  var lines = saved ? saved.split("\n") : [histHead(kind, "ms") + "\t" + header];
  // Nur Datenzeilen mit numerischem Zeitschlüssel vergleichen; "H"-Zeilen sind
  // Marker für eine geänderte Spaltenbelegung.
  var oldContent = [];
  for (var i = 1; i < lines.length; i++) {
    if (!/^\d/.test(lines[i])) { continue; }
    oldContent.push(lines[i].substr(lines[i].indexOf("\t") + 1));
  }
  var fresh = mergeRollingRows(oldContent, rows);

  // Spaltenbelegung geändert? Kopfzeile aktualisieren und den Wechsel als
  // Marker festhalten, damit ältere Zeilen weiterhin deutbar bleiben.
  var headFields = lines[0].split("\t");
  var oldHeader = headFields.slice(4).join("\t");
  if (oldHeader !== header) {
    lines[0] = histHead(kind, "ms") + "\t" + header;
    if (saved && oldContent.length) { lines.push("H\t" + header); }
  } else if (!fresh.length) {
    return;
  }

  var now = getServerNow(); // Erfassungszeitpunkt, für alle neuen Zeilen derselbe
  for (var j = 0; j < fresh.length; j++) { lines.push(now + "\t" + fresh[j]); }
  GM_setValue(key, compactHistory(lines.join("\n")));
}

// ---------------------------------------------------------------------------
// Migration auf die aktuelle Schema-Version
// ---------------------------------------------------------------------------

// Versionsschlüssel des Speicherschemas - pro Server, weil die Migration auf
// jedem Server einmal laufen muss. Ein globaler Schlüssel hätte den jeweils
// zweiten Server dauerhaft von allen Migrationen ausgeschlossen.
function schemaKey() { return "eba_schemaversion_" + srvKey(); }

// Die beiden Stützstellen des Punkte-Fensters von insertPointsDiff(), pro
// Server. Früher global - dadurch hat der eine Server die Punkte des anderen
// in seine Rate gerechnet. n ist 1 (ältere) oder 2 (jüngere Stützstelle).
function pointsWindowKey(n) { return "eba_points_" + srvKey() + n; }
function hoursWindowKey(n) { return "eba_hours_" + srvKey() + n; }

// Umschlüsselung von Werten, die früher global lagen, aber serverabhängig sind.
// Läuft vor jeder Schema-Migration und ist über die Existenz der Altschlüssel
// abgesichert, also beliebig oft wiederholbar.
function migrateServerKeys() {
  // 1) Punkte-/Stundenfenster von insertPointsDiff() (B2). Die Altwerte sind
  //    keinem Server zuzuordnen, deshalb gehen sie an den Normalserver; der
  //    Speedserver startet mit leerem Fenster.
  var pairs = [["eba_points1", "eba_points_1"], ["eba_points2", "eba_points_2"],
               ["eba_hours1", "eba_hours_1"], ["eba_hours2", "eba_hours_2"]];
  for (var i = 0; i < pairs.length; i++) {
    var old = GM_getValue(pairs[i][0], null);
    if (old === null) { continue; }
    if (GM_getValue(pairs[i][1], null) === null) { GM_setValue(pairs[i][1], old); }
    GM_deleteValue(pairs[i][0]);
  }

  // 2) Gemerkte Mengen/Preise aus den Kleinanzeigen (B7). Das alte Präfix
  //    eba_enable_* war irreführend, der Wert ist kein Optionsschalter.
  //    Der Unterstrich am Ende grenzt den Optionsschalter selbst aus.
  var oldPre = "eba_enable_shop_remember_prices_";
  $.each(GM_listValues(), function(j, k) {
    if (k.indexOf(oldPre) !== 0) { return; }
    var item = k.substr(oldPre.length);
    var dst = "eba_shop_remember_price_" + item; // Altwerte an den Normalserver
    if (GM_getValue(dst, null) === null) { GM_setValue(dst, GM_getValue(k, null)); }
    GM_deleteValue(k);
  });

  // 3) Reine Stundencaches (B4/B6): nicht zuordenbar und ohnehin nach einer
  //    Stunde wertlos, werden daher nur entfernt. Die neuen Schlüssel tragen
  //    srvKey(). eba_inv wurde nie geschrieben (Tippfehler), eba_inventory nie
  //    gelesen - beide sind damit kein Datenverlust.
  var stale = ["eba_inv", "eba_inventory", "eba_shop_prices"];
  for (var s = 0; s < stale.length; s++) {
    if (GM_getValue(stale[s], null) !== null) { GM_deleteValue(stale[s]); }
  }

  // 4) Versionsschlüssel (B1): der alte globale Wert wird für BEIDE Server
  //    übernommen. Weil nicht feststellbar ist, auf welchem Server die
  //    v2-Migration tatsächlich gelaufen ist, wird höchstens Version 1
  //    übernommen - die v2-Schritte prüfen selbst, ob ihre Zeitreihe schon
  //    existiert, laufen also gefahrlos erneut und holen den bisher
  //    übersprungenen Server nach.
  var legacyVer = GM_getValue("eba_schema_version", null);
  if (legacyVer !== null) {
    var v = parseInt(legacyVer, 10);
    if (isNaN(v) || v < 0) { v = 0; }
    if (v > 1) { v = 1; }
    var keys = ["eba_schemaversion_", "eba_schemaversion_speed_"];
    for (var n = 0; n < keys.length; n++) {
      if (GM_getValue(keys[n], null) === null) { GM_setValue(keys[n], v); }
    }
    GM_deleteValue("eba_schema_version");
  }
}

// Die Formi- und Futter-Historien werden NICHT angefasst: Schema 2 erweitert
// nur um neue Schlüssel. Zusätzlich werden die alten Einzelwerte aus
// eba_points_1/2 (Punkte je Epoch-Stunde) und eba_tickdur_* (eine Ticklänge)
// verlustfrei als Startpunkte in die neuen Zeitreihen übernommen.
function migrateHistorySchema() {
  migrateServerKeys(); // erst umschlüsseln, dann die Version auswerten
  var from = parseInt(GM_getValue(schemaKey(), 0), 10);
  if (isNaN(from)) { from = 0; }
  if (from >= EBA_SCHEMA_VERSION) { return; }

  if (from < 2) {
    // Punkte: die beiden gespeicherten Stützstellen von insertPointsDiff()
    if (!GM_getValue(histKey("points"), "")) {
      var seeds = [];
      // Der Seed stammt aus der PC-Uhr (Epoch-Stunden), die laufende Erfassung
      // aus der Server-Uhr (Tick-Beginn). Liegt ein Seed im aktuellen Tick oder
      // dahinter, würde histAppend() die erste echte Messung dieses Ticks
      // verwerfen - solche Stützstellen werden deshalb übersprungen (B11).
      var curTick = getTickInfo().nowTick / 60000;
      var add = function(h, p) {
        h = parseInt(h, 10); p = parseInt(p, 10);
        if (isNaN(h) || isNaN(p) || h <= 0 || p <= 0) { return; }
        if (h * 60 >= curTick) { return; }
        seeds.push([h * 60, p]);
      };
      add(GM_getValue(hoursWindowKey(1), 0), GM_getValue(pointsWindowKey(1), 0));
      add(GM_getValue(hoursWindowKey(2), 0), GM_getValue(pointsWindowKey(2), 0));
      var out = [histHead("points", "punkte")];
      var prev = -1;
      for (var i = 0; i < seeds.length; i++) {
        if (seeds[i][0] <= prev) { continue; }
        prev = seeds[i][0];
        out.push(seeds[i][0] + "\t" + seeds[i][1]);
      }
      if (out.length > 1) { GM_setValue(histKey("points"), out.join("\n")); }
    }
    // Ticklänge: der zuletzt gemessene Wert samt seines Ticks
    if (!GM_getValue(histKey("tickdur"), "")) {
      var tk = parseInt(GM_getValue("eba_tickdur_" + srvKey() + "tick", 0), 10);
      var ms = parseInt(GM_getValue("eba_tickdur_" + srvKey() + "ms", 0), 10);
      if (!isNaN(tk) && !isNaN(ms) && tk > 0 && ms > 0) {
        GM_setValue(histKey("tickdur"), histHead("tickdur", "ms") + "\n" + (tk * getTickMinutes()) + "\t" + ms);
      }
    }
  }
  GM_setValue(schemaKey(), EBA_SCHEMA_VERSION);
}

// ---------------------------------------------------------------------------
// Export und Import (JSON)
// ---------------------------------------------------------------------------

// Zeitreihen-Schlüssel: werden beim Import verschmolzen statt überschrieben
function isHistoryKey(k) {
  return k.indexOf("eba_hist_") === 0 || k.indexOf("eba_statistic_") === 0 || k.indexOf("eba_food_") === 0;
}

// Zwei zeilenbasierte Reihen mit absolutem Zeitschlüssel verschmelzen.
// hasHeader: Zeile 0 ist Kopfzeile (eba_hist_*) oder schon eine Datenzeile (eba_food_*).
// byContent: nach Inhalt statt nach ganzer Zeile entdoppeln (Suchen, deren
//            Erfassungszeitpunkt je Browser abweicht); dabei gewinnt der frühere Zeitpunkt.
function mergeSeries(a, b, hasHeader, byContent) {
  if (!a) { return b; }
  if (!b) { return a; }
  var la = a.split("\n"), lb = b.split("\n");
  var start = hasHeader ? 1 : 0;
  var seen = {}, data = [];
  var collect = function(lines) {
    for (var i = start; i < lines.length; i++) {
      var line = lines[i];
      if (!line) { continue; }
      var t = parseFloat(line);
      var content = line.substr(line.indexOf("\t") + 1);
      var id = byContent ? content : line;
      if (typeof seen[id] !== "undefined") {
        if (byContent && !isNaN(t) && t < data[seen[id]][0]) { data[seen[id]][0] = t; }
        continue;
      }
      seen[id] = data.length;
      data.push([isNaN(t) ? null : t, content, line]);
    }
  };
  collect(la); collect(lb);
  // Zeilen ohne Zeitschlüssel (z.B. "H"-Marker) bleiben an ihrer Stelle
  data.sort(function(x, y) {
    if (x[0] == null || y[0] == null) { return 0; }
    return x[0] - y[0];
  });
  var res = hasHeader ? [la[0]] : [];
  for (var i = 0; i < data.length; i++) {
    res.push(data[i][0] == null ? data[i][2] : (data[i][0] + "\t" + data[i][1]));
  }
  return res.join("\n");
}

// Formi-Historien speichern die Zeit relativ zur Basis-Stunde aus Zeile 0.
// Beim Verschmelzen werden daher beide Seiten auf die kleinere Basis-Stunde
// umgerechnet, damit die Zeitstempel zueinander passen und positiv bleiben.
function mergeFormiHistory(a, b) {
  if (!a) { return b; }
  if (!b) { return a; }
  var la = a.split("\n"), lb = b.split("\n");
  var ba = parseInt(la[0], 10), bb = parseInt(lb[0], 10);
  if (isNaN(ba) || isNaN(bb)) { return a; } // unerwartetes Format: lokale Daten behalten
  var base = Math.min(ba, bb);
  var shift = function(lines, oldBase) {
    var out = [], d = oldBase - base;
    for (var i = 1; i < lines.length; i++) {
      var el = parseFloat(lines[i]);
      var tab = lines[i].indexOf("\t");
      if (isNaN(el) || tab < 0) { continue; }
      out.push([Math.round((el + d) * 100) / 100, lines[i].substr(tab + 1)]);
    }
    return out;
  };
  var all = shift(la, ba).concat(shift(lb, bb));
  all.sort(function(x, y) { return x[0] - y[0]; });
  var res = [base === ba ? la[0] : lb[0]];
  var lastTime = null, seen = {};
  for (var i = 0; i < all.length; i++) {
    var line = all[i][0] + "\t" + all[i][1];
    if (seen[line] || all[i][0] === lastTime) { continue; } // Duplikat bzw. gleicher Tick
    seen[line] = true;
    lastTime = all[i][0];
    res.push(line);
  }
  return res.join("\n");
}

// Alle openEBA-Werte als JSON ausgeben. Ohne Argument ein Voll-Backup über
// beide Server; mit onlyThisServer=true nur die Werte des aktuellen Servers
// plus die für beide geltenden Optionen, Filter und Notizen.
// Das Feld "onlyServer" hält fest, ob gefiltert wurde; der Import weist darauf
// hin, wenn ein so gefilterter Export auf dem falschen Server landet.
function exportHistoryJSON(onlyThisServer) {
  var out = {
    format: "openEBA-history",
    schema: EBA_SCHEMA_VERSION,
    exported: new Date().getTime(),
    server: srvKey(),
    onlyServer: !!onlyThisServer,
    values: {}
  };
  $.each(GM_listValues(), function(i, k) {
    if (k.indexOf("eba_") !== 0) { return; }
    if (onlyThisServer && !isOwnServerKey(k)) { return; } // Filtermuster wie in ebaFormiIds()
    out.values[k] = GM_getValue(k, null);
  });
  return JSON.stringify(out);
}

// JSON einlesen. Zeitreihen werden mit den vorhandenen Daten verschmolzen,
// alle anderen Werte (Optionen, Filter, Notizen) ersetzt.
function importHistoryJSON(text) {
  var data = JSON.parse(text);
  if (!data || data.format !== "openEBA-history" || !data.values) {
    throw new Error("Unbekanntes Format");
  }
  // Der Export notiert, von welchem Server er stammt. Passt das nicht zum
  // aktuellen Server, wird nachgefragt. Die Reihen vermischen sich dabei nicht
  // (verschmolzen wird schlüsseltreu), aber ein Export des einen Servers auf
  // dem anderen einzuspielen ist fast immer ein Versehen.
  if (typeof data.server === "string" && data.server !== srvKey()) {
    if (!window.confirm("Dieser Export stammt vom " + srvName(data.server)
      + ", du bist aber auf dem " + srvName(srvKey()) + " (" + location.hostname + ").\n\n"
      + "Die Zeitreihen werden schlüsseltreu verschmolzen, vermischen sich also nicht: "
      + "die Daten des " + srvName(data.server) + " landen in dessen Schlüsseln.\n\n"
      + (data.onlyServer
          ? "Der Export wurde auf den " + srvName(data.server) + " eingeschränkt, "
            + "enthält also KEINE Daten für " + srvName(srvKey()) + ".\n\n"
          : "")
      + "Achtung: Optionen, Filter, Bookmarks und Notizen gelten für beide Server "
      + "und werden ersetzt.\n\nTrotzdem importieren?")) {
      return "Import abgebrochen (Export vom " + srvName(data.server) + ")";
    }
  }
  var merged = 0, replaced = 0;
  $.each(data.values, function(k, v) {
    if (k.indexOf("eba_") !== 0) { return; }
    // Versionsschlüssel beschreiben den Zustand des LOKALEN Speichers, nicht
    // die Daten. Würden sie übernommen, gälte eine fremde Migration hier als
    // erledigt. Sie werden unten von migrateHistorySchema() gesetzt.
    if (k === "eba_schema_version" || k.indexOf("eba_schemaversion_") === 0) { return; }
    if (isHistoryKey(k) && typeof v === "string") {
      var mine = GM_getValue(k, "");
      var res;
      if (k.indexOf("eba_statistic_") === 0) {
        res = mergeFormiHistory(mine, v);
      } else if (k.indexOf("eba_food_") === 0) {
        res = mergeSeries(mine, v, false, false);
      } else if (/_(foodsearch|antsearch)$/.test(k)) {
        res = mergeSeries(mine, v, true, true);
      } else {
        res = mergeSeries(mine, v, true, false);
      }
      GM_setValue(k, res);
      merged++;
    } else {
      GM_setValue(k, v);
      replaced++;
    }
  });
  // Bisher wurde hier blind die aktuelle Version gestempelt - ein Export aus
  // Schema 1 wäre danach nie migriert worden. Stattdessen wird die lokale
  // Version auf den Stand der Importdaten zurückgesetzt (nur nach unten) und
  // die Migration regulär angestoßen.
  var incoming = parseInt(data.schema, 10);
  if (!isNaN(incoming) && incoming < EBA_SCHEMA_VERSION) { GM_setValue(schemaKey(), incoming); }
  migrateHistorySchema();
  return merged + " Zeitreihen verschmolzen, " + replaced + " Werte ersetzt";
}

// Speicherverbrauch der openEBA-Daten (Zeichen), für die Anzeige in der Konfiguration
function historyStorageInfo() {
  var info = {chars: 0, series: 0, lines: 0};
  $.each(GM_listValues(), function(i, k) {
    if (k.indexOf("eba_") !== 0) { return; }
    var v = GM_getValue(k, "");
    var s = (typeof v === "string") ? v : "" + v;
    info.chars += s.length + k.length;
    if (isHistoryKey(k) && typeof v === "string" && v.length) {
      info.series++;
      info.lines += v.split("\n").length;
    }
  });
  return info;
}

// ---------------------------------------------------------------------------
// Lese-Zugriff für Auswertungen (z.B. eine Graphen-Ansicht)
// Alle Zeitstempel sind Millisekunden seit Epoch.
// ---------------------------------------------------------------------------

// Globale Zeitreihe: metric = "money" (Cent) | "points" | "tickdur" (ms)
// Rückgabe: [[tMs, wert], ...] chronologisch aufsteigend
function ebaGlobalSeries(metric) {
  var out = [];
  var saved = GM_getValue(histKey(metric), "");
  if (!saved) { return out; }
  var lines = saved.split("\n");
  for (var i = 1; i < lines.length; i++) {
    var f = lines[i].split("\t");
    var t = parseFloat(f[0]), v = parseFloat(f[1]);
    if (isNaN(t) || isNaN(v)) { continue; }
    out.push([t * 60000, v]);
  }
  return out;
}

// IDs aller Formicarien mit Historie auf dem aktuellen Server
function ebaFormiIds() {
  var pre = "eba_statistic_" + srvKey();
  var out = [];
  $.each(GM_listValues(), function(i, k) {
    if (k.indexOf(pre) !== 0) { return; }
    var rest = k.substr(pre.length);
    if (/^\d+$/.test(rest)) { out.push(rest); } // filtert auf dem Normalserver die speed_-Schlüssel
  });
  return out;
}

// Art des Formicariums aus der Kopfzeile der Historie
function ebaFormiKind(id) {
  var saved = GM_getValue("eba_statistic_" + srvKey() + id, "");
  if (!saved) { return ""; }
  var head = saved.substring(0, saved.indexOf("\n") < 0 ? saved.length : saved.indexOf("\n")).split("\t");
  return head[1] || "";
}

// Vollständige Formi-Historie als Objekte:
// [{t, queens, ants, eggs, larvae, cocoons, points, nest, formicarium, sugar, protein, time}]
// sugar/protein sind Prozentwerte (Zahl), nest/formicarium/time sind Texte.
function ebaFormiRows(id) {
  var out = [];
  var saved = GM_getValue("eba_statistic_" + srvKey() + id, "");
  if (!saved) { return out; }
  var lines = saved.split("\n");
  var baseHour = parseInt(lines[0], 10);
  if (isNaN(baseHour)) { return out; }
  var num = function(s) {
    if (s == null) { return null; }
    var v = parseFloat(("" + s).replace(",", "."));
    return isNaN(v) ? null : v;
  };
  for (var i = 1; i < lines.length; i++) {
    var f = lines[i].split("\t");
    var el = parseFloat(f[0]);
    if (isNaN(el)) { continue; }
    out.push({
      t: Math.round((baseHour + el) * 3600000),
      elapsed: el,
      queens: num(f[1]), ants: num(f[2]), eggs: num(f[3]), larvae: num(f[4]),
      cocoons: num(f[5]), points: num(f[6]),
      nest: f[7] || "", formicarium: f[8] || "",
      sugar: num(f[9]), protein: num(f[10]),
      time: f[11] || ""
    });
  }
  return out;
}

// Einzelne Zahlenreihe eines Formicariums.
// field = "queens"|"ants"|"eggs"|"larvae"|"cocoons"|"points"|"sugar"|"protein"
// Rückgabe: [[tMs, wert], ...]
function ebaFormiSeries(id, field) {
  var out = [];
  $.each(ebaFormiRows(id), function(i, r) {
    if (r[field] != null && typeof r[field] === "number") { out.push([r.t, r[field]]); }
  });
  return out;
}

// Futter-Snapshots eines Formicariums:
// [{t, servertime, raw, entries:[{name, gram, cond}]}]
function ebaFoodSeries(id) {
  var out = [];
  var saved = GM_getValue("eba_food_" + srvKey() + id, "");
  if (!saved) { return out; }
  $.each(saved.split("\n"), function(i, line) {
    if (!line) { return; }
    var f = line.split("\t");
    var t = parseFloat(f[0]);
    if (isNaN(t)) { return; }
    var entries = [];
    if (f[2] && f[2] !== "leer") {
      $.each(f[2].split(" | "), function(j, e) {
        var m = /^(.*)\s([\d.,]+)g\s(.*)$/.exec(e);
        if (m) {
          entries.push({name: $.trim(m[1]), gram: parseFloat(m[2].replace(",", ".")), cond: $.trim(m[3])});
        } else {
          entries.push({name: e, gram: null, cond: ""});
        }
      });
    }
    out.push({t: t * 60000, servertime: f[1] || "", raw: f[2] || "", entries: entries});
  });
  return out;
}

// Suchen-Historie: kind = "foodsearch" | "antsearch"
// Rückgabe: {header: [Spaltennamen], rows: [{t, cells:[...]}]}
// t ist der Erfassungszeitpunkt (ms). Steht in den Zellen ein eigenes Datum,
// ist dieses genauer - siehe Spaltennamen in header.
function ebaSearchSeries(kind) {
  var res = {header: [], rows: []};
  var saved = GM_getValue(histKey(kind), "");
  if (!saved) { return res; }
  var lines = saved.split("\n");
  res.header = lines[0].split("\t").slice(4);
  for (var i = 1; i < lines.length; i++) {
    var line = lines[i];
    if (!line) { continue; }
    if (line.indexOf("H\t") === 0) { // Spaltenwechsel ab hier
      res.header = line.split("\t").slice(1);
      continue;
    }
    var t = parseFloat(line);
    if (isNaN(t)) { continue; }
    res.rows.push({t: t, cells: line.split("\t").slice(1)});
  }
  return res;
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
// Schlüssel der gemerkten Menge/Preis-Vorgabe eines Artikels. Mit Server-Präfix,
// weil der Spielermarkt je Server andere Spieler und Preise hat. Das frühere
// Präfix eba_enable_* war irreführend - es ist kein Optionsschalter.
function shopPriceKey(item) { return "eba_shop_remember_price_" + srvKey() + item; }
function rememberShopPrices() {
  if (!$("center > b:contains('Kleinanzeigen')").length){return}
  //remember price
  $("#shopitem form").on("submit", function(e){
    var text = $("#shopitem option:selected").text();
    text = text.substring(0, text.indexOf(" ("));
    var amount = $("#shopitem input[name='amount']").val();
    var price = $("#shopitem input[name='price_cent']").val().replace(",", ".");
    GM_setValue(shopPriceKey(text), amount+"|"+price);
  });
  //use price
  $("#shopitem select").on("change", function(e){
    var text = $("#shopitem option:selected").text();
    text = text.substring(0, text.indexOf(" ("));
    var values = GM_getValue(shopPriceKey(text), "1|1.00").split("|");
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
    // Mit Server-Präfix: die Auswahllisten unterscheiden sich je Server.
    var key = "eba_saved_state_"+srvKey()+select.attr("name")+"_"+index;
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
  // Das Fenster liegt pro Server, sonst schiebt der Speedserver seine Punkte
  // in die Reihe des Normalservers und die Rate wird absurd (B2).
  var oldPoints1 = GM_getValue(pointsWindowKey(1), 0);
  var oldPoints2 = GM_getValue(pointsWindowKey(2), 0);
  var oldHours1 = GM_getValue(hoursWindowKey(1), 0);
  var oldHours2 = GM_getValue(hoursWindowKey(2), 0);

  if (hours>oldHours2) {
    //save new values and shift
    oldPoints1 = oldPoints2; GM_setValue(pointsWindowKey(1), oldPoints1);
    oldPoints2 = currentPoints; GM_setValue(pointsWindowKey(2), oldPoints2);
    oldHours1 = oldHours2; GM_setValue(hoursWindowKey(1), oldHours1);
    oldHours2 = hours; GM_setValue(hoursWindowKey(2), oldHours2);
  }
  var hourDiff = oldHours2 - oldHours1;
  var pointsDiff = oldPoints2 - oldPoints1;
  // Ohne zwei brauchbare Stützstellen gibt es keine Rate: hourDiff==0 ergäbe
  // Infinity, ein noch leeres Fenster (oldHours1==0) eine absurd kleine Rate.
  var title = (oldHours1 > 0 && hourDiff > 0) ? "+" + (pointsDiff / hourDiff).toFixed(1) : "+?";
  $("div#status img").attr("title", title);
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
// Gespeicherte Werte löschen. onlyThisServer=true entfernt nur die Werte, die
// den Präfix des aktuellen Servers tragen; Optionen, Filter und Notizen bleiben
// stehen, weil sie bewusst für beide Server gelten.
function resetStoredValues(onlyThisServer) {
  var removed = 0;
  $.each(GM_listValues(), function(i, k) {
    if (onlyThisServer && keyServer(k) !== srvKey()) { return; }
    GM_deleteValue(k);
    removed++;
  });
  return removed;
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
    // Datensicherung/Umzug: Export erzeugt JSON, Import verschmilzt Zeitreihen
    configHTML += "<br>Daten-Export/Import (JSON)<br><textarea id='eba_io' style='height:100px;width:90%'></textarea>";
    configHTML += "<div><button id='eba_io_export' type='button'>Exportieren</button> ";
    configHTML += "<button id='eba_io_import' type='button'>Importieren</button> ";
    configHTML += "<label><input type='checkbox' id='eba_io_only_srv'>nur dieser Server</label> ";
    configHTML += "<span id='eba_io_info'></span></div>";
    configHTML += "<div id='eba_io_usage' style='font-size:0.9em'></div>";
    configHTML += "<div style='text-align:right;'><button id='eba_config_reset_srv' type='button'>Nur die Daten dieses Servers l&ouml;schen</button> ";
    configHTML += "<button id='eba_config_reset' type='button'>Alle gespeicherten Daten l&ouml;schen</button></div>";
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
    //Export/Import und Speicherverbrauch
    var showUsage = function() {
      var u = historyStorageInfo();
      $("#eba_io_usage").text("Gespeichert: " + Math.round(u.chars / 1024) + " kB in "
        + u.series + " Zeitreihen mit " + u.lines + " Messzeilen (beide Server, Schema "
        + GM_getValue(schemaKey(), 0) + ", Grenze je Reihe " + EBA_HIST_MAX_LINES + " Zeilen).");
    };
    showUsage();
    $("#eba_io_export").on("click", function(e) {
      // Standard ist das Voll-Backup über beide Server; der Haken schränkt auf
      // den aktuellen Server ein (Optionen und Filter sind immer dabei).
      var only = $("#eba_io_only_srv").prop("checked");
      $("#eba_io").val(exportHistoryJSON(only)).select();
      $("#eba_io_info").text(only
        ? "Exportiert: nur " + srvName(srvKey()) + " - jetzt kopieren."
        : "Exportiert: beide Server - jetzt kopieren.");
    });
    $("#eba_io_import").on("click", function(e) {
      if (!window.confirm("Import: Zeitreihen werden mit den vorhandenen Daten verschmolzen, Optionen und Filter werden ersetzt. Fortfahren?")) { return; }
      try {
        $("#eba_io_info").text(importHistoryJSON($("#eba_io").val()));
        showUsage();
      } catch (err) {
        $("#eba_io_info").text("Fehler: " + err.message);
      }
    });
    //Reset: beide Varianten fragen vorher nach, weil hier Monate an Historie hängen
    $("#eba_config_reset").on("click", function(e) {
      if (!window.confirm("ALLE gespeicherten openEBA-Daten werden unwiderruflich gelöscht - "
        + "und zwar für BEIDE Server (Normalserver UND Speedserver), weil der Speicher "
        + "für alle eatenbyants.de-Adressen derselbe ist.\n\n"
        + "Betroffen sind sämtliche Historien (Formicarien, Futter, Geld, Punkte, "
        + "Ticklänge, Suchen) sowie alle Optionen, Filter, Bookmarks und Notizen.\n\n"
        + "Tipp: Vorher exportieren. Für nur einen Server gibt es den Knopf links daneben.\n\n"
        + "Wirklich alles löschen?")) { return; }
      resetStoredValues(false);
      window.location.href = window.location.href.replace(/\?.*/, '');
    });
    $("#eba_config_reset_srv").on("click", function(e) {
      if (!window.confirm("Es werden nur die Daten des aktuellen Servers ("
        + srvName(srvKey()) + ", " + location.hostname + ") gelöscht: dessen Historien "
        + "für Formicarien, Futter, Geld, Punkte, Ticklänge und Suchen.\n\n"
        + "Der andere Server behält seine Historie. Optionen, Filter, Bookmarks und "
        + "Notizen bleiben ebenfalls erhalten, weil sie für beide Server gelten.\n\n"
        + "Wirklich die Daten von " + srvName(srvKey()) + " löschen?")) { return; }
      resetStoredValues(true);
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

// ---------------------------------------------------------------------------
// Maximal erreichbare Punktzahl je Formicarium
//
// Belegt ist: Punkte sind linear in der Arbeiterinnenzahl. In der
// Spielhilfe-Excel steht in Spalte B die Formel PRODUCT(C,P), also
// Punkte = Arbeiterinnen * Pt/Arbeiterin. Daraus folgt für eine Kolonie mit
// mehr Arbeiterinnen als dem Einzelköniginnen-Maximum:
//   Punkte = Math.round(Arbeiterinnen * p / a)
// Beide Operanden sind Ganzzahlen aus dem Blatt, deshalb genau diese Form und
// nicht arbeiterinnen * (p/a) -- sonst schlägt die Gleitkomma-Ungenauigkeit
// der Division durch.
//
// ANNAHME (nicht belegt): bei polygynen Arten wächst das Maximum um
// (Königinnen - 1) * Zuwachs. Die Spalten G/H der Spielhilfe sind Literale
// ohne Formel, und der dort als Referenz verlinkte Polygynierechner ist
// gelöscht. Für monogyne Arten und für genau eine Königin ist die Zahl
// dagegen belegt. Darum legt der Tooltip die Rechnung offen und zeigt
// zusätzlich die am laufenden Spiel gemessenen Punkte je Arbeiterin -- weil
// die Punkte linear sind, muss gemessen ~ Tabelle gelten. Das ist der Ersatz
// für den gelöschten Rechner. Ein geratener Zuwachs wird nie verwendet: ist
// er in der Spielhilfe unbekannt ("???"), erscheint ab zwei Königinnen ein
// Fragezeichen statt einer Zahl.
// ---------------------------------------------------------------------------

// Normalform eines Artnamens für den Fallback-Vergleich: klein geschrieben,
// Rand-Leerraum weg, Mehrfach-Leerraum zu einem Leerzeichen.
function ebaAntmaxNorm(s) {
  return ("" + s).replace(/^\s+|\s+$/g, "").toLowerCase().replace(/\s+/g, " ");
}

// Einmalig gebauter Index über die Normalformen. null = noch nicht gebaut.
var ebaAntmaxIndex = null;

// Eintrag aus antmax zu einem Artnamen aus dem DOM. Zuerst exakt (nur
// getrimmt), dann über die Normalform. Unbekannte Art -> null.
function ebaAntmaxLookup(kind) {
  if (typeof kind != "string") { return null; }
  var name = kind.replace(/^\s+|\s+$/g, "");
  if (Object.prototype.hasOwnProperty.call(antmax, name)) { return antmax[name]; }
  if (ebaAntmaxIndex == null) {
    ebaAntmaxIndex = {};
    for (var k in antmax) {
      if (Object.prototype.hasOwnProperty.call(antmax, k)) { ebaAntmaxIndex[ebaAntmaxNorm(k)] = antmax[k]; }
    }
  }
  var norm = ebaAntmaxNorm(name);
  if (Object.prototype.hasOwnProperty.call(ebaAntmaxIndex, norm)) { return ebaAntmaxIndex[norm]; }
  return null;
}

// Maximum einer Kolonie. speed ist bewusst ein Parameter und nicht intern
// isSpeedServer(), damit die Funktion ohne DOM und ohne location testbar ist.
// Rückgabe:
//   null                               Art nicht in antmax
//   {points, ants, poly, queens, grow, ratio, base, unknown}
//   points/ants == null bei unknown == true (unbekannter polygyner Zuwachs)
function ebaMaxPoints(kind, queens, speed) {
  var e = ebaAntmaxLookup(kind);
  if (!e) { return null; }
  var q = (isFinite(queens) && queens >= 1) ? Math.floor(queens) : 1;
  var ratio = e.p / e.a;
  // monogyn: harter Wert, weitere Königinnen ändern nichts
  if (!e.poly) {
    return { points: e.p, ants: e.a, poly: false, queens: q, grow: 0, ratio: ratio, base: e.a, unknown: false };
  }
  var z = speed ? e.ps : e.pn;
  if (z == null) {
    // Zuwachs in der Spielhilfe unbekannt ("???"). Bei genau einer Königin
    // ist das Maximum davon unabhängig und bleibt belegt.
    if (q > 1) {
      return { points: null, ants: null, poly: true, queens: q, grow: null, ratio: ratio, base: e.a, unknown: true };
    }
    return { points: e.p, ants: e.a, poly: true, queens: 1, grow: null, ratio: ratio, base: e.a, unknown: false };
  }
  var ants = e.a + (q - 1) * z;
  return { points: Math.round(ants * e.p / e.a), ants: ants, poly: true, queens: q,
           grow: z, ratio: ratio, base: e.a, unknown: false };
}

// Tausenderpunkte, gleiches Idiom wie im Bestand (statBeautify/insertPointsDiff).
function ebaFmtInt(n) {
  return String(n).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
}

// Dezimalzahl mit deutschem Komma, auf digits Stellen gerundet, ohne
// überflüssige Nullen.
function ebaFmtDec(x, digits) {
  var f = Math.pow(10, digits);
  return ("" + (Math.round(x * f) / f)).replace(".", ",");
}

// Hinter den Punkten jedes Formicariums das Maximum anzeigen: "12.340 / 50.000".
// Die Prozentzahl steht absichtlich NICHT in der Spalte (zu schmal), sondern im
// Tooltip des eigenen <span>. Das Tooltip hängt am <span> und nicht am <td>,
// weil updateFormiStatistic() auf dem <td> schon die Punkte-Entwicklung pro
// Stunde als title setzt -- beide müssen nutzbar bleiben. Die eigene Punktzahl
// wird nicht umformatiert, damit parseInt(cells.eq(6).text()) dort unabhängig
// von der Reihenfolge der Features weiter funktioniert.
function showMaxPoints() {
  if (!$("h3:contains('Deine Formicarien')").length) { return; }
  try {
    var speed = isSpeedServer();
    var srv = speed ? "Speedserver" : "Normalserver";
    $("div[id='shopitem']:contains('Larven')").each(function(i, el) {
      try {
        var div = $(this);
        if (div.find("span.eba_maxpt").length) { return; } // schon angezeigt
        // Zellen genau wie in updateFormiStatistic() lesen:
        // 0 Königinnen, 1 Arbeiterinnen, 2 Eier, 3 Larven, 4 Puppen,
        // 5 Art, 6 Punkte, 7 Nest, 8 Formicarium, 9/10 Hunger
        var cells = div.find("table.liste td").add(div.find("div[id='group'] table.inner td")).filter(":odd");
        var kind = ("" + cells.eq(5).text()).replace(/^\s+|\s+$/g, "");
        var qRaw = parseInt(("" + cells.eq(0).text()).replace(/\./g, ""), 10);
        var max = ebaMaxPoints(kind, qRaw, speed);
        if (!max) { return; } // Art nicht in antmax -> gar nichts anzeigen
        var ants = parseInt(("" + cells.eq(1).text()).replace(/\./g, ""), 10);
        var points = parseInt(("" + cells.eq(6).text()).replace(/\./g, ""), 10);

        var tip = [];
        if (max.unknown) {
          tip.push("Polygyner Zuwachs für " + kind + " auf dem " + srv
                 + " ist in der Spielhilfe nicht bekannt (???).");
        } else {
          tip.push("max. " + ebaFmtInt(max.points) + " Punkte bei " + ebaFmtInt(max.ants) + " Arbeiterinnen");
          if (!max.poly) {
            tip.push("monogyn: " + ebaFmtInt(max.base) + " Arbeiterinnen, von der Königinnenzahl unabhängig");
          } else if (max.grow == null) {
            tip.push("1 Königin, polygyn. Der polygyne Zuwachs ist auf dem " + srv
                   + " in der Spielhilfe nicht bekannt (???), ab 2 Königinnen ist daher keine Rechnung möglich.");
          } else if (max.queens > 1) {
            tip.push(max.queens + " Königinnen, polygyn, " + srv + ": " + ebaFmtInt(max.base)
                   + " + " + (max.queens - 1) + " × " + ebaFmtInt(max.grow));
          } else {
            tip.push("1 Königin, polygyn, " + srv + ": je weitere Königin + "
                   + ebaFmtInt(max.grow) + " Arbeiterinnen");
          }
        }
        if (max.poly && !(isFinite(qRaw) && qRaw >= 1)) {
          tip.push("Königinnenzahl unklar, gerechnet mit 1");
        }
        // Laufende Selbstprüfung des Modells am lebenden Spiel: weil die
        // Punkte linear sind, muss punkte/arbeiterinnen ~ p/a gelten.
        var probe = [];
        if (!max.unknown && isFinite(points) && max.points > 0) {
          probe.push("aktuell " + ebaFmtDec(points / max.points * 100, 1) + " %");
        }
        if (isFinite(points) && isFinite(ants) && ants > 0) {
          probe.push("gemessen " + ebaFmtDec(points / ants, 3) + " Pt/Arbeiterin (Tabelle "
                   + ebaFmtDec(max.ratio, 3) + ")");
        }
        if (probe.length) { tip.push(probe.join("  ·  ")); }

        // In das letzte Element-Kind der Punkte-Zelle hängen (meist <center>),
        // aber nur wenn es genau eines ist -- sonst in die Zelle selbst, damit
        // das <span> nicht in einem <img>/<a> landet.
        var td = cells.eq(6);
        var kids = td.children();
        var host = (kids.length == 1) ? kids.last() : td;
        host.append(" <span class='eba_maxpt' style='color:#808080'>/ "
                  + (max.unknown ? "?" : ebaFmtInt(max.points)) + "</span>");
        // title per attr() statt inline, damit der Artname aus dem DOM nicht
        // escaped werden muss.
        div.find("span.eba_maxpt").last().attr("title", tip.join("\n"));
      } catch (err) {}
    });
  } catch (err) {}
}
