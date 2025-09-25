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