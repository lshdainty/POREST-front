# CLAUDE.md
이 파일은 Claude Code가 이 리포지토리의 코드를 작업할 때 가이드를 제공합니다.

## 아키텍처
React 19 + TypeScript + Vite를 사용하는 프론트엔드 프로젝트:

- **프론트엔드**: React 19, TypeScript, Vite
- **스타일링**: Tailwind CSS
- **상태 관리**: Zustand
- **라우팅**: React Router v6
- **API 통신**: Axios

## 코딩 규칙
- TypeScript strict 모드 사용
- 함수형 컴포넌트와 React Hooks 사용
- 2스페이스 들여쓰기, 세미콜론 없이
- camelCase 변수명, PascalCase 컴포넌트명
- 컴포넌트별 파일 분리
- Props 타입 정의 필수

## 프로젝트 구조
src/
├── api/          # API 서비스
├── components/   # 재사용 가능한 UI 컴포넌트
├── config/       # router 주소 등 설정 파일 모음집
├── features/     # 도메인별 메인 page
├── hooks/        # 커스텀 훅
├── utils/        # 유틸리티 함수
├── types/        # TypeScript 타입 정의
├── store/        # 전역 상태 관리

## TypeScript 설정
- strict: true
- noImplicitAny: true
- 명시적 반환 타입 선언
- 인터페이스 우선 사용

## UI 라이브러리 가이드라인
### 기본 UI 라이브러리
- **shadcn/ui**를 기본 UI 라이브러리로 사용합니다
- 모든 컴포넌트 구현 시 shadcn/ui 공식 문서를 우선 참조하세요
- 컴포넌트 설치: `npx shadcn add [component-name]`
- 공식 문서: https://ui.shadcn.com/

### shadcn/ui 사용 규칙
- 새로운 UI 컴포넌트가 필요할 때는 항상 shadcn/ui에서 먼저 확인
- shadcn/ui에 없는 컴포넌트만 커스텀으로 개발
- 모든 컴포넌트는 shadcn/ui의 디자인 시스템을 따름
- Tailwind CSS 클래스 사용으로 일관성 유지

### 컴포넌트 우선순위
1. **shadcn/ui 컴포넌트** - 첫 번째 선택
2. **shadcn/ui 기반 커스터마이징** - 필요시 수정
3. **완전 커스텀 컴포넌트** - 최후의 선택

### 디자인 토큰
- CSS 변수 기반 테마 시스템 사용
- `globals.css`에서 색상 및 스타일 변수 관리
- 다크/라이트 모드 자동 지원