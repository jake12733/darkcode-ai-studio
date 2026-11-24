# DARK CODE Host Agent

DARK CODE 원격 지원·제어 콘솔(`remote.html`)에서 **대상자가 직접 수락한 세션**에 한해 마우스·키보드 입력을 대상 PC에 주입하는 참조용 에이전트입니다. 대상 PC 사용자가 직접 내려받아 직접 실행해야 하며, 실행하지 않으면 요청자는 화면만 볼 수 있습니다.

## 전체 구조

```
① 운영자 콘솔 remote.html
      │  WebRTC (화면 스트림 수신 + DataChannel 입력 송신)
      │  시그널링: Firestore remoteSessions/{sid}/signal  ← status == accepted 일 때만 쓰기 허용
② 수락 페이지 consent.html  (대상 PC 브라우저)
      │  명시적 ACCEPT → 사용자가 고른 화면만 getDisplayMedia로 공유
      │  허용 범위·일시정지·전체 화면 공유 여부 확인 후 입력 중계
      │  WebSocket ws://127.0.0.1:47615 (루프백 전용)
③ host_agent.py  (대상 PC)
      │  Origin 검사 · 6자리 페어링 코드 · 로컬 y/N 확인 · 세션 토큰
④ OS 입력 (pyautogui)
```

화면 캡처는 에이전트가 하지 않습니다. 브라우저가 사용자가 직접 고른 화면만 보냅니다.

## 설치와 실행

```bash
pip install "websockets>=12" pyautogui
python host_agent.py                # 기본 포트 47615
python host_agent.py --port 47615 --origin https://jake12733.github.io
```

1. 에이전트를 실행하면 창에 **6자리 페어링 코드**가 표시됩니다.
2. 수락 페이지에서 ACCEPT → 화면 선택(입력 제어를 쓰려면 **전체 화면**) → 페어링 코드 입력 → [연결].
3. 에이전트 창에 `이 요청자에게 마우스·키보드 제어를 허용할까요? [y/N]`가 뜨면 `y`.
4. 크롬이 "로컬 네트워크의 기기에 액세스" 권한을 물으면 허용합니다.

## 안전장치

| 단계 | 장치 |
|---|---|
| 세션 | 28자 무작위 세션 ID, 만료 3~10분, 거절·만료 시 즉시 폐기 (Firestore 보안 규칙으로 강제) |
| 신호 | 시그널 문서는 `accepted` 상태에서만 읽기·쓰기. answer는 로그인한 요청자 본인만 |
| 수락 페이지 | 허용 범위 체크 해제 가능, 입력 일시정지, 세션 종료, 받은 입력 전부 표시 |
| 에이전트 | 127.0.0.1 전용 · 허용 Origin만 · 페어링 코드 3회 오류 시 60초 잠금 · 로컬 y/N 확인 · 세션마다 코드·토큰 재발급 · 초당 400 이벤트 제한 · 15분 유휴 종료 |
| 긴급 중지 | Ctrl+C, 마우스를 화면 왼쪽 위 모서리로(FAILSAFE), 수락 페이지 [세션 종료], 콘솔 [DISCONNECT] |

## 프로토콜

수락 페이지 → 에이전트 (JSON, WebSocket)

| 메시지 | 설명 |
|---|---|
| `{"t":"hello","v":1,"sid","code","requester","granted"}` | 첫 메시지. code가 맞아야 함 |
| `{"t":"mm","x","y","tok"}` | 마우스 이동 (x, y는 0~1 정규화) |
| `{"t":"md"/"mu","b","x","y","tok"}` | 버튼 누름/뗌 (0 왼쪽, 1 가운데, 2 오른쪽) |
| `{"t":"wh","dx","dy","x","y","tok"}` | 휠 |
| `{"t":"kd"/"ku","key","code","mods","tok"}` | 키 누름/뗌 (KeyboardEvent.key / code) |
| `{"t":"bye","tok"}` | 종료 |

에이전트 → 수락 페이지: `pending`, `ready {token, screen, os}`, `denied {reason}`, `error {reason}`, `ack {n}`

## 한계

- 주 모니터만 지원합니다. 여러 모니터 중 다른 화면을 공유하면 좌표가 맞지 않습니다.
- Windows UAC 창, 로그인 화면(보안 데스크톱), Ctrl+Alt+Del은 제어할 수 없습니다. 이런 작업은 Parsec, AnyDesk, Chrome 원격 데스크톱 등을 쓰세요.
- 한글 IME 조합 입력은 전달되지 않습니다. 한/영 키를 보내 전환한 뒤 영문 키 입력으로 다룹니다.
- WebRTC는 STUN만 사용합니다. 양쪽이 엄격한 NAT(일부 회사망·LTE 테더링)면 연결이 안 될 수 있으며, 이 경우 TURN 서버를 추가해야 합니다.
