/* ILL AI · ILL SOUND STUDIO ENGINE
 * Learned from top-tier AI music studio workflows:
 * - Simple / Custom Mode · Style Prompt + Negative Exclusions · Structured [Intro]/[Verse]/[Chorus]/[Bridge]/[Outro] Metatags
 * - Dual Take A / Take B Variation Generation
 * - 5-Stem Real-Time Web Audio Multi-Track Synthesizer (DRUMS · BASS · CHORDS · LEAD · ATMOS)
 * - Interactive Clickable Waveform Timeline with Section Markers + Live 5-Stem Mute/Solo Mixer + BPM/Transpose + Remix
 * - True 44.1kHz Stereo PCM .WAV Export via OfflineAudioContext (100% Free, In-Browser, Zero External Dependency)
 */
(function () {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ================= GENRE PRESETS & MUSICAL THEORY ================= */
  const GENRES = {
    lofi: {
      re: /(로파이|lo-?fi|비\s*오는|새벽|공부|코딩|칠|chill|잔잔|카페|재즈|jazz)/i,
      genre: 'Lo-Fi City Jazz', mood: 'Warm · Nostalgic · Midnight Rain', bpm: 84, key: 'F Major',
      style: 'lo-fi hip-hop, warm Rhodes electric piano, soft boom-bap drums, gentle vinyl crackle, nostalgic midnight atmosphere',
      exclude: '-harsh distortion, -aggressive metal, -festival EDM drops',
      chordsA: ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'],
      chordsB: ['Dm9', 'G13', 'Cmaj9', 'A7'],
      drumStyle: 'lofi',
      palette: ['#f59e0b', '#ec4899', '#140c18'],
      lyrics: `[Intro | Warm Rhodes · Vinyl Crackle]\n(부드러운 빗소리와 로즈 피아노)\n\n[Verse 1 | Intimate Soft Vocal]\n창문 너머 번지는 새벽의 가로등 불빛\n식어가는 커피 향 속에 오늘 하루를 접어둬\n느린 리듬 위로 흘러가는 조용한 숨결\n아무 말 없어도 괜찮은 우리만의 시간\n\n[Pre-Chorus | Rising Warm Pad]\n잠시 멈춰 서도 돼, 밤은 아직 길어\n\n[Chorus | Dreamy Stacked Harmonies]\n비 오는 이 밤의 멜로디 속에\n지친 마음 내려놓고 천천히 걸어가\n따뜻한 코드가 감싸는 순간\n어제보다 선명한 내일이 찾아와\n\n[Bridge | Stripped Electric Piano Solo]\n조용히 스며드는 새벽의 온도\n\n[Outro | Soft Fade · Rain]\nGoodnight, midnight melody…`,
    },
    citypop: {
      re: /(시티팝|city\s*pop|여름|바다|드라이브|레트로|신스웨이브|synthwave|80s|네온)/i,
      genre: 'Neo City Pop / Synthwave', mood: 'Neon · Breezy · Retro Groove', bpm: 108, key: 'E Minor',
      style: 'Korean neo city pop, funky slap bass, lush 80s analog poly synth, crisp gated snare, breezy night drive groove',
      exclude: '-acoustic folk, -heavy dubstep',
      chordsA: ['Cmaj7', 'Bm7', 'Am7', 'Em7'],
      chordsB: ['Fmaj7', 'Em7', 'Dm7', 'G7'],
      drumStyle: 'pop',
      palette: ['#fb7185', '#f59e0b', '#170b1c'],
      lyrics: `[Intro | Analog Synth Brass · Funky Bass]\n(네온 불빛처럼 번지는 신스 리프)\n\n[Verse 1 | Breezy Groove Vocal]\n한강 다리 위를 스치는 여름밤의 바람\n창문을 열면 들려오는 도시의 네온 사인\n익숙한 리듬에 맞춰 엑셀을 밟아\n오늘 밤은 지도 없이 달려가 볼래\n\n[Pre-Chorus | Shimmering Arpeggio]\n반짝이는 야경 아래 시간이 멈춰\n\n[Chorus | Anthemic Retro Hook]\nMidnight drive, 끝없는 불빛 속으로\n우리의 노래가 밤하늘에 울려 퍼져\n어디로 가든 상관없어 지금 이 순간\n가장 빛나는 여름의 시티팝\n\n[Bridge | Synth Lead Solo]\n(화려한 아날로그 신스 솔로)\n\n[Outro | Fade Into Neon]\nDrive into the midnight glow…`,
    },
    edm: {
      re: /(edm|클럽|신나는|운동|헬스|하우스|house|테크노|techno|댄스|dance|일렉|electronic|페스티벌)/i,
      genre: 'Melodic Deep House / EDM', mood: 'Euphoric · Energetic · Festival', bpm: 126, key: 'A Minor',
      style: 'melodic deep house, punchy four-on-the-floor kick, sidechained supersaw chords, euphoric vocal chops, club polish',
      exclude: '-slow ballad, -acoustic guitar',
      chordsA: ['Am7', 'Fmaj7', 'C', 'G'],
      chordsB: ['Dm7', 'Am7', 'Fmaj7', 'E7'],
      drumStyle: 'edm',
      palette: ['#38bdf8', '#a855f7', '#080e1f'],
      lyrics: `[Intro | Filtered Pluck · Rising Sweep]\n(심장 박동처럼 커지는 베이스 펄스)\n\n[Verse 1 | Crisp Modern Vocal]\n어둠을 깨우는 첫 번째 베이스 라인\n발끝부터 차오르는 전율을 느껴봐\n망설임은 전부 여기 내려두고\n지금 이 비트 위로 뛰어올라\n\n[Pre-Chorus | Snare Roll · Riser]\n3, 2, 1 — 모든 불빛이 터지는 순간\n\n[Chorus | Euphoric Drop · Stacked Synth]\nHigher, higher, 한계를 넘어 날아올라\n멈추지 않는 리듬 속에 하나가 돼\n온몸을 울리는 뜨거운 에너지\n오늘 밤의 주인공은 바로 우리야\n\n[Bridge | Atmospheric Breakdown]\n숨을 고르고 다시 시작되는 파동\n\n[Outro | Club Mix Fade]\nFeel the rhythm till the sunrise…`,
    },
    ballad: {
      re: /(발라드|감성|이별|사랑|피아노|어쿠스틱|ballad|piano|acoustic|서정|OST|드라마)/i,
      genre: 'Cinematic K-Ballad / Piano', mood: 'Emotional · Intimate · Soaring', bpm: 74, key: 'C Major',
      style: 'cinematic Korean ballad, intimate grand piano, lush orchestral string pad, heartfelt airy vocal, emotional dynamics',
      exclude: '-EDM drops, -heavy trap drums',
      chordsA: ['C', 'G', 'Am7', 'Fmaj7'],
      chordsB: ['Fmaj7', 'G', 'Em7', 'Am7'],
      drumStyle: 'ballad',
      palette: ['#d4a586', '#818cf8', '#111018'],
      lyrics: `[Intro | Solo Grand Piano]\n(고요하게 흐르는 피아노 아르페지오)\n\n[Verse 1 | Whispered Intimate Delivery]\n계절이 두 번 바뀌어도 그대로인 기억\n네가 웃던 그 길목에 아직 내가 서 있어\n꺼내지 못했던 수많은 말들이\n바람결에 실려 조용히 내려앉아\n\n[Pre-Chorus | Swelling Warm Strings]\n시간이 흐르면 무뎌질 줄 알았는데\n\n[Chorus | Soaring Emotional Peak]\n널 사랑했던 모든 계절이 노래가 되어\n내 하루의 끝에 조용히 머물러 있어\n다시 돌아갈 수 없다 해도 괜찮아\n그 시절의 우리가 가장 빛났으니까\n\n[Bridge | Piano & Strings Climax]\n마지막 한 마디, 고마웠어 나의 계절아\n\n[Outro | Gentle Piano Resolution]\n(여운을 남기는 피아노 엔딩)`,
    },
    hiphop: {
      re: /(힙합|랩|트랩|hip-?hop|rap|trap|r&b|알앤비|그루브|비트)/i,
      genre: 'Modern Korean R&B / Trap', mood: 'Moody · Confident · 808 Groove', bpm: 92, key: 'D Minor',
      style: 'Korean alternative R&B trap, deep 808 glide bass, crisp hi-hat rolls, dark atmospheric pad, silky vocal melody',
      exclude: '-country, -bright pop',
      chordsA: ['Dm7', 'Bbmaj7', 'Gm7', 'A7'],
      chordsB: ['Dm9', 'C', 'Bbmaj7', 'Asus4'],
      drumStyle: 'trap',
      palette: ['#f43f5e', '#f59e0b', '#14090e'],
      lyrics: `[Intro | Dark Pad · 808 Sub]\n(묵직한 808 베이스와 하이햇 롤)\n\n[Verse 1 | Laid-Back Rhythmic Flow]\n도시의 밤은 깊고 내 페이스는 흔들림 없어\n시끄러운 소음 속에서 나만의 박자를 밟어\n어제의 고민은 전부 뒤로 던져두고\n이 트랙 위에 선명한 흔적을 남겨\n\n[Pre-Chorus | Filtered Hi-Hat Build]\n이제 눈을 떠, 무대는 준비됐어\n\n[Chorus | Hook · Smooth R&B Melody]\nNo limit, 밤새 흐르는 808 그루브\n원하는 대로 그려내는 나만의 무드\n멈추지 않는 심장 소리 그대로\n오늘 밤은 끝까지 올라가\n\n[Bridge | Half-Time Atmospheric Drop]\n고요함 뒤에 터지는 진짜 리듬\n\n[Outro | 808 Fade]\nILL Sound, midnight session…`,
    },
    cinematic: {
      re: /(영화|오케스트라|게임|보스|웅장|시네마틱|사운드트랙|브금|bgm|홍보|광고|epic|cinematic|orchestra)/i,
      genre: 'Cinematic Hybrid Orchestra', mood: 'Epic · Inspiring · Widescreen', bpm: 100, key: 'G Minor',
      style: 'cinematic hybrid orchestra, deep brass swells, pulsing string ostinato, resonant percussion, widescreen trailer polish',
      exclude: '-lo-fi crackle, -comedy',
      chordsA: ['Gm', 'Eb', 'Bb', 'F'],
      chordsB: ['Cm', 'Gm', 'Eb', 'D7'],
      drumStyle: 'cinematic',
      palette: ['#e2b899', '#38bdf8', '#0a0e18'],
      lyrics: `[Intro | Deep Sub Pulse · Low Strings]\n(광활하게 열리는 오케스트라 서곡)\n\n[Verse 1 | Rising Pulse]\n어둠의 경계 너머 첫 빛이 번져오고\n새로운 시대의 문이 서서히 열려\n\n[Chorus | Full Hybrid Orchestra Climax]\n한계를 넘어 펼쳐지는 새로운 지평\n두려움 없는 발걸음이 역사가 되어\n\n[Bridge | Solo Cello & Shimmering Choir Pad]\n고요한 숨결 뒤 찾아오는 거대한 울림\n\n[Outro | Resonant Finale]\n(장엄한 브라스와 스트링 피날레)`,
    },
  };

  function detectGenre(prompt) {
    const p = String(prompt || '');
    for (const [k, g] of Object.entries(GENRES)) {
      if (g.re.test(p)) return { id: k, ...g };
    }
    return { id: 'citypop', ...GENRES.citypop };
  }

  /* ================= IN-BROWSER STEREO PCM .WAV GENERATOR (for studio.html & inline export) ================= */
  const NOTE_MAP = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function chordMidi(name, octave = 4) {
    const m = String(name || 'Am7').match(/^([A-G])([#b])?(m|maj7|m7|7|9|13|sus4)?/i);
    let semi = NOTE_MAP[(m?.[1] || 'A').toUpperCase()] ?? 9;
    if (m?.[2] === '#') semi += 1;
    if (m?.[2] === 'b') semi -= 1;
    const root = (octave + 1) * 12 + semi;
    const q = (m?.[3] || '').toLowerCase();
    const isMinor = q === 'm' || q === 'm7';
    if (q === 'sus4') return [root, root + 5, root + 7, root + 12];
    if (q === 'maj7') return [root, root + 4, root + 7, root + 11];
    if (q === 'm7') return [root, root + 3, root + 7, root + 10];
    if (q === '7') return [root, root + 4, root + 7, root + 10];
    if (isMinor) return [root, root + 3, root + 7, root + 12];
    return [root, root + 4, root + 7, root + 11];
  }
  const m2f = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function encodeWav(audioBuffer) {
    const numCh = audioBuffer.numberOfChannels;
    const sr = audioBuffer.sampleRate;
    const len = audioBuffer.length;
    const dataLen = len * numCh * 2;
    const buf = new ArrayBuffer(44 + dataLen);
    const v = new DataView(buf);
    const wr = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    wr(0, 'RIFF'); v.setUint32(4, 36 + dataLen, true); wr(8, 'WAVE');
    wr(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, numCh, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * numCh * 2, true); v.setUint16(32, numCh * 2, true); v.setUint16(34, 16, true);
    wr(36, 'data'); v.setUint32(40, dataLen, true);
    const chs = Array.from({ length: numCh }, (_, c) => audioBuffer.getChannelData(c));
    let off = 44;
    for (let i = 0; i < len; i++) {
      for (let c = 0; c < numCh; c++) {
        const s = Math.max(-1, Math.min(1, chs[c][i]));
        v.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        off += 2;
      }
    }
    return new Blob([buf], { type: 'audio/wav' });
  }

  async function renderWavTrack({ chords = ['Am7', 'Fmaj7', 'Cmaj7', 'G'], bpm = 96, drumStyle = 'lofi', duration = 36, take = 0, instrumental = false, stems = { drums: 1, bass: 1, chords: 1, lead: 1, atmos: 1 } } = {}) {
    const sr = 44100;
    const dur = Math.max(16, Math.min(90, Number(duration) || 36));
    const ctx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(2, Math.floor(sr * dur), sr);
    const master = ctx.createGain();
    master.gain.value = 0.85;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    master.connect(comp); comp.connect(ctx.destination);

    // Subtle stereo noise buffer for snare/hats/vinyl
    const nBuf = ctx.createBuffer(1, sr * 2, sr);
    const nd = nBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    const beat = 60 / Math.max(60, Math.min(165, bpm));
    const totalBeats = Math.floor(dur / beat);
    const melodyPattern = take === 0 ? [0, 2, 3, 2, 1, 2, 3, 4] : [3, 2, 0, 1, 2, 4, 3, 2];

    for (let b = 0; b < totalBeats; b++) {
      const t = b * beat;
      const bar = Math.floor(b / 4);
      const bi = b % 4;
      const prog = b / totalBeats;
      const isIntro = prog < 0.14;
      const isChorus = (prog >= 0.36 && prog < 0.66) || (prog >= 0.78 && prog < 0.92);
      const isOutro = prog >= 0.92;
      const chordName = chords[bar % chords.length];
      const notes = chordMidi(chordName, 4);
      const bassRoot = notes[0] - 24;

      // 1. CHORDS STEM
      if (stems.chords && bi === 0) {
        const gainAmt = (isChorus ? 0.11 : 0.08) * (isOutro ? 0.6 : 1);
        notes.forEach((m, idx) => {
          const osc = ctx.createOscillator(), flt = ctx.createBiquadFilter(), g = ctx.createGain();
          osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(m2f(m + (take ? 0 : 0)), t);
          osc.detune.setValueAtTime((idx - 1.5) * 6, t);
          flt.type = 'lowpass'; flt.frequency.setValueAtTime(isChorus ? 2600 : 1400, t);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(gainAmt, t + 0.06);
          g.gain.exponentialRampToValueAtTime(0.0001, t + beat * 3.9);
          osc.connect(flt); flt.connect(g); g.connect(master);
          osc.start(t); osc.stop(t + beat * 4);
        });
      }

      // 2. BASS STEM
      if (stems.bass && !isIntro && (bi === 0 || (drumStyle === 'edm' && bi === 2) || (drumStyle === 'pop' && (bi === 2 || bi === 3)))) {
        const osc = ctx.createOscillator(), flt = ctx.createBiquadFilter(), g = ctx.createGain();
        osc.type = drumStyle === 'edm' || drumStyle === 'trap' ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(m2f(bi === 3 ? bassRoot + 7 : bassRoot), t);
        flt.type = 'lowpass'; flt.frequency.value = drumStyle === 'edm' ? 420 : 280;
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(isChorus ? 0.24 : 0.17, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + beat * (bi === 0 ? 1.8 : 0.85));
        osc.connect(flt); flt.connect(g); g.connect(master);
        osc.start(t); osc.stop(t + beat * 2);
      }

      // 3. DRUMS STEM
      if (stems.drums && !isOutro && !(isIntro && drumStyle === 'ballad')) {
        const playKick = (drumStyle === 'edm') || (bi === 0) || (drumStyle !== 'ballad' && bi === 2);
        if (playKick) {
          const ko = ctx.createOscillator(), kg = ctx.createGain();
          ko.frequency.setValueAtTime(drumStyle === 'trap' ? 145 : 130, t);
          ko.frequency.exponentialRampToValueAtTime(38, t + 0.13);
          kg.gain.setValueAtTime(isChorus ? 0.34 : 0.24, t);
          kg.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
          ko.connect(kg); kg.connect(master); ko.start(t); ko.stop(t + 0.24);
        }
        if ((bi === 1 || bi === 3) && drumStyle !== 'ballad') {
          const ns = ctx.createBufferSource(), flt = ctx.createBiquadFilter(), sg = ctx.createGain();
          ns.buffer = nBuf; flt.type = 'bandpass'; flt.frequency.value = 1800;
          sg.gain.setValueAtTime(isChorus ? 0.16 : 0.11, t);
          sg.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
          ns.connect(flt); flt.connect(sg); sg.connect(master); ns.start(t); ns.stop(t + 0.15);
        }
        // Hi-hats on eighth notes
        const hatDiv = drumStyle === 'trap' ? 4 : 2;
        for (let h = 0; h < hatDiv; h++) {
          const ht = t + (beat / hatDiv) * h;
          const hs = ctx.createBufferSource(), hf = ctx.createBiquadFilter(), hg = ctx.createGain();
          hs.buffer = nBuf; hf.type = 'highpass'; hf.frequency.value = 7200;
          hg.gain.setValueAtTime(h % 2 === 0 ? 0.045 : 0.025, ht);
          hg.gain.exponentialRampToValueAtTime(0.0005, ht + 0.045);
          hs.connect(hf); hf.connect(hg); hg.connect(master); hs.start(ht); hs.stop(ht + 0.05);
        }
      }

      // 4. MELODY / VOCAL LEAD STEM
      if (stems.lead && !instrumental && !isIntro && !isOutro) {
        const stepIdx = (bar * 4 + bi) % melodyPattern.length;
        const notePick = notes[melodyPattern[stepIdx] % notes.length] + (isChorus ? 12 : 0);
        if (bi !== 3 || isChorus) {
          const lo = ctx.createOscillator(), lf = ctx.createBiquadFilter(), lg = ctx.createGain();
          lo.type = take === 0 ? 'triangle' : 'sine';
          lo.frequency.setValueAtTime(m2f(notePick), t + (bi % 2 ? beat * 0.25 : 0));
          lf.type = 'lowpass'; lf.frequency.value = isChorus ? 3200 : 1900;
          const st = t + (bi % 2 ? beat * 0.25 : 0);
          lg.gain.setValueAtTime(0.0001, st);
          lg.gain.linearRampToValueAtTime(isChorus ? 0.11 : 0.075, st + 0.04);
          lg.gain.exponentialRampToValueAtTime(0.0001, st + beat * 0.9);
          lo.connect(lf); lf.connect(lg); lg.connect(master);
          lo.start(st); lo.stop(st + beat);
        }
      }
    }

    const rendered = await ctx.startRendering();
    return { blob: encodeWav(rendered), duration: rendered.duration };
  }

  /* ================= LLM SONGWRITER SYSTEM PROMPT ================= */
  const SONG_SYS = `당신은 세계 최고 수준의 AI 음악 프로듀서이자 작곡가입니다.
사용자 요청을 분석해 Suno Studio급 완성도의 곡 설계를 순수 JSON으로만 출력하십시오(코드펜스·설명 금지).
가사(lyrics)에는 반드시 [Intro | ...], [Verse 1 | ...], [Pre-Chorus | ...], [Chorus | ...], [Bridge | ...], [Outro | ...] 형태의 구조·연주 메타태그를 포함하십시오.
JSON 스키마:
{"title":"곡 제목","genre":"장르","mood":"분위기 3키워드","bpm":96,"key":"A Minor","style":"영문 스타일 프롬프트 (장르, 무드, 보컬, 악기, 믹스)","exclude":"-제외할 스타일","chordsA":["Am7","Fmaj7","Cmaj7","G"],"chordsB":["Dm7","G7","Cmaj7","Am7"],"drumStyle":"lofi|pop|edm|ballad|trap|cinematic","lyrics":"[Intro | ...]\\n...\\n\\n[Verse 1 | ...]\\n...\\n\\n[Chorus | ...]\\n..."}`;

  /* ================= SUNO-GRADE INLINE STUDIO PLAYER BUILDER ================= */
  function buildStudioPlayerHtml(song, rawPrompt) {
    const payload = JSON.stringify(song).replace(/<\/script/gi, '<\\/script');
    const studioHref = `studio.html?q=${encodeURIComponent(rawPrompt)}`;
    return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(song.title)} — ILL SOUND STUDIO</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{--bg:#09090b;--sf:#121216;--sf2:#18181f;--line:rgba(255,255,255,.09);--txt:#f4f4f5;--mut:#9ca3af;--warm:#f59e0b;--rose:#fb7185;--accent:${song.palette[0]};--accent2:${song.palette[1]};--sans:'Pretendard Variable',sans-serif;--mono:'JetBrains Mono',monospace}
*{box-sizing:border-box;margin:0;padding:0}
body{min-height:100vh;background:radial-gradient(620px 260px at 32% 0%,rgba(245,158,11,.15),transparent 68%),radial-gradient(500px 260px at 78% 10%,rgba(251,113,133,.11),transparent 65%),var(--bg);color:var(--txt);font-family:var(--sans);display:grid;grid-template-rows:1fr auto;overflow-x:hidden}
.main{display:grid;grid-template-columns:1fr 300px;gap:16px;padding:18px;max-width:1180px;width:100%;margin:0 auto;align-items:start}
@media(max-width:860px){.main{grid-template-columns:1fr}}
.card{background:var(--sf);border:1px solid var(--line);border-radius:16px;padding:18px;display:grid;gap:14px}
.mono{font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase}
/* Top Track Hero */
.th{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.cover{width:84px;height:84px;border-radius:14px;overflow:hidden;flex:none;box-shadow:0 12px 32px rgba(0,0,0,.5);position:relative}
.cover canvas{width:100%;height:100%;display:block}
.tmeta{flex:1;min-width:180px;display:grid;gap:5px}
.badges{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.bdg{padding:3px 8px;border-radius:6px;font-family:var(--mono);font-size:10px;font-weight:700;background:rgba(251,113,133,.16);color:#fda4af;border:1px solid rgba(251,113,133,.3)}
.bdg.v{background:rgba(245,158,11,.16);color:#fcd34d;border-color:rgba(245,158,11,.3)}
h1{font-size:22px;font-weight:750;letter-spacing:-.025em}
.sub{font-size:12.5px;color:var(--mut)}
.acts{display:flex;gap:8px;flex-wrap:wrap}
.btn-w{padding:9px 18px;border-radius:999px;background:#fff;color:#09090b;font-weight:700;font-size:13px;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
.btn-g{padding:8px 14px;border-radius:999px;background:var(--sf2);color:var(--txt);border:1px solid var(--line);font-size:12.5px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px}
.btn-g:hover{border-color:rgba(255,255,255,.28)}
.btn-g.on{background:rgba(245,158,11,.16);border-color:rgba(245,158,11,.5);color:#fde68a}

/* Take A / Take B Variation Selector */
.takes{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.tk{display:flex;align-items:center;gap:12px;padding:11px 13px;border-radius:12px;background:var(--sf2);border:1px solid var(--line);cursor:pointer;text-align:left;color:var(--txt);transition:.2s}
.tk.on{border-color:var(--warm);background:rgba(245,158,11,.08)}
.tk-dot{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:grid;place-items:center;font-weight:800;font-size:12px;color:#09090b;flex:none}
.tk b{display:block;font-size:13.5px}
.tk small{display:block;font-size:11.5px;color:var(--mut)}

/* Interactive Waveform Timeline */
.wave-box{background:#0b0b0f;border:1px solid var(--line);border-radius:14px;padding:12px;display:grid;gap:8px}
.sec-pills{display:flex;gap:6px;flex-wrap:wrap}
.sec-pills span{font-family:var(--mono);font-size:10px;padding:3px 8px;border-radius:6px;background:rgba(255,255,255,.04);color:var(--mut);border:1px solid transparent}
.sec-pills span.on{background:rgba(245,158,11,.18);color:#fde68a;border-color:rgba(245,158,11,.4)}
canvas#wave{width:100%;height:112px;cursor:pointer;display:block}
.ch-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.ch{padding:5px 11px;border-radius:8px;background:var(--sf2);border:1px solid var(--line);font-family:var(--mono);font-size:12px;color:var(--mut)}
.ch.on{border-color:var(--accent);background:rgba(245,158,11,.15);color:#fff}

/* 5-Stem Studio Mixer + Tempo/Pitch */
.mixer{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.stem{padding:10px 8px;border-radius:11px;background:var(--sf2);border:1px solid var(--line);text-align:center;cursor:pointer;transition:.18s}
.stem.on{border-color:rgba(245,158,11,.45);background:rgba(245,158,11,.09)}
.stem.off{opacity:.42}
.stem b{display:block;font-family:var(--mono);font-size:10.5px;color:#fff}
.stem small{display:block;font-size:10.5px;color:var(--mut);margin-top:3px}
.knobs{display:flex;gap:14px;flex-wrap:wrap;align-items:center;padding-top:6px;border-top:1px solid var(--line);font-size:12px;color:var(--mut)}
.knobs label{display:inline-flex;align-items:center;gap:8px}
.knobs input[type=range]{accent-color:var(--warm);width:96px}
@media(max-width:600px){.mixer{grid-template-columns:repeat(3,1fr)}.takes{grid-template-columns:1fr}}

/* Right Song Details & Synced Metatag Lyrics Inspector */
.insp{background:var(--sf);border:1px solid var(--line);border-radius:16px;padding:16px;display:grid;gap:12px;max-height:78vh;overflow:auto}
.style-box{background:#0b0b0f;border:1px solid var(--line);border-radius:12px;padding:12px;font-size:12.5px;color:#d4d4d8;display:grid;gap:8px}
.style-box .neg{color:#f87171;font-family:var(--mono);font-size:11px}
.lyr{background:#0b0b0f;border:1px solid var(--line);border-radius:12px;padding:14px;display:grid;gap:10px;font-size:13px;line-height:1.72;color:#e4e4e7}
.lyr-sec{padding:8px 10px;border-radius:9px;border-left:2px solid transparent;transition:.2s}
.lyr-sec.on{background:rgba(245,158,11,.1);border-left-color:var(--warm)}
.lyr-tag{font-family:var(--mono);font-size:10.5px;color:#fbbf24;font-weight:700;margin-bottom:4px}

/* Bottom Sticky Suno-style Playbar */
.playbar{background:rgba(12,12,16,.95);backdrop-filter:blur(16px);border-top:1px solid var(--line);padding:10px 18px;display:grid;grid-template-columns:220px 1fr 220px;align-items:center;gap:14px}
.pb-l{display:flex;align-items:center;gap:10px;min-width:0}
.pb-l b{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pb-c{display:flex;align-items:center;gap:12px}
.pb-c input[type=range]{flex:1;accent-color:#fff}
.pb-r{display:flex;justify-content:flex-end;gap:8px;align-items:center}
@media(max-width:720px){.playbar{grid-template-columns:1fr}.pb-l,.pb-r{display:none}}
</style>
</head>
<body data-ill-player="true">
<div class="main">
  <div class="card">
    <div class="th">
      <div class="cover"><canvas id="cov" width="168" height="168"></canvas></div>
      <div class="tmeta">
        <div class="badges"><span class="bdg">ILL-V6</span><span class="bdg v">STUDIO 5-STEM</span><span class="mono" style="color:var(--mut)" id="metaLine"></span></div>
        <h1 id="sTitle"></h1>
        <div class="sub" id="sMood"></div>
      </div>
      <div class="acts">
        <button id="playMain" class="btn-w">▶ 재생</button>
        <button id="dlWav" class="btn-g">⬇ WAV 음원 저장</button>
        <a href="${studioHref}" target="_blank" rel="noopener" class="btn-g">풀 스튜디오 ↗</a>
      </div>
    </div>

    <div class="takes" id="takeBox">
      <button type="button" class="tk on" data-t="0"><span class="tk-dot">A</span><span><b>Take A · Original Mix</b><small id="tkADesc">메인 코드 & 그루브 편곡</small></span></button>
      <button type="button" class="tk" data-t="1"><span class="tk-dot" style="background:linear-gradient(135deg,#38bdf8,#a855f7)">B</span><span><b>Take B · Alt Remix</b><small id="tkBDesc">대체 코드 보이싱 & 변주</small></span></button>
    </div>

    <div class="wave-box">
      <div class="sec-pills" id="secPills"><span>INTRO</span><span>VERSE</span><span>CHORUS</span><span>BRIDGE</span><span>OUTRO</span></div>
      <canvas id="wave" width="760" height="112"></canvas>
      <div class="ch-row" id="chRow"></div>
    </div>

    <div>
      <div class="mono" style="color:var(--mut);margin-bottom:8px">5-STEM REAL-TIME MIXER (클릭하여 개별 트랙 ON / MUTE)</div>
      <div class="mixer" id="stemBox">
        <button type="button" class="stem on" data-s="drums"><b>DRUMS</b><small>ON</small></button>
        <button type="button" class="stem on" data-s="bass"><b>BASS</b><small>ON</small></button>
        <button type="button" class="stem on" data-s="chords"><b>CHORDS</b><small>ON</small></button>
        <button type="button" class="stem on" data-s="lead"><b>LEAD</b><small>ON</small></button>
        <button type="button" class="stem on" data-s="atmos"><b>FX/AIR</b><small>ON</small></button>
      </div>
    </div>

    <div class="knobs">
      <label>BPM <input id="bpmR" type="range" min="64" max="150" value="${song.bpm}"><b id="bpmV" class="mono">${song.bpm}</b></label>
      <label>TRANSPOSE <input id="trR" type="range" min="-4" max="4" value="0"><b id="trV" class="mono">0</b></label>
      <button type="button" class="btn-g" id="instBtn">인스트루멘탈 (Lead Off)</button>
    </div>
  </div>

  <aside class="insp">
    <div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:14px">Song Details</b><span class="mono" style="color:var(--warm)">METATAGS</span></div>
    <div class="style-box">
      <div style="display:flex;justify-content:space-between;align-items:center"><span class="mono" style="color:var(--mut)">STYLE OF MUSIC</span><button type="button" class="btn-g" id="copyStyle" style="padding:3px 9px;font-size:11px">복사</button></div>
      <div id="styleTxt"></div>
      <div class="neg" id="exclTxt"></div>
      <div class="mono" style="color:var(--mut);font-size:10px">Style Influence · 78% · Variety · 45%</div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center"><span class="mono" style="color:var(--mut)">STRUCTURED LYRICS</span><button type="button" class="btn-g" id="copyLyr" style="padding:3px 9px;font-size:11px">가사 복사</button></div>
    <div class="lyr" id="lyrBox"></div>
  </aside>
</div>

<div class="playbar">
  <div class="pb-l"><b id="pbTitle"></b></div>
  <div class="pb-c">
    <button id="pbPlay" class="btn-w" style="padding:7px 14px;font-size:12px">▶</button>
    <span class="mono" id="pbCur" style="color:var(--mut)">0:00</span>
    <input id="pbSeek" type="range" min="0" max="1000" value="0">
    <span class="mono" id="pbTot" style="color:var(--mut)">0:40</span>
  </div>
  <div class="pb-r"><span class="mono" style="color:var(--warm)" id="pbTake">TAKE A</span></div>
</div>

<script>
const S=${payload};
document.getElementById('sTitle').textContent=S.title;
document.getElementById('pbTitle').textContent=S.title;
document.getElementById('sMood').textContent=S.genre+' · '+S.mood;
document.getElementById('metaLine').textContent=S.bpm+' BPM · '+S.key;
document.getElementById('styleTxt').textContent=S.style;
document.getElementById('exclTxt').textContent=S.exclude||'';
document.getElementById('tkADesc').textContent=S.chordsA.join(' → ');
document.getElementById('tkBDesc').textContent=S.chordsB.join(' → ');

/* Generative Cover Art */
(function(){
  const c=document.getElementById('cov'),x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,168,168);
  g.addColorStop(0,S.palette[2]); g.addColorStop(1,'#050507'); x.fillStyle=g; x.fillRect(0,0,168,168);
  const r1=x.createRadialGradient(48,46,6,56,56,96); r1.addColorStop(0,S.palette[0]+'cc'); r1.addColorStop(1,'transparent'); x.fillStyle=r1; x.fillRect(0,0,168,168);
  const r2=x.createRadialGradient(128,124,6,120,120,88); r2.addColorStop(0,S.palette[1]+'aa'); r2.addColorStop(1,'transparent'); x.fillStyle=r2; x.fillRect(0,0,168,168);
  x.strokeStyle='rgba(255,255,255,0.45)'; x.lineWidth=2;
  for(let k=1;k<=3;k++){x.beginPath();x.arc(84,84,k*22,0,Math.PI*1.4+k);x.stroke();}
})();

/* Parse structured [Tag] lyrics */
const lyrBox=document.getElementById('lyrBox');
const sections=String(S.lyrics||'').split(/\\n(?=\\[)/).filter(Boolean);
sections.forEach((blk,i)=>{
  const lines=blk.split('\\n'); const head=lines[0].startsWith('[')?lines.shift():'[Section '+(i+1)+']';
  const d=document.createElement('div'); d.className='lyr-sec'+(i===0?' on':'');
  d.innerHTML='<div class="lyr-tag">'+head.replace(/</g,'&lt;')+'</div><div>'+lines.map(function(l){return l.replace(/</g,'&lt;');}).join('<br>')+'</div>';
  lyrBox.append(d);
});

const NOTE_MAP={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function chordMidi(name,oct){
  const m=String(name||'Am7').match(/^([A-G])([#b])?(m|maj7|m7|7|9|13|sus4)?/i);
  let s=NOTE_MAP[(m&&m[1]||'A').toUpperCase()]||9;
  if(m&&m[2]==='#')s++; if(m&&m[2]==='b')s--;
  const r=(oct+1)*12+s+transpose, q=(m&&m[3]||'').toLowerCase();
  if(q==='maj7')return [r,r+4,r+7,r+11];
  if(q==='m7'||q==='m')return [r,r+3,r+7,r+10];
  if(q==='7')return [r,r+4,r+7,r+10];
  return [r,r+4,r+7,r+11];
}
const m2f=m=>440*Math.pow(2,(m-69)/12);

let take=0, bpm=S.bpm||96, transpose=0, playing=false, step=0, totalSteps=64;
const stems={drums:true,bass:true,chords:true,lead:true,atmos:true};
const peaks=Array.from({length:96},(_,i)=>0.22+0.68*Math.abs(Math.sin(i*.23+.4)*Math.cos(i*.09))+((i>32&&i<64)?.15:0));
let ac=null,an=null,nBuf=null,timer=null;

function activeChords(){return take===0?S.chordsA:S.chordsB;}
function renderChords(){
  const row=document.getElementById('chRow'); row.innerHTML='';
  const ci=Math.floor(step/4)%activeChords().length;
  activeChords().forEach((c,i)=>{const s=document.createElement('span');s.className='ch'+(i===ci?' on':'');s.textContent=c;row.append(s);});
}
renderChords();

function fmt(sec){sec=Math.max(0,Math.floor(sec));return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');}
function drawWave(){
  requestAnimationFrame(drawWave);
  const cv=document.getElementById('wave'),x=cv.getContext('2d'),w=cv.width,h=cv.height;
  x.clearRect(0,0,w,h);
  const prog=step/totalSteps, bw=w/peaks.length;
  let freq=null;
  if(an&&playing){freq=new Uint8Array(an.frequencyBinCount);an.getByteFrequencyData(freq);}
  peaks.forEach((p,i)=>{
    const liveBoost=freq?(freq[i%freq.length]/255)*0.28:0;
    const bh=Math.max(6,(p+liveBoost)*h*0.86);
    x.fillStyle=(i/peaks.length)<=prog?S.palette[0]:'rgba(255,255,255,0.16)';
    x.fillRect(i*bw+1.5,(h-bh)/2,Math.max(2,bw-3),bh);
  });
  const totSec=totalSteps*(60/bpm), curSec=step*(60/bpm);
  document.getElementById('pbCur').textContent=fmt(curSec);
  document.getElementById('pbTot').textContent=fmt(totSec);
  document.getElementById('pbSeek').value=Math.round(prog*1000);
  const secIdx=prog<0.15?0:prog<0.38?1:prog<0.68?2:prog<0.85?3:4;
  [...document.getElementById('secPills').children].forEach((el,idx)=>el.classList.toggle('on',idx===secIdx));
  [...lyrBox.children].forEach((el,idx)=>el.classList.toggle('on',idx===Math.min(lyrBox.children.length-1,secIdx)));
}
drawWave();

function initAudio(){
  if(ac)return;
  ac=new (window.AudioContext||window.webkitAudioContext)();
  an=ac.createAnalyser(); an.fftSize=256; an.connect(ac.destination);
  nBuf=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);
  const d=nBuf.getChannelData(0); for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
}
function tick(){
  if(!playing||!ac)return;
  const now=ac.currentTime, beat=60/bpm, bar=Math.floor(step/4), bi=step%4, prog=step/totalSteps;
  const isChorus=(prog>=0.36&&prog<0.68), chords=activeChords(), notes=chordMidi(chords[bar%chords.length],4);
  renderChords();
  if(stems.chords&&bi===0){
    notes.forEach((m,i)=>{
      const o=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain();
      o.type=i%2?'sine':'triangle'; o.frequency.setValueAtTime(m2f(m),now); o.detune.value=(i-1.5)*5;
      f.type='lowpass'; f.frequency.value=isChorus?2400:1300;
      g.gain.setValueAtTime(0.0001,now); g.gain.linearRampToValueAtTime(isChorus?0.09:0.065,now+0.05);
      g.gain.exponentialRampToValueAtTime(0.0001,now+beat*3.85);
      o.connect(f); f.connect(g); g.connect(an); o.start(now); o.stop(now+beat*3.95);
    });
  }
  if(stems.bass&&(bi===0||(S.drumStyle==='edm'&&bi===2)||bi===2)){
    const o=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain();
    o.type=S.drumStyle==='edm'||S.drumStyle==='trap'?'sawtooth':'sine';
    o.frequency.setValueAtTime(m2f(notes[0]-24),now); f.type='lowpass'; f.frequency.value=320;
    g.gain.setValueAtTime(0.001,now); g.gain.linearRampToValueAtTime(0.18,now+0.02); g.gain.exponentialRampToValueAtTime(0.001,now+beat*1.4);
    o.connect(f); f.connect(g); g.connect(an); o.start(now); o.stop(now+beat*1.5);
  }
  if(stems.drums){
    if(bi===0||bi===2||S.drumStyle==='edm'){
      const k=ac.createOscillator(),kg=ac.createGain();
      k.frequency.setValueAtTime(135,now); k.frequency.exponentialRampToValueAtTime(38,now+0.12);
      kg.gain.setValueAtTime(0.28,now); kg.gain.exponentialRampToValueAtTime(0.001,now+0.2);
      k.connect(kg); kg.connect(an); k.start(now); k.stop(now+0.22);
    }
    if(bi===1||bi===3){
      const s=ac.createBufferSource(),sf=ac.createBiquadFilter(),sg=ac.createGain();
      s.buffer=nBuf; sf.type='bandpass'; sf.frequency.value=1800;
      sg.gain.setValueAtTime(0.12,now); sg.gain.exponentialRampToValueAtTime(0.001,now+0.12);
      s.connect(sf); sf.connect(sg); sg.connect(an); s.start(now); s.stop(now+0.14);
    }
  }
  if(stems.lead&&prog>0.1){
    const pat=take===0?[0,2,3,2,1,2,3,0]:[3,2,1,0,2,3,2,1];
    const m=notes[pat[step%pat.length]%notes.length]+(isChorus?12:0);
    const o=ac.createOscillator(),g=ac.createGain();
    o.type=take===0?'triangle':'sine'; o.frequency.setValueAtTime(m2f(m),now);
    g.gain.setValueAtTime(0.0001,now); g.gain.linearRampToValueAtTime(isChorus?0.085:0.055,now+0.03);
    g.gain.exponentialRampToValueAtTime(0.0001,now+beat*0.85);
    o.connect(g); g.connect(an); o.start(now); o.stop(now+beat*0.9);
  }
  if(stems.atmos&&bi===0){
    const a=ac.createBufferSource(),af=ac.createBiquadFilter(),ag=ac.createGain();
    a.buffer=nBuf; af.type='highpass'; af.frequency.value=5500;
    ag.gain.setValueAtTime(0.012,now); ag.gain.exponentialRampToValueAtTime(0.0001,now+beat*2);
    a.connect(af); af.connect(ag); ag.connect(an); a.start(now); a.stop(now+beat*2.1);
  }
  step=(step+1)%totalSteps;
}
function setPlay(on){
  playing=on;
  if(on){initAudio();if(ac.state==='suspended')ac.resume();clearInterval(timer);tick();timer=setInterval(tick,(60/bpm)*1000);}
  else{clearInterval(timer);}
  document.getElementById('playMain').textContent=on?'❚❚ 일시정지':'▶ 재생';
  document.getElementById('pbPlay').textContent=on?'❚❚':'▶';
}
document.getElementById('playMain').onclick=()=>setPlay(!playing);
document.getElementById('pbPlay').onclick=()=>setPlay(!playing);
document.getElementById('wave').onclick=(e)=>{const r=e.target.getBoundingClientRect();step=Math.floor(((e.clientX-r.left)/r.width)*totalSteps);renderChords();};
document.getElementById('pbSeek').oninput=(e)=>{step=Math.floor((Number(e.target.value)/1000)*totalSteps);renderChords();};
document.querySelectorAll('#takeBox .tk').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#takeBox .tk').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  take=Number(b.dataset.t); document.getElementById('pbTake').textContent=take===0?'TAKE A':'TAKE B'; renderChords();
});
document.querySelectorAll('#stemBox .stem').forEach(b=>b.onclick=()=>{
  const k=b.dataset.s; stems[k]=!stems[k]; b.classList.toggle('on',stems[k]); b.classList.toggle('off',!stems[k]);
  b.querySelector('small').textContent=stems[k]?'ON':'MUTE';
});
document.getElementById('bpmR').oninput=(e)=>{bpm=Number(e.target.value);document.getElementById('bpmV').textContent=bpm;if(playing){clearInterval(timer);timer=setInterval(tick,(60/bpm)*1000);}};
document.getElementById('trR').oninput=(e)=>{transpose=Number(e.target.value);document.getElementById('trV').textContent=(transpose>0?'+':'')+transpose;};
document.getElementById('instBtn').onclick=(e)=>{stems.lead=!stems.lead;const sb=document.querySelector('#stemBox [data-s=lead]');sb.classList.toggle('on',stems.lead);sb.classList.toggle('off',!stems.lead);sb.querySelector('small').textContent=stems.lead?'ON':'MUTE';e.target.classList.toggle('on',!stems.lead);};
document.getElementById('copyStyle').onclick=()=>{navigator.clipboard?.writeText(S.style);};
document.getElementById('copyLyr').onclick=()=>{navigator.clipboard?.writeText(S.lyrics);};

/* Offline 44.1kHz Stereo PCM WAV Export */
document.getElementById('dlWav').onclick=async(e)=>{
  const btn=e.target; btn.disabled=true; btn.textContent='WAV 렌더링 중…';
  try{
    const sr=44100, dur=32, oc=new (window.OfflineAudioContext||window.webkitOfflineAudioContext)(2,sr*dur,sr);
    const m=oc.createGain(); m.gain.value=0.82; m.connect(oc.destination);
    const nb=oc.createBuffer(1,sr,sr), nd=nb.getChannelData(0); for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
    const bt=60/bpm, tb=Math.floor(dur/bt), chords=activeChords();
    for(let b=0;b<tb;b++){
      const t=b*bt, bar=Math.floor(b/4), bi=b%4, ns=chordMidi(chords[bar%chords.length],4);
      if(stems.chords&&bi===0) ns.forEach((n,i)=>{const o=oc.createOscillator(),g=oc.createGain();o.type=i%2?'sine':'triangle';o.frequency.value=m2f(n);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(0.08,t+0.05);g.gain.exponentialRampToValueAtTime(0.0001,t+bt*3.85);o.connect(g);g.connect(m);o.start(t);o.stop(t+bt*3.9);});
      if(stems.bass&&(bi===0||bi===2)){const o=oc.createOscillator(),g=oc.createGain();o.type='sine';o.frequency.value=m2f(ns[0]-24);g.gain.setValueAtTime(0.001,t);g.gain.linearRampToValueAtTime(0.2,t+0.02);g.gain.exponentialRampToValueAtTime(0.001,t+bt*1.4);o.connect(g);g.connect(m);o.start(t);o.stop(t+bt*1.5);}
      if(stems.drums&&(bi===0||bi===2)){const k=oc.createOscillator(),kg=oc.createGain();k.frequency.setValueAtTime(135,t);k.frequency.exponentialRampToValueAtTime(38,t+0.12);kg.gain.setValueAtTime(0.26,t);kg.gain.exponentialRampToValueAtTime(0.001,t+0.2);k.connect(kg);kg.connect(m);k.start(t);k.stop(t+0.22);}
      if(stems.drums&&(bi===1||bi===3)){const s=oc.createBufferSource(),f=oc.createBiquadFilter(),sg=oc.createGain();s.buffer=nb;f.type='bandpass';f.frequency.value=1800;sg.gain.setValueAtTime(0.11,t);sg.gain.exponentialRampToValueAtTime(0.001,t+0.12);s.connect(f);f.connect(sg);sg.connect(m);s.start(t);s.stop(t+0.14);}
      if(stems.lead&&b>3){const o=oc.createOscillator(),g=oc.createGain();o.type='triangle';o.frequency.value=m2f(ns[(b%ns.length)]+12);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(0.07,t+0.03);g.gain.exponentialRampToValueAtTime(0.0001,t+bt*0.85);o.connect(g);g.connect(m);o.start(t);o.stop(t+bt*0.9);}
    }
    const ab=await oc.startRendering(), len=ab.length*4, buf=new ArrayBuffer(44+len), v=new DataView(buf);
    const wr=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};
    wr(0,'RIFF');v.setUint32(4,36+len,true);wr(8,'WAVE');wr(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,sr,true);v.setUint32(28,sr*4,true);v.setUint16(32,4,true);v.setUint16(34,16,true);wr(36,'data');v.setUint32(40,len,true);
    const c0=ab.getChannelData(0),c1=ab.getChannelData(1); let off=44;
    for(let i=0;i<ab.length;i++){const l=Math.max(-1,Math.min(1,c0[i])),r=Math.max(-1,Math.min(1,c1[i]));v.setInt16(off,l<0?l*32768:l*32767,true);v.setInt16(off+2,r<0?r*32768:r*32767,true);off+=4;}
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([buf],{type:'audio/wav'}));
    a.download=(S.title||'ill-sound-track').replace(/[\\/:*?"<>|]/g,'_')+'_'+(take===0?'TakeA':'TakeB')+'.wav'; a.click();
  } finally { btn.disabled=false; btn.textContent='⬇ WAV 음원 저장'; }
};
</script>
</body>
</html>`;
  }

  /* ================= PIPELINE ENTRYPOINT FOR ILL AI CHAT ================= */
  async function runMusicPipeline(prompt, run, callTracked) {
    const raw = String(prompt || '').replace(/^\/\S+\s*/, '').trim() || '새벽 감성 로파이 시티팝 트랙';
    const preset = detectGenre(raw);
    run.stage('COMPOSE');
    run.log(`sound  장르 분석: ${preset.genre} (${preset.bpm} BPM · ${preset.key}) · 메타태그 구조 작곡 중`, 'k');
    let parsed = null;
    try {
      const r = await callTracked(run, {
        role: 'fast',
        label: 'songwriter',
        system: SONG_SYS,
        messages: [{ role: 'user', content: `요청: ${raw}\n추천 장르 기준: ${preset.genre} (${preset.bpm} BPM)\n\nTake A와 Take B 두 가지 코드 진행, 영문 Style of Music 프롬프트(네거티브 제외 태그 포함), 그리고 [Intro]/[Verse]/[Pre-Chorus]/[Chorus]/[Bridge]/[Outro] 메타태그가 들어간 한국어 완성 가사를 JSON으로 출력하십시오.` }],
        maxTokens: 1600,
        temperature: 0.72,
      });
      const jm = r.text.match(/\{[\s\S]*\}/);
      if (jm) parsed = JSON.parse(jm[0]);
    } catch (e) {
      if (e.kind === 'abort') throw e;
    }

    const song = {
      title: (parsed?.title && String(parsed.title).trim()) || raw.slice(0, 28),
      genre: (parsed?.genre && String(parsed.genre).trim()) || preset.genre,
      mood: (parsed?.mood && String(parsed.mood).trim()) || preset.mood,
      bpm: Math.max(64, Math.min(155, Number(parsed?.bpm) || preset.bpm)),
      key: (parsed?.key && String(parsed.key).trim()) || preset.key,
      style: (parsed?.style && String(parsed.style).trim()) || preset.style,
      exclude: (parsed?.exclude && String(parsed.exclude).trim()) || preset.exclude,
      chordsA: Array.isArray(parsed?.chordsA) && parsed.chordsA.length >= 3 ? parsed.chordsA.slice(0, 4) : preset.chordsA,
      chordsB: Array.isArray(parsed?.chordsB) && parsed.chordsB.length >= 3 ? parsed.chordsB.slice(0, 4) : preset.chordsB,
      drumStyle: ['lofi', 'pop', 'edm', 'ballad', 'trap', 'cinematic'].includes(parsed?.drumStyle) ? parsed.drumStyle : preset.drumStyle,
      lyrics: (parsed?.lyrics && String(parsed.lyrics).includes('[')) ? String(parsed.lyrics) : preset.lyrics,
      palette: preset.palette,
    };

    run.stage('AUDIO');
    run.log(`audio  Take A / Take B 2곡 변주 · 5-Stem 실시간 믹서 · 44.1kHz Stereo WAV 익스포터 조립`, 'ok');
    const html = buildStudioPlayerHtml(song, raw);
    run.calls.push({ label: 'ill-sound', provider: 'ILL Sound Studio V6', short: 'SOUND', pid: 'media', model: '5-stem' });

    return `## 합의 요약
- **${song.title}** (${song.genre} · **${song.bpm} BPM** · ${song.key}) — **Take A / Take B 2곡 변주**와 구조화된 메타태그 가사(\`[Intro]\` → \`[Verse]\` → \`[Chorus]\` → \`[Bridge]\` → \`[Outro]\`)를 완성했습니다.
- 우측 **ILL Sound Studio**에서 클릭 가능한 인터랙티브 파형, **5-Stem 실시간 믹서(DRUMS · BASS · CHORDS · LEAD · FX)**, BPM/키 조절, **44.1kHz 스테레오 WAV 음원 다운로드**까지 무료로 바로 실행할 수 있습니다.

## 자율 실행 산출물
\`\`\`html
${html}
\`\`\`

## 세션 상태 스냅샷
\`\`\`yaml
user_goal: "${raw.slice(0, 65).replace(/"/g, "'")}"
track_title: "${song.title.replace(/"/g, "'")}"
bpm: ${song.bpm}
key: "${song.key}"
completed_steps: ["스타일 프롬프트·메타태그 가사 작곡", "Take A/B 2곡 변주 편곡", "5-Stem 실시간 믹서·WAV 익스포터 빌드"]
active_artifacts: ["index.html"]
\`\`\``;
  }

  window.ILLSound = { detectGenre, renderWavTrack, runMusicPipeline, GENRES };
})();
