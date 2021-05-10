# JavaScript librarys for Flywheel3

後方互換性問題を極力排除するために100% Vanilla JavaScriptで構築されたJavaScriptライブラリです。

## StringBuilder

[builders/strings/StringBuilder.js](https://github.com/fw3/js/blob/preopen/builders/strings/StringBuilder.js)

import対応版：[exportable/strings/builders/StringBuilder.js](https://github.com/fw3/js/blob/preopen/exportable/builders/strings/StringBuilder.js)

`sprintf`よりも簡単に判りやすいフォーマットから文字列を生成できます。

`factory`メソッドにフォーマット文字列を与え、`factory`メソッドの第二引数および`build`メソッドにオブジェクトとして値を与える事で、フォーマット中の変数を値に差し替えます。
フォーマット文字列中の変数は`{:`、`}`で囲まれた範囲となり、ネストも可能です。

```javascript
StringBuilder.factory(
    "{:title}は{:min}文字から{:max}文字の範囲で入力してください。",
    {title: "タイトル"}
).build({
    min:    1,
    max:    64
});
// タイトルは1文字から64文字の範囲で入力してください。 と表示されます。
```

`factory`メソッドの第二引数はインスタンス構築時に確定している値を設定するために使うと良いでしょう。
`build`メソッドの引数で同名の値が存在した場合は`build`メソッドの引数の値が優先されます。

### 現時点でしていないこと

- 変数の遅延実行
- toStringメソッドの実装
- 修飾子の実装（これはやらない予定）

## HtmlElementBuilder

[builders/html_elements/HtmlElementBuilder.js](https://github.com/fw3/js/blob/preopen/builders/html_elements/HtmlElementBuilder.js)

HTML要素をできるだけなめらかに構築出来るように設計したHTML要素構築機です。
併せてvalidatorを与えてより柔軟な制御を行えるようにしています。

### HTMLElementの構築

次のように、流れるようにHTMLElementを構築できます。

#### 単純な形：`<br>`

```javascript
let br1 = HtmlElementBuilder.factory("br") // brタグとしてのHTMLElementBuilderを構築します。
doument.appendChild(br1.build());           // buildメソッドを実行することでHTMLElementが生成されます。

let br2 = HtmlElementBuilder.br().build(); // 上記の糖衣構文
doument.appendChild(br2.build());
```

#### インプット要素を作ってみる：`<input type="text">`

```javascript
let input1  = HtmlElementBuilder.input().type("text").build(); // inputタグでtext typeなHtmlElementBuilderが生成されます。
doument.appendChild(input1.build());                            // buildをお忘れなく

let input2  = HtmlElementBuilder.inputText().build();          // 上記の糖衣構文
doument.appendChild(input2.build());
```

#### 属性の多いinput：`<input type="number" name="width" value="30" min="1"  max="120">`

```javascript
let input3  = HtmlElementBuilder.inputNumber().name("width").value("30").min("1").max("120");
doument.appendChild(input3.build());

// 次の形で構築する事も出来ます。
let input4  = HtmlElementBuilder.inputNumber({
    name:   "width",
    value:  "30",
    min:    "1",
    max:    "120"
});
doument.appendChild(input4.build());
```

#### 単純に中に文字列があるだけの要素ならこういう記述も可能です。：`<div>単純な</div>`

```javascript
let div = HtmlElementBuilder.div("単純な");
doument.appendChild(div.build());               // 内部ではdocument.createTextNode()で構築しているため実際安全
```

### event

#### eventの追加は次の形で簡単におこなえます。

```javascript
let eventable1  = HtmlElementBuilder.inputText().event("click", function (event) {
    console.log("clickされた");
});
doument.appendChild(eventable1.build());
```

#### 複数の同内容のイベントを簡単に設置することもできます。

```javascript
let eventable2  = HtmlElementBuilder.inputText().event(["keyup", "mouseup"], function (event) {
    console.log("打鍵もクリックも検出したい場合ってあるよね");
});
doument.appendChild(eventable2.build());
```

#### 設定したイベントを`build`時に実行させる事もできます。

```javascript
let eventable1  = HtmlElementBuilder.inputText().event("click", function (event) {
    console.log("clickされてないけどされた");
}).dispatchEvent("click");
doument.appendChild(eventable1.build());
```

### validation

#### 要素単位での検証が行えます。

```javascript
let validatableElement1	= HtmlElementBuilder.inputNumber({
    name:   "width",
    value:  "30",
    min:    "1",
    max:    "120"
})
.validatorValues({
	title: "幅"
})
.validators([
	{rule: "range", min: 1, max: 120}
], {
	pre: 	function (event) {},	// 検証実行前処理
	valid:	function (event) {		// 検証成功時処理
		console.log("検証に成功しました");
	},
	invalid:	function (event, message) {	// 検証成功時処理
		console.log("検証に失敗しました");
		console.log(message);	// 幅は1文字から120文字まで入力できます。 と表示されます。
	},
	post: 	function (event) {}		// 検証実行後処理
});
doument.appendChild(validatableElement1.build());
```

#### 検証単位でのメッセージフォーマットの差し替えも行えます。

```javascript
let validatableElement2	= HtmlElementBuilder.inputNumber({
    name:   "width",
    value:  "30",
    min:    "1",
    max:    "120"
})
.validatorValues({
	title: 		"幅",
	usefulness:	"サブメニュー"
})
.validators([
	{rule: "range", min: 1, max: 120, message: "{:title}は{:usefulness}用のため{:mix}から{:max}の範囲で入力してください。"}
], {
	invalid:	function (event, message) {	// 検証成功時処理
		console.log("検証に失敗しました");
		console.log(message);	// 幅はサブメニュー用のため1文字から120文字の範囲で入力してください。 と表示されます。
	}
});
doument.appendChild(validatableElement2.build());
```

### 現時点でしていないこと

- event発火タイミング遅延時間の設定
- validate発火イベントの設定（現在はblur固定）
- 糖衣構文の完全実装（数が多すぎるので後回し）
