# Finance Learning Lab Landing Page

정적 랜딩페이지 프로젝트입니다. `index.html`, `styles.css`, `script.js`만으로 동작하며 별도 라이브러리 설치가 필요 없습니다.

## Files

- `index.html`: 랜딩페이지 구조
- `styles.css`: 반응형 스타일
- `script.js`: 스크롤 이동, 섹션 등장 애니메이션, 폼 제출 메시지
- `vercel.json`: Vercel 정적 배포 설정

## Local Preview

브라우저에서 `index.html`을 직접 열어도 동작합니다.

## GitHub Push

이 환경에서는 `git` 명령어를 사용할 수 없어 자동 푸시는 진행하지 못했습니다. 로컬에서 아래 순서로 올리면 됩니다.

```bash
git init
git add .
git commit -m "Add finance learning landing page"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## Vercel Auto Deploy

1. Vercel에서 `Add New Project`를 선택합니다.
2. GitHub 저장소를 연결합니다.
3. Framework Preset은 `Other` 또는 자동 감지를 사용합니다.
4. Root Directory는 현재 저장소 루트를 선택합니다.
5. 배포 후부터 `main` 브랜치 푸시 시 자동 배포됩니다.

## Notes

- `.vercelignore`로 노트북과 CSV 파일은 배포 업로드에서 제외됩니다.
- 폼은 현재 프런트엔드 메시지만 처리합니다. 실제 수집이 필요하면 Google Forms, Sheets, Supabase 같은 저장 연동이 추가로 필요합니다.
