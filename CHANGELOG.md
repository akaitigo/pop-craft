# Changelog

## [1.0.0] - 2026-04-04

### Added
- 業態別POPテンプレート選択（スーパー / ドラッグストア / 書店 × 5パターン = 15種）
- 商品情報入力フォーム（Zodバリデーション付き）
- Canvas APIによるリアルタイムPOPプレビュー
- フォント選択（ゴシック / 明朝 / 手書き風 / 筆文字）
- カラーパレット（プリセット12色 + カスタムカラー）
- 文字サイズ調整スライダー
- PDF出力（A4 / A5 / 名刺サイズ対応）
- 印刷プレビュー機能
- 3ステップUIフロー（業態選択 → テンプレート → カスタマイズ）
- レスポンシブデザイン
- Go Backend API（テンプレート一覧 / プレビュー / PDF生成）
- PostgreSQL スキーマ（テンプレート / POP履歴）
- GitHub Actions CI（frontend: lint/typecheck/test/build, backend: vet/test/build）
- ADR-001: テンプレート保存戦略
- ADR-002: Canvas API採用理由
