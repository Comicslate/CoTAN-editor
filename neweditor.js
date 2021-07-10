/* eslint-disable max-classes-per-file */

// ВВОДНЫЕ
// eslint-disable-next-line no-console
console.log ( 'newCoTAN ver. 2021.07.10 23:41 GMT+10', 'Спасибо тебе огромное, Orekh!');
/* global JSINFO, fontChanger */
const { lang: pageLang } = JSINFO;
const ctId = JSINFO.id.replace(/:/g, '/');
const ctNs = JSINFO.namespace.replace(/:/g, '/');
const ctText = [];
const ctTexts = {
  ady: ['Къэгъэсэбэпын', 'Iэтыжын', 'ДэІэпыкъуныгъэ', 'Тхыгъэ', 'ЩIыгъун баллон', 'Оригинал', 'Маскэ', 'Тхыгъэ', 'Къеплъыныгъэ'],
  be: ['Ўжываць', 'Ануляваць', 'Дапамагаць', 'Тэкст', 'Дадаць балон', 'Арыгінал', 'Маскі', 'Тэксты', 'Агляд'],
  bg: ['Приложи', 'Отмени', 'Помощ', 'Текст', 'Добави балон', 'Оригинал', 'Маски', 'Текстове', 'Преглед'],
  da: ['Anvende', 'Annuller', 'Hjælp', 'Tekst', 'Tilføj ballon', 'Original', 'Maske', 'Tekster', 'Eftersyn'],
  de: ['Anwenden', 'Abbrechen', 'Hilfe', 'Text', 'Neuer Aufkleber', 'Originalzeichnung', 'Masken', 'Texte', 'Vorschau'],
  el: ['Ισχύουν', 'Ακύρωση', 'Βοήθεια', 'Κείμενο', 'Προσθέστε μπαλόνι', 'Αρχική', 'Μάσκες', 'Κείμενα', 'Τσεκ-απ'],
  en: ['Apply', 'Cancel', 'Help', 'Text', 'Add balloon', 'Original', 'Masks', 'Texts', 'Checkup'],
  eo: ['Apliki', 'Nuligi', 'Helpo', 'Teksto', 'Aldoni balono', 'Originala', 'Maskoj', 'Tekstoj', 'Inspektado'],
  es: ['Aplicar', 'Cancelar', 'Ayuda', 'Texto', 'Añadir un balón', 'Dibujo original', 'Máscaras', 'Textos', 'Previsión'],
  fi: ['Levitä', 'Peruuta', 'Ohje', 'Teksti', 'Lisää ilmapallo', 'Originaali', 'Maski', 'Tekstit', 'Tarkastus'],
  fr: ['Appliquer', 'Annuler', 'Aide', 'Texte', 'Ajouter ballon', ' Original', 'Masques', 'Textes', 'Apperçu'],
  he: ['החל', 'לבטל', 'לעזור', 'טקסט', 'להוסיף בלון', 'המקורי', 'מסכות', 'טקסטים', 'בדיקה'],
  hi: ['लागू', 'रद्द', 'मदद', 'पाठ', 'जोड़ने के गुब्बारे', 'मूल', 'मास्क', 'ग्रंथों', 'निरीक्षण'],
  hu: ['Alkalmazás', 'Törlés', 'Segítség', 'Szöveg', 'Ballon hozzáadása', 'Eredeti', 'Maszkok', 'Szövegek', 'Ellenőrzés'],
  id: ['Menerapkan', 'Membatalkan', 'Aiuto', 'Teks', 'Tambahkan balon', 'Asli', 'Masker', 'Teks', 'Pemeriksaan'],
  it: ['Applicare', 'Annulla', 'Membantu', 'Testo', 'Aggiungere il pallone', 'Originale', 'Maschere', 'Testi', 'Verifica'],
  ja: ['適用', '消', '助', 'テキスト', '追加のバルーン', '独自の', 'マスク', 'テキスト', '検査'],
  ko: ['적용', '취소', '도움말', '텍스트', '추가 풍선', '래', '마', '텍스트', '검사'],
  pl: ['Stosować', 'Anulować', 'Pomagać', 'Tekst', 'Dodaj balon', 'Oryginał', 'Maski', 'Teksty', 'Przegląd'],
  pt: ['Aplicar', 'Cancelar', 'Ajuda', 'Texto', 'Adicionar balão', 'Original', 'Máscara', 'Textos', 'Exame'],
  ru: ['Применить', 'Отменить', 'Помощь', 'Текст', 'Добавить баллон', 'Оригинал', 'Маски', 'Тексты', 'Осмотр'],
  sib: [],
  sjn: [],
  uk: ['Застосовувати', 'Анулювати', 'Допомагати', 'Текст', 'Додати балон', 'Оригінал', 'Маски', 'Тексти', 'Огляд'],
  zh: ['申请', '取消', '救命', '文本', '添加气球', '原创', '面具', '短信', '检查'],
  default: ['Apply', 'Cancel', 'Help', 'Text', 'Add balloon', 'Original', 'Masks', 'Texts', 'Checkup'],
};

const cotanPath = '/lib/plugins/cotan/img/';
const cotanMediaUrl = `${document.location.origin}/_media/`; // адрес до первого слеша

ctTexts.default = ctTexts.en;
ctTexts.sib = ctTexts.ru;
ctTexts.sjn = ctTexts.en;
for (let i = 0; i < ctTexts.default.length; i += 1) {
  ctText[i] = ctTexts[pageLang][i] || ctTexts.default[i];
}

const LOCALIZED = {
  APPLY: '0',
  CANCEL: '1',
  HELP: '2',
  TEXT: '3',
  ADD_BALLOON: '4',
  ORIGINAL: '5',
  MASKS: '6',
  TEXTS: '7',
  CHECKUP: '8',
};

Object.entries(LOCALIZED).forEach(([key, index]) => {
  const i = Number(index);
  LOCALIZED[key] = ctTexts[pageLang][i] || ctTexts.default[i];
});

/**
 * Create HTMLElement
 * @param {string} tag tagname
 * @param {object} [props] attributes
 * @param {HTMLElement[]} [children] child nodes
 * @returns {HTMLElement}
 */
function h(tag, props = {}, children = []) {
  const element = Object.assign(document.createElement(tag), props);
  element.append(...children);
  return element;
}

const AREA_MODE = {
  CLEAR: 'clear',
  WHITEWASH: 'whitewash',
  STICKER: 'sticker',
  PREVIEW: 'preview',
};

const BUBBLE_TYPE = {
  TEXT: 'text',
  PATCH: 'patch',
  REMOVED: 'removed',
};

/**
 * Converts bubbles marked text into html
 * @param {string} text marked text
 * @returns {string} html
 */
function renderText(text) {
  // обработка шрифтотегов
  let result = text;
  // wiki разметка
  result = result
    .replaceAll('<', '&lt;')
    .replace(/(\*\*)(.+?)(\*\*)/g, '<strong>$2</strong>')
    .replace(/(__)(.+?)(__)/g, '<em class = "u">$2</em>')
    .replace(/(\/\/)(.+?)(\/\/)/g, '<em>$2</em>')
    .replace(/\\\\( +\n?|\n)/g, '<br >');
  // спецназ
  result = result
    .replaceAll('...', '…')
    .replaceAll('(pipe)', '&#124;')
    .replaceAll('-.', '&shy;')
    .replaceAll('--', '–')
    .replaceAll('---', '—')
    .replaceAll("[']", '<strong>&#769;</strong>')
    .replaceAll('&lt;brr>', '<br style="clear:both" />')
    .replaceAll('&lt;hrr>', '<hr style="clear:both" />')
    .replaceAll('(nbsp)', '&nbsp;')
    .replaceAll('(tab)', '&nbsp;&nbsp;&nbsp;');
  // [bbcode]
  result = result.replaceAll(/\[(flo|sam|hlx|saw|qwe|dvo|edge|blunt|max|rai|kor|mad|mayor|mhlp|nio|pol|mst1?|bow|com|ish|gre|vag|ops|oth)\]/g, '<span class = "$1">'); //# freefall
  result = result.replace(/\[(.*?)\]/g, (orig, escapedName) => {
    const name = escapedName.replace('&lt;', '<');
    const replacements = {
      '-.': 'hyph',
      '<': 'vyleft',
      '>': 'vyright',
      '|': 'vycenter',
      '=': 'vyjust',
      mirx: 'mirx',
      miry: 'miry',
      '@': 'anim_mor',
      // font
      ax: 'axol',
      df: 'fest',
      ft: 'dspf',
      sc: 'stri',
      lc: 'lisi',
      cl: 'claw',
      im: 'impt',
      lu: 'lucl',
      aa: 'aace',
      ta: 'tean',
      fa: 'fawe',
      sp: 'spac',
      un: 'unic',
      // kitty
      kit: ['fest tsp', 1.2],
      mou: ['impt dvo', 1.2],
      mtt: ['fest hlx', 1.2],
      nnw: ['fest mst', 1.2],
      znt: ['fest znt', 1.2],
      'ck-': ['fest oth', 1.2],
      // lions
      rel: ['fest oth', 1.7],
      // ponies
      mol: ['stri mol', 1.2],
      tsp: 'stri tsp',
      rrp: 'stri rrp',
      rdp: 'stri rdp',
      fsp: 'stri fsp',
      ppp: 'stri ppp',
      ajp: 'stri ajp',
      sdp: 'stri sdp',
      bmp: 'stri bmp',
      // ozy
      ozy: 'fest ozy',
      mil: 'fest mil',
      otr: 'fest otr',
      ozy1: ['fest ozy', 1.2],
      mil1: ['fest mil', 1.2],
      otr1: ['fest otr', 1.2],
      lle: ['impt saw', 1.2],
      // bunny
      bun: ['fest oth', 1.5],
      // ichabod
      ich: ['axol mil', 1.7],
      'ich-': ['axol oth', 1.7],
      // weegie
      wee: 'impt sdp f45 cl_bold',
    };

    const replacement = replacements[name];

    if (Array.isArray(replacement)) {
      const [className, fontSize] = replacement;
      return `<span class="${className}" style="font-size:${fontSize}em">`;
    }

    if (replacement) return `<span class="${replacement}">`;

    return orig;
  });

  result = result.replace(/(\[)(.)(-?\d+[.,]?\d*)(\])/g, fontChanger); // размер и разрядка шрифта
  // плагин typography
  result = result
    .replace(/&lt;typo (.+?)>(.+?)&lt;\/typo>/g, '<span style = "$1">$2</span>')
    .replace(/"fc:/g, 'color:')
    .replace(/&lt;fc (.+?)>(.+?)&lt;\/fc>/g, '<span style = "color: $1">$2</span>')
    .replace(/"bg:/g, 'background-color:')
    .replace(/&lt;bg (.+?)>(.+?)&lt;\/bg>/g, '<span style = "background-color: $1">$2</span>')
    .replace(/"fs:/g, 'font-size:')
    .replace(/&lt;fs (.+?)>(.+?)&lt;\/fs>/g, '<span style = "font-size: $1">$2</span>')
    .replace(/"fw:/g, 'font-weight:')
    .replace(/&lt;fw (.+?)>(.+?)&lt;\/fw>/g, '<span style = "font-weight: $1">$2</span>')
    .replace(/"fv:/g, 'font-variant:')
    .replace(/"ff:/g, 'font-family:')
    .replace(/&lt;ff (.+?)>(.+?)&lt;\/ff>/g, '<span style = "font-family: $1">$2</span>')
    .replace(/"lh:/g, '"line-height:')
    .replace(/"ls:/g, '"letter-spacing:')
    .replace(/"ws:/g, '"word-spacing:')
    .replace(/"sp:/g, '"white-space:')
    .replace(/"va:/g, '"vertical-align:')
    .replace(/"tt:/g, '"text-transform:')
    .replace(/"ts:/g, '"text-shadow:');
  result = result
    .replace(
      /\{\{ ?http([^[\]}{|>]+?)(\?nolink)?[&?]?(\d+)? ?\}\}/g,
      '<img src = "http$1" class = "media" alt = "" width = "$3">',
    )
    .replace(
      /\{\{ ?([^[\]}{|>]+?)(\?nolink)?[&?]?(\d+)? ?\}\}/g,
      `<img src = "/_media/${ctId.substr(
        ctId.indexOf('/') + 1,
      )}/$1" class = "media" alt = "" width = "$3">`,
    )
    .replace(
      /\[\[ ?(..)w>([^\][|>]+?) ?\| ?([^\][|>]+?) ?\]\]/g,
      `<a
        href="https://$1.wikipedia.org/wiki/$2"
        class="interwiki iw_$1w"
        target="_blank"
        title="https://$1.wikipedia.org/wiki/$2"
        rel="noopener"
      >$3</a>`,
    )
    .replace(
      /\[\[ ?(..)w>([^\][|>]+?) ?\]\]/g,
      `<a
        href="https://$1.wikipedia.org/wiki/$2"
        class="interwiki iw_$1w"
        target="_blank"
        title="https://$1.wikipedia.org/wiki/$2"
        rel="noopener"
      >$2</a>`,
    )
    .replace(
      /\[\[ ?http([^\][|>]+?) ?\| ?([^\][|>]+) ?\]\]/g,
      `<a
        href="http$1"
        class="urlextern"
        target="_blank"
        title="http$1"
        rel="nofollow
        noopener"
      >$2</a>`,
    )
    .replace(
      /\[\[ ?http([^\][|>]+?) ?\]\]/g,
      `<a
        href="http$1"
        class="urlextern"
        target="_blank"
        title="http$1"
        rel="nofollow
        noopener"
      >$1</a>`,
    )
    .replace(
      /\[\[ ?([^\]|]+?) ?\| ?([^\]|]+?) ?\]\]/g,
      '<a class = "wikilink1" href = "$1" >$2</a>',
    ) // только [[ | ]], и класс wikilink1 привязан напостоянно!
    .replace(/%%(.+)%%/g, '<pre>$1</pre>') // защита от невидимых тегов
    .replace(/ ?width="" ?/g, ' ')
    .replace(/\[\/\]/g, '</span>'); // конец стиля
  return result;
}

// ##############
// ### HANDLE ###
// ##############

/**
 * Set mouse move actions on element
 * @param {HTMLElement} element input element
 * @param {function()} grab action callback
 * @param {function(number, number)} drag action callback
 * @param {function()} drop action callback
 * @param {number} button button pressed, 0 = LMB, 1 = CMB, 2 = RMB
 * @returns {HTMLElement} input element
 */
function makeDraggable(element, grab, drag, drop, button) {
  // call action with coords delta on dragging
  const onmousemove = (mouseEvent) => {
    const { movementX, movementY } = mouseEvent;
    drag(movementX, movementY);
  };
  // remove move listener on drop
  const onmouseup = (mouseEvent) => {
    window.removeEventListener('mousemove', onmousemove);
    window.removeEventListener('mouseup', onmouseup);
    drop();
    mouseEvent.preventDefault();
  };
  // add mousemove event listener on start dragging
  element.addEventListener('mousedown', (mouseEvent) => {
    if (mouseEvent.button !== button) return;
    window.addEventListener('mousemove', onmousemove);
    window.addEventListener('mouseup', onmouseup);
    grab();
    mouseEvent.preventDefault();
  });
  if (button === 2) {
    element.addEventListener('contextmenu', (mouseEvent) => mouseEvent.preventDefault());
  }
  return element;
}

class BorderRadius {
  /**
   * Parse BorderRadius form css style
   * @param {string} str css text
   * @param {number} width bubble size
   * @param {number} height bubble size
   */
  constructor(str, width, height) {
    const parce = (part) => {
      let varlen = part.split(' ').filter((s) => s.length);
      if (varlen.length === 0) varlen = ['5px'];
      return [
        [0, 0, 0, 0],
        [0, 1, 0, 1],
        [0, 1, 2, 1],
        [0, 1, 2, 3],
      ][Math.min(varlen.length - 1, 3)].map((i) => varlen[i]);
    };
    const toPx = (s, side) => {
      const n = parseFloat(s);
      if (Number.isNaN(n)) return 5;
      if (!s.includes('%')) return n;
      return Math.round(n * (side / 100));
    };
    const parts = str.split('/');
    const hor = parce(parts[0]).map((v) => toPx(v, width));
    const ver = parce(parts[1] || parts[0]).map((v) => toPx(v, height));

    this.topLeft = [hor[0], ver[0]];
    this.topRight = [hor[1], ver[1]];
    this.bottomRight = [hor[2], ver[2]];
    this.bottomLeft = [hor[3], ver[3]];
  }

  clamp(width, height) {
    const clamp = (arr) => {
      const hor = Math.max(0, Math.min(arr[0], width));
      const ver = Math.max(0, Math.min(arr[1], height));
      // eslint-disable-next-line no-param-reassign
      arr[0] = hor;
      // eslint-disable-next-line no-param-reassign
      arr[1] = ver;
    };
    clamp(this.topLeft);
    clamp(this.topRight);
    clamp(this.bottomRight);
    clamp(this.bottomLeft);
  }

  toString() {
    const hor = [
      `${Math.round(this.topLeft[0])}px`,
      `${Math.round(this.topRight[0])}px`,
      `${Math.round(this.bottomRight[0])}px`,
      `${Math.round(this.bottomLeft[0])}px`,
    ].join(' ');
    const ver = [
      `${Math.round(this.topLeft[1])}px`,
      `${Math.round(this.topRight[1])}px`,
      `${Math.round(this.bottomRight[1])}px`,
      `${Math.round(this.bottomLeft[1])}px`,
    ].join(' ');
    return `${hor} / ${ver}`;
  }
}

// ##############
// ### BUBBLE ###
// ##############

class Bubble {
  /**
   * Construct Bubble
   * @param {object} aabb
   * @param {number} aabb.x0
   * @param {number} aabb.y0
   * @param {number} aabb.x1
   * @param {number} aabb.y1
   * @param {number} rotate
   * @param {string} borderRadius
   * @param {string} rawBodyText
   * @param {HTMLImageElement} image
   * @returns {Bubble} bubble
   */
  constructor(
    aabb,
    rotate,
    borderRadius,
    rawBodyText,
    image,
  ) {
    this.image = image;

    // is color?
    const matchesOrNull = rawBodyText.toLowerCase().match(/^#([0-9a-f]{3}|[0-9a-f]{6})?$/);
    if (matchesOrNull) {
      let [color, hex] = matchesOrNull;
      if (color.length === 1) color = '#ffffff';
      if (color.length === 4) {
        hex = hex.split('').map((c) => c + c).join('');
        color = `#${hex}`;
      }
      this.type = BUBBLE_TYPE.PATCH;
      this.rawBodyText = color;
    } else if (rawBodyText.startsWith('#%') || rawBodyText.startsWith('#*')) {
      this.type = BUBBLE_TYPE.PATCH;
      this.rawBodyText = rawBodyText;
    } else {
      this.type = BUBBLE_TYPE.TEXT;
      this.rawBodyText = rawBodyText;
    }

    this.aabb = aabb;
    const [, , width, height] = this.coords();
    this.borderRaduis = new BorderRadius(borderRadius, width, height);
    this.rotate = rotate;
  }

  updateStyle() {
    const [x, y, width, height] = this.coords();
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
    this.element.style.transform = `transform: rotate(${this.rotate}deg)`;
    this.note.style.borderRadius = this.borderRaduis;

    if (this.type === BUBBLE_TYPE.TEXT) {
      this.note.style.background = 'transparent';
      return;
    }

    // PATCH
    let bg = '';
    const args = this.rawBodyText.slice(2);
    if (this.rawBodyText.startsWith('#%')) {
      bg = `linear-gradient(${args})`;
    } else if (this.rawBodyText.startsWith('#*')) {
      bg = `radial-gradient(${args})`;
    } else {
      bg = this.rawBodyText;
    }

    this.note.style.background = bg;
  }

  remove() {
    // самоубийство объекта
    this.element.classList.remove(`ct-area_${this.type}`);
    this.type = BUBBLE_TYPE.REMOVED;
    this.element.classList.add('ct-area_removed');
  }

  coords() {
    const x = Math.min(this.aabb.x0, this.aabb.x1);
    const y = Math.min(this.aabb.y0, this.aabb.y1);
    const width = Math.max(this.aabb.x0, this.aabb.x1) - x;
    const height = Math.max(this.aabb.y0, this.aabb.y1) - y;
    return [x, y, width, height];
  }

  clampAabb() {
    const x0 = Math.min(this.aabb.x0, this.aabb.x1);
    const y0 = Math.min(this.aabb.y0, this.aabb.y1);
    const x1 = Math.max(this.aabb.x0, this.aabb.x1);
    const y1 = Math.max(this.aabb.y0, this.aabb.y1);
    const canvasWidth = this.image.width || Infinity;
    const canvasHeight = this.image.height || Infinity;
    const clamp = (min, v, max) => Math.max(min, Math.min(v, max));
    this.aabb.x0 = clamp(0, x0, canvasWidth - 1);
    this.aabb.y0 = clamp(0, y0, canvasHeight - 1);
    this.aabb.x1 = clamp(1, x1, canvasWidth);
    this.aabb.y1 = clamp(1, y1, canvasHeight);
  }

  clampRounder() {
    const [, , width, height] = this.coords();
    this.borderRaduis.clamp(width, height);
  }

  draw() {
    const mainClassName = `ct-area ct-area_${this.type}`;

    const texteditButton = h('div', { bubble: this, className: 'handle texteditbutton' });
    this.textedit_button = texteditButton;

    /**
     * Create drag handle
     * @param {string} className
     * @param {number} x0
     * @param {number} y0
     * @param {number} x1
     * @param {number} y1
     * @returns {HTMLElement}
     */
    const handle = (className, x0, y0, x1, y1) => makeDraggable(
      h('div', { className }),
      () => this.element.classList.add('ct_drag'),
      (x, y) => {
        this.aabb.x0 += x * x0;
        this.aabb.y0 += y * y0;
        this.aabb.x1 += x * x1;
        this.aabb.y1 += y * y1;
        this.updateStyle();
      },
      () => {
        this.clampAabb();
        this.updateStyle();
        this.element.classList.remove('ct_drag');
      },
      0,
    );

    const rounder = (element, corner) => {
      const action = {
        tl: (x, y) => {
          this.borderRaduis.topLeft[0] += x;
          this.borderRaduis.topLeft[1] += y;
          this.updateStyle();
        },
        tr: (x, y) => {
          this.borderRaduis.topRight[0] -= x;
          this.borderRaduis.topRight[1] += y;
          this.updateStyle();
        },
        bl: (x, y) => {
          this.borderRaduis.bottomLeft[0] += x;
          this.borderRaduis.bottomLeft[1] -= y;
          this.updateStyle();
        },
        br: (x, y) => {
          this.borderRaduis.bottomRight[0] -= x;
          this.borderRaduis.bottomRight[1] -= y;
          this.updateStyle();
        },
      }[corner];
      return makeDraggable(
        element,
        () => this.element.classList.add('ct_drag'),
        action,
        () => {
          this.clampRounder();
          this.updateStyle();
          this.element.classList.remove('ct_drag');
        },
        2,
      );
    };

    this.colorpickInput = h('input', {
      type: 'color',
      value: this.rawBodyText,
      className: 'ct-colorpick-input',
      oninput: () => {
        this.textarea.value = this.colorpickInput.value;
        this.rawBodyText = this.colorpickInput.value;
        this.updateStyle();
      },
    });

    this.textarea = h('textarea', {
      className: 'ct-textarea',
      value: this.rawBodyText,
      oninput: () => {
        this.colorpickInput.value = this.textarea.value;
        this.updateText(this.textarea.value);
      },
    });

    this.element = h('div', { bubble: this, className: mainClassName }, [
      this.note = h('div', { className: 'ct-note' }, [
        // this.text_element = h('span', { className: 'ct-note-content' }),
      ]),
      h('div', { className: 'ct-ui' }, [
        handle('ct-dragArea', 1, 1, 1, 1),

        handle('ct-handle ct-handle_tm', 0, 1, 0, 0),
        handle('ct-handle ct-handle_bm', 0, 0, 0, 1),
        handle('ct-handle ct-handle_lm', 1, 0, 0, 0),
        handle('ct-handle ct-handle_rm', 0, 0, 1, 0),

        rounder(handle('ct-handle ct-handle_tl', 1, 1, 0, 0), 'tl'),
        rounder(handle('ct-handle ct-handle_tr', 0, 1, 1, 0), 'tr'),
        rounder(handle('ct-handle ct-handle_bl', 1, 0, 0, 1), 'bl'),
        rounder(handle('ct-handle ct-handle_br', 0, 0, 1, 1), 'br'),

        h('div', { className: 'ct-remove', onclick: () => this.remove() }),
        h('div', { className: 'ct-spoiler' }, [
          this.colorpickInput,
          this.textarea,
        ]),
      ]),
    ]);

    if (this.type === BUBBLE_TYPE.TEXT) {
      this.note.innerHTML = renderText(this.rawBodyText);
    } else {
      this.note.innerHTML = '';
    }

    this.updateStyle();
    return this.element;
  }

  updateText(text) {
    this.rawBodyText = text;
    this.note.innerHTML = renderText(text);
  }

  /**
   * Parse string to Bubble
   * @param {string} input string represents bubble
   * @returns {Bubble | null} returns Bubble or null if err
   */
  static fromString(input, image) {
    const bubbleParts = input.match(/^@(.*?)(;.*?)?\n([\w\W]*?)\n~\n$/);
    if (!bubbleParts) return null;
    const [, coordsStr, rounderPart, rawBodyText] = bubbleParts;

    const coordsParts = coordsStr.match(/^([^,]+),([^,]+),([^,]+),([^,]+),?([^,]+)?$/);
    if (!coordsParts) return null;
    const coords = coordsParts
      .slice(1) // skip input group
      .filter((expr) => expr !== undefined) // skip rotate if not exist
      .map((expr) => expr // parse numbers and compute sum
        .match(/[+-]?[^+-]*/g)
        .map(Number)
        .reduce((a, b) => a + b));
    if (coords.find(Number.isNaN)) return null;
    const [y, x, width, height, rotate] = coords;

    // rounder not have any validation, huh?
    const rounder = rounderPart ? rounderPart.slice(1) : '';

    const aabb = {
      x0: x,
      y0: y,
      x1: x + width,
      y1: y + height,
    };
    return new Bubble(aabb, rotate, rounder, rawBodyText, image);
  }

  toString() {
    if (this.type === BUBBLE_TYPE.REMOVED) return '';
    const [x, y, width, height] = this.coords();
    let header = `@${y},${x},${width},${height}`;
    if (this.rotate) header += `,${this.rotate}`;
    if (
      this.type === BUBBLE_TYPE.PATCH
      && this.borderRaduis.toString() !== '5px 5px 5px 5px / 5px 5px 5px 5px'
    ) {
      header += `;${this.borderRaduis}`;
    }
    let { rawBodyText } = this;
    if (rawBodyText === '#ffffff') {
      rawBodyText = '#';
    }
    return `${header}\n${rawBodyText}\n~\n`;
  }
}

// ############
// ### AREA ###
// ############

class ComicArea {
  /**
   * Construct VisArea
   * @param {string} imageLink canvas image
   * @param {string} rawBodyText serialized bubbles
   * @returns {ComicArea} VisArea
   */
  constructor(imageLink, rawBodyText) {
    this.original = imageLink;
    if (!/^https?:\/\//.test(imageLink)) {
      this.file = `${cotanMediaUrl + ctNs}/${imageLink}`;
    } else {
      this.file = this.original;
    }
    this.file = this.file.replace(/_media[:/]\w\w\w?[:/]/, '_media/'); // удаление языка из пути картинки

    this.modeButtons = {};
    const createRadio = (mode, label) => {
      const button = h('button', {
        className: 'button toolbutton',
        onclick: () => this.setMode(mode),
      }, [
        h('img', { src: `${cotanPath + mode}.png` }), label,
      ]);
      this.modeButtons[mode] = button;
      return button;
    };

    /**
     * Add Bubble
     * @param {MouseEvent} mouseEvent
     */
    const addBubble = (mouseEvent) => {
      if (mouseEvent.target !== mouseEvent.currentTarget) return;
      this.addBubble(mouseEvent.offsetX, mouseEvent.offsetY);
      mouseEvent.preventDefault();
    };
    // создаём область визуального интерфейса.
    this.domContainer = h('div', { className: 'cotan-container' }, [
      h('div', { className: 'cotan-modebar' }, [ // modeSwitch
        createRadio(AREA_MODE.CLEAR, LOCALIZED.ORIGINAL),
        createRadio(AREA_MODE.WHITEWASH, LOCALIZED.MASKS),
        createRadio(AREA_MODE.STICKER, LOCALIZED.TEXTS),
        createRadio(AREA_MODE.PREVIEW, LOCALIZED.CHECKUP),
      ]),
      h('div', {}, [ // TODO: remove id cotaned_toolbar
        this.addbutton = h('button', { className: 'button toolbutton', onclick: addBubble }, [
          h('img', { src: `${cotanPath}add.png` }), LOCALIZED.ADD_BALLOON,
        ]),
      ]),
      this.imgarea = h('div', { className: 'cotanimgarea' }, [
        this.image = h('img', { className: 'cotanimg', src: this.file, ondblclick: addBubble }),
      ]),
    ]);

    // WTF
    /* вставка чужих картинок 21.07.2019 */
    if (ctId.match('sci-fi/freefall') != null) {
      let langWork;
      let fileExt;
      const urlNum = window.location.href.match(/[:/](\d\d\d\d)/i);
      if (urlNum != null) {
        const langNum = Number(urlNum[1]);
        switch (pageLang) {
          case 'da':
            langWork = +(langNum < 498);
            fileExt = '.gif';
            break;
          case 'de':
            langWork = +(langNum <= 568);
            fileExt = '.gif';
            break;
          case 'hu':
            langWork = +(langNum <= 2513);
            fileExt = '.gif';
            break;
          case 'it':
            langWork = +(langNum <= 3172);
            fileExt = '.png';
            break;
          case 'pl':
            langWork = +(
              langNum <= 760
              && langNum !== 554
              && langNum !== 670
            );
            fileExt = '.gif';
            break;
          default:
            break;
        }
      }
      if (langWork) {
        const newImg = document.createElement('img');
        newImg.src = `/_media/sci-fi/freefall/${pageLang}/${urlNum[1]}${fileExt}`;
        newImg.style = 'width: 982px; margin-top: 15px;';
        this.domContainer.append(newImg);
      }
    }

    this.body = [];
    this.spawnBubble(rawBodyText);
    this.setMode('whitewash'); // режим по умолчанию - штукатурка
  }

  addBubble(x, y) {
    const width = 128;
    const height = 64;
    const rotate = 0;
    const borderRadius = '';

    let rawBodyText = '';
    if (this.mode === AREA_MODE.WHITEWASH) {
      rawBodyText = '#';
    } else if (this.mode === AREA_MODE.STICKER) {
      rawBodyText = LOCALIZED.TEXT;
    } else {
      return;
    }
    const aabb = {
      x0: x,
      y0: y,
      x1: x + width,
      y1: y + height,
    };

    const bubble = new Bubble(aabb, rotate, borderRadius, rawBodyText, this.image);
    this.imgarea.appendChild(bubble.draw());
    this.body.push(bubble);
  }

  spawnBubble(text) {
    if (!text) return;
    const matches = text.match(/@[\w\W]+?\n~\n|[\w\W]*?\n|.*/g);
    this.body = [...matches].map((fragment) => {
      const bubble = Bubble.fromString(fragment, this.image);
      if (bubble) {
        this.imgarea.appendChild(bubble.draw());
        return bubble;
      }
      return fragment;
    });
  }

  toString() {
    const rawBodyText = this.body.join('');
    if (rawBodyText.trim() === '') return `{{${this.original}}}`;
    return `{{cotan>${this.original}}}${rawBodyText}{{<cotan}}`;
  }

  remove() {
    this.domContainer.remove();
  }

  setMode(mode) {
    this.domContainer.classList.remove(`cotan_${this.mode}`);
    this.domContainer.classList.add(`cotan_${mode}`);
    this.mode = mode;

    Object.entries(this.modeButtons).forEach(([key, button]) => {
      const isActive = mode === key;
      button.classList.toggle('active', isActive);
    });

    this.addbutton.disabled = mode === AREA_MODE.CLEAR || mode === AREA_MODE.PREVIEW;
  }
}

/**
 * Функция поиска картинки/разметки и обработки их
 * @param {string} wikitext Строка с разметкой
 * @param {HTMLElement} cotanContainer Элемент, к котрому прикремляются комиксы
 * @returns {Array.<string|ComicArea>} wikitext Строка с разметкой
 */
function doMatch(wikitext, cotanContainer) {
  const pattern = /{{(.+?)>(.+?)}}([\w\W]*?){{<.*?}}|{{([^>}]+>)?(.+?)}}|[^{]+|{/gi;
  return [...wikitext.matchAll(pattern)].map((groups) => {
    const [all, tag, tagLink, raw, plainTag, plainImageLink] = groups;
    if (tag !== 'cotan' && tag !== 'aimg' || plainTag) return all;
    const link = tagLink || plainImageLink;
    if (link === undefined) return all;
    const area = new ComicArea(link, raw);
    cotanContainer.appendChild(area.domContainer);
    return area;
  });
}

/**
 * Открыть \ закрыть редактор
 * @param {object} state Переключаемое состояние
 * @param {boolean} withSave Сохранить изменения, если это выход из редактора
 * @param {MouseEvent} stopMe Сохранить изменения, если это выход из редактора
 */
function toggleCotan(state, withSave, stopMe) {
  stopMe.preventDefault();

  const show = (el) => el.style.removeProperty('display');
  const hide = (el) => el.style.setProperty('display', 'none');

  const siteUI = [...document.querySelectorAll(
    '#wiki__text, .level1, .toolbar, #pagetools, .editButtons',
  )];

  if (!state.isActivated) {
    show(state.cotanContainer);
    siteUI.forEach(hide);
    // eslint-disable-next-line no-param-reassign
    state.wikitextParts = doMatch(state.wikitextTextarea.value || '', state.cotanContainer);
    // eslint-disable-next-line no-param-reassign
    state.form.onsubmit = (event) => event.preventDefault();
  } else {
    hide(state.cotanContainer);
    siteUI.forEach(show);

    // eslint-disable-next-line no-param-reassign
    if (withSave) state.wikitextTextarea.value = state.wikitextParts.join('');

    state.wikitextParts
      .filter((area) => area instanceof ComicArea)
      .forEach((area) => area.remove());
    // eslint-disable-next-line no-param-reassign
    state.wikitextParts = [];
    // eslint-disable-next-line no-param-reassign
    state.form.onsubmit = null;
  }

  // eslint-disable-next-line no-param-reassign
  state.isActivated = !state.isActivated;
}
/**
 * Вставит котан-редактор и кнопку его запуска
 */
function cotanedit() {
  const wikitextTextarea = document.getElementById('wiki__text');
  const cancelButton = document.getElementById('edbtn__cancel');
  // ленты имеют url вида /d0000 или h0000 и на них редактор не должен быть запущен
  if (window.location.href.match(/\/(d|h)\d+/i) || !wikitextTextarea || !cancelButton) return;

  const cotanContainer = h('div', { className: 'cotan', style: 'display:none' });

  const state = {
    wikitextTextarea,
    wikitextParts: [],
    isActivated: false,
    cotanContainer,
    form: document.getElementById('dw__editform'),
  };

  const cotanButton = h('input', {
    type: 'button',
    accessKey: 'N',
    value: 'newCoTAN',
    id: 'newcotan-editor',
    title: 'CoTAN [N]',
    onclick: (event) => toggleCotan(state, true, event),
  });
  cancelButton.after(cotanButton);

  const cotanSaveButton = h('button', {
    className: 'button green toolbutton',
    accessKey: 'A',
    title: `${LOCALIZED.APPLY} [A}]`,
    onclick: (event) => toggleCotan(state, true, event),
  }, [
    h('img', { src: `${cotanPath}accept.png` }), LOCALIZED.APPLY,
  ]);

  const cotanCancelButton = h('button', {
    className: 'button toolbutton',
    accessKey: 'Q',
    title: `${LOCALIZED.CANCEL} [Q]`,
    onclick: (event) => toggleCotan(state, false, event),
  }, [
    h('img', { src: `${cotanPath}cancel.png` }), LOCALIZED.CANCEL,
  ]);

  const helpButton = h('button', { className: 'button toolbutton' }, [
    h('a', { href: `/${pageLang}/wiki/12balloons`, target: '_blank' }, [
      h('img', { src: `${cotanPath}help.png` }), LOCALIZED.HELP,
    ]),
  ]);

  const cotanToolbar = h('div', { className: 'cotan-toolbar' }, [
    cotanSaveButton, cotanCancelButton, helpButton,
  ]);

  cotanContainer.append(cotanToolbar);
  wikitextTextarea.after(cotanContainer);
}

// запуск функции cotanedit() при загрузке страницы
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', cotanedit, false);
} else {
  cotanedit();
}
