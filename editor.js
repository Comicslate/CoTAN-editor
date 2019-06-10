// ver. 2019.06.10 11:01 GMT

// ВВОДНЫЕ
var $lang = NS.split ( ':', 2 )[0],
	$lines = {
		'ady': ['Къэгъэсэбэпын', 'Iэтыжын', 'ДэІэпыкъуныгъэ', 'Тхыгъэ', 'Оригинал', 'Маскэ', 'Тхыгъэ', 'Къеплъыныгъэ', 'ЩIыгъун баллон'],
		'be': ['Ўжываць', 'Ануляваць', 'Дапамагаць', 'Тэкст', 'Арыгінал', 'Маскі', 'Тэксты', 'Агляд', 'Дадаць балон'],
		'bg': ['Приложи', 'Отмени', 'Помощ', 'Текст', 'Оригинал', 'Маски', 'Текстове', 'Преглед', 'Добави балон'],
		'da': ['Anvende', 'Annuller', 'Hjælp', 'Tekst', 'Original', 'Maske', 'Tekster', 'Eftersyn', 'Tilføj ballon'],
		'de': ['Anwenden', 'Abbrechen', 'Hilfe', 'Text', 'Original', 'Maske', 'Texte', 'Check-up', 'Ballon fügen'],
		'el': ['Ισχύουν', 'Ακύρωση', 'Βοήθεια', 'Κείμενο', 'Αρχική', 'Μάσκες', 'Κείμενα', 'Τσεκ-απ', 'Προσθέστε μπαλόνι'],
		'en': ['Apply', 'Cancel', 'Help', 'Text', 'Original', 'Masks', 'Texts', 'Checkup', 'Add balloon'],
		'eo': ['Apliki', 'Nuligi', 'Helpo', 'Teksto', 'Originala', 'Maskoj', 'Tekstoj', 'Inspektado', 'Aldoni balono'],
		'es': ['Aplicar', 'Cancelar', 'Ayuda', 'Texto', 'Original', 'Máscara', 'Texto', 'Chequeo', 'Añadir el balón'],
		'fi': ['Levitä', 'Peruuta', 'Ohje', 'Teksti', 'Originaali', 'Maski', 'Tekstit', 'Tarkastus', 'Lisää ilmapallo'],
		'fr': ['Appliquer', 'Annuler', 'Aide', 'Texte', ' Original', 'Masques', 'Textes', 'Apperçu', 'Ajouter ballon'],
		'he': ['החל', 'לבטל', 'לעזור', 'טקסט', 'המקורי', 'מסכות', 'טקסטים', 'בדיקה', 'להוסיף בלון'],
		'hi': ['लागू', 'रद्द', 'मदद', 'पाठ', 'मूल', 'मास्क', 'ग्रंथों', 'निरीक्षण', 'जोड़ने के गुब्बारे'],
		'id': ['Menerapkan', 'Membatalkan', 'Aiuto', 'Teks', 'Asli', 'Masker', 'Teks', 'Pemeriksaan', 'Tambahkan balon'],
		'it': ['Applicare', 'Annulla', 'Membantu', 'Testo', 'Originale', 'Maschere', 'Testi', 'Verifica', 'Aggiungere il pallone'],
		'ja': ['適用', '消', '助', 'テキスト', '独自の', 'マスク', 'テキスト', '検査', '追加のバルーン'],
		'ko': ['적용', '취소', '도움말', '텍스트', '래', '마', '텍스트', '검사', '추가 풍선'],
		'pl': ['Stosować', 'Anulować', 'Pomagać', 'Tekst', 'Oryginał', 'Maski', 'Teksty', 'Przegląd', 'Dodaj balon'],
		'pt': ['Aplicar', 'Cancelar', 'Ajuda', 'Texto', 'Original', 'Máscara', 'Textos', 'Exame', 'Adicionar balão'],
		'ru': ['Применить', 'Отменить', 'Помощь', 'Текст', 'Оригинал', 'Маски', 'Тексты', 'Осмотр', 'Добавить баллон'],
		'uk': ['Застосовувати', 'Анулювати', 'Допомагати', 'Текст', 'Оригінал', 'Маски', 'Тексти', 'Огляд', 'Додати балон'],
		'zh': ['申请', '取消', '救命', '文本', '原创', '面具', '短信', '检查', '添加气球'],
		'default': ['Apply', 'Cancel', 'Help', 'Text', 'Original', 'Masks', 'Texts', 'Checkup', 'Add balloon']
	},
	$line = [],
	$wiki_text, // будущая ссылка на доку-редактор #wiki__text
	$ctnote, // все наклейки
	$cotan, // будущая ссылка на котан-редактор
	$cotan_on = false, // показан ли он изначально?
	$cotan_areas = new Array ( ), // массив полей на случай нескольких картинок на странице

	$cotan_preg_cotan = '\\{\\{( ?)(aimg|cotan)>:?(.+?\\.(jpg|png|jpeg|bmp|gif|svg))( ?)\\}\\}([\\w\\W]*?)\\{\\{<(aimg|cotan)\\}\\}', // распознавалка наклеек
	$cotan_preg_img = '\\{\\{( ?):?(.+?\\.(jpg|png|jpeg|bmp|gif|svg))( ?)\\}\\}', // распознавалка картинки
	$cotan_preg = '(' + $cotan_preg_cotan + '|' + $cotan_preg_img + ')', // совмещение распознавалок

	$cotan_preg_img_target = '\\{\\{ ?%FILE% ?\\}\\}', // поиск текста в доку-редакторе для всех 3 возможных вариантов
	$cotan_preg_aimg_target = '\\{ ?\\{aimg>%FILE%\\}\\ ?}([\\w\\W]*?)\\{\\{<aimg\\}\\}',
	$cotan_preg_cotan_target = '\\{ ?\\{cotan>%FILE%\\}\\ ?}([\\w\\W]*?)\\{\\{<cotan\\}\\}',
	$colpat_preg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})?$/, // цветовая метка
	$cotan_media = document.location.href.match ( /^(https?:\/\/.+?)\//i ); // адрес до первого слеша

for ( x in $lines.default ) {
	$line[x] = $lines[$lang][x] ? $lines[$lang][x] : $lines.default[x]
};

if ( $cotan_media ) { // если нашёлся
	$cotan_media = $cotan_media[1] + '/_media/'; // дописываем /_media/
} else { // если не нашёлся (главная страница)
	$cotan_media = ''; // оставляем как есть
}

function cotanedit ( ) { // эта функция действует после загрузки страницы и добавляет котан-редактор и кнопку его запуска
	if ( $cotan_media == '' ) return; // уходим, если это главная страница
	
	// ищем область кнопок $target
	$wiki_text = document.getElementById ( 'wiki__text' ); // получаем и сохраняем ссылку на доку-редактор #wiki__text
	if ( !$wiki_text ) return; // уходим, если нет доку-редактора
	var $target = document.getElementById ( 'edbtn__save' ); // ищем доку-кнопку сохранения
	if ( !$target ) return; // уходим, если это доку-редактор без кнопки сохранения (?) допустим
	$target = $target.parentNode; // получаем область кнопок
	if ( !$target ) return; // уходим, если это доку-редактор с кнопкой сохранения, но без области кнопок (?) бред

	var $button, // объявляем локальные переменные
		$temp;
	$button = document.createElement ( 'input' ); // создаём кнопку CoTAN
	$button.type = 'button';
	$button.accessKey = 'c';
	$button.value = 'CoTAN';
	$button.id = 'cotanbutton';
	$button.title = 'CoTAN [C]';
	$button.onclick = cotan_toggle; // функция показа/скрытия котан-редактора
	$target.appendChild ( $button );

	$cotan = document.createElement ( 'div' ); // создаём область котан-редактора
	$cotan.className = 'cotan';
	$cotan.style.display = 'none'; // сначала скрыта

	$button = document.createElement ( 'button' ); // создаём кнопку сохранения для котан-редактора
	$button.type = 'button';
	$button.className = 'button green toolbutton';
	$button.accessKey = "A";
	$button.title = $line[0] + ' [' + $button.accessKey + ']';
	$button.onclick = cotan_toggle; // функция показа/скрытия котан-редактора
	$temp = document.createElement ( 'img' );
	$temp.src = '/lib/plugins/cotan/accept.png';
	$button.appendChild ( $temp );
	$temp = document.createElement ( 'span' );
	$temp.appendChild ( document.createTextNode ( $line[0] ) );
	$button.appendChild ( $temp );
	$cotan.appendChild ( $button );

	$button = document.createElement ( 'button' ); // создаём кнопку отката для котан-редактора
	$button.type = 'button';
	$button.className = 'button toolbutton';
	$button.accessKey = "Q";
	$button.title = $line[1] + ' [' + $button.accessKey + ']';
	$button.onclick = noSave; // функция отката изменений
	$temp = document.createElement ( 'img' );
	$temp.src = '/lib/plugins/cotan/cancel.png';
	$button.appendChild ( $temp );
	$temp = document.createElement ( 'span' );
	$temp.appendChild ( document.createTextNode ( $line[1] ) );
	$button.appendChild ( $temp );
	$cotan.appendChild ( $button );
	
	$temp = document.createElement ( 'a' ); // создаём ссылку на справку для котан-редактора
	$temp.href = '/' + $lang + '/wiki/12balloons';
	$temp.target = '_blank';
	$temp.innerHTML = '<button type="button" class="button toolbutton"><img src="/lib/plugins/cotan/help.png"><span>' + $line[2] + '</span></button>';
	$cotan.appendChild ( $temp );

	$wiki_text.parentNode.insertBefore ( $cotan, $wiki_text.nextSibling ); //вставляем котан-редактор под доку-редактором
}

if ( window.addEventListener ) { // запуск функции cotanedit ( ) при загрузке страницы
	window.addEventListener ( 'load', cotanedit, false ); // W3C стандарт NB **not** 'onload'
} else if ( window.attachEvent ) {
	window.attachEvent ( 'onload', cotanedit ); // Microsoft стандарт
}

function cotan_toggle ( ) { // функция показа/скрытия котан-редактора
	var $temp;
	if ( $cotan_on ) { // если включён, то выключаем...
		var $save = true,
			$area;
		if ( typeof ( arguments[0] ) != 'undefined' ) $save = arguments[0]; // может быть передан код отмены изменений

		for ( $i in $cotan_areas ) {
			if ( $cotan_areas[$i] ) {
				$area = $cotan_areas[$i];
				if ( $save ) $area.saveBubbles ( );
				$area.scrape ( );
			}
		}
		$cotan_areas = new Array ( );

		$cotan.style.display = 'none';
		$wiki_text.disabled = false;
		$wiki_text.style.background = '';
		//разблокируем кнопки редактора wiki и кнопку вызова cotanedit
		$temp = document.getElementById ( 'edbtn__save' );
		$temp.disabled = false;
		$temp.style.background = '';
		$temp = document.getElementById ( 'edbtn__preview' );
		$temp.disabled = false;
		$temp.style.background = '';
		$temp = document.getElementById ( 'cotanbutton' );
		$temp.disabled = false;
		enclass ( $temp, 'green' );
		$temp.style.background = '';
		$cotan_on = false;
	} else { // если визуального интерфейса нет, включаем его
		$wiki_text.disabled = true; // блокировка доку-редактора
		$wiki_text.style.background = 'lightgray'; // 
		$temp = document.getElementById ( 'edbtn__save' ); // блокировка кнопки сохранения
		$temp.disabled = true;
		$temp.style.background = 'lightgray';
		$temp = document.getElementById ( 'edbtn__preview' ); // блокировка кнопки предпросмотра
		$temp.disabled = true;
		$temp.style.background = 'lightgray';
		$temp = document.getElementById ( 'cotanbutton' );
		$temp.disabled = true;
		declass ( $temp, 'green' );
		$temp.style.background = 'lightgray';
		$cotan_on = true;
		do_match ( );
		$cotan.style.display = ''; // показать котан-редактор
	}
}

function noSave ( ) { // функция отката изменений
	cotan_toggle ( false );
}

function do_match ( ) { // функция поиска картинки/разметки и обработки их
	var $content = $wiki_text.value;
	if ( !$content ) return;

	var $images = preg_match_all ( $cotan_preg, $content );
	for ( $i in $images ) {
		var $image_data = { space_before: '', tag_type: '', image_link: '', image_ext: '', space_after: '', balloons_raw: '' };
		if ( $images[$i][3] ) {
			// эта ветка выполняется только в случае, если обнаружена существующая зона aimg или cotan.
			// индексы:
			$image_data["space_before"] = $images[$i][2]; // 2 - пробел перед картинкой. служит для центрирования.
			$image_data["tag_type"] = $images[$i][3];     // 3 - тэг (aimg или cotan)
			$image_data["image_link"] = $images[$i][4];   // 4 - оригинальный адрес картинки, исключая двоеточие (так же, как это делает cotan). может быть как внутренним, так и внешним (на http:// )
			$image_data["image_ext"] = $images[$i][5];    // 5 - расширение файла. включено в 4-й индекс.
			$image_data["space_after"] = $images[$i][6];  // 6 - пробел после картинки. служит для центрирования.
			$image_data["balloons_raw"] = $images[$i][7] // 7 - необработанное содержимое баллонов.
		} else {
			// эта ветка выполняется в случае, если найдена необработанная картинка.
			// индексы (аналогично):
			$image_data["space_before"] = $images[$i][9]; // 9 - пробел перед картинкой.
			$image_data["tag_type"] = '';
			$image_data["image_link"] = $images[$i][10];  // 10 - оригинальный адрес картинки
			$image_data["image_ext"] = $images[$i][11];   // 11 - расширение файла.
			$image_data["space_after"] = $images[$i][12]; // 12 - пробел после картинки.
			$image_data["balloons_raw"] = ''
		};
		new VisArea (
			$image_data["image_link"],
			$image_data["balloons_raw"],
			$image_data["tag_type"],
			analyzeImage (
				$image_data["space_before"],
				$image_data["image_link"],
				$image_data["space_after"]
			),
			$i
		)
	}
}

function analyzeImage ( $space1, $file, $space2 ) {
// эта функция анализирует код картинки и наличие пробелов и возвращает следующее:
	var $result = new Object ( );
	if ( // $result.align - прилипание (center, left, right, default)
		$space1 == ' '
		&&
		$space2 == ' '
	) {
		$result.align = 'center'
	} else if ( $space1 == ' ' ) {
		$result.align = 'right'
	} else if ( $space2 == ' ' ) {
		$result.align = 'left'
	} else {
		$result.align = 'default'
	}
	
	if ( $file.match ( /^https?:\/\// ) ) { // $result.source - расположение: внутреняя картинка на вики (internal) или внешняя ссылка (external)
		$result.source = 'external'
	} else {
		$result.source = 'internal';
		if ( $file.indexOf ( ':' ) == -1 ) { // $result.relative - уточнение пути внутренних картинок: true - относительный, false - абсолютный
			$result.relative = true
		} else {
			$result.relative = false
		}
	}
	
	return $result
}

function setMode ( $area_id, $mode ) {
	var $area_modes = ['clear', 'whitewash', 'sticker', 'preview'];
	if ( $area_id > $cotan_areas.length ) return;
	var $area = $cotan_areas[$area_id];
	$area.setMode ( $mode );
	var $addbutton = document.getElementById ( 'cotanarea-' + $area.id + '-addbubble' );
	switch ( $area.mode ) {
		case 'clear':
			enclass ( $area.modeButtons[0], 'active' );
			declass ( $area.modeButtons[1], 'active' );
			declass ( $area.modeButtons[2], 'active' );
			declass ( $area.modeButtons[3], 'active' );
			$addbutton.disabled = true;
			break
		case 'whitewash':
			declass ( $area.modeButtons[0], 'active' );
			enclass ( $area.modeButtons[1], 'active' );
			declass ( $area.modeButtons[2], 'active' );
			declass ( $area.modeButtons[3], 'active' );
			$addbutton.disabled = false;
			break
		case 'sticker':
			declass ( $area.modeButtons[0], 'active' );
			declass ( $area.modeButtons[1], 'active' );
			enclass ( $area.modeButtons[2], 'active' );
			declass ( $area.modeButtons[3], 'active' );
			$addbutton.disabled = false;
			break
		case 'preview':
			declass ( $area.modeButtons[0], 'active' );
			declass ( $area.modeButtons[1], 'active' );
			declass ( $area.modeButtons[2], 'active' );
			enclass ( $area.modeButtons[3], 'active' );
			$addbutton.disabled = true;
			break
	}
	for ( $i in $area.bubbles ) {
		if ( $area.bubbles[$i] ) $area.bubbles[$i].redraw ( )
	}
}

function preg_match_all ( regex, haystack ) { // эквивалент php-функции
	var globalRegex = new RegExp ( regex, 'gi' );
	var globalMatch = haystack.match ( globalRegex );
	matchArray = new Array ( );
	for ( var i in globalMatch ) {
		nonGlobalRegex = new RegExp ( regex );
		nonGlobalMatch = globalMatch[i].match ( nonGlobalRegex );
		matchArray.push ( nonGlobalMatch );
	}
	return matchArray;
}

// ############
// ### AREA ###
// ############

function VisArea ( $original, $text, $tag, $analyze, $id ) {
	this.addBubble = function ( e, $source ) { // создание пустого баллона
		var $x,
			$y;
		if ( $source == this.imgarea ) { // если команда происходит от самой области
			var $imgareaRect = this.imgarea.getBoundingClientRect ( );
			$x = parseInt ( e.clientX - $imgareaRect.left );
			$y = parseInt ( e.clientY - $imgareaRect.top );
		} else { // если команда идёт от кнопки "Добавить баллон"
			$x = 10;
			$y = 10;
		};
		var $bubble_id = this.bubbles.length,
			$bubble_text = '';
		if ( this.mode === 'whitewash' ) {
			$bubble_text = '#'
		} else if ( this.mode === 'sticker' ) {
			$bubble_text = $line[3];
		}
		var $bubble = new Bubbles ( $bubble_id, $x, $y, 100, 50, $bubble_text, this, true );
		$bubble.cotanarea = this;
		this.bubbles[this.bubbles.length] = $bubble;
	}

	this.spawnBubbles = function ( $text ) {
		if ( $text == '' ) return;
		// EvilCat 5.11.2013: добавлено распознавание поворота.
		var $list = preg_match_all ( '(\n)+@(-?[0-9]+\\.?[0-9]?[-+]?[0-9]*\\.?[0-9]?), *(-?[0-9]+\\.?[0-9]?[-+]?[0-9]*\\.?[0-9]?), *(-?[0-9]+\\.?[0-9]?[-+]?[0-9]*\\.?[0-9]?), *(-?[0-9]+\\.?[0-9]?[-+]?[0-9]*\\.?[0-9]?)(, *(-?[0-9]+\\.?[0-9]?))?(; *([^\n]+))?(\n)+((.|\n)+?)\n+~', $text ), $bubble
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
		
		if ( $list ) {
			for ( $i in $list ) { // создаём новые
				var $bubble_id;
				$bubble_id = this.bubbles.length;
				$bubble = new Bubbles ( $i, $list[$i][3], $list[$i][2], $list[$i][4], $list[$i][5], $list[$i][11], this, false, $list[$i][7], $list[$i][9] );
	//( $id, $x, $y, $width, $height, $text, $cotanarea, $new, $rotate, $rounder )
				this.bubbles[this.bubbles.length] = $bubble
			}
		}
	}

	this.saveBubbles = function ( ) { // сохранение баллонов в тексте
		// сначала создаём целевой текст
		var $temp,
			$result = '';
		for ( $i in this.bubbles ) {
			if ( !this.bubbles[$i] ) continue;
			$temp = this.bubbles[$i];
			$result += '\n@'
			+ $temp.y
			+ ','
			+ $temp.x
			+ ','
			+ $temp.width
			+ ','
			+ $temp.height
			+ ( ( $temp.angle != 0 ) ? ( ',' + $temp.angle ) : ( '' ) ) // EvilCat 5.11.2013: добавлена запись поворота
			+ ( ( $temp.radius != 0 ) ? ( ';' + $temp.radius ) : ( '' ) ) // asd скругления
			+ '\n'
			+ $temp.text
			+ '\n~';
		}

		if ( $result != '' ) {
			$result = '{{'
			+ 'cotan>'
			+ (
				(
					this.align == 'center'
					||
					this.align == 'right'
				)
				? ( ' ' )
				: ( '' )
			)
			+ this.original
			+ (
				(
					this.align == 'center'
					||
					this.align == 'left'
				)
				? ( ' ' )
				: ( '' )
			)
			+ '}}'
			+ $result
			+ '\n{{<cotan}}'
		} else {
			$result = '{{'
			+ (
				(
					this.align == 'center'
					||
					this.align == 'right'
				)
				? ( ' ' )
				: ( '' )
			)
			+ this.original
			+ (
				(
					this.align == 'center'
					||
					this.align == 'left'
				)
				? ( ' ' )
				: ( '' )
			)
			+ '}}';
		}

		// в зависимости от того, новая ли это конструкция или существующая, заменяем текст.
		// проверка на тип источника требуется потому, что внутренние картинки могут идти как с двоеточием в начале, так и без него.
		var $replace;
		switch ( this.sourcetag ) {
			case '':
				$replace = $cotan_preg_img_target.replace ( '%FILE%', ( ( this.source == 'internal' ) ? ( ':?' ) : ( '' ) ) + this.original );
				break
			case 'aimg':
				$replace = $cotan_preg_aimg_target.replace ( '%FILE%', ( ( this.source == 'internal' ) ? ( ':?' ) : ( '' ) ) + this.original );
				break
			case 'cotan':
				$replace = $cotan_preg_cotan_target.replace ( '%FILE%', ( ( this.source == 'internal' ) ? ( ':?' ) : ( '' ) ) + this.original );
				break
			default:
				break
		}

		$replace = new RegExp ( $replace );
		$wiki_text.value = $wiki_text.value.replace ( $replace, $result )
	}

	this.scrape = function ( ) {
		for ( $i in this.bubbles ) {
			if ( this.bubbles[$i] ) this.bubbles[$i].scrape ( )
		}
		this.element.parentNode.removeChild ( this.element );
		$cotan_areas[$cotan_areas.indexOf ( this )] = null
	}

	this.setMode = function ( $mode ) {
		var $area_modes = ['clear', 'whitewash', 'sticker', 'preview'];
		this.mode = '';
		for ( $i in $area_modes ) {
			if ( $mode == $area_modes[$i] ) this.mode = $mode
		}
		if ( this.mode == '' ) this.mode = 'whitewash' // при потере переменной функции? по дефолту? но дефолтный режим ставится в последней строке этой функции
	}

	this.id = $id;
	this.original = $original;
	this.align = $analyze.align;
	this.source = $analyze.source;
	this.relative = $analyze.relative;
	if (
		this.source == 'internal'
		&&
		this.relative
	) {
		this.file = $cotan_media + JSINFO.namespace.replace ( ':', '/') + '/' + $original
	} else if ( this.source == 'internal' ) {
		this.file = $cotan_media + $original.replace ( ':', '/' )
	} else {
		this.file = this.original
	}
	this.sourcetag = $tag;

	this.index = $cotan_areas.length;
	$cotan_areas[this.index] = this;
	this.bubbles = new Array ( );
	this.modeButtons = new Array ( );

	this.element = document.createElement ( 'div' ); // создаём область визуального интерфейса.
	this.element.cotanarea = this;
	this.element.className = 'cotancontainer cotanarea-' + this.id;

	var $toolbar, // объявляем локальные переменные
		$button,
		$temp;

	$toolbar = document.createElement ( 'div' ); // создаём панель .cotan-toolbar
	$toolbar.className = 'cotan-toolbar';
	this.element.appendChild ( $toolbar );

	$button = document.createElement ( 'button' ); // кнопка clear-режима
	$button.cotanarea = this;
	$button.className = 'button toolbutton';
	$button.type = 'button';
	$button.id = 'cotanarea-' + this.id + '-clear';
	$temp = document.createElement ( 'img' );
	$temp.src = '/lib/plugins/cotan/clear.png';
	$button.appendChild ( $temp );
	$temp = document.createElement ( 'span' );
	$temp.appendChild ( document.createTextNode ( $line[4] ) );
	$button.appendChild ( $temp );
	$button.addEventListener (
		'click', function ( ) {
			setMode ( this.cotanarea.id, 'clear' )
		}
	);
	$toolbar.appendChild ( $button );
	this.modeButtons.push ( $button );
	
	$button = document.createElement ( 'button' ); // кнопка whitewash-режима
	$button.cotanarea = this;
	$button.className = 'button toolbutton';
	$button.type = 'button';
	$button.id = 'cotanarea-' + this.id + '-whitewash';
	$temp = document.createElement ( 'img' );
	$temp.src = '/lib/plugins/cotan/whitewash.png';
	$button.appendChild ( $temp );
	$temp = document.createElement ( 'span' );
	$temp.appendChild ( document.createTextNode ( $line[5] ) );
	$button.appendChild ( $temp );
	$button.addEventListener (
		'click', function ( ) {
			setMode ( this.cotanarea.id, 'whitewash' )
		}
	);
	$toolbar.appendChild ( $button );
	this.modeButtons.push ( $button );

	$button = document.createElement ( 'button' ); // кнопка sticker-режима
	$button.cotanarea = this;
	$button.className = 'button toolbutton';
	$button.type = 'button';
	$button.id = 'cotanarea-' + this.id + '-sticker';
	$temp = document.createElement ( 'img' );
	$temp.src = '/lib/plugins/cotan/sticker.png';
	$button.appendChild ( $temp );
	$temp = document.createElement ( 'span' );
	$temp.appendChild ( document.createTextNode ( $line[6] ) );
	$button.appendChild ( $temp );
	$button.addEventListener (
		'click', function ( ) {
			setMode ( this.cotanarea.id, 'sticker' )
		}
	);
	$toolbar.appendChild ( $button );
	this.modeButtons.push ( $button );

	$button = document.createElement ( 'button' ); // кнопка preview-режима
	$button.cotanarea = this;
	$button.className = 'button toolbutton';
	$button.type = 'button';
	$button.id = 'cotanarea-' + this.id + '-preview';
	$temp = document.createElement ( 'img' );
	$temp.src = '/lib/plugins/cotan/preview.png';
	$button.appendChild ( $temp );
	$temp = document.createElement ( 'span' );
	$temp.appendChild ( document.createTextNode ( $line[7] ) );
	$button.appendChild ( $temp );
	$button.addEventListener (
		'click', function ( ) {
			setMode ( this.cotanarea.id, 'preview' )
		}
	);
	$toolbar.appendChild ( $button );
	this.modeButtons.push ( $button );

	$toolbar = document.createElement ( 'div' ); // панель #cotaned_toolbar
	$toolbar.className = 'cotan-toolbar';
	$toolbar.id = 'cotaned_toolbar';
	this.element.appendChild ( $toolbar );

	$button = document.createElement ( 'button' ); // кнопка добавления баллона
	$button.cotanarea = this;
	$button.className = 'button toolbutton';
	$button.type = 'button';
	$button.id = 'cotanarea-' + this.id + '-addbubble';
	$temp = document.createElement ( 'img' );
	$temp.src = '/lib/plugins/cotan/add.png';
	$button.appendChild ( $temp );
	$temp = document.createElement ( 'span' );
	$temp.appendChild ( document.createTextNode ( $line[8] ) );
	$button.appendChild ( $temp );
	$button.onclick = function ( e ) {
		this.cotanarea.addBubble ( e, this )
	};
	$toolbar.appendChild ( $button );

	this.imgarea = document.createElement ( 'div' ); // зона картинки
	this.imgarea.className = 'cotanimgarea';
	this.imgarea.cotanarea = this;
	this.imgarea.ondblclick = function ( e ) { // двойной клик по картинке добавляет баллон
		this.cotanarea.addBubble ( e, this )
	};
	this.element.appendChild ( this.imgarea );
	this.img = document.createElement ( 'img' ); // комикс
	this.img.className = 'cotanimg';
	this.img.src = this.file.replace ( /_media[:\/]\w\w\w?[:\/]/, '_media/' ); // удаление языка из пути картинки
	this.imgarea.appendChild ( this.img );

	$temp = document.createElement ( 'div' ); // защита от закукоживания размечаемых наклеек жёстко по содержимому
	$temp.style.clear = 'both';
	this.imgarea.appendChild ( $temp );
	
	this.spawnBubbles ( $text );
	$cotan.appendChild ( this.element );
	setMode ( this.id, 'whitewash' ) // режим по умолчанию - штукатурка
}

// ###############
// ### BUBBLE ###
// ###############

function Bubbles ( $id, $x, $y, $width, $height, $text, $cotanarea, $new, $rotate, $rounder ) { // объект баллона
	// сначала задаём геттеры и сеттеры. это позволяет баллону менять размеры и положение всякий раз, когда меняются соответствующие параметры.
	if ( $rounder ) {
		this.rads = $rounder // asd скругления
	} else {
		this.rads = ''
	}
	this.__defineGetter__ (
		"radius", function ( ) {
			return this.rads
		}
	)

	this.__defineGetter__ (
		"x", function ( ) {
			return this.left
		}
	)
	this.__defineSetter__ (
		"x", function ( $val ) {
			this.left = $val;
			this.place ( )
		}
	)

	this.__defineGetter__ (
		"y", function ( ) {
			return this.top
		}
	)
	this.__defineSetter__ (
		"y", function ( $val ) {
			this.top = $val;
			this.place ( )
		}
	)

	this.__defineGetter__ (
		"width", function ( ) {
			return this.w
		}
	)
	this.__defineSetter__ (
		"width", function ( $val ) {
			this.w = $val;
			this.resize ( )
		}
	)

	this.__defineGetter__ (
		"height", function ( ) {
			return this.h
		}
	)
	this.__defineSetter__ (
		"height", function ( $val ) {
			this.h = $val;
			this.resize ( )
		}
	)

	this.__defineGetter__ (
		"text", function ( ) {
			return this._text
		}
	)
	this.__defineSetter__ (
		"text", function ( $val ) {
			this._text = $val;
			if ( this.text_element ) this.text_element.innerHTML = renderText ( $val )
		}
	)

	this.__defineGetter__ ( // EvilCat 5.11.2013: добавлен параметр поворота
		"angle", function ( ) {
			return this.r
		}
	)
	this.__defineSetter__ (
		"angle", function ( $val ) {
			this.r = $val;
			this.resize ( )
		}
	)

	this.__defineGetter__ (
		"mode", function ( ) {
			return this.mod
		}
	)
	this.__defineSetter__ (
		"mode", function ( $val ) {
			if ( $val == this.mod ) return;
			if (
				$val != 'normal'
				&&
				this.mod != 'normal'
			) {
				this.mode = 'normal' // отталкиваемся от нормы
			}
			this.mod = $val;
			if ( $val == 'normal' ) {
				if ( this.textedit_element ) {
					this.textedit_element.blur ( );
					this.textedit_element.style.top = '0';
					this.textedit_element.style.zIndex = '';
					this.textedit_element.style.display = 'none'
				}
			} else if ( $val == 'edit' ) {
				if ( this.textedit_element ) {
					this.textedit_element.style.top = this.height + 'px';
					this.textedit_element.style.zIndex = 100;
					this.textedit_element.style.display = 'block'
				}
			} else if ( $val == 'handled' ) {
				if ( this.textedit_element ) this.textedit_element.style.display = 'none'
			}
		}
	)

	this.place = function ( ) { // помещает баллон по текущим координатам
		if ( typeof ( arguments[0] ) != 'undefined' ) {
			this.left = arguments[0];
			this.top = arguments[1]
		}
		this.element.style.top = this.y + 'px';
		this.element.style.left = this.x + 'px'
	}

	this.resize = function ( ) { // задаёт размер баллона в соответствии с параметрами
		this.element.style.width = this.width + 'px';
		this.element.style.height = this.height + 'px';
		
		this.element.style.transform = "transform: rotate(" + this.angle + "deg)"; // EvilCat 5.11.2013: добавлен поворот для рамки
		
		if (
			this.type === 'text'
			&&
			this.cotanarea.mode === 'sticker'
		) { // а вдруг там скроллер?
			this.textedit_element.style.left = '0';
			this.textedit_element.style.top = Math.max ( 70, this.height ) + 1 + 'px';
			this.textedit_element.style.width = Math.max ( 100, ( parseInt ( this.width ) + 18 ) ) + 'px';
			this.textedit_element.style.height = Math.max ( 70, this.height ) + 'px'
		}
	}

	this.handled = function ( e, $handle ) { // эту функцию вызывают ручки, когда их двигают
		// получаем экранные координаты курсора и родительского элемента.
		var $x,
			$y,
			$e,
			$imgareaRect;
		$imgareaRect = this.cotanarea.imgarea.getBoundingClientRect ( );
		$x = parseInt ( e.clientX - $imgareaRect.left );
		$y = parseInt ( e.clientY - $imgareaRect.top );

		// координаты не могут быть за пределами области визуального интерфейса
		if ( $x < 0 ) {
			$x = 0
		} else if ( $x > $imgareaRect.width ) {
			$x = $imgareaRect.width
		}
		if ( $y < 0 ) {
			$y = 0
		} else if ( $y > $imgareaRect.height ) {
			$y = $imgareaRect.height
		}

		if ( $handle == this.move_handle ) { // если двигали ручку перемещения
			this.place ( $x, $y )
		} else if ( $handle == this.size_handle ) { // если двигали ручку размера - минимальные длина и высота
			$x = $x - this.element.offsetLeft;
			if ( $x < 1 ) $x = 1;
			this.width = $x;

			$y = $y - this.element.offsetTop;
			if ( $y < 1 ) $y = 1;
			this.height = $y
		}
	}

	this.scrape = function ( ) { // самоубийство объекта
		if ( this.element ) this.element.parentNode.removeChild ( this.element );
		this.cotanarea.bubbles[this.cotanarea.bubbles.indexOf ( this )] = null
	}

	this.createContainer = function ( ) {
		this.element = document.createElement ( 'div' );
		this.element.bubble = this;
		if (
			this.cotanarea.mode === 'preview'
			||
			this.cotanarea.mode === 'sticker'
		) {
			if (
				this.cotanarea.mode === 'sticker'
				&&
				this.type === 'text'
			) {
				enclass ( this.element, 'bubble' )
			}
			enclass ( this.element, 'ct-area' );
			if ( this.type === 'text' ) this.element.style.zIndex = "1"
		} else {
			enclass ( this.element, 'bubble' )
		}
	}

	this.createView = function ( ) {
		var $div, $temp;
		$div = document.createElement ( 'div' );
		enclass ( $div, 'ct-note' );
		$temp = document.createElement ( 'span' );
		enclass ( $temp, 'ct-note-content' );
		$div.appendChild ( $temp );
		this.element.appendChild ( $div );
		if (
			this.type === 'patch'
			&&
			this.cotanarea.mode != 'whitewash'
		) {
			var $color = 'white';
			$div.style.backgroundColor = 'rgba(' + this.color.R + ',' + this.color.G + ',' + this.color.B + ',' + '1)';
			this.element.style.zIndex = "0"
		} else if ( this.type === 'text' ) {
			this.text_element = document.createElement ( 'p' );
			this.text_element.innerHTML = renderText ( this.text );
			$temp.appendChild ( this.text_element )
		}
	}

	this.createTextarea = function ( ) { // поле ввода, несколько больше основного поля из-за скролла
		this.textedit_element = document.createElement ( 'textarea' );
		this.textedit_element.bubble = this;
		this.textedit_element.onchange = function ( ) {
			this.bubble.text = this.value
		}
		this.element.appendChild ( this.textedit_element );
		this.textedit_element.value = this.text;
		this.textedit_element.style.display = "none";
		this.textedit_element.style.position = "absolute";
		this.textedit_button.tabIndex = "-1";
		this.textedit_button.onclick = function ( ) {
			this.bubble.mode = 'edit';
			if ( this.bubble.fresh ) this.value = '';
			this.bubble.element.style.zIndex = "2";
			this.bubble.textedit_element.style.display = "";
			this.bubble.textedit_element.focus ( );
			$ctnote = document.getElementsByClassName ( 'ct-note' );
			for ( z in $ctnote ) {
				if ( $ctnote[z].style !== undefined ) $ctnote[z].style.display = 'none';
				if ( $ctnote[z].parentNode !== undefined ) $ctnote[z].parentNode.style.background = 'none repeat scroll 0 0 rgba(255,255,255,0)'
			}
		}
		this.textedit_element.onblur = function ( ) {
			this.mode = 'normal';
			if (
				this.bubble.fresh
				&&
				this.value != ''
			) this.bubble.fresh = false;
			this.bubble.textedit_element.style.display = "none";
			this.bubble.element.style.zIndex = "1";
			$ctnote = document.getElementsByClassName ( 'ct-note' );
			for ( z in $ctnote ) {
				if ( $ctnote[z].style !== undefined ) $ctnote[z].style.display = 'table-cell';
				if ( $ctnote[z].parentNode !== undefined ) $ctnote[z].parentNode.style.background = 'none repeat scroll 0 0 rgba(255,255,255,0.8)'
			}
		}
	}

	this.createButtons = function ( ) { // создаём наклеечный интерфейс
		this.move_handle = new nHandle ( this ); // ручка перемещения
		enclass ( this.move_handle.element, 'movehandle' );
		this.element.appendChild ( this.move_handle.element );

		this.size_handle = new nHandle ( this ); // ручка изменения размера
		enclass ( this.size_handle.element, 'sizehandle' );
		this.element.appendChild ( this.size_handle.element );

		this.close_button = document.createElement ( 'div' ); // кнопка удаления
		this.close_button.bubble = this;
		this.close_button.className = "handle closebutton";
		this.close_button.innerHTML = '&nbsp;';
		this.element.appendChild ( this.close_button );

		this.close_button.onclick = function ( e ) { // кнопка удаления учится удалять
			this.bubble.scrape ( );
			e.cancelBubble = true;
			if ( e.stopPropagation ) e.stopPropagation ( )
		}

		if ( // в режиме перевода добавить значок текста
			this.cotanarea.mode === 'sticker'
			&&
			this.type === 'text'
		) {
			this.textedit_button = document.createElement ( 'div' );
			this.textedit_button.bubble = this;
			this.textedit_button.className = "handle texteditbutton";
			this.textedit_button.innerHTML = '&nbsp;';
			this.element.appendChild ( this.textedit_button );
		};

		if ( // в режиме забеливания добавить значок цветности
			this.cotanarea.mode === 'whitewash'
			&&
			this.type === 'patch'
		) {
			this.colorpicker_button = document.createElement ( 'div' );
			this.colorpicker_button.className = "handle colorpickerbutton";
			this.colorpicker_button.innerHTML = '&nbsp;';
			this.element.appendChild ( this.colorpicker_button );
			/* ГДЕ-ТО ВСТАВИТЬ COLORPICKER*/
		}
	}

	this.draw = function ( ) { // основное поле баллона, соответствующее области, при наведении на которую появляется текст
		if ( //поле редактирования текста для "заплаток" не создаём
			(
				this.cotanarea.mode != 'whitewash'
				||
				this.type != 'text'
			)
			&&
			this.cotanarea.mode != 'clear'
		) {
			this.createContainer ( );
			this.createView ( )
		};
		
		if ( // в двух режимах, где требуется наклеечный интерфейс
			(
				this.cotanarea.mode === 'whitewash'
				&&
				this.type === 'patch'
			)
			||
			(
				this.cotanarea.mode === 'sticker'
				&&
				this.type === 'text'
			)
		) this.createButtons ( );

		if (
			this.type === 'text'
			&&
			this.cotanarea.mode === 'sticker'
		) this.createTextarea ( );

		if ( this.element ) {
			this.cotanarea.imgarea.appendChild ( this.element );
			this.place ( );
			this.resize ( )
		}
	}
	
	this.redraw = function ( ) {
		if ( this.textedit_element ) this.textedit_element.parentNode.removeChild ( this.textedit_element );
		this.textedit_element = '';

		if ( this.element ) this.element.parentNode.removeChild ( this.element );
		this.element = '';

		this.draw ( )
	}

	// ниже основное тело конструктора

	this.id = $id;
	this.cotanarea = $cotanarea;
	this.fresh = $new;
	if ( $colpat_preg.test ( $text ) ) {
		var $color = { R: 255, G: 255, B: 255, A: 1 };
		if ( $text.length === 4 ) {
			$color["R"] = parseInt ( $text[1] + $text[1], 16 );
			$color["G"] = parseInt ( $text[2] + $text[2], 16 );
			$color["B"] = parseInt ( $text[3] + $text[3], 16 )
		} else if ( $text.length === 7 ) {
			$color["R"] = parseInt ( $text[1] + $text[2], 16 );
			$color["G"] = parseInt ( $text[3] + $text[4], 16 );
			$color["B"] = parseInt ( $text[5] + $text[6], 16 )
		}
		this.type = 'patch';
		this.color = $color;
		this.text = $text
	} else {
		this.type = 'text';
		this.text = $text
	}
	
	this.draw ( );
	
	this.x = eval ( $x );
	this.y = eval ( $y );
	this.width = eval ( $width );
	this.height = eval ( $height );

	if ( // EvilCat 5.11.2013: добавлен параметр поворота
		typeof (
			$rotate != 'undefined'
		)
	) {
		this.angle = parseFloat ( $rotate ) || 0
	} else {
		this.angle = 0
	}

	this.mode = 'normal'
}

// ##############
// ### HANDLE ###
// ##############

var $cotan_held = null; // в этой переменной хранится перемещаемый или растягиваемый баллон, если таковой есть
function nHandle ( $bubble ) { // объект ручки
	this.bubble = $bubble;
	this.element = document.createElement ( 'div' );
	this.element.button = this;
	this.element.className = 'handle';
	this.element.innerHTML = '&nbsp;';

	this.element.onmousedown = function ( e ) {
		if ( $cotan_held ) return;

		if ( e.button === 0 ) {
			$cotan_held = this.button;
			enclass ( this.button.element, 'dragged' );
			this.button.bubble.mode = 'handled';
			window.onmousemove = function ( e ) {
				if ( !$cotan_held ) return;
				if ( e.button === 0 ) {
					$cotan_held.move ( e )
				} else {
					$cotan_held.drop ( e )
				}
			}

			window.onmouseup = function ( e ) {
				if ( !$cotan_held ) return;
				$cotan_held.drop ( e )
			}
		}

		e.preventDefault ( );
		return false
	}
	
	this.drop = function ( e ) {
		declass ( this.element, 'dragged' );
		this.bubble.handled ( e, this );
		this.bubble.mode = 'normal';
		$cotan_held = null;
		window.onmousemove = null;
		window.onmouseup = null
	}

	this.move = function ( e ) {
		this.bubble.handled ( e, this )
	}
}

function renderText ( $text ) { // обработка шрифтотегов
	var $result = $text;
	function fontsizeReplacer ( str, openSB, value, closeSB, offset, s ) {
		var fontSize = parseFloat ( value );
		if (
			fontSize >= 0.6
			&&
			fontSize <= 6
		) {
			return '<span class = "f' + value.replace ( /\./g, "" ) + '">'
		} else {
			return openSB + '!' + value + closeSB
		}
	}
	//wiki разметка
	$result = $result.replace ( /(\*\*)(.+?)(\*\*)/g, '<strong>$2</strong>' );
	$result = $result.replace ( /(__)(.+?)(__)/g, '<em class = "u">$2</em>' );
	$result = $result.replace ( /(\/\/)(.+?)(\/\/)/g, '<em>$2</em>' );
	$result = $result.replace ( /\\\\/g, '<br \>' );
	$result = $result.replace ( /<fc ([#\w\d]+)>(.+?)<\/fc>/g, '<span style="color: $1">$2</span>' );
	// спецназ
	$result = $result.replace ( /\.\.\./g, '…' );
	$result = $result.replace ( /\(pipe\)/g, '&#124;' );
	$result = $result.replace ( /\[\-\.\]/g, '<span class = "hyph">' );
	$result = $result.replace ( /\-\./g, '&shy;' );
	$result = $result.replace ( /\-\-/g, '–' );
	$result = $result.replace ( /\-\-\-/g, '—' );
	$result = $result.replace ( /\['\]/g, '<strong>&#769;</strong>' );
	$result = $result.replace ( /<(b|h)rr>/g, '<$1r style="clear:both" />' );
	$result = $result.replace ( /\(nbsp\)/g, '&nbsp;' );
	$result = $result.replace ( /\(tab\)/g, '&nbsp;&nbsp;&nbsp;' );
	$result = $result.replace ( /\[<\]/g, '<span class = "vyleft">' );
	$result = $result.replace ( /\[>\]/g, '<span class = "vyright">' );
	$result = $result.replace ( /\[\|\]/g, '<span class = "vycenter">' );
	$result = $result.replace ( /\[\=\]/g, '<span class = "vyjust">' );
	$result = $result.replace ( /\[mir(x|y)\]/g, '<span class = "mir$1">' );
	//гарнитура шрифта
	$result = $result.replace ( /\[ax\]/g, '<span class = "axol">' );
	$result = $result.replace ( /\[df\]/g, '<span class = "fest">' );
	$result = $result.replace ( /\[ft\]/g, '<span class = "dspf">' );
	$result = $result.replace ( /\[sc\]/g, '<span class = "stri">' );
	$result = $result.replace ( /\[lc\]/g, '<span class = "lisi">' );
	$result = $result.replace ( /\[cl\]/g, '<span class = "claw">' );
	$result = $result.replace ( /\[im\]/g, '<span class = "impt">' );
	//размер шрифта
	$result = $result.replace ( /(\[)!(\d\.\d)(\])/g, fontsizeReplacer );
	//стили реплик отдельных персонажей
	//# freefall
	$result = $result.replace ( /\[(flo|sam|hlx|saw|qwe|dvo|edge|blunt|max|rai|kor|mad|mayor|mhlp|pol|mst1?|bow|ish|oth)\]/g, '<span class = "fest $1 f13">' );
	$result = $result.replace ( /\[nio\]/g, '<span class = "fest niomi f13">' );
	$result = $result.replace ( /\[com\]/g, '<span class = "fest edge f13">' );
	//# kitty
	$result = $result.replace ( /\[kit\]/g, '<span class = "fest tsp f12">' );
	$result = $result.replace ( /\[mou\]/g, '<span class = "impt dvo f12">' );
	$result = $result.replace ( /\[mtt\]/g, '<span class = "fest hlx f12">' );
	$result = $result.replace ( /\[nnw\]/g, '<span class = "fest mst f12">' );
	$result = $result.replace ( /\[znt\]/g, '<span class = "fest znt f12">' );
	$result = $result.replace ( /\[ck-\]/g, '<span class = "fest oth f12">' );
	//# lions
	$result = $result.replace ( /\[rel\]/g, '<span class = "fest oth f17">' );
	//# ponies
	$result = $result.replace ( /\[mol\]/g, '<span class = "stri mol f12">' );
	$result = $result.replace ( /\[(tsp|rrp|rdp|fsp|ppp|ajp|sdp|bmp)\]/g, '<span class = "stri $1">' );
	//# ozy
	$result = $result.replace ( /\[(ozy|mil|otr)\]/g, '<span class = "fest $1">' );
	$result = $result.replace ( /\[(ozy|mil|otr)1\]/g, '<span class = "fest $1 f12">' );
	$result = $result.replace ( /\[lle\]/g, '<span class = "impt saw f12">' );
	//# bunny
	$result = $result.replace ( /\[bun\]/g, '<span class = "fest oth f15">' );
	//# ichabod
	$result = $result.replace ( /\[ich\]/g, '<span class = "axol mil f17">' );
	$result = $result.replace ( /\[ich-\]/g, '<span class = "axol oth f17">' );
	//# weegie
	$result = $result.replace ( /\[wee\]/g, '<span class = "impt sdp f45 cl_bold">' );
	//конец стиля
	$result = $result.replace ( /\[\/\]/g, '</span>' );
	return $result
}

function enclass ( $obj, $class ) { // добавление класса
	if (
		!$obj.className.match (
			new RegExp ( '^$', 'i' )
		)
	) {
		$obj.className += ' ';
	}
	if (
		!$obj.className.match (
			new RegExp ( $class, 'i' )
		)
	) {
		$obj.className += $class
	}
}

function declass ( $obj, $class ) { // удаление класса
	$obj.className = $obj.className
					.replace ( $class, '' )
					.replace ( new RegExp ( '(^ | (?= )| $)', 'ig' ), '' )
}
