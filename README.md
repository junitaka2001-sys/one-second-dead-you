# 1秒後に死ぬ君

## Overview
"1秒後に死ぬ君" は、キャラクターの情報と現在のシチュエーションを入力すると、1秒後に起こる運命（死亡・生存）をランダムに抽選して表示する静的 Web アプリです。レトロな 16bit 風ドット絵 UI と短い演出で、スマートフォンでも快適に遊べます。

## Getting Started
1. **Clone / Download** this repository.
2. Open `index.html` in a modern browser (Chrome, Edge, Firefox, Safari). No server or build step is required.
3. Follow the on‑screen flow:
   - タイトル画面 → キャラクター設定 → シチュエーション設定 → 運命判定演出 → 結果表示
4. 結果はローカルストレージに保存され、ページ再読み込み後も履歴として閲覧できます。

## Deployment (GitHub Pages)
1. Push the repository to GitHub.
2. Enable GitHub Pages in the repository settings, selecting the `main` (or `master`) branch root folder.
3. The site will be available at `https://<username>.github.io/<repo>/`.

## Features
- 日本語 UI、PC とスマートフォン対応
- キャラクター情報（名前、性別、年齢、体格、性格、職業、健康状態）を自由入力またはランダム生成
- 簡易体格／詳細体格切替、BMI 表示
- 17 種類のシチュエーション選択（ランダム含む）
- 60 以上のイベントデータ（現実系・ネタ系・生存系）
- 重み付き抽選ロジック（年齢・健康・性格 などの補正）
- 演出画面（ピクセルキャラ表示、"1秒後のあなたは……"）
- 結果履歴のローカル保存・表示

## License
MIT – Feel free to fork, modify and publish.
