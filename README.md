# 2026 코엑스 송년회 네컷사진 (Netlify 버전)

## 배포 (둘 중 하나)
**A. GitHub 연결 (추천)**: 이 폴더를 GitHub에 올리고 Netlify에서 "Import from Git" → 설정 변경 없이 Deploy.
**B. CLI**:
    npm i -g netlify-cli
    npm install
    netlify deploy --prod

※ 웹 대시보드에 폴더를 끌어다 놓는 방식은 함수의 패키지(@netlify/blobs) 설치가 안 될 수 있어 권장하지 않습니다.

## 설정(선택)
Site settings → Environment variables → `TTL_HOURS` (사진 보관 시간, 기본 24)

## 구성
- `public/` 포토부스 화면 (`index.html`, `bg.png`)
- `netlify/functions/upload.mjs` 사진 업로드 → `/api/upload`
- `netlify/functions/photo.mjs` 다운로드 페이지 `/p/<id>`, 이미지 `/uploads/<id>.jpg`
- `netlify/functions/cleanup.mjs` 오래된 사진 자동 삭제(매시간)
- 카메라·공유 기능은 HTTPS가 필요한데, 넷리파이는 기본 HTTPS라 그대로 동작합니다.
