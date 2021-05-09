# JavaScript librarys for Flywheel3

## StringBuilder

[strings/builders/StringBuilder.js](https://github.com/fw3/js/blob/preopen/strings/builders/StringBuilder.js)

`sprintf`よりも簡単に判りやすいフォーマットから文字列を生成できます。

```javascript
StringBuilder.factory("{:title}は{:min}文字から{:max}文字の範囲で入力してください。", {title: "タイトル"}).build({min: 1, max: 64});
// タイトルは1文字から64文字の範囲で入力してください。 と表示されます。
```
