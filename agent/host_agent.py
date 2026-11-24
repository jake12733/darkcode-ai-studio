#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DARK CODE Host Agent (reference implementation) v1.0

대상 PC 사용자가 '직접' 실행하는 입력 주입 에이전트입니다.
- 127.0.0.1(로컬 루프백)에서만 대기합니다. 다른 컴퓨터에서는 접속할 수 없습니다.
- 허용된 Origin(DARK CODE 수락 페이지)에서 온 WebSocket만 받습니다.
- 실행할 때마다 새 6자리 페어링 코드를 이 창에 표시합니다. 수락 페이지에 이 코드를 입력해야 연결됩니다.
- 연결 요청이 오면 이 창에서 y 를 입력해 한 번 더 확인해야 입력 주입이 시작됩니다.
- 화면 왼쪽 위 모서리로 마우스를 밀면(FAILSAFE) 또는 Ctrl+C 로 즉시 중지됩니다.
- 화면 캡처는 하지 않습니다. 화면은 수락 페이지에서 사용자가 직접 고른 화면만 브라우저가 공유합니다.
- 주입한 모든 클릭·키 입력을 이 창에 출력합니다.

설치:  pip install "websockets>=12" pyautogui
실행:  python host_agent.py
       python host_agent.py --port 47615 --origin https://jake12733.github.io
"""
import argparse
import asyncio
import hmac
import json
import platform
import secrets
import sys
import time

try:
    import pyautogui
except ImportError:
    sys.exit('pyautogui 가 필요합니다:  pip install "websockets>=12" pyautogui')
try:
    try:
        from websockets.asyncio.server import serve  # websockets >= 13
    except ImportError:
        from websockets.server import serve  # websockets 10-12
    from websockets.exceptions import ConnectionClosed
except ImportError:
    sys.exit('websockets 가 필요합니다:  pip install "websockets>=12" pyautogui')

pyautogui.FAILSAFE = True  # 마우스를 화면 왼쪽 위 모서리로 → 즉시 중지
pyautogui.PAUSE = 0

DEFAULT_ORIGINS = ['https://jake12733.github.io']
MAX_EVENTS_PER_SEC = 400
IDLE_TIMEOUT = 15 * 60
IS_WIN = platform.system() == 'Windows'
BUTTONS = {0: 'left', 1: 'middle', 2: 'right'}
KEYMAP = {
    'Enter': 'enter', 'Backspace': 'backspace', 'Tab': 'tab', 'Escape': 'esc', ' ': 'space', 'Delete': 'delete',
    'Insert': 'insert', 'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right',
    'Home': 'home', 'End': 'end', 'PageUp': 'pageup', 'PageDown': 'pagedown', 'Shift': 'shift', 'Control': 'ctrl',
    'Alt': 'alt', 'Meta': 'win' if IS_WIN else 'command', 'CapsLock': 'capslock', 'ContextMenu': 'apps',
    'PrintScreen': 'printscreen', 'HangulMode': 'hangul', 'HanjaMode': 'hanja', 'NumLock': 'numlock',
}


def log(msg):
    print(time.strftime('%H:%M:%S'), msg, flush=True)


def map_key(key, code):
    """브라우저 KeyboardEvent(key, code) → pyautogui 키 이름. 조합(IME) 입력은 지원하지 않음."""
    if key in KEYMAP:
        return KEYMAP[key]
    if code.startswith('Key') and len(code) == 4:
        return code[3].lower()
    if code.startswith('Digit') and len(code) == 6:
        return code[5]
    if len(key) > 1 and key[0] == 'F' and key[1:].isdigit():
        return key.lower()
    if len(key) == 1 and key in pyautogui.KEYBOARD_KEYS:
        return key
    return None


class Agent:
    def __init__(self, origins, port):
        self.origins = set(origins)
        self.port = port
        self.code = self.new_code()
        self.busy = False
        self.fail = 0
        self.lock_until = 0.0
        self.held_keys = set()
        self.held_btn = set()

    @staticmethod
    def new_code():
        return f'{secrets.randbelow(10 ** 6):06d}'

    def banner(self):
        w, h = pyautogui.size()
        print('=' * 62)
        print(' DARK CODE HOST AGENT v1.0   ws://127.0.0.1:%d' % self.port)
        print(' 허용 Origin : %s' % ', '.join(sorted(self.origins)))
        print(' 화면        : %dx%d (주 모니터)' % (w, h))
        print(' 페어링 코드 : %s   ← 수락 페이지에 입력' % self.code)
        print(' 중지        : Ctrl+C 또는 마우스를 화면 왼쪽 위 모서리로')
        print('=' * 62, flush=True)

    def release_all(self):
        for k in list(self.held_keys):
            try:
                pyautogui.keyUp(k)
            except Exception:
                pass
        for b in list(self.held_btn):
            try:
                pyautogui.mouseUp(button=b)
            except Exception:
                pass
        self.held_keys.clear()
        self.held_btn.clear()

    async def handler(self, ws, path=None):
        req = getattr(ws, 'request', None)
        headers = req.headers if req is not None and hasattr(req, 'headers') else getattr(ws, 'request_headers', {})
        origin = headers.get('Origin', '')
        if origin not in self.origins:
            log(f'거부: 허용되지 않은 Origin {origin!r}')
            await ws.close(4003, 'origin')
            return
        if self.busy:
            await ws.send(json.dumps({'t': 'error', 'reason': 'busy'}))
            await ws.close(4009, 'busy')
            return
        if time.time() < self.lock_until:
            await ws.send(json.dumps({'t': 'error', 'reason': 'locked'}))
            await ws.close(4029, 'locked')
            return
        try:
            hello = json.loads(await asyncio.wait_for(ws.recv(), 20))
        except Exception:
            await ws.close(4000, 'hello')
            return
        if hello.get('t') != 'hello' or not hmac.compare_digest(str(hello.get('code', '')), self.code):
            self.fail += 1
            if self.fail >= 3:
                self.fail = 0
                self.lock_until = time.time() + 60
                log('페어링 코드 3회 오류 → 60초 잠금')
            await ws.send(json.dumps({'t': 'denied', 'reason': 'code'}))
            await ws.close(4001, 'code')
            return
        self.fail = 0
        sid = str(hello.get('sid', ''))[:40]
        who = str(hello.get('requester', ''))[:80] or '(알 수 없음)'
        self.busy = True
        try:
            await ws.send(json.dumps({'t': 'pending'}))
            log(f'연결 요청 · 세션 {sid[:4]}…{sid[-4:]} · 요청자 {who}')
            ans = await asyncio.to_thread(input, '>>> 이 요청자에게 마우스·키보드 제어를 허용할까요? [y/N] ')
            if ans.strip().lower() not in ('y', 'yes'):
                await ws.send(json.dumps({'t': 'denied', 'reason': 'local'}))
                log('로컬 사용자가 거부했습니다')
                return
            token = secrets.token_urlsafe(24)
            w, h = pyautogui.size()
            await ws.send(json.dumps({'t': 'ready', 'token': token, 'screen': {'w': w, 'h': h}, 'os': platform.system()}))
            log('입력 제어 시작 · 중지: Ctrl+C 또는 마우스를 화면 왼쪽 위 모서리로')
            await self.loop(ws, token, w, h)
        except ConnectionClosed:
            pass
        finally:
            self.busy = False
            self.release_all()
            self.code = self.new_code()
            log('세션 종료 · 새 페어링 코드: ' + self.code)

    async def loop(self, ws, token, W, H):
        window_start, window_n, n, moves = time.time(), 0, 0, 0
        while True:
            try:
                raw = await asyncio.wait_for(ws.recv(), IDLE_TIMEOUT)
            except asyncio.TimeoutError:
                log('유휴 시간 초과 → 세션 종료')
                return
            try:
                m = json.loads(raw)
            except ValueError:
                continue
            if not hmac.compare_digest(str(m.get('tok', '')), token):
                log('토큰 불일치 이벤트 무시')
                await ws.send(json.dumps({'t': 'error', 'reason': 'token'}))
                continue
            now = time.time()
            if now - window_start >= 1:
                window_start, window_n = now, 0
            window_n += 1
            if window_n > MAX_EVENTS_PER_SEC:
                continue
            t = m.get('t')
            if t == 'bye':
                log('수락 페이지가 연결을 종료했습니다')
                return
            try:
                x = y = None
                if m.get('x') is not None and m.get('y') is not None:
                    x = min(max(float(m['x']), 0.0), 1.0) * (W - 1)
                    y = min(max(float(m['y']), 0.0), 1.0) * (H - 1)
                if t == 'mm' and x is not None:
                    pyautogui.moveTo(x, y)
                    moves += 1
                elif t == 'md':
                    b = BUTTONS.get(int(m.get('b', 0)), 'left')
                    pyautogui.mouseDown(x=x, y=y, button=b)
                    self.held_btn.add(b)
                    log(f'mouse {b} down ({int(x or 0)},{int(y or 0)})')
                elif t == 'mu':
                    b = BUTTONS.get(int(m.get('b', 0)), 'left')
                    pyautogui.mouseUp(x=x, y=y, button=b)
                    self.held_btn.discard(b)
                elif t == 'wh':
                    dy = float(m.get('dy', 0))
                    amount = int(-dy * 1.2) if IS_WIN else (-1 if dy > 0 else 1 if dy < 0 else 0) * max(1, round(abs(dy) / 100))
                    if amount:
                        pyautogui.scroll(amount, x=x, y=y)
                elif t in ('kd', 'ku'):
                    k = map_key(str(m.get('key', '')), str(m.get('code', '')))
                    if not k:
                        continue
                    if t == 'kd':
                        pyautogui.keyDown(k)
                        self.held_keys.add(k)
                        if not m.get('rep'):
                            log(f'key {k}')
                    else:
                        pyautogui.keyUp(k)
                        self.held_keys.discard(k)
                else:
                    continue
                n += 1
            except pyautogui.FailSafeException:
                log('FAILSAFE 발동 → 세션 즉시 종료')
                await ws.send(json.dumps({'t': 'error', 'reason': 'failsafe'}))
                return
            if t != 'mm' or moves % 30 == 0:
                await ws.send(json.dumps({'t': 'ack', 'n': n}))


async def main():
    ap = argparse.ArgumentParser(description='DARK CODE host agent (consent-based input injection, loopback only)')
    ap.add_argument('--port', type=int, default=47615)
    ap.add_argument('--origin', action='append', help='허용할 수락 페이지 Origin (여러 번 지정 가능)')
    args = ap.parse_args()
    agent = Agent(args.origin or DEFAULT_ORIGINS, args.port)
    agent.banner()
    async with serve(agent.handler, '127.0.0.1', args.port, max_size=2 ** 16):
        await asyncio.Future()


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print('\n에이전트를 중지했습니다.')
