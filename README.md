# Vibe TodoList

Vue.js와 TypeScript를 사용한 모던한 TodoList 애플리케이션입니다.

## 기술 스택

- Vue.js
- TypeScript
- Vite
- ESLint

## 시작하기

### 필수 조건

- Node.js (v16 이상)
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
# 또는
yarn install
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

### 빌드

```bash
npm run build
# 또는
yarn build
```

## 프로젝트 구조

```
vibe_todolist/
├── src/              # 소스 코드
├── public/           # 정적 파일
├── dist/            # 빌드 결과물
├── node_modules/    # 의존성 모듈
└── ...
```

## 기능

### Todo 관리
- 새로운 Todo 항목 추가
- Todo 항목 수정
- Todo 항목 삭제
- Todo 완료 상태 토글

### 카테고리 관리
- Todo 항목을 카테고리별로 분류
- 카테고리 추가/수정/삭제
- 카테고리별 Todo 필터링

### 사용자 경험
- 드래그 앤 드롭으로 Todo 순서 변경
- 반응형 디자인으로 모바일/데스크톱 지원
- 다크/라이트 모드 테마 지원

### 추가 기능
- Todo 항목 검색
- Todo 항목 우선순위 설정
- 마감일 설정 및 알림
- 진행 상황 시각화
