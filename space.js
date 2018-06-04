/**
 * スペースを整形します。
 *
 * -----------------------------------------
 * var a =  123;
 * var aaa = 23333;
 * -----------------------------------------
 * ↓
 * -----------------------------------------
 * var a   = 123;
 * var aaa = 23333;
 * -----------------------------------------
 *
 * マクロの設定
 *   設定 > 共通設定 > マクロ
 *    1. 適当な番号に割り当てる
 *    2. 「マクロを実行するたびにファイルを読み直す」を選択
 *
 * 実行方法
 *   テーブル部分を選択してマクロを実行する
 *
 * （任意で）
 *   設定 > 共通設定 > キー割り当て
 *    1. 種別 > 外部マクロ
 *    2. space.js
 *    3. Alt+S に割り当てる
 *
 */
Array.prototype.each = function(fn) {
  for (var i = 0, l = this.length; i < l; ++i) {
    fn(this[i], i);
  }
}
Array.prototype.map = function(fn) {
  var buf = [];
  this.each(function(e, i) {
    buf[i] = fn(e, i);
  });
  return buf;
}
Array.prototype.accumulate = function(ini, fn) {
    this.each(function(e) {
        ini= fn(ini, e);
    });
    return ini;
}
Array.prototype.isArray = true;
String.prototype.trim = function() {
  return this.replace(/(^\s+|\s+$)/g, '');
}
String.prototype.byteLength = function() {
  return this.split("").map(function(e) {
    return e.charCodeAt(0) > 0xFF ? 2 : 1;
  }).accumulate(0, function(a, b) {
    return a + b;
  });
}

// 各列の最大文字数を調べる
var selected = GetSelectedString(0);
var lines = selected.split(/\n/);
var colsize = [];
var indent;

// 各列の最大文字数を数える
lines = lines.map(function(line, i) {
  if (i == 0) {
    indent = line.match(/^\s*/)[0];
  }
  line = line.trim();
  cols = line.split(/\s+/);
  cols = cols.map(function(col) {
    return col.trim();
  });
  cols.each(function(col, c) {
    var len = col.byteLength();
    if (typeof(colsize[c]) == 'undefined' || len > colsize[c]) {
      colsize[c] = len;
    }
  });
  return cols;
});

// 最大文字数になるように末尾にスペースをつける
lines = lines.map(function(liner, c) {
  liner = liner.map(function(col, i) {
    var ad = colsize[i] - col.byteLength();
    for (var a = 0; a < ad; ++a) {
      col += " ";
    }
    return col;
  });
  return indent + liner.join(' ').trim();
});

// 出力
selected = lines.join("\r\n");
InsText(selected);
