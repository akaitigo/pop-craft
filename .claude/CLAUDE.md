# POP-Craft Internal Guidelines

## アーキテクチャ
- 本番サイトはNext.js Static Exportでブラウザ内完結。Go APIへの実行時依存は持たない
- 本番用テンプレートデータは frontend/src/data/templates.ts で管理
- 印刷・PDF保存はBrowser Print APIを使用
- backend/internal/ のGo API・PDF生成・テンプレートは比較検証用に保管
- Canvas描画は frontend/src/lib/canvas/ に集約

## コーディング規約
- Go: chi router, 構造体にバリデーションタグ
- TS: Zod でランタイムバリデーション, TailwindCSS
- テストファイルは対象と同じディレクトリに配置
- 本番画面へAPI依存を再導入する場合は、コスト・プライバシー・運用負荷をADRで再評価する

## テンプレート体系
- 業態: supermarket, drugstore, bookstore
- パターン: recommendation, limited, staff_pick, new_arrival, sale
- 用紙: a4, a5, card (名刺サイズ)。現状は縦横比のみ反映し、実寸指定はIssue #37で追跡する
