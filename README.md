# JavaScript librarys for Flywheel3

## StringBuilder

```javascript
StringBuilder.factory("{:title}は{:min}文字から{:max}文字の範囲で入力してください。", {title: "タイトル"}).build({min: 1, max: 64}).build(); // タイトルは1文字から64文字の範囲で入力してください。 と表示されます。
```
