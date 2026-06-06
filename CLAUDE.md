# WildBoar Project Guidelines

## 프로젝트 개요
- Electron + React + TypeScript 기반 데스크톱 앱
- 한글(HWPX) 및 엑셀(XLSX) 문서 생성기

## 기술 스택
- electron-vite
- React + TypeScript
- Tailwind CSS v4
- shadcn/ui
- hwpx-ts (HWPX 생성)
- ExcelJS (XLSX 생성)
- Zustand (상태관리)
- react-i18next (다국어)

## QA/검증 필수 요구사항

### Electron 앱 QA 체크리스트
autopilot, ultrawork, ralph 등 워크플로우에서 QA 단계 시 반드시 수행:

1. **런타임 테스트**
   - `npm run dev`로 앱 실제 실행
   - 앱이 정상적으로 로드되는지 확인

2. **IPC 통신 검증**
   - preload 스크립트 정상 로드 확인
   - `window.api` 객체 존재 여부 테스트
   - 개발자 도구 콘솔에서 `window.api` 입력하여 확인

3. **버튼/UI 클릭 테스트**
   - 모든 버튼이 실제로 클릭 가능한지 확인
   - onClick 핸들러가 호출되는지 확인

4. **파일 다이얼로그 테스트**
   - 폴더 선택 대화상자 동작 확인
   - 파일 저장 대화상자 동작 확인

5. **sandbox 모드 호환성**
   - `sandbox: true` 설정 시 preload 동작 여부 테스트
   - 문제 발생 시 `sandbox: false`로 변경 필요

6. **문서 생성 검증**
   - 생성된 HWPX 파일을 한컴오피스에서 열어서 확인
   - 생성된 XLSX 파일을 엑셀/Numbers에서 열어서 확인
   - 파일 구조 검증: `unzip -l output.hwpx` 또는 `file output.xlsx`
   - 내용이 정상적으로 표시되는지 확인

### QA 원칙
- 정적 분석(빌드, 타입체크, 린트)만으로 QA 완료 선언 금지
- 실제 기능 동작 확인 필수
- IPC, API 호출 등 런타임 통신은 반드시 실행해서 테스트
- 생성된 파일은 실제 뷰어에서 열어서 검증

## 알려진 이슈

### sandbox 모드 비활성화
- `src/main/index.ts`에서 `sandbox: false` 설정됨
- electron-vite + preload 조합에서 sandbox 모드 시 IPC 통신 실패
- 보안상 sandbox 활성화가 권장되나, 현재는 호환성 문제로 비활성화

## 빌드 및 실행

```bash
# 개발
npm run dev

# 빌드
npm run build

# 프로덕션 빌드
npm run build:mac   # macOS
npm run build:win   # Windows
```
