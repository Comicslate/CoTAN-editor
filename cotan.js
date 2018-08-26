// ver. 23-08-16 02:10
var $lang = NS.split(':', 2)[0]; // для языковых вставок
var $wiki_text, // будущая ссылка на доку-редактор #wiki__text
$ctnote, // все наклейки
$cotan, // будущая ссылка на котан-редактор
$cotan_on = false, // показан ли он изначально?
$cotan_areas = new Array(); // массив полей на случай нескольких картинок на странице

var $cotan_preg_cotan = '\\{\\{( ?)(aimg|cotan)>:?(.+?\\.(jpg|png|jpeg|bmp|gif|svg))( ?)\\}\\}([\\w\\W]*?)\\{\\{<(aimg|cotan)\\}\\}'; // распознавалка наклеек
var $cotan_preg_img = '\\{\\{( ?):?(.+?\\.(jpg|png|jpeg|bmp|gif|svg))( ?)\\}\\}'; // распознавалка картинки
var $cotan_preg = '(' + $cotan_preg_cotan + '|' + $cotan_preg_img + ')'; // совмещение распознавалок

// поиск текста в доку-редакторе для всех 3 возможных вариантов
var $cotan_preg_img_target = '\\{\\{ ?%FILE% ?\\}\\}';
var $cotan_preg_aimg_target = '\\{ ?\\{aimg>%FILE%\\}\\ ?}([\\w\\W]*?)\\{\\{<aimg\\}\\}';
var $cotan_preg_cotan_target = '\\{ ?\\{cotan>%FILE%\\}\\ ?}([\\w\\W]*?)\\{\\{<cotan\\}\\}';

var $cotan_media = document.location.href.match(/^(https?:\/\/.+?)\//i); // адрес до первого слеша
if ($cotan_media) { // если нашёлся
 $cotan_media = $cotan_media[1] + '/_media/'; // дописываем /_media/
} else { // если не нашёлся (главная страница)
 $cotan_media = ''; // оставляем как есть
}

var $colpat_preg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})?$/; // цветовая метка

function cotanedit() { // эта функция действует после загрузки страницы и добавляет котан-редактор и кнопку его запуска
 if ($cotan_media == '') return; // уходим, если это главная страница
 
 // ищем область кнопок $target
 $wiki_text = document.getElementById('wiki__text'); // получаем и сохраняем ссылку на доку-редактор #wiki__text
 if (!$wiki_text) return; // уходим, если нет доку-редактора
 var $target = document.getElementById('edbtn__save'); // ищем доку-кнопку сохранения
 if (!$target) return; // уходим, если это доку-редактор без кнопки сохранения (?) допустим
 $target = $target.parentNode; // получаем область кнопок
 if (!$target) return; // уходим, если это доку-редактор с кнопкой сохранения, но без области кнопок (?) бред

 var $button, $temp; // объявляем локальные переменные
 $button = document.createElement('input'); // создаём кнопку CoTAN
 $button.type = 'button';
 $button.accessKey = 'c';
 $button.value = 'CoTAN';
 $button.id = 'cotanbutton';
 $button.title = 'CoTAN [C]';
 $button.onclick = cotan_toggle; // функция показа/скрытия котан-редактора
 $target.appendChild($button);

 $cotan = document.createElement('div'); // создаём область котан-редактора
 $cotan.className = 'cotan';
 $cotan.style.display = 'none'; // сначала скрыта

 $button = document.createElement('button'); // создаём кнопку сохранения для котан-редактора
 $button.className = 'button green toolbutton';
 $button.accessKey = "g";
 var $apps = {
 'ady': 'Къэгъэсэбэпын',
 'be': 'Ўжываць',
 'bg': 'Приложи',
 'da': 'Anvende',
 'de': 'Anwenden',
 'en': 'Apply',
 'eo': 'Apliki',
 'es': 'Aplicar',
 'fi': 'Levitä',
 'fr': 'Appliquer',
 'he': 'החל',
 'hi': 'लागू',
 'id': 'Menerapkan',
 'ja': '適用',
 'ko': '적용',
 'pl': 'Stosować',
 'pt': 'Aplicar',
 'ru': 'Применить',
 'uk': 'Застосовувати',
 'zh': '申请',
 'default': 'Применить'
 };
 var $app = $apps[$lang] ? $apps[$lang] : $apps.default;
 $button.title = $app+' [G]';
 $button.type = 'button';
 $button.onclick = cotan_toggle; // функция показа/скрытия котан-редактора
 $temp = document.createElement('img');
 $temp.src = '/lib/tpl/tempe/cotan/accept.png';
 $button.appendChild($temp);
 $temp = document.createElement('span');
 $temp.appendChild(document.createTextNode($app));
 $button.appendChild($temp);
 $cotan.appendChild($button);

 $button = document.createElement('button'); // создаём кнопку отката для котан-редактора
 $button.className = 'button toolbutton';
 $button.accessKey = "x";
 var $anns = {
 'ady': 'Iэтыжын',
 'be': 'Ануляваць',
 'bg': 'Отмени',
 'da': 'Annuller',
 'de': 'Abbrechen',
 'en': 'Cancel',
 'eo': 'Nuligi',
 'es': 'Cancelar',
 'fi': 'Peruuta',
 'fr': 'Annuler',
 'he': 'לבטל',
 'hi': 'रद्द',
 'id': 'Membatalkan',
 'ja': '消',
 'ko': '취소',
 'pl': 'Anulować',
 'pt': 'Cancelar',
 'ru': 'Отменить',
 'uk': 'Анулювати',
 'zh': '取消',
 'default': 'Отменить'
 };
 var $annu = $anns[$lang] ? $anns[$lang] : $anns.default;
 $button.title = $annu+' [X]';
 $button.type = 'button';
 $button.onclick = noSave; // функция отката изменений
 $temp = document.createElement('img');
 $temp.src = '/lib/tpl/tempe/cotan/cancel.png';
 $button.appendChild($temp);
 $temp = document.createElement('span');
 $temp.appendChild(document.createTextNode($annu));
 $button.appendChild($temp);
 $cotan.appendChild($button);
 
 $temp = document.createElement('a'); // создаём ссылку на справку для котан-редактора
 $temp.href = '/'+$lang+'/wiki/12balloons';
 $temp.target = '_blank';
 var $helps = {
 'ady': 'ДэІэпыкъуныгъэ',
 'be': 'Дапамагаць',
 'bg': 'Помощ',
 'da': 'Hjælp',
 'de': 'Hilfe',
 'en': 'Help',
 'eo': 'Helpo',
 'es': 'Ayuda',
 'fi': 'Ohje',
 'fr': 'Aide',
 'he': 'לעזור',
 'hi': 'मदद',
 'id': 'Membantu',
 'ja': '助',
 'ko': '도움말',
 'pl': 'Pomagać',
 'pt': 'Ajuda',
 'ru': 'Помощь',
 'uk': 'Допомагати',
 'zh': '救命',
 'default': 'Помощь'
 };
 var $help = $helps[$lang] ? $helps[$lang] : $helps.default;
 $temp.innerHTML = '<button type="button" class="button toolbutton"><img src="/lib/tpl/tempe/cotan/help.png"><span>'+$help+'</span></button>';
 $cotan.appendChild($temp);

 $wiki_text.parentNode.insertBefore($cotan, $wiki_text.nextSibling); //вставляем котан-редактор под доку-редактором
}

if (window.addEventListener) { // запуск функции cotanedit() при загрузке страницы
 window.addEventListener('load', cotanedit, false); // W3C стандарт NB **not** 'onload'
} else if (window.attachEvent) {
 window.attachEvent('onload', cotanedit); // Microsoft стандарт
}

function cotan_toggle() { // функция показа/скрытия котан-редактора
 var $temp;
 if ($cotan_on) { // если включён, то выключаем...
  var $save = true, $area;
  if (typeof(arguments[0]) != 'undefined') {
   $save = arguments[0]; // может быть передан код отмены изменений
  }

  for ($i in $cotan_areas) {
   if ($cotan_areas[$i]) {
    $area = $cotan_areas[$i];
    if ($save) {
     $area.saveBubbles();
    }
    $area.scrape();
   }
  }
  $cotan_areas = new Array();

  $cotan.style.display = 'none';
  $wiki_text.disabled = false;
  $wiki_text.style.background = '';
  //разблокируем кнопки редактора wiki и кнопку вызова cotanedit
  $temp = document.getElementById('edbtn__save');
  $temp.disabled = false;
  $temp.style.background = '';
  $temp = document.getElementById('edbtn__preview');
  $temp.disabled = false;
  $temp.style.background = '';
  $temp = document.getElementById('cotanbutton');
  $temp.disabled = false;
  enclass($temp, 'green');
  $temp.style.background = '';
  $cotan_on = false;
 } else { // если визуального интерфейса нет, включаем его
  $wiki_text.disabled = true; // блокировка доку-редактора
  $wiki_text.style.background = 'lightgray'; // 
  $temp = document.getElementById('edbtn__save'); // блокировка кнопки сохранения
  $temp.disabled = true;
  $temp.style.background = 'lightgray';
  $temp = document.getElementById('edbtn__preview'); // блокировка кнопки предпросмотра
  $temp.disabled = true;
  $temp.style.background = 'lightgray';
  $temp = document.getElementById('cotanbutton');
  $temp.disabled = true;
  declass($temp, 'green');
  $temp.style.background = 'lightgray';
  $cotan_on = true;
  do_match();
  $cotan.style.display = ''; // показать котан-редактор
 }
}

function noSave() { // функция отката изменений
 cotan_toggle(false);
}

function do_match() { // функция поиска картинки/разметки и обработки их
 var $content = $wiki_text.value;
 if (!$content) return;

 var $images = preg_match_all($cotan_preg, $content);
 for ($i in $images) {
  var $image_data = { space_before:'', tag_type:'', image_link:'', image_ext:'', space_after:'', balloons_raw:''};
  if ($images[$i][3]) {
   // эта ветка выполняется только в случае, если обнаружена существующая зона aimg или cotan.
   // индексы:
   $image_data["space_before"] = $images[$i][2]; // 2 - пробел перед картинкой. служит для центрирования.
   $image_data["tag_type"] = $images[$i][3];     // 3 - тэг (aimg или cotan)
   $image_data["image_link"] = $images[$i][4];   // 4 - оригинальный адрес картинки, исключая двоеточие (так же, как это делает cotan). может быть как внутренним, так и внешним (на http:// )
   $image_data["image_ext"] = $images[$i][5];    // 5 - расширение файла. включено в 4-й индекс.
   $image_data["space_after"] = $images[$i][6];  // 6 - пробел после картинки. служит для центрирования.
   $image_data["balloons_raw"] = $images[$i][7]; // 7 - необработанное содержимое баллонов.
  } else {
   // эта ветка выполняется в случае, если найдена необработанная картинка.
   // индексы (аналогично):
   $image_data["space_before"] = $images[$i][9]; // 9 - пробел перед картинкой.
   $image_data["tag_type"] = '';
   $image_data["image_link"] = $images[$i][10];  // 10 - оригинальный адрес картинки
   $image_data["image_ext"] = $images[$i][11];   // 11 - расширение файла.
   $image_data["space_after"] = $images[$i][12]; // 12 - пробел после картинки.
   $image_data["balloons_raw"] = '';
  };
  new VisArea($image_data["image_link"], $image_data["balloons_raw"], $image_data["tag_type"], analyzeImage($image_data["space_before"], $image_data["image_link"], $image_data["space_after"]), $i);
 }
}

function analyzeImage($space1, $file, $space2) {
// эта функция анализирует код картинки и наличие пробелов и возвращает следующее:
// $result.align - прилипание (center, left, right, default)
// $result.source - расположение: внутреняя картинка на вики (internal) или внешняя ссылка (external)
// $result.relative - уточнение расположения для внутренних картинок: true - относительно текущего места, false - абсолютный путь.
 var $result = new Object();
 if (($space1 == ' ') && ($space2 == ' ')) {
  $result.align = 'center';
 } else if ($space1 == ' ') {
  $result.align = 'right';
 } else if ($space2 == ' ') {
  $result.align = 'left';
 } else {
  $result.align = 'default';
 }
 
 if ($file.match(/^https?:\/\//)) {
  $result.source = 'external';
 } else {
  $result.source = 'internal';
  if ($file.indexOf(':') == -1) {
   $result.relative = true;
  } else {
   $result.relative = false;
  }
 }
 
 return $result;
}

function setMode($area_id, $mode) {
 var $area_modes = ['clear', 'whitewash', 'sticker', 'preview'];
 if ($area_id > $cotan_areas.length) return;
 var $area = $cotan_areas[$area_id];
 $area.setMode($mode);
 var $addbutton = document.getElementById('cotanarea-' + $area.id + '-addbubble');
 switch($area.mode) {
  case 'clear':
   enclass($area.modeButtons[0], 'active');
   declass($area.modeButtons[1], 'active');
   declass($area.modeButtons[2], 'active');
   declass($area.modeButtons[3], 'active');
   $addbutton.disabled = true;
   break;
  case 'whitewash':
   declass($area.modeButtons[0], 'active');
   enclass($area.modeButtons[1], 'active');
   declass($area.modeButtons[2], 'active');
   declass($area.modeButtons[3], 'active');
   $addbutton.disabled = false;
   break;
  case 'sticker':
   declass($area.modeButtons[0], 'active');
   declass($area.modeButtons[1], 'active');
   enclass($area.modeButtons[2], 'active');
   declass($area.modeButtons[3], 'active');
   $addbutton.disabled = false;
   break;
  case 'preview':
   declass($area.modeButtons[0], 'active');
   declass($area.modeButtons[1], 'active');
   declass($area.modeButtons[2], 'active');
   enclass($area.modeButtons[3], 'active');
   $addbutton.disabled = true;
   break;
 }
 for ($i in $area.bubbles) {
  if ($area.bubbles[$i]) {
   $area.bubbles[$i].redraw();
  }
 }
}

function preg_match_all(regex, haystack) { // эквивалент php-функции
 var globalRegex = new RegExp(regex, 'gi');
 var globalMatch = haystack.match(globalRegex);
 matchArray = new Array();
 for (var i in globalMatch) {
  nonGlobalRegex = new RegExp(regex);
  nonGlobalMatch = globalMatch[i].match(nonGlobalRegex);
  matchArray.push(nonGlobalMatch);
 }
 return matchArray;
}

// ############
// ### AREA ###
// ############

function VisArea($original, $text, $tag, $analyze, $id) {
 this.addBubble = function(e, $source) { // создание пустого баллона
  var $x, $y;
  if ($source == this.imgarea) { // если команда происходит от самой области
   var $imgareaRect = this.imgarea.getBoundingClientRect();
   $x = parseInt(e.clientX - $imgareaRect.left);
   $y = parseInt(e.clientY - $imgareaRect.top);
  } else { $x = 10; $y = 10; } // если команда идёт от кнопки "Добавить баллон"
  var $bubble_id = this.bubbles.length;
  var $bubble_text = '';
  if (this.mode === 'whitewash') {
   $bubble_text = '#'
  } else if (this.mode === 'sticker') {
   var $stkrs = {
    'ady': 'Тхыгъэ',
    'be': 'Тэкст',
    'bg': 'Текст',
    'da': 'Tekst',
    'de': 'Text',
    'en': 'Text',
    'eo': 'Teksto',
    'es': 'Texto',
    'fi': 'Teksti',
    'fr': 'Texte', 
    'he': 'טקסט',
    'hi': 'पाठ',
    'id': 'Teks',
    'ja': 'テキスト',
    'ko': '텍스트',
    'pl': 'Tekst',
    'pt': 'Texto',
    'ru': 'Текст',
    'uk': 'Текст',
    'zh': '文本',
    'default': 'Текст'
    };
   $bubble_text = $stkrs[$lang] ? $stkrs[$lang] : $stkrs.default;
  }
  var $bubble = new Bubbles( $bubble_id, $x, $y, 100, 50, $bubble_text, this, true);
  $bubble.cotanarea = this;
  this.bubbles[this.bubbles.length] = $bubble;
 }

 this.spawnBubbles = function($text) {
  if ($text == '') return;
  // EvilCat 5.11.2013: добавлено распознавание поворота.
  var $list = preg_match_all('(\n)+@(-?[0-9]+\\.?[0-9]?[-+]?[0-9]*\\.?[0-9]?), *(-?[0-9]+\\.?[0-9]?[-+]?[0-9]*\\.?[0-9]?), *(-?[0-9]+\\.?[0-9]?[-+]?[0-9]*\\.?[0-9]?), *(-?[0-9]+\\.?[0-9]?[-+]?[0-9]*\\.?[0-9]?)(, *(-?[0-9]+\\.?[0-9]?))?(; *([^\n]+))?(\n)+((.|\n)+?)\n+~', $text), $bubble
  // группы идут в таком порядке:
  // 1 - новая строка
  // 2 - y-координата
  // 3 - x-координата
  // 4 - ширина
  // 5 - высота
  // 6 - возможная группа с поворотом
  //  7 - градусы
  // 8 - возможная группа с округлениями
  //  9 - строка округлений
  // 10 - новая строка
  // 11 - текст баллона
  //  12 - символика текста баллона
  
  if ($list) {
   for ($i in $list) { // создаём новые
    var $bubble_id;
    $bubble_id = this.bubbles.length;
    $bubble = new Bubbles ($i, $list[$i][3], $list[$i][2], $list[$i][4], $list[$i][5], $list[$i][11], this, false, $list[$i][7], $list[$i][9]);
	//( $id, $x, $y, $width, $height, $text, $cotanarea, $new, $rotate, $rounder)
    this.bubbles[this.bubbles.length] = $bubble;
   }
  }
 }

 this.saveBubbles = function() { // сохранение баллонов в тексте
  // сначала создаём целевой текст
  var $temp, $result = '';
  for ($i in this.bubbles) {
   if (!this.bubbles[$i]) continue;
   $temp = this.bubbles[$i];
   // EvilCat 5.11.2013: добавлена запись поворота.
   $result += '\n@' + $temp.y + ',' + $temp.x + ',' + $temp.width + ',' + $temp.height + (($temp.angle != 0)?(',' + $temp.angle):('')) + (($temp.radius != 0)?(';' + $temp.radius):('')) + '\n' + $temp.text + '\n~';//asd скругления
  }

  if ($result != '') {
   $result = '{{' + 'cotan>' + ( ((this.align == 'center')||(this.align == 'right'))?(' '):('') ) + this.original + ( ((this.align == 'center')||(this.align == 'left'))?(' '):('') ) + '}}' + $result + '\n{{<cotan}}';
  } else {
   $result = '{{' + ( ((this.align == 'center')||(this.align == 'right'))?(' '):('') ) + this.original + ( ((this.align == 'center')||(this.align == 'left'))?(' '):('') ) + '}}';
  }

  // в зависимости от того, новая ли это конструкция или существующая, заменяем текст.
  // проверка на тип источника требуется потому, что внутренние картинки могут идти как с двоеточием в начале, так и без него.
  var $replace;
  switch (this.sourcetag) {
   case '':
    $replace = $cotan_preg_img_target.replace('%FILE%', ((this.source == 'internal')?(':?'):('')) + this.original);
    break;
   case 'aimg':
    $replace = $cotan_preg_aimg_target.replace('%FILE%', ((this.source == 'internal')?(':?'):('')) + this.original);
    break;
   case 'cotan':
    $replace = $cotan_preg_cotan_target.replace('%FILE%', ((this.source == 'internal')?(':?'):('')) + this.original);
    break;
   default:
    break;
  }

  $replace = new RegExp($replace);
  $wiki_text.value = $wiki_text.value.replace($replace, $result);
 }

 this.scrape = function() {
  for ($i in this.bubbles) {
   if (this.bubbles[$i]) {
    this.bubbles[$i].scrape();
   }
  }
  this.element.parentNode.removeChild(this.element);
  $cotan_areas[$cotan_areas.indexOf(this)] = null;
 }

 this.setMode = function($mode) {
  var $area_modes = ['clear', 'whitewash', 'sticker', 'preview'];
  this.mode = '';
  for ($i in $area_modes) {
   if ($mode == $area_modes[$i]) {
    this.mode = $mode;
   }
  }
  if (this.mode == '') {
   this.mode = 'sticker';
  }
 };

 this.id = $id;
 this.original = $original;
 this.align = $analyze.align;
 this.source = $analyze.source;
 this.relative = $analyze.relative;
 if ((this.source == 'internal')&&(this.relative)) {
  this.file = $cotan_media + JSINFO.namespace.replace(':', '/') + '/' + $original;
 } else if (this.source == 'internal') {
  this.file = $cotan_media + $original.replace(':', '/');
 } else {
  this.file = this.original;
 }
 this.sourcetag = $tag;

 this.index = $cotan_areas.length;
 $cotan_areas[this.index] = this;
 this.bubbles = new Array();
 this.modeButtons = new Array();

 this.element = document.createElement('div'); // создаём область визуального интерфейса.
 this.element.cotanarea = this;
 this.element.className = 'cotancontainer cotanarea-' + this.id;

 var $toolbar, $button, $temp; // объявляем локальные переменные.

 $toolbar = document.createElement('div'); // создаём панель .cotan-toolbar
 $toolbar.className = 'cotan-toolbar';
 this.element.appendChild($toolbar);

 $button = document.createElement('button'); // кнопка clear-режима
 $button.cotanarea = this;
 $button.className = 'button toolbutton';
 $button.type = 'button';
 $button.id = 'cotanarea-' + this.id + '-clear';
 $temp = document.createElement('img');
 $temp.src = '/lib/tpl/tempe/cotan/clear.png';
 $button.appendChild($temp);
 $temp = document.createElement('span');
 var $origs = {
 'ady': 'Оригинал',
 'be': 'Арыгінал',
 'bg': 'Оригинал',
 'da': 'Original',
 'de': 'Original',
 'en': 'Original',
 'eo': 'Originala',
 'es': 'Original',
 'fi': 'Originaali',
 'fr': 'Original',
 'he': 'המקורי',
 'hi': 'मूल',
 'id': 'Asli',
 'ja': '独自の',
 'ko': '래',
 'pl': 'Oryginał',
 'pt': 'Original',
 'ru': 'Оригинал',
 'uk': 'Оригінал',
 'zh': '原创',
 'default': 'Оригинал'
 };
 var $orig = $origs[$lang] ? $origs[$lang] : $origs.default;
 $temp.appendChild(document.createTextNode($orig));
 $button.appendChild($temp);
 $button.addEventListener('click', function(){
  setMode(this.cotanarea.id, 'clear');
 });
 $toolbar.appendChild($button);
 this.modeButtons.push($button);
 
 $button = document.createElement('button'); // кнопка whitewash-режима
 $button.cotanarea = this;
 $button.className = 'button toolbutton';
 $button.type = 'button';
 $button.id = 'cotanarea-' + this.id + '-whitewash';
 $temp = document.createElement('img');
 $temp.src = '/lib/tpl/tempe/cotan/whitewash.png';
 $button.appendChild($temp);
 $temp = document.createElement('span');
 var $masks = {
 'ady': 'Маскэ',
 'be': 'Маскі',
 'bg': 'Маски',
 'da': 'Maske',
 'de': 'Maske',
 'en': 'Masks',
 'eo': 'Maskoj',
 'es': 'Máscara',
 'fi': 'Maski',
 'fr': 'Masques',
 'he': 'מסכות',
 'hi': 'मास्क',
 'id': 'Masker',
 'ja': 'マスク',
 'ko': '마',
 'pl': 'Maski',
 'pt': 'Máscara',
 'ru': 'Маски',
 'uk': 'Маски',
 'zh': '面具',
 'default': 'Маски'
 };
 var $mask = $masks[$lang] ? $masks[$lang] : $masks.default;
 $temp.appendChild(document.createTextNode($mask));
 $button.appendChild($temp);
 $button.addEventListener('click', function(){
  setMode(this.cotanarea.id, 'whitewash');
 });
 $toolbar.appendChild($button);
 this.modeButtons.push($button);

 $button = document.createElement('button'); // кнопка sticker-режима
 $button.cotanarea = this;
 $button.className = 'button toolbutton';
 $button.type = 'button';
 $button.id = 'cotanarea-' + this.id + '-sticker';
 $temp = document.createElement('img');
 $temp.src = '/lib/tpl/tempe/cotan/sticker.png';
 $button.appendChild($temp);
 $temp = document.createElement('span');
 var $txts = {
 'ady': 'Тхыгъэ',
 'be': 'Тэксты',
 'bg': 'Текстове',
 'da': 'Tekster',
 'de': 'Texte',
 'en': 'Texts',
 'eo': 'Tekstoj',
 'es': 'Texto',
 'fi': 'Tekstit',
 'fr': 'Textes',
 'he': 'טקסטים',
 'hi': 'ग्रंथों',
 'id': 'Teks',
 'ja': 'テキスト',
 'ko': '텍스트',
 'pl': 'Teksty',
 'pt': 'Textos',
 'ru': 'Тексты',
 'uk': 'Тексти',
 'zh': '短信',
 'default': 'Тексты'
 };
 var $txt = $txts[$lang] ? $txts[$lang] : $txts.default;
 $temp.appendChild(document.createTextNode($txt));
 $button.appendChild($temp);
 $button.addEventListener('click', function(){
  setMode(this.cotanarea.id, 'sticker');
 });
 $toolbar.appendChild($button);
 this.modeButtons.push($button);

 $button = document.createElement('button'); // кнопка preview-режима
 $button.cotanarea = this;
 $button.className = 'button toolbutton';
 $button.type = 'button';
 $button.id = 'cotanarea-' + this.id + '-preview';
 $temp = document.createElement('img');
 $temp.src = '/lib/tpl/tempe/cotan/preview.png';
 $button.appendChild($temp);
 $temp = document.createElement('span');
 var $prvws = {
 'ady': 'Къеплъыныгъэ',
 'be': 'Агляд',
 'bg': 'Преглед',
 'da': 'Eftersyn',
 'de': 'Check-up',
 'en': 'Checkup',
 'eo': 'Inspektado',
 'es': 'Chequeo',
 'fi': 'Tarkastus',
 'fr': 'Apperçu',
 'he': 'בדיקה',
 'hi': 'निरीक्षण',
 'id': 'Pemeriksaan',
 'ja': '検査',
 'ko': '검사',
 'pl': 'Przegląd',
 'pt': 'Exame',
 'ru': 'Осмотр',
 'uk': 'Огляд',
 'zh': '检查',
 'default': 'Осмотр'
 };
 var $prvw = $prvws[$lang] ? $prvws[$lang] : $prvws.default;
 $temp.appendChild(document.createTextNode($prvw));
 $button.appendChild($temp);
 $button.addEventListener('click', function(){
  setMode(this.cotanarea.id, 'preview');
 });
 $toolbar.appendChild($button);
 this.modeButtons.push($button);

 $toolbar = document.createElement('div'); // панель #cotaned_toolbar
 $toolbar.className = 'cotan-toolbar';
 $toolbar.id = 'cotaned_toolbar';
 this.element.appendChild($toolbar);

 $button = document.createElement('button'); // кнопка добавления баллона
 $button.cotanarea = this;
 $button.className = 'button toolbutton';
 $button.type = 'button';
 $button.id = 'cotanarea-' + this.id + '-addbubble';
 $temp = document.createElement('img');
 $temp.src = '/lib/tpl/tempe/cotan/add.png';
 $button.appendChild($temp);
 $temp = document.createElement('span');
 var $adds = {
 'ady': 'ЩIыгъун баллон',
 'be': 'Дадаць балон',
 'bg': 'Добави балон',
 'da': 'Tilføj ballon',
 'de': 'Ballon fügen',
 'en': 'Add balloon',
 'eo': 'Aldoni balono',
 'es': 'Añadir el balón',
 'fi': 'Lisää ilmapallo',
 'fr': 'Ajouter ballon',
 'he': 'להוסיף בלון',
 'hi': 'जोड़ने के गुब्बारे',
 'id': 'Tambahkan balon',
 'ja': '追加のバルーン',
 'ko': '추가 풍선',
 'pl': 'Dodaj balon',
 'pt': 'Adicionar balão',
 'ru': 'Добавить баллон',
 'uk': 'Додати балон',
 'zh': '添加气球',
 'default': 'Добавить баллон'
 };
 var $add = $adds[$lang] ? $adds[$lang] : $adds.default;
 $temp.appendChild(document.createTextNode($add));
 $button.appendChild($temp);
 $button.onclick = function(e) {
  this.cotanarea.addBubble(e, this)
 };
 $toolbar.appendChild($button);

 this.imgarea = document.createElement('div'); // зона картинки
 this.imgarea.className = 'cotanimgarea';
 this.imgarea.cotanarea = this;
 this.imgarea.ondblclick = function(e) { // двойной клик по картинке добавляет баллон
  this.cotanarea.addBubble(e, this);
 };
 this.element.appendChild(this.imgarea);
 this.img = document.createElement('img'); // комикс
 this.img.className = 'cotanimg';
 this.img.src = this.file.replace(/_media[:\/]\w\w\w?[:\/]/,'_media/');
 this.imgarea.appendChild(this.img);

 $temp = document.createElement('div'); // защита от закукоживания размечаемых наклеек жёстко по содержимому
 $temp.style.clear = 'both';
 this.imgarea.appendChild($temp);

 
 this.spawnBubbles($text);
 $cotan.appendChild(this.element);
 setMode(this.id, 'whitewash'); // режим по умолчанию - штукатурка
}

// ###############
// ### BUBBLE ###
// ###############

function Bubbles( $id, $x, $y, $width, $height, $text, $cotanarea, $new, $rotate, $rounder) { // объект баллона
 // сначала задаём геттеры и сеттеры. это позволяет баллону менять размеры и положение всякий раз, когда меняются соответствующие параметры.
 if ($rounder) {
  this.rads = $rounder; // asd скругления
 } else {
  this.rads = '';
 }
 this.__defineGetter__("radius", function() {
  return this.rads;
 });
 this.__defineGetter__("x", function() {
  return this.left;
 });
 this.__defineSetter__("x", function($val) {
  this.left = $val;
  this.place();
 });

 this.__defineGetter__("y", function() {
  return this.top;
 });
 this.__defineSetter__("y", function($val) {
  this.top = $val;
  this.place();
 });

 this.__defineGetter__("width", function() {
  return this.w;
 });
 this.__defineSetter__("width", function($val)
 {
  this.w = $val;
  this.resize();
 });

 this.__defineGetter__("height", function() {
  return this.h;
 });
 this.__defineSetter__("height", function($val) {
  this.h = $val;
  this.resize();
 });

 this.__defineGetter__("text", function() {
  return this._text;
 });
 this.__defineSetter__("text", function($val) {
  this._text = $val;
  if (this.text_element) {
   this.text_element.innerHTML = renderText($val);
  }
 });

 // EvilCat 5.11.2013: добавлен параметр поворота
 this.__defineGetter__("angle", function() {
  return this.r;
 });
 this.__defineSetter__("angle", function($val) {
  this.r = $val;
  this.resize();
 });

 this.__defineGetter__("mode", function() {
  return this.mod;
 });
 this.__defineSetter__("mode", function($val) {
  if ($val == this.mod) return;
  if (($val != 'normal')&&(this.mod != 'normal')) {
   this.mode = 'normal'; // отталкиваемся от нормы.
  }
  this.mod = $val;
  if ($val == 'normal') {
   if (this.textedit_element) {
    this.textedit_element.blur();
    this.textedit_element.style.top = '0px';
    this.textedit_element.style.zIndex = '';
    this.textedit_element.style.display = 'none';
   }
  } else if ($val == 'edit') {
   if (this.textedit_element) {
    this.textedit_element.style.top = this.height + 'px';
    this.textedit_element.style.zIndex = 100;
    this.textedit_element.style.display = 'block';
   }
  } else if ($val == 'handled') {
   if (this.textedit_element) {
    this.textedit_element.style.display = 'none';
   }
  }
 });

 this.place = function() { // помещает баллон по текущим координатам
  if (typeof(arguments[0]) != 'undefined') {
   this.left = arguments[0];
   this.top = arguments[1];
  }
  this.element.style.top = this.y + 'px';
  this.element.style.left = this.x + 'px';
 };

 this.resize = function() { // задаёт размер баллона в соответствии с параметрами
  this.element.style.width = this.width + 'px';
  this.element.style.height = this.height + 'px';
  
  // EvilCat 5.11.2013: добавлен поворот для рамки
  this.element.style.transform = "transform: rotate(" + this.angle + "deg)";
  
  if (this.type === 'text' && this.cotanarea.mode === 'sticker') {
   this.textedit_element.style.left = '0px';
   this.textedit_element.style.top = Math.max(70, this.height) + 1 + 'px'; // а вдруг там скроллер?
   this.textedit_element.style.width = Math.max(100, (parseInt(this.width) + 18)) + 'px'; // а вдруг там скроллер?
   this.textedit_element.style.height = Math.max(70, this.height) + 'px'; // а вдруг там скроллер?
  }
 };

 this.handled = function(e, $handle) { // эту функцию вызывают ручки, когда их двигают
  // получаем экранные координаты курсора и родительского элемента.
  var $x, $y, $e, $imgareaRect;
  $imgareaRect = this.cotanarea.imgarea.getBoundingClientRect();
  $x = parseInt(e.clientX - $imgareaRect.left);
  $y = parseInt(e.clientY - $imgareaRect.top);

// координаты не могут быть за пределами области визуального интерфейса
  if ($x < 0) {
   $x = 0;
  } else if ($x > $imgareaRect.width) {
   $x = $imgareaRect.width;
  }
  if ($y < 0) {
   $y = 0;
  } else if ($y > $imgareaRect.height) {
   $y = $imgareaRect.height;
  }

  if ($handle == this.move_handle) { // если двигали ручку перемещения
   this.place ($x, $y);
  } else if ($handle == this.size_handle) { // если двигали ручку размера
   $x = $x - this.element.offsetLeft;
   if ($x < 20) {
    $x = 20; // минимальные длина и высота
   }
   $y = $y - this.element.offsetTop;
   if ($y < 20) {
    $y = 20;
   }
   this.width = $x;
   this.height = $y;
  }
 }

 this.scrape = function() { // самоубийство объекта
  if (this.element) {
   this.element.parentNode.removeChild(this.element);
  }
  this.cotanarea.bubbles[this.cotanarea.bubbles.indexOf(this)] = null;
 }

 this.createContainer = function() {
  this.element = document.createElement('div');
  this.element.bubble = this;
  if (this.cotanarea.mode === 'preview' || this.cotanarea.mode === 'sticker') {
   if (this.cotanarea.mode === 'sticker' && this.type === 'text') {
    enclass(this.element, 'bubble');
   }
   enclass(this.element, 'ct-area');
   if (this.type === 'text') {
    this.element.style.zIndex = "1";
   }
  } else {
   enclass(this.element, 'bubble');
  }
 }

 this.createView = function() {
  var $div, $temp;
  $div = document.createElement('div');
  enclass($div, 'ct-note');
  $temp = document.createElement('span');
  enclass($temp, 'ct-note-content');
  $div.appendChild($temp);
  this.element.appendChild($div);
  if (this.type === 'patch' && this.cotanarea.mode != 'whitewash') {
   var $color = 'white';
   $div.style.backgroundColor = 'rgba(' + this.color.R + ',' + this.color.G + ',' + this.color.B + ',' + '1)';
   this.element.style.zIndex = "0";
  } else if (this.type === 'text') {
   this.text_element = document.createElement('p');
   this.text_element.innerHTML = renderText(this.text);
   $temp.appendChild(this.text_element);
  }
 }

 this.createTextarea = function() { // поле ввода, несколько больше основного поля из-за скролла
  this.textedit_element = document.createElement('textarea');
  this.textedit_element.bubble = this;
  this.textedit_element.onchange = function() {
   this.bubble.text = this.value;
  }
  this.element.appendChild(this.textedit_element);
  this.textedit_element.value = this.text;
  this.textedit_element.style.display = "none";
  this.textedit_element.style.position = "absolute";
  this.textedit_button.tabIndex = "-1";
  this.textedit_button.onclick = function() {
   this.bubble.mode = 'edit';
   if (this.bubble.fresh) {
    this.value = '';
   }
   this.bubble.element.style.zIndex = "2";
   this.bubble.textedit_element.style.display = "";
   this.bubble.textedit_element.focus();
   $ctnote = document.getElementsByClassName('ct-note'); //
   for ($i in $ctnote) {
    $ctnote[$i].style.display = 'none';
	$ctnote[$i].parentNode.style.background = 'none repeat scroll 0 0 rgba(255,255,255,0)';
   }
  }
  this.textedit_element.onblur = function() {
   this.mode = 'normal';
/*   if ((this.bubble.fresh)&&(this.value == '')) {
    this.value = 'Нажмите "Править страницу" и введите перевод';
   } else if (this.bubble.fresh) {
    this.bubble.fresh = false;
   }
*/
   if ((this.bubble.fresh)&&(this.value != '')) {
    this.bubble.fresh = false;
   }
   this.bubble.textedit_element.style.display = "none";
   this.bubble.element.style.zIndex = "1";
   $ctnote = document.getElementsByClassName('ct-note'); //
   for ($i in $ctnote) {
    $ctnote[$i].style.display = 'table-cell';
	$ctnote[$i].parentNode.style.background = 'none repeat scroll 0 0 rgba(255,255,255,0.8)';
   }
  }
 }

 this.createButtons = function() { // создаём наклеечный интерфейс

  this.move_handle = new nHandle(this); // ручка перемещения
  enclass(this.move_handle.element, 'movehandle');
  this.element.appendChild(this.move_handle.element);

  this.size_handle = new nHandle(this); // ручка изменения размера
  enclass(this.size_handle.element, 'sizehandle');
  this.element.appendChild(this.size_handle.element);

  this.close_button = document.createElement('div'); // кнопка удаления
  this.close_button.bubble = this;
  this.close_button.className = "handle closebutton";
  this.close_button.innerHTML = '&nbsp;';
  this.element.appendChild(this.close_button);
  this.close_button.onclick = function(e) { // кнопка удаления учится удалять
   this.bubble.scrape();
   e.cancelBubble = true;
   if (e.stopPropagation) {
    e.stopPropagation();
   }
  };

  if (this.cotanarea.mode === 'sticker' && this.type === 'text') { // в режиме перевода добавить значок текста
   this.textedit_button = document.createElement('div');
   this.textedit_button.bubble = this;
   this.textedit_button.className = "handle texteditbutton";
   this.textedit_button.innerHTML = '&nbsp;';
   this.element.appendChild(this.textedit_button);
  };

  if (this.cotanarea.mode === 'whitewash' && this.type === 'patch') { // в режиме забеливания добавить значок цветности
   this.colorpicker_button = document.createElement('div');
   this.colorpicker_button.className = "handle colorpickerbutton";
   this.colorpicker_button.innerHTML = '&nbsp;';
   this.element.appendChild(this.colorpicker_button);
   /* СЮДА ВСТАВИТЬ COLORPICKER*/
  };
 };

 this.draw = function() { // основное поле баллона, соответствующее области, при наведении на которую появляется текст
  if (
   (this.type != 'text' || this.cotanarea.mode != 'whitewash') &&
   this.cotanarea.mode != 'clear'
  ) { //поле редактирования текста для "заплаток" не создаём
   this.createContainer();
   this.createView();
  };
  
  if ( // в двух режимах, где требуется наклеечный интерфейс
   (this.cotanarea.mode === 'whitewash' && this.type === 'patch') ||
   (this.cotanarea.mode === 'sticker' && this.type === 'text')
  ) {
   this.createButtons(); // создать наклеечный интерфейс
  }

  if (this.type === 'text' && this.cotanarea.mode === 'sticker') { //поле редактирования текста для "заплаток" не создаём
   this.createTextarea();
  };

  if (this.element) {
   this.cotanarea.imgarea.appendChild(this.element);
   this.place();
   this.resize();
  }
 }
 
 this.redraw = function() {
  if (this.textedit_element) {
   this.textedit_element.parentNode.removeChild(this.textedit_element);
  }
  this.textedit_element = '';
  if (this.element) {
   this.element.parentNode.removeChild(this.element);
  }
  this.element = '';
  this.draw();
 }

 // ниже основное тело конструктора

 this.id = $id;
 this.cotanarea = $cotanarea;
 this.fresh = $new;
 if ($colpat_preg.test($text)) {
  var $color = { R:255, G:255, B:255, A:1};
  if ($text.length === 4) {
   $color["R"] = parseInt($text[1] + $text[1], 16);
   $color["G"] = parseInt($text[2] + $text[2], 16);
   $color["B"] = parseInt($text[3] + $text[3], 16);
  } else if ($text.length === 7) {
   $color["R"] = parseInt($text[1] + $text[2], 16);
   $color["G"] = parseInt($text[3] + $text[4], 16);
   $color["B"] = parseInt($text[5] + $text[6], 16);
  }
  this.type = 'patch';
  this.color = $color;
  this.text = $text;
 } else {
  this.type = 'text';
  this.text = $text;
 }
 
 this.draw();
 
 this.x = eval($x);
 this.y = eval($y);
 this.width = eval($width);
 this.height = eval($height);

 // EvilCat 5.11.2013: добавлен параметр поворота
 if (typeof($rotate != 'undefined')) {
  this.angle = parseInt($rotate) || 0;
 } else {
  this.angle = 0;
 }

 this.mode = 'normal';
}

// ##############
// ### HANDLE ###
// ##############

var $cotan_held = null; // в этой переменной хранится перемещаемый или растягиваемый баллон, если таковой есть
function nHandle($bubble) { // объект ручки
 this.bubble = $bubble;
 this.element = document.createElement('div'); this.element.button = this;
 this.element.className = 'handle';
 this.element.innerHTML = '&nbsp;';

 this.element.onmousedown = function(e) {
  if ($cotan_held) return;

  if (e.button === 0) {
   $cotan_held = this.button;
   enclass(this.button.element, 'dragged');
   this.button.bubble.mode = 'handled';
   window.onmousemove = function(e) {
    if (!$cotan_held) return;
    if (e.button === 0) {
     $cotan_held.move(e);
    } else {
     $cotan_held.drop(e);
    }
   }

   window.onmouseup = function(e) {
    if (!$cotan_held) return;
    $cotan_held.drop(e);
   }   
  }
  
  e.preventDefault(); return false;
 }
 
 this.drop = function(e) {
  declass(this.element, 'dragged');
  this.bubble.handled(e, this);
  this.bubble.mode = 'normal';
  $cotan_held = null;
  window.onmousemove = null;
  window.onmouseup = null;
 }

 this.move = function(e) {
  this.bubble.handled(e, this);
 }
}

function renderText($text) { // обработка шрифтотегов
 var $result = $text;
 function fontsizeReplacer(str, openSB, value, closeSB, offset, s) {
  var fontSize = parseFloat(value);
  if (fontSize >= 0.6 && fontSize <= 6) {
   return '<span class = "f' + value.replace(/\./g, "") + '">';
  } else {
   return openSB + '!' + value + closeSB;
  }
 }
 //wiki разметка
 $result = $result.replace(/(\*\*)(.+?)(\*\*)/g, '<strong>$2</strong>');
 $result = $result.replace(/(__)(.+?)(__)/g, '<em class = "u">$2</em>');
 $result = $result.replace(/(\/\/)(.+?)(\/\/)/g, '<em>$2</em>');
 $result = $result.replace(/\\\\/g, '<br \>');
 $result = $result.replace(/<fc ([#\w\d]+)>(.+?)<\/fc>/g, '<span style="color: $1">$2</span>');
 // спецназ
 $result = $result.replace(/\.\.\./g, '…');
 $result = $result.replace(/\(pipe\)/g, '&#124;');
 $result = $result.replace(/\[\-\.\]/g, '<span class = "hyph">');
 $result = $result.replace(/\-\./g, '&shy;');
 $result = $result.replace(/\-\-/g, '–');
 $result = $result.replace(/\-\-\-/g, '—');
 $result = $result.replace(/\['\]/g, '<strong>&#769;</strong>');
 $result = $result.replace(/<(b|h)rr>/g, '<$1r style="clear:both" />');
 $result = $result.replace(/\(nbsp\)/g, '&nbsp;');
 $result = $result.replace(/\(tab\)/g, '&nbsp;&nbsp;&nbsp;');
 $result = $result.replace(/\[<\]/g, '<span class = "vyleft">');
 $result = $result.replace(/\[>\]/g, '<span class = "vyright">');
 $result = $result.replace(/\[\|\]/g, '<span class = "vycenter">');
 $result = $result.replace(/\[\=\]/g, '<span class = "vyjust">');
 $result = $result.replace(/\[mir(x|y)\]/g, '<span class = "mir$1">');
 //гарнитура шрифта
 $result = $result.replace(/\[ax\]/g, '<span class = "axol">');
 $result = $result.replace(/\[df\]/g, '<span class = "fest">');
 $result = $result.replace(/\[ft\]/g, '<span class = "dspf">');
 $result = $result.replace(/\[sc\]/g, '<span class = "stri">');
 $result = $result.replace(/\[lc\]/g, '<span class = "lisi">');
 $result = $result.replace(/\[cl\]/g, '<span class = "claw">');
 $result = $result.replace(/\[im\]/g, '<span class = "impt">');
 //размер шрифта
 $result = $result.replace(/(\[)!(\d\.\d)(\])/g, fontsizeReplacer);
 //стили реплик отдельных персонажей
 //# freefall
 $result = $result.replace(/\[(flo|sam|hlx|saw|qwe|dvo|edge|blunt|max|rai|kor|mad|mayor|mhlp|pol|mst1?|bow|ish|oth)\]/g, '<span class = "fest $1 f13">');
 $result = $result.replace(/\[nio\]/g, '<span class = "fest niomi f13">');
 $result = $result.replace(/\[com\]/g, '<span class = "fest edge f13">');
 //# kitty
 $result = $result.replace(/\[kit\]/g, '<span class = "fest tsp f12">');
 $result = $result.replace(/\[mou\]/g, '<span class = "impt dvo f12">');
 $result = $result.replace(/\[mtt\]/g, '<span class = "fest hlx f12">');
 $result = $result.replace(/\[nnw\]/g, '<span class = "fest mst f12">');
 $result = $result.replace(/\[znt\]/g, '<span class = "fest znt f12">');
 $result = $result.replace(/\[ck-\]/g, '<span class = "fest oth f12">');
 //# lions
 $result = $result.replace(/\[rel\]/g, '<span class = "fest oth f17">');
 //# ponies
 $result = $result.replace(/\[mol\]/g, '<span class = "stri mol f12">');
 $result = $result.replace(/\[(tsp|rrp|rdp|fsp|ppp|ajp|sdp|bmp)\]/g, '<span class = "stri $1">');
 //# ozy
 $result = $result.replace(/\[(ozy|mil|otr)\]/g, '<span class = "fest $1">');
 $result = $result.replace(/\[(ozy|mil|otr)1\]/g, '<span class = "fest $1 f12">');
 $result = $result.replace(/\[lle\]/g, '<span class = "impt saw f12">');
 //# bunny
 $result = $result.replace(/\[bun\]/g, '<span class = "fest oth f15">');
 //# ichabod
 $result = $result.replace(/\[ich\]/g, '<span class = "axol mil f17">');
 $result = $result.replace(/\[ich-\]/g, '<span class = "axol oth f17">');
 //# weegie
 $result = $result.replace(/\[wee\]/g, '<span class = "impt sdp f45 cl_bold">');
 //конец стиля
 $result = $result.replace(/\[\/\]/g, '</span>');
 return $result;
}

function enclass($obj, $class) { // добавление класса
 if (!$obj.className.match(new RegExp('^$', 'i'))) {
  $obj.className += ' ';
 }
 if (!$obj.className.match(new RegExp($class, 'i'))) {
  $obj.className += $class;
 }
}

function declass($obj, $class) { // удаление класса
 $obj.className = $obj.className.replace($class, '').replace(new RegExp('(^ | (?= )| $)', 'ig'), '');
}
