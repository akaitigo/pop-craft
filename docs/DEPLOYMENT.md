# Cloudflare Workers Static Assets デプロイrunbook

## 方針

POP-CraftはWorker scriptを持たず、`frontend/out/`だけをWorkers Static Assetsへ配置します。2026-07-20時点のCloudflare公式仕様では、静的assetへの要求は無料・無制限で、保存の追加料金もありません。Freeプランの主な上限は1 version 20,000 files、1 file 25 MiBです。

Wranglerは2026-07-20時点の最新版`4.112.0`をdevDependencyへ固定しています。更新時は公式の上限・設定schema・Preview・rollback仕様を再確認します。

- Workers Paidへ切り替えない
- R2、D1、KV、外部AI APIを追加しない
- 最初の売上まで独自ドメインを購入せず、`workers.dev`を使う
- Preview URLも公開URLであるため、ユーザー承認前にuploadしない
- API token、account ID、商品情報をリポジトリやbundleへ入れない

根拠:

- [Static Assetsの料金と制限](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- [Workers / Static Assets上限](https://developers.cloudflare.com/workers/platform/limits/)
- [Static Site Generation設定](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)
- [Static Assetsのcustom headers](https://developers.cloudflare.com/workers/static-assets/headers/)

## 構成

- `wrangler.jsonc`: Worker名、`frontend/out`、404、HTML routingを固定
- `frontend/public/_headers`: build時に`frontend/out/_headers`へコピー
- `scripts/verify-static-assets.mjs`: Free上限、必須header、公開禁止文字列を検査
- `.github/workflows/deploy-cloudflare.yml`: 明示入力付きの手動workflow

`assets.run_worker_first`とWorker `main`は設定しません。将来追加する場合、静的要求がWorker課金・日次上限の対象になり得るため、別IssueとADRを必須とします。

## Security header方針

CSPの外部接続先はGoogle Fontsのstylesheetとfont fileだけです。`connect-src`は`self`だけなので、商品情報を外部APIへ送るfetch/XHRを遮断します。Next.jsのhydrationが生成するinline scriptと、用紙ごとに生成するinline `@page` styleのため、`script-src`と`style-src`には`unsafe-inline`が必要です。`unsafe-eval`は許可せず、`dangerouslySetInnerHTML`やユーザー入力由来のHTML/CSSを追加しません。

将来Cloudflare Web Analytics等を追加する場合、CSP許可先を広げるだけの変更を行わず、収集データ・同意・プライバシー表記・送信先を別Issueでレビューします。

## ローカル検証

```bash
pnpm --dir frontend install --frozen-lockfile
make cloudflare-validate
```

`cloudflare-validate`は次を行い、Cloudflare accountへのupload・deployはしません。

1. 検証scriptのnegative test
2. build済み成果物の20,000 files / 25 MiB上限確認
3. `index.html`、`404.html`、`_headers`の存在確認
4. CSP等の必須header確認
5. API URL・Cloudflare secret代入文字列のbundle scan
6. `wrangler deploy --dry-run`

Cloudflare相当のローカル配信は次で起動します。

```bash
make cloudflare-preview
# Wranglerが表示するlocalhost URLだけを使用する
```

## 初回だけユーザーが行う設定

このセクションは自動実行しません。

1. Cloudflare FreeアカウントでWorkersを有効化し、Paidへ変更しない
2. Account API TokensでWorkers Scriptsの編集権限を持つcustom tokenを作る
3. tokenの対象resourceを使用する1 accountだけへ限定する
4. GitHub repositoryの`preview`と`production` environmentへ次をsecret登録する
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
5. `production` environmentへ本人をrequired reviewerとして設定する
6. Cloudflare dashboardでWorkers Logs、R2、D1、KV等が未使用であることを確認する

API tokenは[Cloudflare公式GitHub Actions手順](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)に従い、リポジトリへ保存しません。

## Preview手順

Preview URLは公開されるため、ユーザーの公開承認後にのみ実行します。

1. GitHub Actionsから「Cloudflareへ手動デプロイ」を選ぶ
2. `target=preview`、`confirmation=PREVIEW`を指定する
3. workflowが`wrangler versions upload --preview-alias staging`を実行する
4. 出力されたURLでsmoke testを行う
5. 問題があればProductionへ進まず、Issue化して修正する

Preview URLの仕様は[Cloudflare公式Preview URLs](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/)を参照してください。Preview URLはログ収集に対応しないため、ブラウザ確認とGitHub Actionsの結果を証跡にします。

## Production手順

1. Previewのsmoke test結果をPRまたはIssueへ記録する
2. ユーザーが本番公開を最終承認する
3. GitHub Actionsで`target=production`、`confirmation=DEPLOY`を指定する
4. `production` environmentの承認画面で内容を再確認する
5. deploy後10分以内にsmoke testを行う

workflow_dispatch以外のpush、PR、scheduleではdeployしません。

## Smoke test

- `/`が200、存在しないpathが404
- CSP、HSTS、nosniff、frame、Referrer、Permissions headersがある
- スーパー→テンプレート→日本語入力→印刷プレビューが動く
- A4・A5・名刺Canvasの寸法が`docs/PRINTING.md`と一致する
- ConsoleにCSP violationとJavaScript errorがない
- 商品情報を送るXHR / fetchが0件
- `_next/static/`がimmutable cacheになる
- モバイル幅390pxで横overflowがない

## Rollback

障害時は新規修正を待たず、直前の正常versionへ戻します。

```bash
cd frontend
pnpm exec wrangler rollback --config ../wrangler.jsonc
```

version IDを指定する場合は`wrangler rollback <VERSION_ID>`を使います。rollbackは即時に対象versionを100% trafficへ適用します。実行後にSmoke testを再実行し、原因と影響をIssueへ記録します。詳細は[Cloudflare公式Rollback](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)を参照してください。

token漏えい時はrollbackではなく、先にtoken revoke、GitHub secret削除、workflow停止、公開停止を行います。

## 公開停止

重大な秘密情報漏えい、意図しない外部通信、法務上の問題がある場合はCloudflare dashboardでroute / workers.devを無効化します。停止中はPreviewも作成せず、再公開にはユーザーの再承認を必要とします。
