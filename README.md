# 칫허브 · Chithub

GitHub 리포지토리를 불러와 정리하고, 홍보 자료를 자동으로 생성하는 개인용 대시보드입니다.

🌐 **라이브 데모**: [chithub.chichiboo.link](https://chithub.chichiboo.link)

---

## 주요 기능

### 리포지토리 관리
- GitHub Username으로 공개 리포지토리 불러오기
- Personal Access Token으로 비공개 리포지토리 포함 불러오기
- 카드형 / 표형 뷰 전환
- 검색, 필터(카테고리·언어·공개 여부·상태), 다양한 정렬 옵션

### 메타데이터 편집
각 리포지토리에 아래 정보를 직접 추가해 관리할 수 있습니다.

| 항목 | 설명 |
|------|------|
| 앱 이름 | 표시용 이름 |
| 설명 | 한 줄 소개 |
| 카테고리 | 교육뮤지컬 / 국제교류 / 학급운영 등 |
| 상태 | 아이디어 / 개발중 / 배포완료 / 보류 등 |
| 우선순위 | 높음 / 보통 / 낮음 |
| 배포 URL | 실제 서비스 주소 |
| 해시태그 | 검색 및 홍보용 태그 |

### 홍보 자료 자동 생성 (Gemini AI)
리포지토리 정보를 기반으로 아래 자료를 자동 생성합니다.

- **한 줄 소개** — 짧고 임팩트 있는 설명
- **SNS 게시글** — 트위터·인스타그램용 포스트
- **유튜브 업로드 설명문** — 영상 설명란에 바로 붙여넣기
- **연수 자료용 소개문** — 교원 연수·발표 자료용
- **포트폴리오 JSON** — 포트폴리오 사이트 연동용
- **README 초안** — 리포지토리 README 자동 작성

### 데이터 동기화 및 백업
- **GitHub Gist 동기화** — 편집한 메타데이터를 Gist에 저장, 어느 기기에서도 동일한 데이터 접근 가능
- **자동 동기화** — 마지막 편집 4초 후 자동 업로드, 앱 실행 시 자동 다운로드
- **JSON 백업/복원** — 로컬 파일로 내보내기/가져오기
- **CSV 다운로드** — 스프레드시트 활용 가능

### 다국어 지원
한국어 · English · 日本語

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | React 18 |
| 빌드 도구 | Vite 5 |
| 스타일 | Tailwind CSS 3 |
| 아이콘 | Lucide React |
| 배포 | GitHub Pages (GitHub Actions) |
| 폰트 | Pretendard |

---

## 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

---

## 배포 구조

`main` 브랜치에 Push하면 GitHub Actions가 자동으로 빌드하고 GitHub Pages에 배포합니다.

```
push to main
  └─ GitHub Actions (.github/workflows/deploy.yml)
       ├─ npm ci
       ├─ npm run build
       └─ GitHub Pages 배포
```

커스텀 도메인은 `public/CNAME`에 설정되어 있으며 빌드 시 `dist/`에 포함됩니다.

---

## 라이선스

개인 프로젝트입니다. 별도 라이선스가 명시되지 않은 경우 All rights reserved.

---

*Created by. 교육뮤지컬 꿈꾸는 치수쌤*
