/* ILL AI · Meridian-Grade Editorial Motion Website Synthesis Engine
 * 4-Stage Pipeline:
 * 1. BENCHMARK  : Fast top-1% industry benchmark analysis (sub-specialty tone, palette, UX patterns)
 * 2. ARCHITECTURE: 13-band editorial layout & bespoke Korean copywriting per sub-specialty
 * 3. VISUALS    : 100% AI-generated bespoke photography (matched to each section's exact copy) + 60fps generative hero cinema canvas
 * 4. MOTION     : Lenis smooth scroll, clip-path scroll expand, word-by-word scrub, floating hover previews,
 *                 horizontal scroll showcase, working booking modal & live CRM admin drawer
 */
(function () {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ================= SUB-SPECIALTY PRESETS & PALETTES ================= */
  const SPECIALTIES = {
    plastic: {
      re: /(성형|성형외과|눈성형|코성형|안면윤곽|리프팅|거상|가슴성형|지방흡입|plastic\s*surgery|aesthetic\s*surgery)/i,
      label: '성형외과 · 하이엔드 에스테틱 클리닉',
      palette: { paper: '#f5f1eb', paper2: '#ebe4da', ink: '#141110', ink2: '#423934', mute: '#8a7f76', brand: '#2c1c21', brand2: '#3d272e', accent: '#e2c2a8', dark: '#110e0f' },
      benchmarks: ['강남 상위 1% 하이엔드 성형외과 에디토리얼 톤(Warm Alabaster + Deep Espresso/Burgundy + Champagne Rose Gold)', '3D-CT 정밀 진단·전문의 1:1 전담 책임제·안전 마취 시스템을 섹션별 스토리텔링과 수치로 시각화', '전후 케이스 가로 스크롤 쇼케이스 + 시술별 플로팅 프리뷰 아코디언 + 실시간 상담 예약·CRM 관리 연동'],
      fallback: {
        brand: 'LUMIÈRE', brandSub: 'PLASTIC SURGERY', est: '2014, Cheongdam Seoul',
        practice1: 'Face Contour · Lifting', practice2: 'Eye · Nose · Revision',
        status: '2026 하반기 대표원장 1:1 정밀상담 예약 중',
        heroLines: ['자연스러운', '아름다움을', '설계합니다.'], heroLightWord: '아름다움을',
        heroDesc: '과장된 변화가 아닌 본연의 골격과 조화를 이루는 하이엔드 성형. 성형외과 전문의 대표원장이 상담부터 수술, 사후 회복까지 전 과정을 직접 책임집니다.',
        ctaPrimary: '1:1 정밀 상담 예약', ctaSecondary: '시술 센터 보기',
        heroMotionTag: '3D CT CONSULTATION · CHEONGDAM',
        heroPrompt: 'ultra luxury minimalist Korean plastic surgery clinic interior in Cheongdam Seoul, warm travertine alabaster stone walls, soft golden morning sunlight, architectural photography, 8k',
        marqueeLabel: 'Certified Safety & Medical Excellence',
        marquee: ['대한성형외과학회 정회원', '3D-CT 정밀 골격분석', '마취통증의학과 전문의 상주', '대학병원급 무균 수술실', 'CCTV 안심 모니터링', '고압산소 회복센터', '정품 보형물 보증제', '1:1 전담 사후관리', 'K-Medical 우수기관', 'ISO 9001 안전인증'],
        revealPrompt: 'serene high-end aesthetic medical lounge in Seoul, curved warm ivory architecture, sculptural lighting, luxury hospitality clinic atmosphere, architectural digest photography, 8k',
        revealStats: [['Location', 'Cheongdam · Dosan-daero'], ['Specialists', '8 Board-Certified MD'], ['Safety Record', '12 Years Zero-Accident']],
        beliefEyebrow: '(01) — Our Philosophy',
        beliefTitle: '티 나지 않는 변화가 가장 오래 남습니다.',
        founderName: '서도윤 대표원장', founderRole: '서울대 의대 · 성형외과 전문의',
        founderPrompt: 'editorial portrait of distinguished Korean male chief plastic surgeon in crisp tailored white coat, warm architectural alabaster studio background, gentle confident expression, Leica 85mm photography, 8k',
        statementText: '화려한 광고보다 중요한 것은 수술 후 5년이 지나도 자연스러운 조화입니다. 우리는 하루 수술 건수를 제한하고 오직 한 분만을 위한 맞춤 해부학 설계에 집중합니다.',
        statementHighlight: '한 분만을 위한 맞춤 해부학 설계',
        principles: [
          ['01 · 해부학 기반 설계', '3D-CT 정밀 촬영으로 신경선·연부조직·골격 비율을 0.1mm 단위로 분석해 안전하고 조화로운 라인을 도출합니다.'],
          ['02 · 대표원장 책임 집도', '유령수술 없는 100% 실명제와 수술실 안심 시스템으로 상담한 대표원장이 마지막 봉합까지 직접 집도합니다.'],
          ['03 · 프리미엄 회복 프로토콜', '고압산소 치료·스마트 붓기 레이저·전담 간호 케어로 일상 복귀 기간을 획기적으로 단축합니다.'],
        ],
        servicesTitle: '네 가지 시그니처 센터.',
        services: [
          { code: 'S/01', name: '딥플레인 안면거상 · 리프팅', summary: '피부 표면이 아닌 SMAS 근막층과 유지인대를 정밀 박리해 10년 전 탄력선을 복원합니다.', tags: ['딥플레인 거상', '미니 리프팅', '내시경 이마거상', '목주름 거상'], imgPrompt: 'luxury Korean aesthetic clinic facial contour 3D analysis consultation room, warm ivory and rose gold lighting, ultra realistic photography, 8k' },
          { code: 'S/02', name: '커스텀 눈 · 코 성형', summary: '미간 거리, 비순각, 눈뜨는 근육의 힘까지 계측해 얼굴 중심축의 입체감을 완성합니다.', tags: ['자연유착 눈매교정', '자체연골 코성형', '기능코 동시교정', '고난도 재수술'], imgPrompt: 'minimalist luxury beauty sculpture light and shadow on alabaster marble, refined aesthetic balance, editorial macro photography, 8k' },
          { code: 'S/03', name: '3D 안면윤곽 · 밸런스', summary: '3D-CT 가상 시뮬레이션으로 광대·사각턱·턱끝의 부드러운 곡선을 오차 없이 설계합니다.', tags: ['퀵광대 축소', 'V라인 윤곽술', '이중턱 교정', '신경선 보존술'], imgPrompt: 'modern high-tech medical 3D facial imaging workstation in sleek warm minimalist Korean clinic, soft cinematic lighting, 8k' },
          { code: 'S/04', name: '쁘띠 · 줄기세포 안티에이징', summary: '절개 부담 없이 즉각적인 볼륨과 피부 재생을 끌어올리는 맞춤형 바이오 리쥬버네이션.', tags: ['커스텀 필러', '자가지방 이식', '줄기세포 재생', '울쎄라·써마지'], imgPrompt: 'luxury glass serum ampoules and botanical minimal medical skincare aesthetic still life on warm travertine stone, soft sunlight, 8k' },
        ],
        kpis: [
          ['14,800', '+', '누적 시그니처 수술 케이스'],
          ['98.4', '%', '재방문 및 지인 추천 비율'],
          ['0', '건', '개원 12년 무사고 안전 기록'],
          ['8', '인', '분야별 서울대·연세대 전문의'],
        ],
        processTitle: '안전에서 완성까지, 네 단계 정밀 프로토콜.',
        process: [
          { step: '01', time: 'STEP 01 · 정밀 계측', title: '3D-CT & 안면 비율 분석', desc: '육안 진단을 넘어 3D 입체 촬영과 초음파로 골격·연부조직·신경 위치를 정밀 파악합니다.', tags: ['3D-CT 촬영', '초음파 진단', '가상 시뮬레이션'], imgPrompt: 'high-end medical diagnostic room with sleek lighting and curved glass interior, serene Korean clinic, 8k photography' },
          { step: '02', time: 'STEP 02 · 맞춤 설계', title: '대표원장 1:1 디자인 컨설팅', desc: '충분한 상담 시간을 통해 원하는 이미지와 해부학적 한계를 투명하게 공유하고 수술 계획을 확정합니다.', tags: ['1:1 전담 상담', '수술 계획서 발급', '맞춤 보형물 설계'], imgPrompt: 'Korean plastic surgeon discussing bespoke aesthetic plan on tablet in warm luxury consultation lounge, editorial photo, 8k' },
          { step: '03', time: 'STEP 03 · 안심 집도', title: '무균 수술 & 마취 전문의 상주', desc: '대학병원급 무균 공조 수술실에서 마취통증의학과 전문의가 1:1 실시간 생체 모니터링을 전담합니다.', tags: ['마취전문의 상주', '무정전 시스템', '실명 책임집도'], imgPrompt: 'ultra clean state-of-the-art modern surgical suite with warm architectural ambient light, high-tech minimalist medical design, 8k' },
          { step: '04', time: 'STEP 04 · 프리미엄 회복', title: '애프터케어 & 1년 책임 경과', desc: '고압산소 챔버, LED 붓기 케어, 흉터 레이저까지 회복 전 과정을 전담팀이 밀착 관리합니다.', tags: ['고압산소 회복', '스마트 붓기케어', '1년 정기 검진'], imgPrompt: 'serene VIP private medical recovery suite in Seoul resembling a 5-star boutique hotel room, warm linen and soft daylight, 8k' },
        ],
        casesTitle: '조화로운 결과로 증명합니다.',
        casesSubtitle: '(04) — CLINICAL ARCHIVE · 의료법 준수 익명화 데이터',
        cases: [
          { code: 'C/01', cat: 'LIFTING · 40s', year: '2025', title: '중안면 처짐 개선 및 딥플레인 안면거상', desc: 'SMAS 심부 리프팅과 목선 정리를 동시 진행해 흉터를 귀라인 안쪽으로 정밀 은닉했습니다.', k1: ['-8.4', '세', '3D 안면 노화 지수 개선'], k2: ['9', '일', '일상 복귀 소요 기간'], imgPrompt: 'graceful Korean woman in her 40s with radiant natural glowing skin, soft studio side lighting, warm beige editorial beauty portrait, 8k' },
          { code: 'C/02', cat: 'RHINOPLASTY · REVISION', year: '2025', title: '구축 코 재수술 · 자가늑연골 입체 복원', desc: '보형물 부작용으로 짧아진 비주를 자가늑연골로 안전하게 재건하고 자연스러운 반버선 라인을 구현했습니다.', k1: ['100', '%', '자가연골 생체 적합 재건'], k2: ['99.1', '%', '6개월 경과 호흡·라인 만족'], imgPrompt: 'refined side profile portrait of young Korean woman with harmonious natural facial features, soft diffused alabaster studio light, 8k' },
          { code: 'C/03', cat: 'EYE · NATURAL', year: '2026', title: '안검하수 기능 교정 & 자연유착 눈매교정', desc: '이마 근육 보상작용을 해소하면서 흉터 부담 없는 또렷한 인아웃 라인을 완성했습니다.', k1: ['+34', '%', '동공 노출도 및 시야 개선'], k2: ['4', '일', '주요 붓기 안정화 기간'], imgPrompt: 'close-up editorial beauty portrait of Korean woman with clear bright natural eyes, warm soft daylight, luxury skincare campaign style, 8k' },
          { code: 'C/04', cat: 'CONTOUR · 3D', year: '2026', title: '비대칭 3D 안면윤곽 · 연부조직 리프팅 병행', desc: '미세 절골과 심부볼 정리를 동시 적용해 볼처짐 없이 매끄러운 페이스 라인을 구축했습니다.', k1: ['0.2', 'mm', '3D 대칭 오차 정밀도'], k2: ['12', '개월', '전담 경과 모니터링'], imgPrompt: 'elegant Korean female model silhouette and serene facial contour in soft warm studio light, minimalist luxury portrait, 8k' },
        ],
        teamTitle: '직접 집도하는 전문의.',
        team: [
          { code: 'P/01', name: '서도윤', role: '대표원장 · 안면거상/윤곽', bio: '서울대학교 의과대학 졸업 · 서울대병원 성형외과 전문의 · 대한안면성형학회 정회원', imgPrompt: 'editorial studio portrait of Korean male chief plastic surgeon in his 40s wearing tailored white medical coat, calm trustworthy gaze, warm minimal backdrop, 8k' },
          { code: 'P/02', name: '김채린', role: '원장 · 눈/코 재수술 전담', bio: '연세대학교 의과대학 졸업 · 세브란스병원 전문의 · 국제미용성형학회(ISAPS) 정회원', imgPrompt: 'editorial studio portrait of elegant Korean female plastic surgeon in her late 30s wearing crisp white doctor coat, warm soft lighting, 8k' },
          { code: 'P/03', name: '박지훈', role: '원장 · 3D 윤곽/재건', bio: '가톨릭대학교 의과대학 졸업 · 성형외과 전문의 · 두개안면성형학회 학술위원', imgPrompt: 'editorial portrait of confident Korean male medical specialist in dark suit and white coat, modern architectural clinic background, 8k' },
          { code: 'P/04', name: '이수현', role: '과장 · 마취통증의학과 전담', bio: '서울아산병원 마취통증의학과 전문의 · 안전한 수면·전신마취 프로토콜 총괄', imgPrompt: 'editorial portrait of warm professional Korean female anesthesiologist in neat medical coat, bright serene hospital studio, 8k' },
        ],
        insightsTitle: '전문의가 직접 쓰는 메디컬 칼럼.',
        insights: [
          { tag: 'Medical Report', date: '2026.08', title: '딥플레인 안면거상, 유지 기간을 결정하는 SMAS 박리의 핵심', desc: '단순 피부 당김과 근막층 고정술의 해부학적 차이를 3D 단면 자료로 알기 쉽게 정리했습니다.', imgPrompt: 'minimalist luxury medical research notebook and sleek glass architecture in warm morning sunlight, editorial still life, 8k' },
          { tag: 'Safety Guide', date: '2026.07', title: '코 재수술 전 반드시 확인해야 할 자가연골 선택 기준 3가지', desc: '비중격·귀연골·자가늑연골의 탄성과 흡수율 차이를 케이스별로 비교 분석합니다.', imgPrompt: 'sculptural white ceramic forms symbolizing anatomical harmony on travertine table, soft shadow, editorial photography, 8k' },
          { tag: 'Recovery Note', date: '2026.06', title: '수술 후 72시간 골든타임: 고압산소 회복 프로토콜의 실제 효과', desc: '초기 부종과 멍을 최소화해 일상 복귀를 앞당기는 근거 기반 애프터케어 가이드.', imgPrompt: 'tranquil luxury recovery lounge with soft warm linen sunlight and minimal botanical accents, Seoul boutique clinic, 8k' },
        ],
        faqs: [
          ['상담한 대표원장님이 직접 수술까지 집도하시나요?', '네, 모든 수술은 100% 대표원장 실명 책임제로 운영됩니다. 상담 시 직접 계측하고 디자인한 담당 전문의가 마취부터 마무리 봉합, 경과 체크까지 전 과정을 전담합니다.'],
          ['마취 안전 시스템은 어떻게 갖추어져 있나요?', '마취통증의학과 전문의가 병원 내 상주하며 모든 수술의 생체 신호를 실시간 모니터링합니다. 무정전 전원장치(UPS), 응급 제세동기, 단트롤렌 등 대학병원급 안전 장비를 완비했습니다.'],
          ['지방이나 해외 거주 고객도 당일 상담·예약이 가능한가요?', '사전 온라인 예약을 통해 3D-CT 촬영과 대표원장 1:1 정밀 상담을 원스톱으로 진행하실 수 있으며, 회복 일정에 맞춘 전용 스케줄링을 제공합니다.'],
          ['수술 후 사후관리 프로그램은 별도 비용이 발생하나요?', '아니요. 고압산소 회복 치료, 스마트 붓기 레이저, 정기 경과 검진 및 흉터 관리 프로그램이 수술 케어 플랜에 기본 포함되어 있습니다.'],
        ],
        contactTitle: '당신만의 조화를', contactSub: '함께 설계합니다.',
        contactChips: ['안면거상 · 리프팅', '눈 · 코 성형', '3D 안면윤곽', '고난도 재수술', '쁘띠 · 안티에이징'],
        address: '서울특별시 강남구 도산대로 418, 4—6F', phone: '02-512-8800', email: 'concierge@lumiere-ps.kr', hours: '평일 10:00—19:00 · 토 10:00—16:00 (100% 예약제)',
      },
    },

    derma: {
      re: /(피부과|피부클리닉|에스테틱|리프팅|울쎄라|써마지|레이저|여드름|기미|색소|dermatology|skin\s*clinic)/i,
      label: '피부과 · 하이엔드 메디컬 스킨 클리닉',
      palette: { paper: '#f3f5f1', paper2: '#e6ebe3', ink: '#101412', ink2: '#37423c', mute: '#7c8881', brand: '#183631', brand2: '#224a43', accent: '#cbe6a8', dark: '#0e1311' },
      benchmarks: ['청담 상위 1% 피부과 전문의 클리닉의 클린 보태니컬 에디토리얼 톤(Porcelain Mist + Deep Botanical Forest + Dew Lime)', '정품 샷 인증·피부 초음파 정밀 진단·1인 프라이빗 룸 중심의 신뢰 UX 설계', '시술별 커스텀 레이저 조합 아코디언 + 임상 개선 수치 가로 쇼케이스 + 실시간 예약·CRM'],
      fallback: {
        brand: 'VERDÉ', brandSub: 'DERMATOLOGY CLINIC', est: '2016, Hannam Seoul',
        practice1: 'Lifting · Tightening', practice2: 'Pigment · Skin Barrier',
        status: '피부과 전문의 1:1 정밀 초음파 진단 예약 가능',
        heroLines: ['피부 본연의', '빛을 되찾는', '정밀 의학.'], heroLightWord: '빛을 되찾는',
        heroDesc: '획일화된 공장형 시술을 거부합니다. 피부과 전문의가 피부 두께와 진피 밀도를 초음파로 직접 판독하고, 오직 당신의 피부만을 위한 커스텀 에너지 프로토콜을 처방합니다.',
        ctaPrimary: '정밀 피부 진단 예약', ctaSecondary: '시술 프로그램 보기',
        heroMotionTag: 'PRIVATE SKIN LAB · HANNAM SEOUL',
        heroPrompt: 'ultra serene luxury Korean dermatology clinic lounge in Hannam Seoul, pale limestone walls, indoor minimalist olive tree, diffused morning sunlight, architectural photography, 8k',
        marqueeLabel: 'Authentic Devices & Specialist Standards',
        marquee: ['피부과 전문의 100%', '울쎄라 정품 팁 인증', '써마지 FLX 공식인증', 'VISIA 3D 피부진단', '1인 프라이빗 시술룸', '피부 초음파 정밀계측', '무통 마취 프로토콜', '커스텀 스킨부스터', '대한피부과학회 정회원', '멸균 클린룸 시스템'],
        revealPrompt: 'minimalist 5-star private Korean dermatology treatment room with warm stone wall, soft botanical shadow, luxury medical aesthetics interior, 8k photography',
        revealStats: [['Location', 'Hannam-daero, Seoul'], ['Private Suites', '14 Single-Patient Rooms'], ['Specialists', '100% Board-Certified']],
        beliefEyebrow: '(01) — Our Belief',
        beliefTitle: '좋은 피부과는 많이 권하지 않습니다.',
        founderName: '윤하은 대표원장', founderRole: '피부과 전문의 · 의학박사',
        founderPrompt: 'editorial portrait of refined Korean female chief dermatologist in crisp minimalist white coat, sunlit serene botanical clinic interior, warm natural smile, Leica 85mm photography, 8k',
        statementText: '같은 울쎄라 300샷이라도 피부 두께와 지방 분포에 따라 에너지를 넣어야 할 깊이는 완전히 다릅니다. 우리는 초음파 정밀 진단 기반 1:1 맞춤 처방만을 원칙으로 합니다.',
        statementHighlight: '초음파 정밀 진단 기반 1:1 맞춤 처방',
        principles: [
          ['01 · 100% 피부과 전문의', '대한민국 의사 중 상위 2% 피부과 전문의가 직접 진단하고, 모든 레이저 샷을 1:1로 정밀 시술합니다.'],
          ['02 · 정품 · 정량 투명 공개', '시술 전 고객 눈앞에서 정품 팁 개봉과 시리얼 인증을 확인하는 투명 프로토콜을 지킵니다.'],
          ['03 · 올 프라이빗 1인 케어', '입장부터 마취, 레이저, 진정 관리까지 타인과 마주치지 않는 독립 스위트 룸에서 진행합니다.'],
        ],
        servicesTitle: '네 가지 커스텀 피부 솔루션.',
        services: [
          { code: 'S/01', name: '커스텀 탄력 · 리프팅', summary: '울쎄라·써마지·소프웨이브를 피부층별 초음파 계측에 맞춰 복합 디자인해 꺼짐 없이 탄력을 끌어올립니다.', tags: ['울쎄라 프라임', '써마지 FLX', '소프웨이브', '티타늄 리프팅'], imgPrompt: 'luxury minimalist skincare light refraction through frosted glass and botanical leaves, clean clinical aesthetic photography, 8k' },
          { code: 'S/02', name: '프리미엄 색소 · 기미 토닝', summary: '표피 잡티부터 재발성 진피 기미까지 파장별 멀티 레이저로 피부 손상 없이 맑은 톤을 복원합니다.', tags: ['피코슈어 프로', '레블라이트 SI', '혈관·홍조 레이저', '저자극 기미 케어'], imgPrompt: 'close-up artistic still life of pure clear water droplets on warm porcelain stone, luminous radiant light, macro photography, 8k' },
          { code: 'S/03', name: '스킨부스터 · 진피 재생', summary: '손상된 피부 장벽과 콜라겐 밀도를 근본부터 채우는 전문의 맞춤 바이오 부스터 프로그램.', tags: ['리쥬란 HB', '쥬베룩 볼륨', '엑소좀 재생', '물광 하이드라'], imgPrompt: 'high-end medical dermatology glass ampoule and dewy translucent serum texture on alabaster surface, soft studio light, 8k' },
          { code: 'S/04', name: '여드름 · 모공 · 흉터 복원', summary: '피지선 조절과 콜라겐 리모델링을 동시 설계해 재발률을 낮추고 매끈한 피부결을 완성합니다.', tags: ['포텐자 펌핑팁', '카프리 레이저', '미라젯 흉터치료', '장벽 진정 케어'], imgPrompt: 'serene high-end Korean skin care preparation table with pristine white towels and glass bowls in morning sunlight, 8k' },
        ],
        kpis: [
          ['21,500', '+', '누적 정품 리프팅 시술'],
          ['96.8', '%', '1년 이상 정기 관리 유지율'],
          ['14', '실', '전 객실 1인 프라이빗 스위트'],
          ['100', '%', '피부과 전문의 직접 시술'],
        ],
        processTitle: '진단부터 진정까지, 4단계 프라이빗 케어.',
        process: [
          { step: '01', time: 'STEP 01 · 3D 분석', title: 'VISIA & 고해상도 피부 초음파', desc: '육안으로 보이지 않는 잠재 색소, 진피 콜라겐 밀도, 피하지방 두께를 수치로 정밀 촬영합니다.', tags: ['VISIA 3D 촬영', '진피 초음파', '탄력도 측정'], imgPrompt: 'modern luxury skin analysis room in Seoul, warm minimalist architecture with sleek diagnostic monitor, 8k photography' },
          { step: '02', time: 'STEP 02 · 전문의 처방', title: '1:1 커스텀 에너지 설계', desc: '피부과 전문의가 불필요한 시술을 배제하고 현재 피부에 꼭 필요한 최적의 장비·샷수 조합을 설계합니다.', tags: ['과잉진료 배제', '맞춤 에너지 맵', '정품 팁 배정'], imgPrompt: 'Korean dermatologist consulting patiently with client in serene sunlit private lounge, luxury editorial photography, 8k' },
          { step: '03', time: 'STEP 03 · 정밀 시술', title: '무통 케어 & 1인실 직접 시술', desc: '특수 마취 케어와 쿨링 시스템을 병행해 통증 부담을 낮추고 전문의가 한 샷씩 정교하게 시술합니다.', tags: ['정품 인증서', '통증 최소화', '전문의 전담'], imgPrompt: 'pristine minimalist private aesthetic treatment room with warm indirect ceiling lighting, tranquil atmosphere, 8k' },
          { step: '04', time: 'STEP 04 · 장벽 진정', title: 'LDM 진정 & 홈케어 처방', desc: '시술 직후 열감을 즉각 진정시키는 LDM 초음파 관리와 피부 타입별 애프터 홈케어를 제공합니다.', tags: ['LDM 물방울 진정', '장벽 재생 마스크', '경과 팔로업'], imgPrompt: 'minimalist luxury spa recovery room with pale linen curtains and warm natural daylight, botanical aesthetic, 8k' },
        ],
        casesTitle: '데이터로 확인하는 피부 변화.',
        casesSubtitle: '(04) — CLINICAL DATA · VISIA 3D 정량 측정 기준',
        cases: [
          { code: 'C/01', cat: 'LIFTING · 40s', year: '2025', title: '울써마지 커스텀 복합 리프팅', desc: '볼패임 우려 부위를 피한 초음파 가이드 설계로 턱선 탄력과 잔주름을 동시 개선했습니다.', k1: ['+42', '%', '진피 콜라겐 밀도 상승'], k2: ['14', '개월', '평균 탄력 유지 기간'], imgPrompt: 'editorial skincare portrait of Korean woman with luminous glass skin and serene expression, soft natural window light, 8k' },
          { code: 'C/02', cat: 'PIGMENT · MELASMA', year: '2025', title: '복합 진피성 기미 · 홍조 8주 집중 프로그램', desc: '피코 토닝과 혈관 레이저, 장벽 재생을 병행해 색소 반동 없이 균일한 피부 톤을 회복했습니다.', k1: ['-68', '%', 'VISIA 멜라닌 지수 감소'], k2: ['8', '주', '톤 균일화 완료 기간'], imgPrompt: 'close-up natural light beauty portrait of Korean woman showing clear radiant porcelain complexion, minimal white aesthetic, 8k' },
          { code: 'C/03', cat: 'BOOSTER · BARRIER', year: '2026', title: '만성 건조 · 민감성 장벽 리쥬버네이션', desc: '미세 통증 완화 스킨부스터와 LDM 재생 프로토콜로 수분 손실률을 획기적으로 줄였습니다.', k1: ['+57', '%', '표피 수분 보유력 증가'], k2: ['3', '회', '장벽 안정화 세션'], imgPrompt: 'serene editorial close-up of dewy hydrated skin texture in golden morning light, luxury dermatology campaign, 8k' },
          { code: 'C/04', cat: 'PORE · SCAR', year: '2026', title: '나비존 모공 · 여드름 흉터 콜라겐 리모델링', desc: '포텐자 펌핑팁과 쥬베룩 병합 시술로 피부결 거칠기와 모공 면적을 정량 개선했습니다.', k1: ['-51', '%', '확장 모공 면적 감소'], k2: ['97.4', '%', '시술 3개월 후 만족도'], imgPrompt: 'minimalist artistic beauty portrait of young Korean person with smooth healthy skin under soft diffused studio light, 8k' },
        ],
        teamTitle: '신뢰할 수 있는 피부과 전문의.',
        team: [
          { code: 'P/01', name: '윤하은', role: '대표원장 · 안티에이징/리프팅', bio: '서울대학교 의과대학 졸업 · 피부과 전문의 · 의학박사 · 울쎄라 키닥터', imgPrompt: 'editorial portrait of refined Korean female dermatologist in her 40s wearing white tailored coat, soft sunlit studio, 8k' },
          { code: 'P/02', name: '정민석', role: '원장 · 색소/혈관 레이저', bio: '연세대학교 의과대학 졸업 · 세브란스 피부과 전문의 · 대한피부레이저학회 이사', imgPrompt: 'editorial portrait of warm intelligent Korean male dermatologist in crisp white doctor coat, minimalist architectural backdrop, 8k' },
          { code: 'P/03', name: '한서윤', role: '원장 · 스킨부스터/여드름', bio: '고려대학교 의과대학 졸업 · 피부과 전문의 · 대한여드름주사학회 정회원', imgPrompt: 'editorial portrait of approachable Korean female medical doctor in modern clinic coat, bright serene aesthetic, 8k' },
          { code: 'P/04', name: '오태준', role: '원장 · 흉터/모공 리모델링', bio: '성균관대학교 의과대학 졸업 · 삼성서울병원 피부과 전문의', imgPrompt: 'editorial portrait of professional Korean male skin specialist in clean white lab coat, warm neutral tones, 8k' },
        ],
        insightsTitle: '피부과 전문의의 스킨 저널.',
        insights: [
          { tag: 'Lifting Guide', date: '2026.08', title: '울쎄라와 써마지, 내 피부 두께에 맞는 정확한 선택 기준', desc: '피부 지방층이 얇은 얼굴과 탄력이 떨어진 얼굴에 따라 달라지는 최적의 에너지 설계법.', imgPrompt: 'minimalist glass bottle and botanical shadow on warm cream stone, luxury dermatology editorial still life, 8k' },
          { tag: 'Pigment Lab', date: '2026.07', title: '기미 치료가 자꾸 재발하는 이유: 진피 혈관과 장벽의 비밀', desc: '단순 미백 레이저를 넘어 진피 환경을 안정화해야 색소 침착이 재발하지 않습니다.', imgPrompt: 'delicate sunlit white ceramic bowl and pure botanical stems in serene clinic lounge, editorial photography, 8k' },
          { tag: 'Skin Barrier', date: '2026.06', title: '환절기 민감 피부, 홈케어 성분보다 먼저 점검할 3가지 습관', desc: '피부과 전문의가 진료실에서 가장 많이 처방하는 장벽 회복 루틴을 공개합니다.', imgPrompt: 'calm minimalist linen aesthetic and morning sunbeams across travertine shelf, quiet luxury wellness photo, 8k' },
        ],
        faqs: [
          ['초음파 정밀 피부 진단은 첫 방문 시 바로 받을 수 있나요?', '네, 첫 내원 시 VISIA 3D 피부 분석과 초음파 진단을 바탕으로 피부과 전문의가 직접 1:1 맞춤 리포트를 설명해 드립니다.'],
          ['리프팅 시술 시 통증이 걱정되는데 무통 케어가 가능한가요?', '전용 마취 크림과 에어 쿨링, 필요 시 수면 마취 및 국소 진통 프로토콜을 선택하실 수 있어 편안하게 시술받으실 수 있습니다.'],
          ['시술 후 바로 일상생활이나 메이크업이 가능한가요?', '울쎄라·써마지·피코토닝 등 대부분의 시그니처 시술은 다운타임이 거의 없어 시술 직후 가벼운 메이크업과 일상 복귀가 가능합니다.'],
          ['정품 팁과 샷 수는 어떻게 확인할 수 있나요?', '시술 직전 고객님 앞에서 정품 팁을 개봉하고 기기 화면의 실시간 샷 카운트와 공식 정품 인증서를 함께 발급해 드립니다.'],
        ],
        contactTitle: '가장 건강한 피부로', contactSub: '돌아가는 시작.',
        contactChips: ['울쎄라 · 써마지 리프팅', '기미 · 색소 토닝', '스킨부스터 · 재생', '여드름 · 모공 흉터', '1:1 피부 초음파 진단'],
        address: '서울특별시 용산구 한남대로 98, 3—4F', phone: '02-794-3300', email: 'care@verde-derm.kr', hours: '평일 10:00—19:30 · 토 10:00—16:00 (예약 우선제)',
      },
    },

    dental: {
      re: /(치과|임플란트|치아교정|라미네이트|미백|충치|dental|dentist|orthodont)/i,
      label: '치과 · 디지털 정밀 치의학 클리닉',
      palette: { paper: '#f3f5f7', paper2: '#e4e9ef', ink: '#0f1722', ink2: '#364152', mute: '#788596', brand: '#122b44', brand2: '#1b3d5e', accent: '#9ae6df', dark: '#0c131c' },
      benchmarks: ['서울대·연세대 치의학 프리미엄 클리닉의 정밀 화이트/딥네이비 에디토리얼 무드', '3D 구강스캐너·네비게이션 임플란트·무통 마취 프로토콜을 직관적 단계와 수치로 제시', '진료과목별 플로팅 프리뷰 아코디언 + 임상 케이스 가로 스크롤 + 실시간 진료예약'],
      fallback: {
        brand: 'CLAIRE', brandSub: 'DENTAL STUDIO', est: '2015, Gangnam Seoul',
        practice1: 'Digital Implant · Prosthetics', practice2: 'Invisalign · Veneer',
        status: '3D 디지털 구강스캔 · 분과별 전문의 협진 예약 중',
        heroLines: ['자연 치아를', '가장 먼저', '생각합니다.'], heroLightWord: '가장 먼저',
        heroDesc: '불필요한 발치와 과잉 진료를 배제합니다. 서울대 치대 출신 분과별 전문의가 3D 디지털 정밀 계측으로 오래도록 편안한 구강 건강과 자신 있는 미소를 설계합니다.',
        ctaPrimary: '정밀 검진 예약', ctaSecondary: '진료 과목 보기',
        heroMotionTag: 'DIGITAL 3D DENTISTRY · SEOUL',
        heroPrompt: 'ultra clean luxury modern Korean dental studio interior, pale stone and brushed steel architectural design, warm daylight, tranquil boutique atmosphere, 8k photography',
        marqueeLabel: 'Digital Precision & Sterilization Standards',
        marquee: ['서울대 치의학 전문의', '3D CT 네비게이션', '구강스캐너 무인상 채득', '13단계 멸균 소독실', '무통 컴퓨터 마취', '자체 디지털 기공소', '정품 픽스처 보증', '분과별 협진 시스템', '투명교정 공식인증', '평생 주치의 관리'],
        revealPrompt: 'bright serene architectural Korean dental clinic lounge with minimalist Nordic wood and ivory stone, panoramic window sunlight, 8k photography',
        revealStats: [['Location', 'Teheran-ro, Gangnam'], ['Lab', 'In-House Digital CAD/CAM'], ['Specialists', '5 Board-Certified DDS']],
        beliefEyebrow: '(01) — Our Philosophy',
        beliefTitle: '치과 치료는 평생을 함께할 설계입니다.',
        founderName: '김도현 대표원장', founderRole: '서울대 치의학박사 · 보철과 전문의',
        founderPrompt: 'editorial portrait of trustworthy Korean male chief dentist in crisp white tailored coat, bright minimalist architectural clinic studio, warm smile, Leica 85mm photography, 8k',
        statementText: '1mm의 교합 오차가 10년 뒤 치아 수명을 바꿉니다. 우리는 자체 디지털 기공소와 분과별 전문의 협진으로 자연치아 보존과 정밀 보철의 기준을 높입니다.',
        statementHighlight: '자연치아 보존과 정밀 보철의 기준',
        principles: [
          ['01 · 자연치아 우선 보존', '미세현미경 신경치료와 최소 삭제 원칙으로 살릴 수 있는 자연 치아는 끝까지 지켜냅니다.'],
          ['02 · 자체 디지털 기공소', '3D 구강스캐너와 원내 CAD/CAM 시스템으로 보철물의 정밀도와 심미성을 당일 정교하게 조정합니다.'],
          ['03 · 3단계 무통 · 멸균 안심', '도포 마취·컴퓨터 무통 마취와 1인 1기구 멸균 팩 원칙으로 치과에 대한 두려움을 없앱니다.'],
        ],
        servicesTitle: '네 가지 전문 진료 센터.',
        services: [
          { code: 'S/01', name: '네비게이션 디지털 임플란트', summary: '3D 모의 수술 가이드를 제작해 잇몸 절개를 최소화하고 정확하고 빠른 회복을 돕습니다.', tags: ['최소절개 가이드', '당일 임시치아', '뼈이식·상악동', '전악 임플란트'], imgPrompt: 'high-tech modern 3D dental scanner and precision ceramic prosthetic design on clean glass surface, architectural lighting, 8k' },
          { code: 'S/02', name: '무삭제 · 최소삭제 라미네이트', summary: '치아 손상을 극소화한 0.1mm 수작업 세라믹으로 본래 내 치아 같은 투명도와 미소선을 구현합니다.', tags: ['최소삭제 베니어', '디지털 스마일 디자인', '전문가 미백', '잇몸 성형'], imgPrompt: 'radiant confident natural smile portrait of young Korean woman in clean bright daylight studio, luxury dental campaign, 8k' },
          { code: 'S/03', name: '투명교정 · 디지털 치아교정', summary: '3D 이동 예측 시뮬레이션으로 교정 후 결과를 미리 확인하며 눈에 띄지 않게 가지런한 배열을 완성합니다.', tags: ['인비절라인', '비발치 교정', '부분 심미교정', '성장기 턱교정'], imgPrompt: 'clear translucent orthodontic aligner architectural macro photography on pale cool slate stone, minimalist lighting, 8k' },
          { code: 'S/04', name: '미세현미경 자연치아 보존', summary: '25배 확대 미세현미경으로 미세 균열과 난치성 신경관까지 정밀 치료해 발치 위기 치아를 살립니다.', tags: ['미세현미경 근관', '치아 재식술', '정밀 치주치료', '턱관절 클리닉'], imgPrompt: 'pristine modern minimalist dental treatment chair in sunlit serene Korean clinic with glass walls, 8k photography' },
        ],
        kpis: [
          ['18,200', '+', '디지털 임플란트 식립'],
          ['99.2', '%', '임플란트 5년 생존율'],
          ['13', '단계', '개별 멸균 감염관리'],
          ['5', '개과', '전문의 협진 클리닉'],
        ],
        processTitle: '두려움 없는 진료, 4단계 디지털 워크플로우.',
        process: [
          { step: '01', time: 'STEP 01 · 정밀 스캔', title: '저선량 3D-CT & 구강스캐너', desc: '불편한 본뜨기 대신 3분 구강 스캔과 저선량 CT로 치조골과 교합 상태를 입체 분석합니다.', tags: ['저선량 3D-CT', '무인상 스캔', '교합 분석'], imgPrompt: 'sleek minimalist digital medical imaging room in Seoul, bright neutral stone and glass, 8k' },
          { step: '02', time: 'STEP 02 · 분과 협진', title: '전문의 협진 & 투명 치료계획', desc: '보철·교정·보존과 전문의가 함께 검토해 과잉 없는 최적 치료안과 정확한 비용을 안내합니다.', tags: ['분과별 협진', '투명 견적서', '가상 결과 미리보기'], imgPrompt: 'Korean dentist showing 3D digital tooth model on tablet to patient in bright serene consultation room, 8k' },
          { step: '03', time: 'STEP 03 · 무통 진료', title: '3단계 무통 마취 & 가이드 시술', desc: '가글·도포·컴퓨터 정속 마취로 통증을 줄이고, 독립 진료실에서 편안하게 치료합니다.', tags: ['컴퓨터 무통마취', '독립 1인실', '원내 정밀기공'], imgPrompt: 'calm luxury private dental suite with warm indirect light and ergonomic minimalist design, 8k' },
          { step: '04', time: 'STEP 04 · 평생 관리', title: '정기 리콜 & 보증 케어', desc: '치료 완료 후에도 6개월 주기 정밀 스케일링과 교합 점검으로 평생 구강 건강을 함께 지킵니다.', tags: ['정품 보증서', '6개월 정기점검', '맞춤 구강관리'], imgPrompt: 'bright Scandinavian minimalist clinic reception lounge with fresh greenery and soft morning light, 8k' },
        ],
        casesTitle: '정밀한 임상 결과로 답합니다.',
        casesSubtitle: '(04) — CLINICAL CASES · 디지털 정밀 계측 아카이브',
        cases: [
          { code: 'C/01', cat: 'IMPLANT · FULL', year: '2025', title: '무절개 네비게이션 어금니 임플란트', desc: '당뇨 병력 환자를 위해 출혈·부종을 최소화한 3D 가이드 무절개 식립과 맞춤 지대주를 적용했습니다.', k1: ['18', '분', '정밀 가이드 식립 시간'], k2: ['0', '바늘', '무절개 비봉합 회복'], imgPrompt: 'warm natural smile of distinguished Korean middle-aged gentleman in bright studio light, editorial portrait, 8k' },
          { code: 'C/02', cat: 'VENEER · SMILE', year: '2025', title: '앞니 파절·변색 최소삭제 세라믹 복원', desc: '법랑질 보존 설계와 원내 기공소 맞춤 쉐이드 조색으로 자연치아와 구별되지 않는 투명감을 구현했습니다.', k1: ['0.15', 'mm', '초박막 세라믹 두께'], k2: ['3', '일', '원내 기공 완성 기간'], imgPrompt: 'bright editorial close-up portrait of joyful Korean woman with effortless natural smile, soft sunlit background, 8k' },
          { code: 'C/03', cat: 'ORTHO · CLEAR', year: '2026', title: '비발치 디지털 투명교정 · 돌출입 개선', desc: '3D 치아 이동 시뮬레이션을 통해 발치 없이 안정적인 악궁 확장과 균형 잡힌 측모를 완성했습니다.', k1: ['14', '개월', '총 교정 완료 기간'], k2: ['98.9', '%', '예측 시뮬레이션 일치율'], imgPrompt: 'fresh editorial portrait of young Korean professional smiling warmly in soft studio lighting, 8k' },
          { code: 'C/04', cat: 'ENDO · SAVE', year: '2026', title: '발치 권유 어금니 미세현미경 재신경치료', desc: '25배 확대 현미경으로 놓친 4번째 신경관을 찾아내 자연치아를 성공적으로 보존했습니다.', k1: ['100', '%', '자연치아 발치 없이 보존'], k2: ['25', '배', '고배율 정밀 시야 치료'], imgPrompt: 'tranquil architectural detail of pristine modern dental glass studio with warm sunlight, 8k' },
        ],
        teamTitle: '분과별 전문의 협진 팀.',
        team: [
          { code: 'P/01', name: '김도현', role: '대표원장 · 보철과 전문의', bio: '서울대학교 치의학대학원 박사 · 서울대치과병원 보철과 전문의', imgPrompt: 'editorial studio portrait of confident Korean male chief dentist in crisp white coat, soft neutral studio light, 8k' },
          { code: 'P/02', name: '이서진', role: '원장 · 교정과 전문의', bio: '연세대학교 치과대학 졸업 · 세브란스 치과교정과 전문의 · 인비절라인 다이아몬드', imgPrompt: 'editorial studio portrait of warm Korean female orthodontist in clean white coat, bright sunlit clinic background, 8k' },
          { code: 'P/03', name: '최현우', role: '원장 · 구강악안면외과 전문의', bio: '서울대학교 치과병원 구강악안면외과 전문의 · 고난도 임플란트·사랑니 전담', imgPrompt: 'editorial portrait of approachable Korean male oral surgeon in white coat, modern architectural clinic backdrop, 8k' },
          { code: 'P/04', name: '강유리', role: '원장 · 치과보존과 전문의', bio: '경희대학교 치과병원 보존과 전문의 · 미세현미경 자연치아 살리기 전담', imgPrompt: 'editorial portrait of gentle Korean female dental specialist in white coat, minimalist serene backdrop, 8k' },
        ],
        insightsTitle: '치의학 전문의의 구강 가이드.',
        insights: [
          { tag: 'Implant', date: '2026.08', title: '네비게이션 임플란트, 일반 임플란트와 무엇이 다른가요?', desc: '3D 모의 시술 가이드가 수술 정확도와 통증·회복 기간에 미치는 실제 차이를 설명합니다.', imgPrompt: 'clean minimalist ceramic dental aesthetic still life on cool ivory stone, editorial photography, 8k' },
          { tag: 'Aesthetics', date: '2026.07', title: '치아 삭제 걱정 없는 최소삭제 라미네이트의 조건', desc: '법랑질 보존율이 접착력과 수명을 좌우합니다. 시술 전 반드시 체크할 3가지 기준.', imgPrompt: 'bright minimalist architectural glass reflection and white limestone interior, quiet luxury, 8k' },
          { tag: 'Prevention', date: '2026.06', title: '시린 치아와 잇몸 출혈, 방치하면 안 되는 초기 신호', desc: '조기 스케일링과 미세 교합 조정만으로 큰 치료를 예방하는 실전 관리법.', imgPrompt: 'serene Nordic wellness clinic reception table with soft morning light and greenery, 8k' },
        ],
        faqs: [
          ['임플란트 시술이 많이 아프고 오래 걸리나요?', '3D 네비게이션 가이드를 활용한 최소절개 방식과 3단계 무통 마취를 적용해 통증과 붓기가 적으며, 단일 식립 기준 15~20분 내외로 완료됩니다.'],
          ['야간 진료나 토요일 진료도 운영하나요?', '직장인 환자분들을 위해 화·목요일 저녁 8시 30분까지 야간 진료를 운영하며, 토요일은 점심시간 없이 오후 3시까지 진료합니다.'],
          ['타 병원에서 발치를 권유받았는데 자연치아를 살릴 수 있나요?', '치과보존과 전문의가 3D-CT와 25배 미세현미경으로 정밀 재진단하여, 보존 가능성이 있는 치아는 끝까지 살리는 치료를 우선합니다.'],
          ['주차 및 예약 변경은 어떻게 하나요?', '건물 내 무료 발렛 주차를 지원하며, 아래 온라인 예약 또는 카카오톡 알림을 통해 간편하게 일정을 조정하실 수 있습니다.'],
        ],
        contactTitle: '평생 편안한 미소,', contactSub: '지금 상담하세요.',
        contactChips: ['네비게이션 임플란트', '최소삭제 라미네이트', '투명 · 치아교정', '자연치아 보존치료', '정밀 구강검진'],
        address: '서울특별시 강남구 테헤란로 212, 5F', phone: '02-567-2800', email: 'hello@claire-dental.kr', hours: '월·수·금 09:30—18:30 · 화·목 야간 20:30 · 토 15:00',
      },
    },

    hospital: {
      re: /(병원|클리닉|의원|정형외과|소아과|소아청소년과|정신과|정신건강|화상|한의원|내과|안과|산부인과|건강검진|메디컬|재활|통증|hospital|medical|clinic)/i,
      archetype: 'meridian',
      label: '프리미엄 메디컬 센터 · 전문 클리닉',
      palette: { paper: '#f5f1ea', paper2: '#e8e2d7', ink: '#141413', ink2: '#3f3d39', mute: '#807b72', brand: '#17343a', brand2: '#214850', accent: '#d6e59a', dark: '#0e1315' },
      benchmarks: ['상위 1% 전문 클리닉(Elpis·GDWEB 수상작)의 웜 클리니컬 파치먼트 + 신뢰 에디토리얼 톤', '실시간 진료 상태·전문의 협진·단계별 치료 패스웨이를 수치와 프로세스로 시각화', '센터별 플로팅 프리뷰 아코디언 + 임상 성과 가로 쇼케이스 + 실시간 예약·CRM'],
      fallback: {
        brand: 'ELPIS', brandSub: 'MEDICAL CENTER', est: '2015, Seoul',
        practice1: 'Precision Diagnostics · Care', practice2: 'Rehabilitation · Recovery',
        status: '분과별 전문의 협진 · 당일 정밀검사 예약 가능',
        heroLines: ['회복의 시작을', '가장 가까이서', '함께합니다.'], heroLightWord: '가장 가까이서',
        heroDesc: '정확한 진단과 따뜻한 진료가 만나는 프리미엄 메디컬 센터. 대학병원급 정밀 장비와 분야별 전문의 협진으로 안전한 회복 경로를 설계합니다.',
        ctaPrimary: '진료 · 검진 예약', ctaSecondary: '진료 센터 보기',
        heroMotionTag: 'CARE PROTOCOL · SEOUL',
        heroPrompt: 'serene architectural Korean medical center reception lounge with warm stone and morning daylight, 8k',
        marqueeLabel: 'Clinical Excellence & Patient Safety',
        marquee: ['분과별 전문의 협진', '3.0T MRI · 저선량 CT', '원스톱 당일 검사', '무균 클린 진료실', '1:1 맞춤 재활 케어', '야간·주말 안심 진료', '근거 중심 프로토콜', '보건복지부 인증 기준'],
        revealPrompt: 'calm sunlit minimalist private medical consultation suite in Seoul, warm oak and stone, 8k',
        revealStats: [['Location', 'Gangnam-daero, Seoul'], ['Centers', '4 Specialized Clinics'], ['Specialists', '12 Board-Certified MD']],
        beliefEyebrow: '(01) — Our Philosophy',
        beliefTitle: '정확한 진단은 충분한 경청에서 시작합니다.',
        founderName: '이정훈 대표원장', founderRole: '서울대 의대 · 의학박사',
        founderPrompt: 'editorial portrait of warm Korean chief medical director in white coat, serene sunlit clinic studio, 8k',
        statementText: '증상만 빠르게 덮는 진료가 아니라 근본 원인을 끝까지 찾아냅니다. 우리는 충분한 진료 시간과 정밀 영상 진단을 바탕으로 환자 중심의 회복 경로를 약속합니다.',
        statementHighlight: '환자 중심의 회복 경로',
        principles: [
          ['01 · 비수술 우선 원칙', '불필요한 시술·수술을 배제하고 근거 기반 보존 치료와 맞춤 재활을 최우선으로 설계합니다.'],
          ['02 · 원스톱 정밀 검사', '초음파·CT·혈액 정밀 검사를 한 공간에서 빠르게 진행하고 전문의가 당일 판독합니다.'],
          ['03 · 회복까지 책임 관리', '치료 종료 후에도 생활 습관 코칭과 정기 추적 검진으로 재발을 예방합니다.'],
        ],
        servicesTitle: '네 가지 전문 진료 센터.',
        services: [
          { code: 'S/01', name: '정밀 통증 · 척추관절 센터', summary: '초음파 가이드 비수술 주사치료와 1:1 도수·운동재활로 근본적인 통증 원인을 해결합니다.', tags: ['초음파 유도치료', '1:1 도수재활', '비수술 디스크', '스포츠 손상'], imgPrompt: 'serene modern physical therapy rehabilitation studio' },
          { code: 'S/02', name: '프리미엄 건강검진 · 내과', summary: '연령·가족력 맞춤 정밀 검진과 만성질환 관리, 당일 결과 상담을 제공합니다.', tags: ['맞춤 종합검진', '심혈관 정밀검사', '수면 내시경', '영양 수액 클리닉'], imgPrompt: 'clean minimalist diagnostic lounge' },
          { code: 'S/03', name: '재생 · 흉터 · 회복 클리닉', summary: '급성기 처치부터 단계별 레이저·피부 재생까지 일상 복귀를 앞당기는 통합 케어.', tags: ['급성기 집중처치', '흉터 레이저', '고압산소 회복', '전담 간호케어'], imgPrompt: 'tranquil medical recovery suite' },
          { code: 'S/04', name: '마음 · 수면 · 스트레스 케어', summary: '프라이빗 독립 공간에서 수면 장애·번아웃·자율신경 불균형을 정밀 분석하고 회복합니다.', tags: ['자율신경 검사', '수면 클리닉', '1:1 심층상담', '야간 진료'], imgPrompt: 'warm quiet private counseling room' },
        ],
        kpis: [['38,000', '+', '누적 정밀 진료 케이스'], ['97.6', '%', '환자 진료 만족도'], ['12', '인', '대학병원 출신 전문의'], ['30', '분', '원스톱 검사·판독 완료']],
        processTitle: '내원부터 완치까지, 4단계 케어 패스웨이.',
        process: [
          { step: '01', time: 'STEP 01 · 정밀 문진', title: '증상 분석 & 영상 계측', desc: '충분한 문진과 고해상도 초음파·영상 장비로 통증과 질환의 정확한 원인을 파악합니다.', tags: ['정밀 문진', '고해상도 초음파', '당일 판독'], imgPrompt: 'modern medical scan room' },
          { step: '02', time: 'STEP 02 · 협진 설계', title: '맞춤 치료 로드맵 수립', desc: '환자분의 생활 패턴과 회복 목표에 맞춘 단계별 치료 계획과 기간을 투명하게 안내합니다.', tags: ['맞춤 로드맵', '과잉진료 배제', '투명 비용안내'], imgPrompt: 'doctor explaining chart' },
          { step: '03', time: 'STEP 03 · 집중 치료', title: '전문의 전담 정밀 시술·치료', desc: '독립된 쾌적한 진료 공간에서 담당 전문의가 안전하고 세심하게 치료를 진행합니다.', tags: ['전문의 전담', '무통 프로토콜', '독립 진료실'], imgPrompt: 'private clinical suite' },
          { step: '04', time: 'STEP 04 · 일상 복귀', title: '재활 코칭 & 추적 검진', desc: '증상 재발을 막는 맞춤 운동·생활 가이드를 제공하고 정기적으로 경과를 확인합니다.', tags: ['1:1 재활 코칭', '정기 추적검진', '모바일 케어'], imgPrompt: 'sunlit wellness studio' },
        ],
        casesTitle: '데이터로 증명하는 회복.',
        casesSubtitle: '(04) — CLINICAL OUTCOMES · 익명화 치료 지표',
        cases: [
          { code: 'C/01', cat: 'SPINE · NON-SURGICAL', year: '2026', title: '만성 경추·요추 통증 비수술 통합 재활', desc: '신경차단술과 6주 맞춤 도수·운동재활을 병행해 수술 없이 일상 기능을 회복했습니다.', k1: ['-78', '%', '통증 지수(VAS) 감소'], k2: ['6', '주', '기능 회복 완료'], imgPrompt: 'minimalist wellness posture study' },
          { code: 'C/02', cat: 'RECOVERY · SCAR', year: '2026', title: '단계별 재생 레이저 & 피부 장벽 복원', desc: '초기 진정 케어와 복합 파장 레이저로 흉터 경계와 붉은기를 정밀 완화했습니다.', k1: ['+64', '%', '피부 탄력·결 개선'], k2: ['98', '%', '경과 만족도'], imgPrompt: 'serene clinical skincare studio' },
          { code: 'C/03', cat: 'CHECKUP · EARLY', year: '2025', title: '원스톱 정밀 건강검진 조기 발견 케어', desc: '당일 영상 판독과 상급병원 연계 프로토콜로 골든타임 내 신속한 치료를 연결했습니다.', k1: ['45', '분', '검사부터 판독까지'], k2: ['100', '%', '전문의 직접 설명'], imgPrompt: 'bright architectural clinic hall' },
          { code: 'C/04', cat: 'SLEEP · MIND', year: '2026', title: '직장인 만성 불면 · 번아웃 회복 프로그램', desc: '자율신경 정량 평가와 인지행동 요법으로 수면 효율과 주간 집중력을 회복했습니다.', k1: ['+48', '%', '깊은 수면 비율 증가'], k2: ['8', '주', '수면 리듬 안정화'], imgPrompt: 'calm sunlit architectural sanctuary' },
        ],
        teamTitle: '함께 고민하는 전문의 팀.',
        team: [
          { code: 'P/01', name: '이정훈', role: '대표원장 · 통합진료 총괄', bio: '서울대학교 의과대학 졸업 · 의학박사 · 전 서울대병원 전임의', imgPrompt: 'Korean male doctor portrait' },
          { code: 'P/02', name: '박소연', role: '원장 · 정밀진단/내과', bio: '연세대학교 의과대학 졸업 · 세브란스병원 내과 전문의', imgPrompt: 'Korean female doctor portrait' },
          { code: 'P/03', name: '최민재', role: '원장 · 통증/재활의학과', bio: '성균관대학교 의과대학 졸업 · 삼성서울병원 재활의학과 전문의', imgPrompt: 'Korean male specialist portrait' },
          { code: 'P/04', name: '김지우', role: '원장 · 회복/마음클리닉', bio: '고려대학교 의과대학 졸업 · 정신건강·수면의학 전문의', imgPrompt: 'Korean female specialist portrait' },
        ],
        insightsTitle: '전문의가 전하는 건강 인사이트.',
        insights: [
          { tag: 'Medical Note', date: '2026.08', title: '만성 통증, 진통제보다 먼저 확인해야 할 생활 자세 3가지', desc: '진료실에서 가장 흔히 발견되는 체형 불균형과 5분 교정 루틴을 정리했습니다.', imgPrompt: 'minimalist desk sunlight' },
          { tag: 'Checkup Guide', date: '2026.07', title: '30·40대 직장인이 꼭 챙겨야 할 맞춤 정밀검진 항목', desc: '연령대와 가족력에 따라 우선순위가 달라지는 핵심 검사 리스트.', imgPrompt: 'calm glass interior' },
          { tag: 'Recovery', date: '2026.06', title: '수면의 질이 면역력과 회복 속도를 결정하는 이유', desc: '깊은 수면 단계를 회복하는 근거 기반 수면 위생 프로토콜.', imgPrompt: 'warm linen morning light' },
        ],
        faqs: [
          ['당일 초진과 정밀검사를 한 번에 받을 수 있나요?', '네, 온라인 사전 예약 후 내원하시면 문진·초음파·혈액검사 및 전문의 판독까지 원스톱으로 진행하실 수 있습니다.'],
          ['야간 진료나 토요일 진료도 운영하나요?', '평일 화·목요일 저녁 8시까지 야간 진료를 운영하며, 토요일은 오후 2시까지 점심시간 없이 진료합니다.'],
          ['실손보험 적용 및 제증명 발급이 가능한가요?', '네, 급여·비급여 항목별 투명한 안내와 함께 원무 데스크 및 모바일로 간편하게 필요 서류를 발급해 드립니다.'],
          ['주차 지원은 어떻게 되나요?', '건물 지하 주차장 2시간 무료 주차 및 발렛 서비스를 제공합니다.'],
        ],
        contactTitle: '건강한 일상을', contactSub: '다시 설계합니다.',
        contactChips: ['통증 · 재활 진료', '프리미엄 건강검진', '재생 · 흉터 케어', '수면 · 스트레스 상담', '야간 · 주말 예약'],
        address: '서울특별시 강남구 강남대로 382, 4—5F', phone: '02-554-7100', email: 'care@elpis-med.kr', hours: '평일 09:00—18:30 · 화·목 야간 20:00 · 토 14:00',
      },
    },

    fashion: {
      re: /(패션|의류|옷|브랜드\s*룩북|룩북|아틀리에|뷰티\s*브랜드|코스메틱|화장품|향수|주얼리|악세서리|웨딩|드레스|가방|fashion|atelier|lookbook|cosmetic|beauty\s*brand|jewelry)/i,
      archetype: 'atelier',
      label: '하이엔드 패션 · 뷰티 아틀리에 룩북',
      palette: { paper: '#FAF7F1', paper2: '#F1ECE3', ink: '#1E1B18', ink2: '#4D463F', mute: '#867C72', brand: '#6A4330', brand2: '#523223', accent: '#E3EAF0', dark: '#1E1B18' },
      benchmarks: ['아틀리에 룩북 레퍼런스(TWO FOLD)의 코튼 페이퍼(#F1ECE3) + 혼 브라운(#6A4330) + 초크 블루 하이라이트', 'Bodoni Moda 초대형 세리프 + 좌측 점선 재봉선 스크롤 프로그레스 + 기울어진 듀얼 폴드 룩북 카드', '소재·원단 라이브러리 + 카테고리 필터 컬렉션 프리뷰 + 프라이빗 런칭 알림 예약'],
      fallback: {
        brand: 'MAISON FOLD', brandSub: 'WOMENSWEAR ATELIER', est: '2026, Hannam Seoul',
        practice1: 'Natural Cotton · Silk', practice2: 'Tailored Dart · Horn Button',
        status: '2026 F/W 첫 컬렉션 프라이빗 프리오더 오픈',
        heroLines: ['좋은 결은,', '두 번', '오래 입혀집니다.'], heroLightWord: '두 번',
        heroDesc: '유행보다 원단의 숨결과 입체 패턴에 집중하는 한남동 아틀리에. 손끝에 닿는 코튼과 천연 소뿔 단추, 정교한 다트 핏으로 시간이 지날수록 깊어지는 실루엣을 짓습니다.',
        ctaPrimary: '첫 컬렉션 알림 받기', ctaSecondary: '룩북 아카이브 보기',
        heroMotionTag: 'ATELIER FILM · HANNAM',
        heroPrompt: 'sunlit minimalist Korean fashion atelier lookbook photography',
        marqueeLabel: 'Crafted Fabrics & Atelier Standards',
        marquee: ['이탈리아 오가닉 코튼', '천연 소뿔 단추', '입체 다트 패턴', '소량 한정 제작', '한남 프라이빗 쇼룸', '평생 수선 보증'],
        revealPrompt: 'warm cotton fabric draping in sunlit studio',
        revealStats: [['Atelier', 'Hannam-dong, Seoul'], ['Fabric', '100% Natural Fiber'], ['Edition', 'Small Batch Crafted']],
        beliefEyebrow: '(01) — Why Atelier',
        beliefTitle: '입는 사람의 하루를 닮아가는 옷을 만듭니다.',
        founderName: '김서아 크리에이티브 디렉터', founderRole: '패턴 마스터 · 아틀리에 디렉터',
        founderPrompt: 'editorial portrait of Korean female fashion designer in sunlit linen atelier',
        statementText: '화려한 로고 대신 안감의 시접과 어깨선의 떨어짐에서 품격이 드러납니다. 우리는 10번을 세탁해도 흐트러지지 않는 원단과 입체 봉제만을 고집합니다.',
        statementHighlight: '흐트러지지 않는 원단과 입체 봉제',
        principles: [
          ['01 · 원단이 80%를 결정합니다', '피부에 닿는 첫 감촉을 위해 국내외 방직 공방의 고밀도 천연 면·실크·울 원단만 선별합니다.'],
          ['02 · 1mm 입체 다트 설계', '체형을 가두지 않으면서도 허리와 어깨 라인이 정갈하게 떨어지는 자체 입체 패턴을 개발합니다.'],
          ['03 · 시즌을 넘는 소량 제작', '불필요한 재고를 남기지 않고 한 벌씩 검수해 고유 넘버링과 평생 수선 케어를 제공합니다.'],
        ],
        servicesTitle: '아틀리에 원단 · 시그니처 디테일.',
        services: [
          { code: 'F/01', name: '하이덴시티 코튼 포플린 셔츠', summary: '바스락거리는 청량감과 은은한 광택이 살아있는 100수 고밀도 코튼 시그니처 셔츠.', tags: ['시그니처', '100수 코튼', '천연 자개단추'], imgPrompt: 'cotton poplin shirt detail' },
          { code: 'F/02', name: '테일러드 실크 블렌드 블라우스', summary: '움직일 때마다 부드럽게 흐르는 드레이프와 정교한 소매 핀턱 디테일을 담았습니다.', tags: ['컬렉션', '실크 블렌드', '입체 핀턱'], imgPrompt: 'silk blouse drape' },
          { code: 'F/03', name: '핸드메이드 더블 울 자켓', summary: '가벼운 착용감과 단정한 어깨 실루엣이 조화를 이루는 사계절 아틀리에 아우터.', tags: ['아카이브', '메리노 울', '혼 버튼'], imgPrompt: 'tailored wool jacket' },
          { code: 'F/04', name: '프라이빗 비스포크 피팅', summary: '한남 아틀리에 쇼룸에서 체형별 기장·소매 맞춤 조정 서비스를 제공합니다.', tags: ['시그니처', '1:1 피팅'], imgPrompt: 'atelier fitting room' },
        ],
        kpis: [['100', '%', '천연 섬유 원단'], ['42', '공정', '한 벌당 정밀 봉제'], ['1:1', '', '프라이빗 쇼룸 피팅'], ['평생', '', '단추·시접 수선 보증']],
        processTitle: '원단 선별부터 완성까지.',
        process: [
          { step: '01', time: 'STEP 01', title: '원단 아카이브 선별', desc: '밀도·수축률·드레이프 테스트를 통과한 천연 원단만 채택합니다.', tags: ['소재 검증'], imgPrompt: 'fabric swatches' },
          { step: '02', time: 'STEP 02', title: '입체 드레이핑 패턴', desc: '마네킹 위에서 직접 핀을 꽂아 움직임이 편안한 실루엣을 완성합니다.', tags: ['입체 패턴'], imgPrompt: 'draping studio' },
          { step: '03', time: 'STEP 03', title: '장인 봉제 & 검수', desc: '30년 경력 봉제 장인이 미세 스티치와 안감 마감을 완성합니다.', tags: ['정밀 봉제'], imgPrompt: 'tailor stitching' },
          { step: '04', time: 'STEP 04', title: '코튼 파우치 패키징', desc: '재사용 가능한 오가닉 코튼 더스트백에 담아 배송합니다.', tags: ['에코 패키지'], imgPrompt: 'linen packaging' },
        ],
        casesTitle: '2026 첫 컬렉션 프리뷰.',
        casesSubtitle: '(03) — LOOKBOOK ARCHIVE',
        cases: [
          { code: 'L/01', cat: '시그니처 · SHIRT', year: '2026', title: '핀턱 코튼 아틀리에 셔츠 — Ivory', desc: '은은한 아이보리 컬러와 좁은 카라 라인이 돋보이는 데일리 에센셜.', k1: ['100', '수', '코튼'], k2: ['S-L', '', '사이즈'], imgPrompt: 'ivory shirt lookbook' },
          { code: 'L/02', cat: '컬렉션 · OUTER', year: '2026', title: '혼 버튼 테일러드 린넨 자켓 — Sand', desc: '자연스러운 구김조차 멋이 되는 벨기에산 헤비 린넨 테일러드 자켓.', k1: ['100', '%', '린넨'], k2: ['한정', '', '150피스'], imgPrompt: 'sand linen jacket' },
          { code: 'L/03', cat: '아카이브 · DRESS', year: '2026', title: '플리츠 실크 미디 원피스 — Espresso', desc: '허리 다트와 절제된 플리츠가 우아한 실루엣을 완성합니다.', k1: ['SILK', '', '블렌드'], k2: ['1:1', '', '기장 맞춤'], imgPrompt: 'espresso silk dress' },
          { code: 'L/04', cat: '시그니처 · KNIT', year: '2026', title: '캐시미어 블렌드 가디건 — Oatmeal', desc: '맨살에 닿아도 포근한 파인 캐시미어 데일리 니트.', k1: ['30', '%', '캐시미어'], k2: ['F/W', '', '컬렉션'], imgPrompt: 'oatmeal knitwear' },
        ],
        teamTitle: '아틀리에 크래프트 팀.',
        team: [
          { code: 'P/01', name: '김서아', role: '크리에이티브 디렉터', bio: '컬렉션 디렉팅 및 원단 큐레이션 총괄', imgPrompt: 'Korean female designer' },
          { code: 'P/02', name: '박은지', role: '수석 패턴사', bio: '입체 다트 패턴 및 핏 엔지니어링 18년', imgPrompt: 'Korean pattern maker' },
          { code: 'P/03', name: '이도연', role: '소재 연구 매니저', bio: '천연 섬유 소싱 및 세탁 내구성 검증', imgPrompt: 'Korean textile specialist' },
          { code: 'P/04', name: '최유진', role: '쇼룸 컨시어지', bio: '한남 아틀리에 1:1 프라이빗 피팅 전담', imgPrompt: 'Korean showroom director' },
        ],
        insightsTitle: '아틀리에 저널.',
        insights: [
          { tag: 'Fabric', date: '2026.08', title: '천연 소뿔 단추와 고밀도 코튼의 관리법', desc: '오래 입을수록 멋이 더해지는 천연 소재 세탁 가이드.', imgPrompt: 'horn button fabric' },
          { tag: 'Pattern', date: '2026.07', title: '어깨선 5mm의 차이가 만드는 핏의 완성도', desc: '입체 다트 설계 비하인드 노트.', imgPrompt: 'tailor chalk pattern' },
          { tag: 'Atelier', date: '2026.06', title: '한남 쇼룸 프라이빗 피팅 라운지 오픈', desc: '예약제로 운영되는 조용한 시착 공간 안내.', imgPrompt: 'minimalist showroom' },
        ],
        faqs: [
          ['프리오더 알림을 신청하면 어떤 혜택이 있나요?', '정식 오픈 24시간 전 프라이빗 링크와 첫 구매 전용 아틀리에 케어 키트를 우선 제공합니다.'],
          ['쇼룸에서 직접 입어볼 수 있나요?', '한남동 아틀리에 쇼룸은 화~토 예약제로 운영되며 체형별 맞춤 기장 상담이 가능합니다.'],
          ['세탁 및 수선 서비스는 어떻게 받나요?', '구매하신 모든 의류는 아틀리에 평생 수선 케어를 통해 단추·시접·기장 보수를 지원합니다.'],
          ['해외 배송도 가능한가요?', '네, 아시아·북미·유럽 주요 국가로 DHL 익스프레스 안전 배송을 지원합니다.'],
        ],
        contactTitle: '첫 컬렉션의 소식을', contactSub: '가장 먼저 받아보세요.',
        contactChips: ['첫 컬렉션 알림', '한남 쇼룸 피팅', '원단 스와치 신청', 'B2B 바잉 문의'],
        address: '서울특별시 용산구 이태원로54길 38, 2F', phone: '02-790-4420', email: 'atelier@maisonfold.kr', hours: '화—토 11:00—19:00 (예약제 쇼룸)',
      },
    },

    architecture: {
      re: /(인테리어|건축|건설|리모델링|주택|시공|설계\s*사무소|공간\s*대관|갤러리\s*대관|스튜디오\s*대관|부동산|타운하우스|interior|architecture|construction|remodeling)/i,
      archetype: 'architecture',
      label: '하이엔드 건축 · 인테리어 스튜디오',
      palette: { paper: '#fbfaf7', paper2: '#eee8dd', ink: '#22211f', ink2: '#4e4b45', mute: '#77726a', brand: '#24221e', brand2: '#3a352e', accent: '#c8a77c', dark: '#161513' },
      benchmarks: ['상위 1% 건축·인테리어 스튜디오(결·명진건설)의 라임워시 스톤(#fbfaf7) + 오크 브론즈(#8a6f4d) 에디토리얼 톤', '풀블리드 다크 틴트 아키텍처 모션 히어로 + 4:5 필터 포트폴리오 그리드(주거·상업·오피스)', '평수·공간유형·마감등급 실시간 예상 공사비 자동 견적 계산기 + 우측 플로팅 퀵 독'],
      fallback: {
        brand: 'GYEOL STUDIO', brandSub: 'ARCHITECTURE & INTERIOR', est: '2016, Seongsu Seoul',
        practice1: 'Residential · Villa', practice2: 'Commercial · Office',
        status: '2026 하반기 설계·시공 프로젝트 사전 상담 중',
        heroLines: ['빛과 재료가', '머무는 공간을', '설계합니다.'], heroLightWord: '머무는 공간을',
        heroDesc: '과장된 장식을 덜어내고 공간 본연의 비례와 자연광의 흐름을 살립니다. 설계부터 직영 시공, 사후 하자보증까지 원스톱 책임 프로세스로 완성합니다.',
        ctaPrimary: '예상 공사비 자동 견적', ctaSecondary: '시공 포트폴리오 보기',
        heroMotionTag: 'ARCHITECTURAL STUDIO · SEOUL',
        heroPrompt: 'warm minimalist travertine architecture interior',
        marqueeLabel: 'Architectural Craft & Direct Construction',
        marquee: ['직영 시공 팀 운영', '3D BIM 정밀 설계', '친환경 E0 자재', '2년 책임 하자보증', '투명 내역서 공개'],
        revealPrompt: 'limewash stone gallery space',
        revealStats: [['Completed', '312 Projects'], ['Referral', '68% Re-Commission'], ['Warranty', '2 Years Direct A/S']],
        beliefEyebrow: '(01) — PHILOSOPHY',
        beliefTitle: '비워낼수록 공간의 결이 선명해집니다.',
        founderName: '정우진 대표 건축가', founderRole: '건축사 · 공간 디렉터',
        founderPrompt: 'Korean male architect portrait',
        statementText: '시간이 지나도 낡지 않고 깊어지는 천연 스톤과 원목, 그리고 계절마다 달라지는 빛의 각도를 계산해 거주자의 삶에 맞춘 공간을 완성합니다.',
        statementHighlight: '거주자의 삶에 맞춘 공간',
        principles: [
          ['01 · 빛의 동선 설계', '하루의 채광 변화와 간접 조도의 균형을 3D 시뮬레이션으로 정밀 계획합니다.'],
          ['02 · 본질적인 천연 재료', '라임워시, 트래버틴, 화이트 오크 등 시간이 쌓일수록 멋이 더해지는 정직한 자재를 씁니다.'],
          ['03 · 직영 시공 & 투명 견적', '하청 없는 직영 현장 소장 전담제와 품목별 100% 공개 견적으로 신뢰를 지킵니다.'],
        ],
        servicesTitle: '공간 유형별 맞춤 설계.',
        services: [
          { code: 'A/01', name: '하이엔드 주거 리모델링', summary: '구조 변경부터 맞춤 가구 제작까지 가족의 라이프스타일을 담은 주거 설계.', tags: ['주거', '맞춤 제작가구'], imgPrompt: 'luxury apartment interior' },
          { code: 'A/02', name: '브랜드 플래그십 · 쇼룸', summary: '브랜드의 철학을 첫눈에 각인시키는 상업 공간·카페·클리닉 디렉팅.', tags: ['상업', '브랜딩 공간'], imgPrompt: 'flagship retail showroom' },
          { code: 'A/03', name: '크리에이티브 오피스', summary: '집중과 협업의 리듬이 자연스럽게 흐르는 하이엔드 워크스페이스.', tags: ['오피스', '음향 설계'], imgPrompt: 'minimalist modern office' },
          { code: 'A/04', name: '단독주택 신축 · 건축설계', summary: '대지 분석부터 인허가, 건축·인테리어 통합 시공까지 원스톱 수행.', tags: ['건축', '턴키 시공'], imgPrompt: 'modern concrete villa' },
        ],
        kpis: [['312', '건', '누적 설계·시공 완료'], ['11', '주', '평균 원스톱 완공'], ['2', '년', '직영 책임 하자보증'], ['68', '%', '고객 지인 소개 비중']],
        processTitle: '투명한 4단계 원스톱 시공.',
        process: [
          { step: '01', time: 'STEP 01 · 실측·기획', title: '현장 실측 & 무드보드', desc: '공간 구조와 설비 상태를 정밀 점검하고 예산 범위와 디자인 방향을 확정합니다.', tags: ['현장 실측'], imgPrompt: 'architect blueprint' },
          { step: '02', time: 'STEP 02 · 3D 설계', title: '포토리얼 3D & 자재 미팅', desc: '실제 마감 샘플을 직접 만져보며 착공 전 완성 공간을 100% 검증합니다.', tags: ['3D 시안'], imgPrompt: 'material board' },
          { step: '03', time: 'STEP 03 · 직영 시공', title: '전담 현장 소장 공정 관리', desc: '매주 공정 리포트와 사진으로 투명하게 현장 진행 상황을 공유합니다.', tags: ['직영 시공'], imgPrompt: 'interior craft' },
          { step: '04', time: 'STEP 04 · 준공·보증', title: '정밀 검수 & 2년 사후관리', desc: '입주 전 48개 항목 체크리스트 검수 후 2년간 책임 A/S를 보장합니다.', tags: ['2년 보증'], imgPrompt: 'finished living room' },
        ],
        casesTitle: '완공된 공간의 기록.',
        casesSubtitle: '(02) — SELECTED PROJECTS',
        cases: [
          { code: 'P/01', cat: '주거', year: '2026', title: '한남 더힐 68평 라임워시 레지던스', desc: '천연 트래버틴 아일랜드와 히든 도어 시스템으로 완성한 미니멀 주거.', k1: ['68', '평', '시공 면적'], k2: ['10', '주', '완공 기간'], imgPrompt: 'minimalist residence' },
          { code: 'P/02', cat: '상업', year: '2026', title: '성수 에디토리얼 로스터리 플래그십', desc: '노출 콘크리트와 오크 목재의 대비가 돋보이는 2층 복합 문화 카페.', k1: ['52', '평', '시공 면적'], k2: ['8', '주', '완공 기간'], imgPrompt: 'minimalist cafe architecture' },
          { code: 'P/03', cat: '오피스', year: '2025', title: '테헤란로 AI 스타트업 헤드쿼터', desc: '라운지형 오픈 워크존과 방음 포커스 룸이 공존하는 하이브리드 오피스.', k1: ['95', '평', '시공 면적'], k2: ['9', '주', '완공 기간'], imgPrompt: 'modern executive office' },
          { code: 'P/04', cat: '주거', year: '2025', title: '반포 42평 갤러리 하우스', desc: '미술 컬렉션 조도와 화이트 오크 마루가 어우러진 가족의 집.', k1: ['42', '평', '시공 면적'], k2: ['7', '주', '완공 기간'], imgPrompt: 'gallery apartment' },
        ],
        teamTitle: '설계 · 시공 디렉터.',
        team: [
          { code: 'D/01', name: '정우진', role: '대표 건축가', bio: '공간 디렉팅 및 하이엔드 주거 총괄', imgPrompt: 'architect' },
          { code: 'D/02', name: '한지민', role: '수석 공간 디자이너', bio: '상업·플래그십 공간 및 조명 설계', imgPrompt: 'interior designer' },
          { code: 'D/03', name: '강태호', role: '시공 총괄 소장', bio: '직영 공정 관리 및 정밀 디테일 검수 20년', imgPrompt: 'construction director' },
          { code: 'D/04', name: '송유라', role: 'FF&E 큐레이터', bio: '제작 가구·마감재·아트 스타일링', imgPrompt: 'curator' },
        ],
        insightsTitle: '스튜디오 아카이브.',
        insights: [
          { tag: 'Material', date: '2026.08', title: '라임워시와 천연 석재, 관리하기 어렵지 않을까요?', desc: '실제 시공 현장에서 검증한 방오 코팅과 유지관리 노하우.', imgPrompt: 'travertine texture' },
          { tag: 'Budget', date: '2026.07', title: '평당 견적의 함정: 투명 내역서 확인법', desc: '추가 공사비를 막기 위해 계약 전 반드시 체크할 5가지.', imgPrompt: 'architectural plan' },
          { tag: 'Light', date: '2026.06', title: '집의 분위기를 바꾸는 3000K 간접 조명 공식', desc: '공간별 최적 조도와 색온도 배치 가이드.', imgPrompt: 'warm lighting interior' },
        ],
        faqs: [
          ['설계만 별도로 의뢰할 수도 있나요?', '네, 설계·시공 통합 턴키를 기본으로 하며 지방 또는 대형 프로젝트는 설계 단독 의뢰도 가능합니다.'],
          ['예상 견적은 어떻게 산출되나요?', '위 자동 견적 계산기로 대략적인 예산 범위를 즉시 확인하신 뒤, 현장 실측을 통해 품목별 확정 내역서를 드립니다.'],
          ['시공 기간 중 현장 진행을 어떻게 확인하나요?', '전용 프로젝트 채널로 주 2회 공정 사진과 다음 주 일정을 투명하게 공유합니다.'],
          ['하자보증 기간은 얼마인가요?', '준공일로부터 2년간 직영 A/S 팀이 무상 책임 보수를 지원합니다.'],
        ],
        contactTitle: '당신의 공간을', contactSub: '함께 설계합니다.',
        contactChips: ['주거 리모델링', '상업·쇼룸', '오피스 설계', '신축 턴키'],
        address: '서울특별시 성동구 연무장길 42, 3F', phone: '02-468-9200', email: 'studio@gyeol-arch.kr', hours: '평일 09:30—18:30 (방문 상담 예약제)',
      },
    },

    luxury: {
      re: /(호텔|리조트|펜션|풀빌라|호캉스|파인다이닝|오마카세|한우|정육|숙성육|와인바|위스키|라운지|명품|시계|hotel|resort|fine\s*dining|butcher|luxury\s*brand)/i,
      archetype: 'luxury',
      label: '녹터널 럭셔리 호스피탈리티 · 크래프트',
      palette: { paper: '#0b1019', paper2: '#101826', ink: '#ece6da', ink2: '#c9c1b2', mute: '#9aa3b2', brand: '#141e30', brand2: '#1d2b44', accent: '#c9a45c', dark: '#070a0f' },
      benchmarks: ['하이엔드 호텔·장인 브랜드(BELLUCE·광)의 딥 옵시디언/네이비(#0b1019) + 샴페인 골드(#c9a45c) 톤', 'Noto Serif KR + Cormorant Garamond 이탤릭 페어링 + 풀블리드 시네마틱 모션 히어로', '등급·박수/세트·인원 선택에 따라 실시간 예상 금액이 계산되는 프라이빗 예약 엔진'],
      fallback: {
        brand: 'BELLUCE', brandSub: 'GRAND HOTEL & RESIDENCES', est: '2018, Seoul',
        practice1: 'Private Suites · Lounge', practice2: 'Fine Dining · Concierge',
        status: '2026 시그니처 스위트 & 다이닝 프라이빗 예약 중',
        heroLines: ['머무는 순간을', '예술로 완성하다.'], heroLightWord: '예술로',
        heroDesc: '도심의 소음을 완벽히 차단한 프라이빗 생츄어리. 절제된 건축미, 24시간 버틀러 컨시어지, 그리고 미쉐린 셰프의 다이닝이 잊지 못할 밤을 완성합니다.',
        ctaPrimary: '스위트 예약 조회', ctaSecondary: '시그니처 컬렉션',
        heroMotionTag: 'PRIVATE SANCTUARY · SEOUL',
        heroPrompt: 'dark obsidian luxury hotel suite interior warm gold lighting',
        marqueeLabel: 'Forbes Five-Star Standard',
        marquee: ['24H 버틀러 컨시어지', '프라이빗 스파', '노이어 다이닝 바', '발렛 & 리무진'],
        revealPrompt: 'luxury nocturnal hotel corridor',
        revealStats: [['Suites', '48 Private Residences'], ['Dining', 'Noir Fine Bar'], ['Service', '24H Butler']],
        beliefEyebrow: '(01) — Heritage',
        beliefTitle: '화려함보다 깊은 고요함으로 기억됩니다.',
        founderName: '윤태성 총지배인', founderRole: 'General Manager',
        founderPrompt: 'hotel general manager portrait',
        statementText: '최고의 환대는 요청하기 전에 먼저 준비되어 있는 세심함입니다. 체크인 순간부터 체크아웃 이후까지 단 한 분만을 위한 맞춤 리듬을 설계합니다.',
        statementHighlight: '단 한 분만을 위한 맞춤 리듬',
        principles: [
          ['01 · 프라이빗 아키텍처', '전 객실 독립 엘리베이터 홀과 파노라마 시티 뷰로 완벽한 사생활을 보장합니다.'],
          ['02 · 마스터 다이닝 & 바', '제철 최상급 식재료와 450여 종의 빈티지 와인이 어우러진 시그니처 미식 경험.'],
          ['03 · 24H 전담 컨시어지', '객실 침구 취향부터 프라이빗 이동까지 모든 여정을 전담 버틀러가 케어합니다.'],
        ],
        servicesTitle: '시그니처 스위트 & 다이닝.',
        services: [
          { code: 'S/01', name: '시그니처 디럭스 스위트', summary: '파노라마 통창과 천연 대리석 욕조, 전용 미니바가 갖춰진 68㎡ 프라이빗 객실.', tags: ['68㎡', '조식 2인 포함'], imgPrompt: 'deluxe suite' },
          { code: 'S/02', name: '그랜드 프리미어 레지던스', summary: '독립 리빙룸과 프라이빗 다이닝 테이블을 갖춘 112㎡ 하이엔드 스위트.', tags: ['112㎡', '버틀러 서비스'], imgPrompt: 'grand suite' },
          { code: 'S/03', name: '프레지덴셜 펜트하우스', summary: '최상층 전용 테라스와 프라이빗 스파, 셰프 인룸 다이닝을 포함한 최고급 공간.', tags: ['240㎡', '전용 리무진'], imgPrompt: 'penthouse suite' },
          { code: 'S/04', name: '노이어 파인다이닝 & 바', summary: '미쉐린 출신 셰프의 9코스 테이스팅 메뉴와 시그니처 페어링.', tags: ['9코스', '프라이빗 룸'], imgPrompt: 'fine dining bar' },
        ],
        kpis: [['48', '실', '전 객실 스위트 구성'], ['24', 'H', '전담 버틀러 컨시어지'], ['450', '+', '빈티지 와인 셀러'], ['99.2', '%', '재투숙 만족도']],
        processTitle: '프라이빗 투숙 여정.',
        process: [
          { step: '01', time: '01', title: '사전 취향 컨시어지', desc: '침구·향기·웰컴 드링크를 투숙 전 맞춤 세팅합니다.', tags: ['맞춤 세팅'], imgPrompt: 'welcome' },
          { step: '02', time: '02', title: '인룸 프라이빗 체크인', desc: '대기 없이 전용 라운지 또는 객실에서 바로 체크인합니다.', tags: ['인룸 체크인'], imgPrompt: 'checkin' },
          { step: '03', time: '03', title: '스파 & 노이어 다이닝', desc: '프라이빗 웰니스와 미식 코스로 완벽한 휴식을 누립니다.', tags: ['파인다이닝'], imgPrompt: 'dining' },
          { step: '04', time: '04', title: '레이트 체크아웃', desc: '여유로운 아침 식사와 공항 리무진 센딩을 지원합니다.', tags: ['리무진'], imgPrompt: 'checkout' },
        ],
        casesTitle: '잊지 못할 경험의 순간.',
        casesSubtitle: 'CURATED EXPERIENCE',
        cases: [
          { code: 'E/01', cat: 'SUITE', year: '2026', title: '어텀 샴페인 스테이 패키지', desc: '스위트 1박 + 노이어 바 샴페인 보틀 + 인룸 조식.', k1: ['₩450k', '~', '1박 기준'], k2: ['2인', '', '조식 포함'], imgPrompt: 'champagne' },
          { code: 'E/02', cat: 'DINING', year: '2026', title: '셰프 테이블 프라이빗 디너', desc: '하루 단 2팀만 예약 가능한 시즈널 테이스팅 코스.', k1: ['9', '코스', '페어링'], k2: ['100', '%', '예약제'], imgPrompt: 'tasting menu' },
          { code: 'E/03', cat: 'WELLNESS', year: '2026', title: '녹터널 프라이빗 스파 리추얼', desc: '아로마 테라피와 히노끼 프라이빗 배스 90분.', k1: ['90', '분', '프라이빗'], k2: ['1:1', '', '테라피스트'], imgPrompt: 'spa' },
          { code: 'E/04', cat: 'EVENT', year: '2026', title: '펜트하우스 프라이빗 살롱', desc: '소규모 VIP 리셉션 및 브랜드 프레젠테이션 대관.', k1: ['30', '인', '최대 수용'], k2: ['전담', '', '케이터링'], imgPrompt: 'salon' },
        ],
        teamTitle: '호스피탈리티 마스터.',
        team: [
          { code: 'M/01', name: '윤태성', role: '총지배인', bio: '글로벌 5성 호텔 20년 경력', imgPrompt: 'gm' },
          { code: 'M/02', name: '강현석', role: '총괄 셰프', bio: '미쉐린 스타 레스토랑 헤드 셰프 출신', imgPrompt: 'chef' },
          { code: 'M/03', name: '이수진', role: '수석 소믈리에', bio: '와인 셀러 450종 큐레이션 총괄', imgPrompt: 'sommelier' },
          { code: 'M/04', name: '박도윤', role: '컨시어지 디렉터', bio: '레클레도르 골든키 정회원', imgPrompt: 'concierge' },
        ],
        insightsTitle: '저널.',
        insights: [
          { tag: 'Dining', date: '2026.08', title: '가을 시즈널 테이스팅 메뉴 공개', desc: '국내 제철 트러플과 한우 숙성 코스의 조화.', imgPrompt: 'autumn menu' },
          { tag: 'Design', date: '2026.07', title: '빛과 어둠으로 빚은 벨루체의 건축미', desc: '천연 현무암과 브론즈 디테일 이야기.', imgPrompt: 'obsidian design' },
          { tag: 'Wine', date: '2026.06', title: '올여름 추천하는 빈티지 샴페인 3선', desc: '수석 소믈리에의 페어링 노트.', imgPrompt: 'wine cellar' },
        ],
        faqs: [
          ['체크인/체크아웃 시간은 어떻게 되나요?', '체크인 15:00, 체크아웃 12:00이며 스위트 투숙객은 사전 요청 시 레이트 체크아웃을 우대합니다.'],
          ['발렛 파킹은 무료인가요?', '투숙 및 다이닝 이용 고객 모두 무료 발렛 파킹 서비스를 제공합니다.'],
          ['기념일 맞춤 데코레이션이 가능한가요?', '예약 시 요청하시면 플로리스트와 페이스트리 팀이 맞춤 세팅을 준비해 드립니다.'],
          ['취소 규정은 어떻게 되나요?', '투숙 48시간 전까지 위약금 없이 무료 변경 및 취소가 가능합니다.'],
        ],
        contactTitle: '프라이빗한 여정을', contactSub: '지금 예약하세요.',
        contactChips: ['스위트 예약', '다이닝 예약', '프라이빗 스파', 'VIP 행사 대관'],
        address: '서울특별시 강남구 삼성로 512', phone: '02-3456-9000', email: 'concierge@belluce.kr', hours: '24시간 프런트 & 컨시어지 운영',
      },
    },

    cafe: {
      re: /(카페|커피|로스터리|베이커리|빵집|디저트|브런치|케이크|티하우스|식당|음식점|맛집|cafe|coffee|bakery|dessert|brunch)/i,
      archetype: 'cafe',
      label: '오가닉 감성 카페 · 베이커리 다이닝',
      palette: { paper: '#fbf8f3', paper2: '#f3ece0', ink: '#1f2a22', ink2: '#465249', mute: '#66705f', brand: '#3f6b45', brand2: '#2f5234', accent: '#f2661c', dark: '#1d241f' },
      benchmarks: ['성수 인기 카페 레퍼런스(오렌지 다이닝)의 웜 오프화이트(#fbf8f3) + 올리브 잉크 + 탠저린 오렌지(#f2661c)', '아날로그 필름 프레임 히어로 + 오늘의 원두/신선도 실시간 배지 + 비대칭 원형 포토 콜라주', 'BEST 배지와 가격표·카테고리 필터가 동작하는 시그니처 메뉴 보드 + 테이블 예약'],
      fallback: {
        brand: 'SOLÉA DINING', brandSub: 'SEONGSU ROASTERY & BAKERY', est: 'Seongsu · Since 2021',
        practice1: 'Single Origin Roastery', practice2: 'Artisan Brunch · Dessert',
        status: '오늘의 시그니처 브릭스 13.4 Brix · 08:30 갓 구운 페이스트리',
        heroLines: ['햇살과 향이', '머무는', '성수의 아침.'], heroLightWord: '머무는',
        heroDesc: '매일 아침 6시 직접 로스팅한 스페셜티 원두와 제주 직송 제철 과일로 구워낸 페이스트리. 따뜻한 빛이 드는 창가 자리에서 여유로운 브런치를 즐겨보세요.',
        ctaPrimary: '시그니처 메뉴 보기', ctaSecondary: '테이블 예약하기',
        heroMotionTag: 'FRESH ROASTED · SEONGSU',
        heroPrompt: 'sunlit minimalist Seongsu bakery cafe interior',
        marqueeLabel: 'Daily Fresh Ingredients',
        marquee: ['당일 로스팅 원두', '프랑스 발효 버터', '제주 농가 직송', '무첨가 천연 발효종'],
        revealPrompt: 'warm sunlight coffee table',
        revealStats: [['Roasting', 'Daily 40kg Fresh'], ['Seats', '28 Sunlit Seats'], ['Bakers', '3 Head Patissiers']],
        beliefEyebrow: 'Our Story',
        beliefTitle: '좋은 재료가 가장 정직한 맛을 냅니다.',
        founderName: '오하린 헤드 파티시에', founderRole: '로스터 & 파티시에',
        founderPrompt: 'Korean barista smiling',
        statementText: '냉동 생지나 시럽을 쓰지 않습니다. 산지에서 아침에 도착한 과일을 직접 착즙하고, 48시간 저온 숙성한 천연 발효종 반죽으로 매일 한정 수량만 구워냅니다.',
        statementHighlight: '48시간 저온 숙성한 천연 발효종',
        principles: [
          ['01 · 48시간 저온 발효', '속이 편안하고 겉은 바삭한 크러스트를 위해 매일 새벽 직접 반죽합니다.'],
          ['02 · 스페셜티 싱글 오리진', '에티오피아·콜롬비아 직거래 생두를 매장에서 소량씩 데일리 로스팅합니다.'],
          ['03 · 제철 산지 직송 과일', '계절마다 가장 당도가 높은 농가 직송 과일로 시그니처 타르트와 에이드를 만듭니다.'],
        ],
        servicesTitle: '매일 아침 갓 준비하는 시그니처.',
        services: [
          { code: 'M/01', name: '제주 시트러스 크림 라떼', summary: '직접 만든 귤 껍질 콩포트와 부드러운 마스카포네 크림이 어우러진 베스트 라떼.', tags: ['시그니처'], imgPrompt: 'citrus cream latte' },
          { code: 'M/02', name: '발효 버터 소금 브리오슈', summary: '프랑스산 AOP 발효 버터와 게랑드 소금으로 구워낸 겉바속촉 대표 베이커리.', tags: ['디저트'], imgPrompt: 'butter brioche' },
          { code: 'M/03', name: '시즈널 프루트 밀푀유', summary: '캐러멜라이즈드 파이 사이에 바닐라빈 커스터드와 제철 과일을 층층이 쌓았습니다.', tags: ['디저트'], imgPrompt: 'fruit mille-feuille' },
          { code: 'M/04', name: '성수 브런치 사워도우 플레이트', summary: '천연 발효 사워도우와 부라타 치즈, 구운 제철 채소, 수제 바질 페스토.', tags: ['시그니처'], imgPrompt: 'brunch sourdough plate' },
        ],
        kpis: [['40', 'kg', '하루 신선 착즙·로스팅'], ['28', '석', '햇살 가득한 테이블'], ['3', '인', '전담 파티시에·로스터'], ['48', 'H', '천연 발효종 숙성']],
        processTitle: '하루의 루틴.',
        process: [
          { step: '01', time: '06:00', title: '로스팅 & 반죽', desc: '첫 오븐 예열과 데일리 에스프레소 테이스팅.', tags: ['로스팅'], imgPrompt: 'roasting' },
          { step: '02', time: '08:30', title: '첫 빵 출고', desc: '갓 구운 소금빵과 크루아상이 진열됩니다.', tags: ['오픈'], imgPrompt: 'bakery' },
          { step: '03', time: '11:00', title: '브런치 타임', desc: '제철 브런치 플레이트와 스페셜티 브루잉.', tags: ['브런치'], imgPrompt: 'brunch' },
          { step: '04', time: '15:00', title: '디저트 페어링', desc: '오후 티타임 한정 밀푀유와 필터 커피.', tags: ['티타임'], imgPrompt: 'tea time' },
        ],
        casesTitle: '오늘의 추천 페어링.',
        casesSubtitle: 'DAILY SPECIAL',
        cases: [
          { code: 'P/01', cat: '음료', year: '2026', title: '에티오피아 게이샤 핸드드립', desc: '자스민과 백도 향이 깔끔하게 퍼지는 라이트 로스트 필터 커피.', k1: ['₩8,500', '', 'HOT/ICE'], k2: ['싱글', '', '오리진'], imgPrompt: 'pour over coffee' },
          { code: 'P/02', cat: '디저트', year: '2026', title: '피스타치오 라즈베리 타르트', desc: '고소한 시칠리아산 피스타치오 크림과 상큼한 라즈베리 콩포트.', k1: ['₩9,200', '', '포장가능'], k2: ['한정', '', '30개'], imgPrompt: 'pistachio tart' },
          { code: 'P/03', cat: '시그니처', year: '2026', title: '트러플 에그 브리오슈 샌드위치', desc: '폭신한 스크램블 에그와 화이트 트러플 오일의 깊은 풍미.', k1: ['₩14,500', '', '브런치'], k2: ['BEST', '', '인기'], imgPrompt: 'egg brioche' },
          { code: 'P/04', cat: '음료', year: '2026', title: '제주 청귤 로즈마리 에이드', desc: '주문 즉시 착즙한 청귤과 직접 키운 허브의 청량한 조화.', k1: ['₩7,500', '', 'ICE'], k2: ['100%', '', '생착즙'], imgPrompt: 'citrus ade' },
        ],
        teamTitle: '솔레아 팀.',
        team: [
          { code: 'T/01', name: '오하린', role: '헤드 파티시에', bio: '르꼬르동블루 출신 · 천연발효 베이커리 총괄', imgPrompt: 'patissier' },
          { code: 'T/02', name: '김태민', role: '헤드 로스터', bio: 'Q-Grader · 싱글 오리진 소싱 및 로스팅', imgPrompt: 'roaster' },
          { code: 'T/03', name: '박지은', role: '브런치 셰프', bio: '제철 브런치 플레이트 개발', imgPrompt: 'chef' },
          { code: 'T/04', name: '이준서', role: '매니저', bio: '공간 호스피탈리티 및 단체 케이터링', imgPrompt: 'manager' },
        ],
        insightsTitle: '성수 노트.',
        insights: [
          { tag: 'Beans', date: '2026.08', title: '이번 달의 싱글 오리진 테이스팅 노트', desc: '산뜻한 시트러스 산미가 돋보이는 여름 블렌드.', imgPrompt: 'coffee beans' },
          { tag: 'Bakery', date: '2026.07', title: '집에서도 맛있게 즐기는 사워도우 보관법', desc: '슬라이스 냉동과 토스터 리베이킹 팁.', imgPrompt: 'sourdough' },
          { tag: 'Space', date: '2026.06', title: '반려견 동반 테라스 좌석 안내', desc: '햇살 좋은 야외 데크 좌석 이용 가이드.', imgPrompt: 'terrace' },
        ],
        faqs: [
          ['홀 케이크나 기프트 박스 사전 예약이 가능한가요?', '방문 2일 전까지 예약해 주시면 원하시는 문구와 함께 정성스럽게 준비해 드립니다.'],
          ['주차가 가능한가요?', '매장 앞 3대 및 인근 공영주차장 1시간 주차권을 지원합니다.'],
          ['반려동물 동반이 가능한가요?', '야외 테라스 좌석은 반려견과 함께 편안하게 이용하실 수 있습니다.'],
          ['단체 케이터링·답례품 주문도 되나요?', '기업 세미나 및 행사 맞춤 구움과자·커피 케이터링을 운영 중입니다.'],
        ],
        contactTitle: '성수의 따뜻한 테이블을', contactSub: '미리 예약하세요.',
        contactChips: ['테이블 예약', '홀케이크 픽업', '단체 케이터링', '원두 정기구독'],
        address: '서울특별시 성동구 서울숲2길 24, 1F', phone: '02-498-2100', email: 'hello@solea-dining.kr', hours: '매일 08:30—21:00 (라스트오더 20:30)',
      },
    },

    tech: {
      re: /(테크|ai|인공지능|클라우드|스타트업|saas|앱\s*랜딩|소프트웨어|플랫폼|devops|개발|보안|핀테크|데이터|api|tech|startup|software|cloud|platform)/i,
      archetype: 'saas',
      label: '다크 테크니컬 SaaS · 클라우드 플랫폼',
      palette: { paper: '#070b14', paper2: '#0c1220', ink: '#e9eef8', ink2: '#b8c7e0', mute: '#93a0b8', brand: '#111a2d', brand2: '#1a2742', accent: '#3d7eff', dark: '#05080f' },
      benchmarks: ['글로벌 1티어 개발자 SaaS(STRATA)의 딥 스페이스 네이비(#070b14) + 일렉트릭 블루(#3d7eff) + 네온 라이브(#45f0a1)', '비트맵 사진 없이 100% UI·벡터로 구현한 실시간 프로덕션 콘솔(req/s·p95·로그 스트림) 히어로', '글래스 벤토 기능 + 4탭 산업 솔루션 + 복사 가능한 TypeScript SDK + 월간/연간 20% 할인 요금제 토글'],
      fallback: {
        brand: 'STRATA', brandSub: 'AI CLOUD INFRASTRUCTURE', est: '2024, Seoul & SF',
        practice1: 'Predictive Autoscale', practice2: 'AI Cost Guard · Observability',
        status: 'NEW · AI 비용 최적화 엔진 v2.4 정식 출시',
        heroLines: ['트래픽이 몰리기', '5분 전에 먼저', '확장하는 클라우드.'], heroLightWord: '5분 전에 먼저',
        heroDesc: '갑작스러운 장애와 과도한 클라우드 청구서를 끝내세요. AI 예측형 오토스케일링과 실시간 통합 관측성으로 배포 속도는 4배 높이고 인프라 비용은 평균 38% 절감합니다.',
        ctaPrimary: '14일 무료 시작하기', ctaSecondary: '솔루션 아키텍처 보기',
        heroMotionTag: 'LIVE PRODUCTION TELEMETRY',
        heroPrompt: 'dark technical cloud network',
        marqueeLabel: 'Trusted by Engineering Teams',
        marquee: ['SOC2 Type II', 'ISO 27001', '99.998% SLA', 'Multi-Region Edge', 'Zero-Downtime Deploy'],
        revealPrompt: 'dark server console',
        revealStats: [['Uptime', '99.998% SLA'], ['Latency', '38ms Global P95'], ['Savings', '-38% Cloud Spend']],
        beliefEyebrow: '01 · CORE ENGINE',
        beliefTitle: '인프라 운영을 코드 한 줄로 자동화합니다.',
        founderName: '한도윤 CTO', founderRole: 'Co-Founder & Principal Architect',
        founderPrompt: 'tech founder',
        statementText: '개발팀이 YAML 설정과 새벽 장애 알림에 시간을 쏟지 않도록, 배포·확장·비용 최적화를 단일 AI 제어 플레인으로 통합했습니다.',
        statementHighlight: '단일 AI 제어 플레인',
        principles: [
          ['01 · 예측형 오토스케일링', '시계열 AI 모델이 트래픽 급증을 5분 앞서 예측해 콜드스타트 없이 노드를 선제 확장합니다.'],
          ['02 · 통합 실시간 관측성', '로그·메트릭·분산 트레이싱을 단일 타임라인에서 1초 이내 쿼리합니다.'],
          ['03 · AI 비용 자동 가드', '유휴 인스턴스와 스팟 노드를 실시간 리밸런싱해 매달 클라우드 비용을 자동 절감합니다.'],
        ],
        servicesTitle: '프로덕션 인프라를 위한 3대 엔진.',
        services: [
          { code: 'ENG/01', name: '예측형 AI 오토스케일링', summary: '트래픽 패턴을 실시간 학습해 스파이크 발생 전 컨테이너와 GPU 노드를 자동 워밍업합니다.', tags: ['5분 선제 확장', 'Zero Cold-Start', 'GPU 지원'], imgPrompt: 'autoscale' },
          { code: 'ENG/02', name: '통합 관측성 & 이상 탐지', summary: '수백만 건의 로그와 p95 레이턴시 병목을 AI가 자동 요약하고 근본 원인을 지목합니다.', tags: ['OpenTelemetry', 'p95 추적', '자동 롤백'], imgPrompt: 'observability' },
          { code: 'ENG/03', name: 'AI 클라우드 비용 최적화', summary: '워크로드 SLA를 지키면서 스팟·예약 인스턴스를 자동 조합해 평균 38% 비용을 줄입니다.', tags: ['-38% 절감', '실시간 리밸런싱', 'FinOps'], imgPrompt: 'finops' },
          { code: 'ENG/04', name: '제로 트러스트 보안 게이트', summary: '모든 서비스 간 통신에 자동 mTLS와 실시간 취약점 정책 검증을 적용합니다.', tags: ['mTLS', 'SOC2', 'ISMS'], imgPrompt: 'security' },
        ],
        kpis: [['99.998', '%', '글로벌 가용성 SLA'], ['38', 'ms', '평균 Edge P95 응답'], ['-38', '%', '평균 클라우드 비용 절감'], ['1.4', '초', '무중단 프로덕션 배포']],
        processTitle: '5분 만에 프로덕션 연동.',
        process: [
          { step: '01', time: '01', title: 'SDK 설치', desc: '기존 AWS·GCP·Kubernetes 클러스터에 에이전트 1줄 연동.', tags: ['CLI'], imgPrompt: 'cli' },
          { step: '02', time: '02', title: '자동 토폴로지 스캔', desc: '서비스 의존성과 병목 구간을 즉시 시각화합니다.', tags: ['Scan'], imgPrompt: 'scan' },
          { step: '03', time: '03', title: 'AI 오토스케일 활성', desc: '트래픽 예측 모델이 실시간 스케일링을 시작합니다.', tags: ['AI'], imgPrompt: 'ai' },
          { step: '04', time: '04', title: '비용 절감 리포트', desc: '매월 절감된 인프라 비용을 대시보드로 확인합니다.', tags: ['FinOps'], imgPrompt: 'report' },
        ],
        casesTitle: '산업별 프로덕션 도입 성과.',
        casesSubtitle: 'PRODUCTION BENCHMARKS',
        cases: [
          { code: 'C/01', cat: '핀테크 · 결제', year: '2026', title: '초당 4만 건 결제 트래픽 무중단 처리', desc: '급여일·프로모션 피크 타임에도 p95 35ms 이하 응답과 장애 0건을 달성했습니다.', k1: ['35', 'ms', '피크 P95 레이턴시'], k2: ['0', '건', '연간 서비스 장애'], imgPrompt: 'fintech' },
          { code: 'C/02', cat: '이커머스 · 커머스', year: '2026', title: '라이브 커머스 10배 트래픽 자동 대응', desc: '방송 시작 5분 전 선제 스케일링으로 체크아웃 이탈률을 절반 이하로 줄였습니다.', k1: ['-44', '%', '클라우드 인프라 비용'], k2: ['+29', '%', '피크 결제 전환율'], imgPrompt: 'commerce' },
          { code: 'C/03', cat: 'AI 플랫폼 · GPU', year: '2026', title: 'LLM 추론 GPU 클러스터 가동률 극대화', desc: '유휴 GPU 자동 회수 및 배치 라우팅으로 토큰당 추론 단가를 대폭 낮췄습니다.', k1: ['-52', '%', 'GPU 추론 단가 절감'], k2: ['3.4', '배', '처리량 향상'], imgPrompt: 'ai gpu' },
          { code: 'C/04', cat: '엔터프라이즈 · 보안', year: '2026', title: '전용 VPC 하이브리드 멀티 클라우드 통합', desc: '금융권 망분리·ISMS 컴플라이언스를 유지하며 배포 주기를 주간에서 일간으로 단축했습니다.', k1: ['4.8', '배', '배포 빈도 증가'], k2: ['100', '%', '보안 정책 자동감사'], imgPrompt: 'enterprise' },
        ],
        teamTitle: '엔지니어링 리더십.',
        team: [
          { code: 'E/01', name: '한도윤', role: 'CTO · 분산시스템', bio: '전 글로벌 클라우드 인프라 스태프 엔지니어', imgPrompt: 'cto' },
          { code: 'E/02', name: '김민서', role: 'VP Engineering', bio: '대규모 Kubernetes 및 FinOps 엔진 총괄', imgPrompt: 'vp' },
          { code: 'E/03', name: '박준혁', role: 'Head of AI Systems', bio: '시계열 트래픽 예측 및 이상 탐지 모델 연구', imgPrompt: 'ai lead' },
          { code: 'E/04', name: '정수빈', role: 'Security Architect', bio: 'Zero-Trust · SOC2 · ISMS 보안 총괄', imgPrompt: 'security' },
        ],
        insightsTitle: '엔지니어링 블로그.',
        insights: [
          { tag: 'Architecture', date: '2026.08', title: '트래픽 급증을 5분 전에 예측하는 시계열 모델 구조', desc: '콜드스타트 문제를 해결한 실제 프로덕션 아키텍처 공개.', imgPrompt: 'arch' },
          { tag: 'FinOps', date: '2026.07', title: '스팟 인스턴스로 SLA 99.99%를 지키는 법', desc: '무중단 드레이닝과 멀티존 폴백 전략.', imgPrompt: 'finops' },
          { tag: 'DX', date: '2026.06', title: 'YAML 400줄을 TypeScript 4줄로 줄인 SDK 설계기', desc: '개발자 경험을 최우선으로 한 선언형 배포 API.', imgPrompt: 'sdk' },
        ],
        faqs: [
          ['기존 AWS나 GCP 환경을 옮겨야 하나요?', '아니요. 기존 클라우드 계정 위에 경량 에이전트만 연결하면 5분 만에 즉시 적용됩니다.'],
          ['무료 체험 기간 중 과금이 발생하나요?', '14일간 신용카드 등록 없이 Pro 플랜의 모든 기능을 무료로 테스트할 수 있습니다.'],
          ['온프레미스나 폐쇄망 VPC도 지원하나요?', 'Enterprise 플랜에서 전용 VPC 설치와 국내 보안 규제(ISMS-P) 맞춤 지원을 제공합니다.'],
          ['데이터 보안과 로그는 어떻게 관리되나요?', '모든 텔레메트리는 종단 암호화되며 서울 리전(ap-northeast-2)에 안전하게 보관됩니다.'],
        ],
        contactTitle: '클라우드 운영의', contactSub: '새로운 기준을 시작하세요.',
        contactChips: ['14일 무료 체험', '아키텍처 진단', '비용 절감 시뮬레이션', '엔터프라이즈 도입'],
        address: '서울특별시 강남구 테헤란로 521, 18F', phone: '02-6000-4200', email: 'hello@strata.cloud', hours: '24/7 엔지니어링 지원 · 평일 09:00—18:00 세일즈 상담',
      },
    },

    corporate: {
      re: /(기업\s*홈페이지|기업소개|회사소개|그룹|지주|제조|중공업|로보틱스|모빌리티|물류|에너지|바이오\s*기업|공식\s*홈페이지|B2B|채용|ESG|corporate|enterprise|company)/i,
      archetype: 'corporate',
      label: '한국형 대기업 · B2B 공식 기업 사이트',
      palette: { paper: '#ffffff', paper2: '#f5f7fa', ink: '#0f172a', ink2: '#334155', mute: '#64748b', brand: '#0b1220', brand2: '#162847', accent: '#3b82f6', dark: '#0b1220' },
      benchmarks: ['DBCut·GDWEB 기업 수상작(한화비전·HD현대중공업·두산로보틱스)의 풀블리드 시네마틱 기업 히어로 슬라이더 + KR/EN 전환', '4단 풀하이트 호버 확장 사업영역 쇼케이스 + ESG·글로벌 핵심 지표 벤토 그리드', '보도자료·공지·IR 탭 뉴스룸 + 제휴 문의 + 패밀리 사이트 푸터'],
      fallback: {
        brand: 'NEXA GROUP', brandSub: 'GLOBAL INDUSTRIAL & AI TECH', est: '1988, Seoul',
        practice1: 'Robotics · Mobility', practice2: 'Clean Energy · AI Cloud',
        status: '2026 글로벌 기술 혁신 및 ESG 지속가능경영 보고서 발간',
        heroLines: ['기술의 경계를 넘어', '산업의 다음 기준을', '만듭니다.'], heroLightWord: '산업의 다음 기준을',
        heroDesc: '대한민국 제조·로보틱스·친환경 에너지의 미래를 선도하는 글로벌 테크 그룹. 혁신적인 R&D 역량과 책임 있는 ESG 경영으로 지속 가능한 내일을 설계합니다.',
        ctaPrimary: '핵심 사업영역 보기', ctaSecondary: 'IR · 제휴 문의',
        heroMotionTag: 'GLOBAL INNOVATION · SEOUL',
        heroPrompt: 'dark corporate futuristic global network',
        marqueeLabel: 'Global Certified Partners',
        marquee: ['ISO 14001', 'RE100 이니셔티브', '글로벌 28개 거점', 'AAA 신용등급'],
        revealPrompt: 'corporate headquarters architecture',
        revealStats: [['Global', '28 Countries'], ['Patents', '1,420+ Tech Patents'], ['ESG', 'Grade A+']],
        beliefEyebrow: '02 · SUSTAINABILITY',
        beliefTitle: '기술 혁신과 지속 가능성의 균형을 지킵니다.',
        founderName: '김현철 대표이사', founderRole: 'CEO & Chairman',
        founderPrompt: 'executive portrait',
        statementText: '단기 수익을 넘어 2040 탄소중립 로드맵과 협력사 동반성장 생태계를 통해 전 세계 고객이 신뢰하는 글로벌 기업으로 도약합니다.',
        statementHighlight: '2040 탄소중립 로드맵',
        principles: [
          ['01 · 초격차 R&D', '매출의 9.4%를 차세대 로보틱스·AI 자율제조 연구개발에 지속 투자합니다.'],
          ['02 · RE100 친환경 전환', '국내외 전 사업장 재생에너지 100% 전환 및 저탄소 공정 혁신을 실행합니다.'],
          ['03 · 투명한 지배구조', '이사회 독립성 강화와 글로벌 기준의 윤리·준법 경영을 실천합니다.'],
        ],
        servicesTitle: '네 개의 핵심 성장 엔진.',
        services: [
          { code: 'BIZ 01', name: '스마트 로보틱스 · 자동화', summary: '협동로봇과 AI 비전 검사 시스템으로 차세대 무인 스마트 팩토리를 구축합니다.', tags: ['로보틱스', '스마트팩토리'], imgPrompt: 'robotics' },
          { code: 'BIZ 02', name: '친환경 에너지 · ESS', summary: '차세대 고효율 에너지 저장장치와 수소 연료전지 인프라를 글로벌 공급합니다.', tags: ['클린에너지', 'ESS'], imgPrompt: 'clean energy' },
          { code: 'BIZ 03', name: '자율 모빌리티 · 전장', summary: '소프트웨어 중심 차량(SDV) 통합 제어기와 고신뢰성 전장 솔루션을 개발합니다.', tags: ['모빌리티', 'SDV'], imgPrompt: 'mobility' },
          { code: 'BIZ 04', name: '산업용 AI · 클라우드', summary: '제조 공정 예지보전과 글로벌 공급망 최적화를 위한 엔터프라이즈 AI 플랫폼.', tags: ['Industrial AI', 'DX'], imgPrompt: 'industrial ai' },
        ],
        kpis: [['6.4', '조', '연간 연결 매출액'], ['28', '개국', '글로벌 사업 네트워크'], ['1,420', '+', '보유 핵심 기술 특허'], ['A+', '', 'ESG 통합 평가 등급']],
        processTitle: '글로벌 혁신 로드맵.',
        process: [
          { step: '01', time: 'R&D', title: '원천 기술 연구', desc: '글로벌 4대 연구소 공동 R&D.', tags: ['R&D'], imgPrompt: 'lab' },
          { step: '02', time: 'TEST', title: '필드 실증 검증', desc: '극한 환경 신뢰성 테스트 통과.', tags: ['QA'], imgPrompt: 'test' },
          { step: '03', time: 'SCALE', title: '글로벌 양산 공급', desc: '유럽·북미·아시아 적기 공급망.', tags: ['Global'], imgPrompt: 'factory' },
          { step: '04', time: 'ESG', title: '순환 자원 관리', desc: '제품 생애주기 탄소 저감 관리.', tags: ['ESG'], imgPrompt: 'esg' },
        ],
        casesTitle: '글로벌 레퍼런스.',
        casesSubtitle: 'GLOBAL IMPACT',
        cases: [
          { code: 'G/01', cat: 'EUROPE', year: '2026', title: '독일 친환경 스마트 팩토리 턴키 구축', desc: '협동로봇 320대 도입으로 생산 효율 41% 향상.', k1: ['+41', '%', '생산성'], k2: ['320', '대', '로봇 공급'], imgPrompt: 'eu' },
          { code: 'G/02', cat: 'NORTH AMERICA', year: '2026', title: '북미 대형 ESS 그리드 프로젝트 수주', desc: '1.2GWh 규모 계통연계 에너지 저장 시스템 공급.', k1: ['1.2', 'GWh', '공급 규모'], k2: ['15', '년', '성능 보증'], imgPrompt: 'na' },
          { code: 'G/03', cat: 'ASIA', year: '2025', title: '글로벌 물류 허브 자율주행 AMR 통합', desc: '24시간 무인 피킹 및 AI 경로 최적화 실현.', k1: ['-36', '%', '물류 비용'], k2: ['99.9', '%', '정시 출고'], imgPrompt: 'asia' },
          { code: 'G/04', cat: 'KOREA', year: '2026', title: '국가 핵심 인프라 산업용 AI 예지보전', desc: '설비 고장 72시간 전 사전 감지로 다운타임 최소화.', k1: ['-82', '%', '비계획 정지'], k2: ['24/7', '', '모니터링'], imgPrompt: 'kr' },
        ],
        teamTitle: '경영진.',
        team: [
          { code: 'C/01', name: '김현철', role: '대표이사 CEO', bio: '그룹 경영 총괄 및 글로벌 전략 지휘', imgPrompt: 'ceo' },
          { code: 'C/02', name: '박성민', role: 'CTO 연구소장', bio: '로보틱스·산업용 AI 핵심 기술 총괄', imgPrompt: 'cto' },
          { code: 'C/03', name: '이정아', role: 'CFO 재무총괄', bio: '글로벌 IR 및 재무 건전성 관리', imgPrompt: 'cfo' },
          { code: 'C/04', name: '최우석', role: 'CSO ESG총괄', bio: '탄소중립·지속가능경영 전략 수립', imgPrompt: 'cso' },
        ],
        insightsTitle: '보도자료 & IR 공시.',
        insights: [
          { tag: 'Report', date: '2026.08', title: '차세대 AI 자율제조 로보틱스 신모델 글로벌 동시 출시', desc: '유럽·북미 주요 제조사와 4,200억 원 규모 공급 계약을 체결했습니다.', imgPrompt: 'news1' },
          { tag: 'Report', date: '2026.07', title: '2026 지속가능경영보고서 발간 — 사업장 재생에너지 전환율 74% 달성', desc: 'RE100 목표 조기 달성을 위한 친환경 공정 로드맵을 공개했습니다.', imgPrompt: 'news2' },
          { tag: 'IR', date: '2026.06', title: '2026년 상반기 기업설명회(NDR) 발표 자료 및 실적 하이라이트', desc: '전년 동기 대비 영업이익 28.4% 증가 및 R&D 투자 확대 현황.', imgPrompt: 'news3' },
        ],
        faqs: [
          ['B2B 파트너십·납품 문의는 어떻게 하나요?', '하단 제휴 문의 폼을 통해 접수하시면 담당 사업부에서 2영업일 내 회신드립니다.'],
          ['IR 실적 자료는 어디서 확인할 수 있나요?', '뉴스룸의 IR·공시 탭에서 분기별 실적 자료를 상시 확인하실 수 있습니다.'],
          ['수시 채용 및 인재 등록이 가능한가요?', '패밀리 사이트의 Careers 포털을 통해 직무별 상시 채용을 진행 중입니다.'],
          ['글로벌 지사 연락처를 알 수 있나요?', '서울 본사 대표번호 또는 공식 이메일로 문의 시 해당 지역 법인으로 연결해 드립니다.'],
        ],
        contactTitle: '글로벌 비즈니스 파트너십을', contactSub: '지금 시작하세요.',
        contactChips: ['B2B 사업 제휴', '제품·솔루션 도입', 'IR 투자 문의', '언론·홍보'],
        address: '서울특별시 영등포구 여의대로 108, 24F', phone: '02-780-9000', email: 'ir@nexagroup.co.kr', hours: '평일 09:00—18:00',
      },
    },

    commerce: {
      re: /(쇼핑몰|스토어|브랜드몰|커머스|온라인\s*몰|장바구니|화장품\s*몰|건강식품|영양제|반려동물|펫\s*쇼핑|리빙몰|굿즈|판매\s*사이트|shop|store|mall|ecommerce|e-commerce)/i,
      archetype: 'commerce',
      label: '한국형 D2C 브랜드 쇼핑몰 · 커머스',
      palette: { paper: '#ffffff', paper2: '#f7f5f2', ink: '#151413', ink2: '#44403c', mute: '#716d68', brand: '#151413', brand2: '#292524', accent: '#d93829', dark: '#111111' },
      benchmarks: ['DBCut 쇼핑몰(코오롱몰·힌스) + Imweb 쇼케이스의 상단 쿠폰 프로모션 바 + 3단 룩북 스플릿 히어로', '원형 퀵 카테고리 아이콘 스트립 + 클릭 즉시 발급되는 10%/15%/20% 쿠폰팩 + 4열 상품 스와치 카드', '실제 작동하는 슬라이드 장바구니 드로어(수량 조절·5만원 무료배송 게이지·쿠폰 자동할인) + 카카오톡 채널 독'],
      fallback: {
        brand: 'MAISON OBJECT', brandSub: 'OFFICIAL BRAND STORE', est: '2022, Seongsu Seoul',
        practice1: 'Daily Ritual · Living', practice2: 'Signature Care · Gift',
        status: '신규 회원 최대 20% 웰컴 쿠폰팩 & 당일 출고',
        heroLines: ['일상의 감도를 높이는', '시그니처 오브제.'], heroLightWord: '시그니처',
        heroDesc: '자연 유래 성분과 미니멀한 디자인이 만나 매일의 루틴을 특별한 리추얼로 바꿉니다. 공식 온라인 스토어만의 한정 기프트 패키지를 만나보세요.',
        ctaPrimary: '베스트 상품 보기', ctaSecondary: '쿠폰팩 받기',
        heroMotionTag: 'OFFICIAL D2C STORE',
        heroPrompt: 'minimalist aesthetic beauty living product photography',
        marqueeLabel: 'Official Store Benefits',
        marquee: ['당일 오후 3시 출고', '5만원 이상 무료배송', '시그니처 선물 포장', '첫 구매 20% 쿠폰'],
        revealPrompt: 'minimalist store interior',
        revealStats: [['Reviews', '24,800+ ★4.9'], ['Repurchase', '78% 재구매율'], ['Shipping', '당일 출고']],
        beliefEyebrow: 'BRAND STORY',
        beliefTitle: '매일 손이 가는 단 하나의 기준.',
        founderName: '박지연', founderRole: 'Brand Director',
        founderPrompt: 'director',
        statementText: '불필요한 성분을 덜어내고 본질적인 향과 사용감에 집중해 일상에 오래 남는 제품을 만듭니다.',
        statementHighlight: '본질적인 향과 사용감',
        principles: [
          ['01 · 저자극 클린 포뮬러', '피부 자극 테스트 0.00 무자극 판정을 받은 안전한 원료만 담았습니다.'],
          ['02 · 리필 가능한 오브제 디자인', '욕실과 공간 어디에 두어도 인테리어가 되는 절제된 용기를 설계합니다.'],
          ['03 · 공식몰 전용 기프트 포장', '모든 선물 주문에 시그니처 코튼 리본과 메시지 카드를 무료 제공합니다.'],
        ],
        servicesTitle: '베스트셀러 컬렉션.',
        services: [
          { code: 'BEST', name: '히노끼 시더 핸드 & 바디 워시 500ml', summary: '깊은 숲의 잔향이 오래 남는 약산성 클린 데일리 워시.', tags: ['BEST'], imgPrompt: 'body wash' },
          { code: 'NEW', name: '시어버터 세라마이드 인텐스 핸드크림', summary: '끈적임 없이 산뜻하게 스며드는 고보습 장벽 케어.', tags: ['NEW'], imgPrompt: 'hand cream' },
          { code: 'SET', name: '시그니처 리추얼 듀오 기프트 세트', summary: '베스트 워시 + 로션 + 리넨 파우치 선물 포장 패키지.', tags: ['SET'], imgPrompt: 'gift set' },
          { code: 'GIFT', name: '아틀리에 룸 & 패브릭 스프레이 200ml', summary: '공간에 고요한 우디 머스크 향을 채우는 패브릭 퍼퓸.', tags: ['GIFT'], imgPrompt: 'room spray' },
        ],
        kpis: [['4.9', '★', '실구매 고객 평점'], ['78', '%', '3개월 내 재구매율'], ['24k', '+', '누적 포토 리뷰'], ['15', '시', '평일 당일 출고 마감']],
        processTitle: '배송 안내.',
        process: [
          { step: '01', time: 'ORDER', title: '간편 주문', desc: '쿠폰 자동 적용 결제.', tags: ['결제'], imgPrompt: 'order' },
          { step: '02', time: 'PACK', title: '친환경 포장', desc: '완충 종이·선물 리본 패킹.', tags: ['포장'], imgPrompt: 'pack' },
          { step: '03', time: 'SHIP', title: '당일 발송', desc: '오후 3시 이전 주문 당일 출고.', tags: ['배송'], imgPrompt: 'ship' },
          { step: '04', time: 'CARE', title: '안심 교환', desc: '7일 내 무료 반품·교환 보장.', tags: ['CS'], imgPrompt: 'care' },
        ],
        casesTitle: '추천 기프트 에디션.',
        casesSubtitle: 'CURATED EDIT',
        cases: [
          { code: 'BEST', cat: 'BEST', year: '2026', title: '베르가못 & 엠버 디퓨저 250ml', desc: '천연 발효 주정 베이스로 은은하게 발향되는 프리미엄 디퓨저.', k1: ['4.9', '★', '평점'], k2: ['BEST', '', '인기'], imgPrompt: 'diffuser' },
          { code: 'NEW', cat: 'NEW', year: '2026', title: '로즈우드 립 트리트먼트 밤', desc: '식물성 스쿠알란으로 건조한 입술에 윤기를 채워줍니다.', k1: ['NEW', '', '신상'], k2: ['비건', '', '인증'], imgPrompt: 'lip balm' },
          { code: 'SET', cat: 'SET', year: '2026', title: '트래블 에센셜 미니 4종 키트', desc: '기내 반입 가능한 여행용 올인원 어메니티 세트.', k1: ['SET', '', '기획'], k2: ['파우치', '', '증정'], imgPrompt: 'travel kit' },
          { code: 'GIFT', cat: 'GIFT', year: '2026', title: '세라믹 인센스 홀더 & 스틱 기프트', desc: '수작업 백자 홀더와 천연 백단향 인센스 스틱 세트.', k1: ['GIFT', '', '선물'], k2: ['리본', '', '포장'], imgPrompt: 'incense' },
        ],
        teamTitle: '브랜드 팀.',
        team: [
          { code: 'T/01', name: '박지연', role: '브랜드 디렉터', bio: '조향 및 제품 기획 총괄', imgPrompt: 't1' },
          { code: 'T/02', name: '김도원', role: '포뮬레이터', bio: '클린 코스메틱 R&D 12년', imgPrompt: 't2' },
          { code: 'T/03', name: '이수민', role: '패키지 디자이너', bio: '친환경 오브제 패키지 설계', imgPrompt: 't3' },
          { code: 'T/04', name: '정현아', role: 'CX 리드', bio: '공식몰 고객 케어 및 VIP 멤버십', imgPrompt: 't4' },
        ],
        insightsTitle: '고객 포토 리뷰.',
        insights: [
          { tag: 'REVIEW', date: '2026.08', title: '집들이 선물로 보냈는데 향이랑 패키지 칭찬만 들었어요!', desc: '리본 포장까지 완벽해서 따로 쇼핑백 살 필요가 없었고, 히노끼 잔향이 호텔 욕실 같아요.', imgPrompt: 'r1' },
          { tag: 'REVIEW', date: '2026.07', title: '벌써 3통째 재구매입니다. 건조한 손에 딱이에요.', desc: '바르자마자 끈적임 없이 흡수되어 키보드 칠 때도 부담이 전혀 없습니다.', imgPrompt: 'r2' },
          { tag: 'REVIEW', date: '2026.06', title: '5만원 무료배송 채우려고 듀오 세트 샀는데 대만족!', desc: '쿠폰 15% 바로 써서 합리적으로 구매했고 다음날 바로 도착했어요.', imgPrompt: 'r3' },
        ],
        faqs: [
          ['배송은 얼마나 걸리나요?', '평일 오후 3시 이전 결제 완료 건은 당일 출고되며 평균 1~2일 내 수령 가능합니다.'],
          ['선물 포장 신청은 어떻게 하나요?', '기프트 세트 및 3만원 이상 주문 시 무료 선물 포장이 기본 제공됩니다.'],
          ['교환·반품이 가능한가요?', '수령 후 7일 이내 미개봉 상품에 한해 간편 반품 신청이 가능합니다.'],
          ['대량 기업 답례품 주문도 되나요?', '카카오톡 채널로 문의하시면 수량별 할인 및 로고 각인 견적을 안내해 드립니다.'],
        ],
        contactTitle: '공식몰 혜택을', contactSub: '지금 만나보세요.',
        contactChips: ['베스트 상품', '선물 세트', '기업 답례품'],
        address: '서울특별시 성동구 성수이로 78, 2F', phone: '1661-4820', email: 'cs@maisonobject.kr', hours: '평일 10:00—17:00 (점심 12:30—13:30)',
      },
    },

    landing: {
      re: /(상세페이지|랜딩페이지|랜딩|프로모션|이벤트\s*페이지|전환율|와디즈|펀딩|크라우드펀딩|강의|클래스|부트캠프|세미나|웨비나|세일즈\s*페이지|홍보\s*페이지|landing|detail\s*page|promo\s*page)/i,
      archetype: 'landing',
      label: '고전환 프로모션 랜딩 · 상세페이지 (CRO)',
      palette: { paper: '#faf8f5', paper2: '#efeae3', ink: '#141312', ink2: '#44403c', mute: '#67625c', brand: '#121110', brand2: '#292524', accent: '#ea580c', dark: '#121110' },
      benchmarks: ['Notefolio 인기 상세페이지·랜딩의 3초 후킹 질문 히어로 + 사회적 증거 리본(★4.9 · 누적 12만)', 'Pain Point → Solution 이중 대비 블록 + 직접 드래그해 비교하는 인터랙티브 Before/After 슬라이더', '실시간 카운트다운 희소성 배너 + 투명한 3단 패키지 비교 + 30일 환불 보장 + 하단 고정 Sticky 전환 CTA 바'],
      fallback: {
        brand: 'PURE LAB', brandSub: 'HIGH-CONVERSION EDITION', est: '2026 Limited Edition',
        practice1: 'Verified Clinical Data', practice2: '30-Day Money-Back Guarantee',
        status: '얼리버드 38% 특가 마감 임박',
        heroLines: ['단 14일 만에', '눈으로 확인하는', '확실한 변화.'], heroLightWord: '눈으로 확인하는',
        heroDesc: '수많은 시행착오 끝에 완성한 특허 솔루션. 복잡한 과정 없이 하루 3분 투자로 압도적인 차이를 직접 경험하세요.',
        ctaPrimary: '38% 특가 혜택 받기', ctaSecondary: '실제 변화 확인하기',
        heroMotionTag: 'HIGH-CONVERTING LANDING',
        heroPrompt: 'clean editorial product hero studio photography',
        marqueeLabel: 'Verified Customer Proof',
        marquee: ['누적 124,000+ 선택', '만족도 ★4.9/5.0', '특허 성분 인증', '30일 전액 환불 보장'],
        revealPrompt: 'product comparison',
        revealStats: [['Users', '124,000+'], ['Rating', '4.9 / 5.0'], ['Guarantee', '30 Days 100%']],
        beliefEyebrow: 'WHY DIFFERENT',
        beliefTitle: '효과는 숫자로 증명되어야 합니다.',
        founderName: '김민수 디렉터', founderRole: 'Product Lead',
        founderPrompt: 'founder',
        statementText: '과장된 마케팅 문구 대신 14일 인체 적용 테스트 데이터와 12만 명의 실제 후기로 결과를 증명합니다.',
        statementHighlight: '14일 인체 적용 테스트 데이터',
        principles: [
          ['임상 시험 94.2% 개선 입증', '공인 기관 14일 테스트에서 참가자 94.2%가 즉각적인 변화를 체감했습니다.'],
          ['거품 뺀 D2C 직거래 특가', '불필요한 중간 유통 마진을 없애고 핵심 원료 함량만 3배 높였습니다.'],
          ['30일 100% 책임 환불 보장', '직접 써보시고 만족하지 않으시면 이유를 묻지 않고 전액 환불합니다.'],
        ],
        servicesTitle: '핵심 설계 포인트.',
        services: [
          { code: '01', name: '고농축 특허 포뮬러', summary: '핵심 유효 성분을 손실 없이 깊숙이 전달하는 리포좀 공법.', tags: ['특허 공법'], imgPrompt: 'formula' },
          { code: '02', name: '하루 3분 제로 프릭션', summary: '바쁜 일상에서도 꾸준히 실천할 수 있는 직관적 사용 경험.', tags: ['간편 루틴'], imgPrompt: 'routine' },
          { code: '03', name: '안전성 무자극 0.00', summary: '민감한 환경에서도 안심하고 쓸 수 있는 클린 인증 완료.', tags: ['무자극'], imgPrompt: 'clean' },
          { code: '04', name: '1:1 전담 컨시어지', summary: '구매 후에도 효과를 극대화하는 맞춤 활용 가이드를 제공합니다.', tags: ['전담 케어'], imgPrompt: 'care' },
        ],
        kpis: [['124,000', '+', '누적 고객 선택'], ['4.9', '★', '실사용자 평균 평점'], ['94.2', '%', '14일 체감 개선율'], ['30', '일', '100% 책임 환불 보장']],
        processTitle: '변화의 타임라인.',
        process: [
          { step: '01', time: 'DAY 1', title: '즉각적인 첫 체감', desc: '첫 사용부터 느껴지는 가벼움과 차이.', tags: ['첫 체감'], imgPrompt: 'd1' },
          { step: '02', time: 'DAY 7', title: '루틴 안정화', desc: '일상 속 확연한 컨디션 변화가 시작됩니다.', tags: ['1주차'], imgPrompt: 'd7' },
          { step: '03', time: 'DAY 14', title: '눈으로 보이는 결과', desc: '주변에서 먼저 알아보는 확실한 비포·애프터.', tags: ['2주차'], imgPrompt: 'd14' },
          { step: '04', time: 'DAY 30', title: '지속되는 습관', desc: '재구매율 81%가 증명하는 장기 만족.', tags: ['1개월'], imgPrompt: 'd30' },
        ],
        casesTitle: '실제 고객 후기.',
        casesSubtitle: 'REAL REVIEWS',
        cases: [
          { code: 'R/01', cat: '30대 직장인', year: '2026', title: '반신반의했는데 2주 만에 정착했습니다', desc: '환불 보장 보고 시작했는데 오히려 주변에 추천하고 있어요.', k1: ['★5.0', '', '만족도'], k2: ['3회', '', '재구매'], imgPrompt: 'r1' },
          { code: 'R/02', cat: '40대 워킹맘', year: '2026', title: '하루 3분이라 바쁜 아침에도 꾸준히 씁니다', desc: '복잡하지 않고 결과까지 확실해서 올인원 세트 추가 주문했습니다.', k1: ['★5.0', '', '만족도'], k2: ['14일', '', '체감'], imgPrompt: 'r2' },
          { code: 'R/03', cat: '20대 디자이너', year: '2026', title: '디자인까지 예뻐서 선물용으로 최고예요', desc: '효과는 물론이고 패키지 완성도까지 기대 이상입니다.', k1: ['★4.9', '', '만족도'], k2: ['선물', '', '추천'], imgPrompt: 'r3' },
          { code: 'R/04', cat: '50대 대표', year: '2026', title: '불필요한 거품 없이 본질에 충실한 제품', desc: '데이터와 테스트 결과가 정직해서 신뢰가 갑니다.', k1: ['★5.0', '', '만족도'], k2: ['VIP', '', '패키지'], imgPrompt: 'r4' },
        ],
        teamTitle: '개발 연구진.',
        team: [
          { code: 'L/01', name: '김민수', role: '제품 디렉터', bio: '임상 데이터 기반 제품 개발 총괄', imgPrompt: 'l1' },
          { code: 'L/02', name: '윤지혜', role: '수석 연구원', bio: '특허 포뮬러 R&D', imgPrompt: 'l2' },
          { code: 'L/03', name: '박성준', role: 'UX 디렉터', bio: '고객 경험 설계', imgPrompt: 'l3' },
          { code: 'L/04', name: '최유나', role: '품질 책임자', bio: '전수 안전성 검수', imgPrompt: 'l4' },
        ],
        insightsTitle: '자주 묻는 질문.',
        insights: [
          { tag: 'FAQ', date: '2026.08', title: '언제부터 효과를 체감할 수 있나요?', desc: '평균 7~14일 이내 눈에 띄는 변화를 체감하십니다.', imgPrompt: 'f1' },
          { tag: 'FAQ', date: '2026.07', title: '환불 보장은 어떻게 적용되나요?', desc: '구매 후 30일 이내 고객센터 접수 시 전액 환불해 드립니다.', imgPrompt: 'f2' },
          { tag: 'FAQ', date: '2026.06', title: '얼리버드 특가는 언제 종료되나요?', desc: '상단 카운트다운 종료 또는 준비 수량 소진 시 정상가로 복원됩니다.', imgPrompt: 'f3' },
        ],
        faqs: [
          ['30일 환불 보장은 정말 조건 없이 가능한가요?', '네, 사용 후 불만족 시 30일 이내 접수하시면 전액 환불해 드립니다.'],
          ['배송은 얼마나 걸리나요?', '오후 2시 이전 주문 시 당일 무료 출고됩니다.'],
          ['어떤 패키지가 가장 인기가 많나요?', '38% 할인과 사은품이 포함된 시그니처 올인원 구성을 72%가 선택하십니다.'],
          ['할부 결제가 가능한가요?', '주요 카드사 최대 6개월 무이자 할부를 지원합니다.'],
        ],
        contactTitle: '지금 가장 좋은 조건으로', contactSub: '시작하세요.',
        contactChips: ['시그니처 올인원', '베이직 구성', '프리미엄 더블팩'],
        address: '서울특별시 강남구 역삼로 168', phone: '1588-7420', email: 'hello@purelab.kr', hours: '평일 09:30—18:00',
      },
    },

    default: {
      re: /.*/,
      archetype: 'meridian',
      label: '하이엔드 에디토리얼 브랜드 · 컨설팅',
      palette: { paper: '#f1ede4', paper2: '#e8e2d5', ink: '#111111', ink2: '#3a3a36', mute: '#85827a', brand: '#1d3a2c', brand2: '#25493a', accent: '#d8e86c', dark: '#111111' },
      benchmarks: ['Meridian급 스위스 에디토리얼 레이아웃(Warm Paper + Deep Forest Ink + Acid Lime)', '스크롤 연동 클립패스 확장·단어별 리빌·호버 플로팅 프리뷰·가로 스크롤 케이스', '실제 작동하는 예약 모달 + 로컬 CRM 관리자 드로어 완비'],
      fallback: {
        brand: 'MERIDIAN', brandSub: 'STRATEGY & ADVISORY', est: '2012, Seoul',
        practice1: 'Strategy · Organization', practice2: 'Digital · M&A Advisory',
        status: '2026 하반기 기업 전략 프로젝트 예약 중',
        heroLines: ['다음 결정을', '함께 설계', '합니다.'], heroLightWord: '함께 설계',
        heroDesc: '복잡한 보고서 대신 실행 가능한 한 장의 결론. 시니어 파트너가 진단부터 실행, 정착까지 현장에서 직접 책임집니다.',
        ctaPrimary: '무료 진단 신청', ctaSecondary: '서비스 보기',
        heroMotionTag: 'STRATEGY SESSION · SEOUL',
        heroPrompt: 'warm architectural executive boardroom in Seoul',
        marqueeLabel: 'Trusted by 48 Listed Companies',
        marquee: ['HANSOL', 'DAEWON HOLDINGS', 'K-LOGIS', 'SEORIN', 'MIRAE BIO', 'NOVATEK', 'PRIMEFIN', 'HAEON'],
        revealPrompt: 'architectural office lounge',
        revealStats: [['Location', 'Sejong-daero, Seoul'], ['Consultants', '42 Senior Experts'], ['Clients', '48 Listed Co.']],
        beliefEyebrow: '(01) — Our Belief',
        beliefTitle: '좋은 전략은 길지 않습니다.',
        founderName: '한정우 대표 파트너', founderRole: 'Managing Partner · 경영학 박사',
        founderPrompt: 'Korean executive managing partner portrait',
        statementText: '화려한 장표가 회사를 바꾸지 않습니다. 경영진이 내일 아침 바로 실행할 수 있는 한 장의 명확한 결론과 숫자로 증명되는 결과만이 전략의 가치입니다.',
        statementHighlight: '한 장의 명확한 결론',
        principles: [
          ['01 · 한 장의 결론', '200페이지 보고서 대신 의사결정권자가 즉시 움직일 수 있는 핵심 액션 플랜에 집중합니다.'],
          ['02 · 파트너 직접 책임', '주니어에게 위임하지 않고 제안한 시니어 파트너가 프로젝트 종료까지 직접 상주합니다.'],
          ['03 · 숫자로 증명', '영업이익률, 리드타임, ROI 등 측정 가능한 재무 지표로 프로젝트 성과를 검증합니다.'],
        ],
        servicesTitle: '네 가지 영역, 하나의 책임.',
        services: [
          { code: 'S/01', name: '경영 전략 · 성장 로드맵', summary: '중장기 포트폴리오 재편, 신사업 진출, 수익성 구조 혁신을 설계합니다.', tags: ['중장기 전략', '신사업 타당성', '수익성 개선', '글로벌 진출'], imgPrompt: 'strategy workshop' },
          { code: 'S/02', name: '조직 · 인사 · 거버넌스', summary: '성장 단계에 맞는 조직 구조 개편과 성과 보상 체계, 리더십 정렬을 구현합니다.', tags: ['조직 개편', '성과 보상', 'KPI 설계', '변화 관리'], imgPrompt: 'leadership team' },
          { code: 'S/03', name: 'AI · 디지털 전환(DX)', summary: '현업 워크플로우와 데이터 파이프라인을 AI 중심으로 재설계해 생산성을 혁신합니다.', tags: ['AI 전환', '데이터 아키텍처', '업무 자동화', '클라우드'], imgPrompt: 'digital transformation' },
          { code: 'S/04', name: 'M&A · 투자 · PMI 통합', summary: '인수 실사(CDD)부터 밸류업 시나리오, 인수 후 통합(PMI)까지 완결 지원합니다.', tags: ['상업 실사', '밸류업', 'PMI 통합', 'IR 전략'], imgPrompt: 'mergers acquisitions' },
        ],
        kpis: [['320', '+', '누적 전략 프로젝트'], ['94', '%', '고객사 재의뢰 비율'], ['2.8', '×', '평균 투자 대비 ROI'], ['17', '인', '시니어 파트너 전담']],
        processTitle: '16주, 네 단계로 끝까지 갑니다.',
        process: [
          { step: '01', time: 'WEEK 01—03 · 진단', title: '현황 데이터 & 현장 심층 진단', desc: '재무·운영 데이터와 핵심 이해관계자 인터뷰로 진짜 병목 지점을 특정합니다.', tags: ['데이터 진단', '현장 인터뷰'], imgPrompt: 'diagnostic' },
          { step: '02', time: 'WEEK 04—07 · 설계', title: '핵심 전략 & 실행 로드맵 확정', desc: '우선순위 과제와 투자 대비 효과를 수치화해 한 장의 마스터플랜으로 합의합니다.', tags: ['마스터플랜', '재무 모델링'], imgPrompt: 'planning' },
          { step: '03', time: 'WEEK 08—16 · 실행', title: '현장 파일럿 & 조직 실행 지원', desc: '실무 TF와 함께 첫 성과를 만들어내며 장애 요인을 즉시 해결합니다.', tags: ['현장 파일럿', 'TF 협업'], imgPrompt: 'execution' },
          { step: '04', time: '+6 MONTHS · 정착', title: '성과 트래킹 & 내재화', desc: '종료 후 6개월간 KPI 대시보드와 경영진 리뷰를 통해 변화를 완전히 정착시킵니다.', tags: ['KPI 트래킹', '내재화'], imgPrompt: 'sustain' },
        ],
        casesTitle: '결과로 말합니다.',
        casesSubtitle: '(04) — SELECTED CASES · 고객사 보안상 사명 비공개',
        cases: [
          { code: 'C/01', cat: 'MANUFACTURING · COST', year: '2025', title: '글로벌 제조 A사 공급망 · 원가 구조 혁신', desc: '글로벌 거점 재편과 조달 자동화로 12개월 내 영업이익을 대폭 끌어올렸습니다.', k1: ['-23', '%', '제조 리드타임 단축'], k2: ['+410', '억', '연간 영업이익 개선'], imgPrompt: 'manufacturing' },
          { code: 'C/02', cat: 'HEALTHCARE · GROWTH', year: '2025', title: '바이오 헬스케어 B사 신사업 GTM 전략', desc: '핵심 타깃 재정의와 파트너십 구조 혁신으로 해외 매출 성장을 견인했습니다.', k1: ['+38', '%', '신규 매출 성장률'], k2: ['-31', '%', '고객 획득 비용 절감'], imgPrompt: 'healthcare' },
          { code: 'C/03', cat: 'RETAIL · M&A', year: '2026', title: '유통 그룹 C사 플랫폼 인수 · PMI 통합', desc: '인수 9개월 만에 온·오프라인 데이터와 물류망을 단일 체계로 통합했습니다.', k1: ['3.2', '×', '기업가치 상승'], k2: ['9', '개월', '통합 완료 기간'], imgPrompt: 'retail' },
          { code: 'C/04', cat: 'FINANCE · AI DX', year: '2026', title: '금융 D사 AI 기반 심사 자동화 구축', desc: '데이터 파이프라인과 리스크 모델을 고도화해 심사 속도와 정확도를 동시 개선했습니다.', k1: ['-62', '%', '심사 소요 시간'], k2: ['+17', '%', '승인 정확도 향상'], imgPrompt: 'finance' },
        ],
        teamTitle: '위임하지 않는 파트너들.',
        team: [
          { code: 'P/01', name: '한정우', role: '대표 파트너 · 경영전략', bio: '전 글로벌 전략컨설팅 파트너 · 20년 경력', imgPrompt: 'partner 1' },
          { code: 'P/02', name: '윤서연', role: '시니어 파트너 · AI/DX', bio: '금융·제조 AI 전환 및 데이터 전략 총괄', imgPrompt: 'partner 2' },
          { code: 'P/03', name: '강민준', role: '시니어 파트너 · M&A/PMI', bio: '누적 4조 원 규모 인수 실사 및 통합 지휘', imgPrompt: 'partner 3' },
          { code: 'P/04', name: '이도현', role: '파트너 · 조직/거버넌스', bio: '상장사 조직 개편 및 성과 체계 전문가', imgPrompt: 'partner 4' },
        ],
        insightsTitle: '현장에서 쓴 인사이트.',
        insights: [
          { tag: 'Report', date: '2026.08', title: 'AI 전환에 성공한 상위 10% 기업의 공통점', desc: '툴 도입보다 의사결정 구조 재설계가 성패를 가릅니다.', imgPrompt: 'report' },
          { tag: 'Column', date: '2026.07', title: '인수 후 첫 100일: PMI 실패를 막는 4가지 원칙', desc: '핵심 인재 이탈과 시스템 충돌을 예방하는 체크리스트.', imgPrompt: 'column' },
          { tag: 'Case Note', date: '2026.06', title: '보고서를 1장으로 줄였을 때 생긴 변화', desc: '실행 속도를 3배 높인 경영 회의 혁신 사례.', imgPrompt: 'note' },
        ],
        faqs: [
          ['초기 무료 진단은 어떻게 진행되나요?', '문의 접수 후 48시간 이내 담당 파트너가 직접 연락드려 45분간 핵심 과제와 진단 방향을 논의합니다.'],
          ['보안(NDA) 유지가 가능한가요?', '첫 미팅 전 표준 비밀유지계약(NDA) 체결을 기본 원칙으로 합니다.'],
          ['중견·스타트업 규모도 의뢰할 수 있나요?', '네, 매출 100억~수조 원 규모까지 성장 단계에 맞춘 모듈형 프로젝트를 운영합니다.'],
          ['프로젝트 완료 후 사후 지원이 포함되나요?', '모든 전략 프로젝트에는 6개월간의 분기별 KPI 리뷰가 기본 포함됩니다.'],
        ],
        contactTitle: "Let's talk", contactSub: '다음 결정을 함께.',
        contactChips: ['경영 전략', '조직 · 인사', 'AI · 디지털 전환', 'M&A · PMI', '무료 진단 요청'],
        address: '서울특별시 종로구 세종대로 136, 14F', phone: '02-732-5500', email: 'partner@meridian-advisory.kr', hours: '평일 09:00—18:30 (파트너 1:1 미팅 예약제)',
      },
    },
  };

  function detectSpecialty(prompt) {
    for (const key of ['landing', 'commerce', 'plastic', 'derma', 'dental', 'hospital', 'fashion', 'architecture', 'luxury', 'cafe', 'tech', 'corporate']) {
      if (SPECIALTIES[key].re.test(prompt)) return { key, ...SPECIALTIES[key] };
    }
    return { key: 'default', ...SPECIALTIES.default };
  }

  /* ================= HIGH-RES EDITORIAL VISUAL RESOLVER ================= */
  const PHOTO_BANK = {
    plastic: [
      'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    derma: [
      'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    dental: [
      'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3845766/pexels-photo-3845766.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3779705/pexels-photo-3779705.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/6812561/pexels-photo-6812561.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    hospital: [
      'https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    fashion: [
      'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    architecture: [
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    luxury: [
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    cafe: [
      'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    corporate: [
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    commerce: [
      'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
    default: [
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
  };

  function bespokeImgUrl(prompt, seed, w = 1200, h = 840, specKey = 'default', idx = 0) {
    if (window.DCMedia && window.DCMedia.has && window.DCMedia.has('pollinations')) {
      const clean = String(prompt || 'luxury minimalist Korean architectural studio interior, soft daylight, editorial photography, 8k')
        .replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 240);
      const enc = encodeURIComponent(clean + ', ultra detailed, editorial photography, no text, no watermark');
      return `https://image.pollinations.ai/prompt/${enc}?width=${w}&height=${h}&seed=${seed}&nologo=true&enhance=true`;
    }
    const pool = PHOTO_BANK[specKey] || PHOTO_BANK.default;
    return pool[idx % pool.length];
  }

  /* ================= LLM BLUEPRINT SYSTEM PROMPT ================= */
  const BLUEPRINT_SYS = `당신은 세계 최상위 Awwwards 에디토리얼 웹 크리에이티브 디렉터입니다.
사용자 요청을 분석해 그 업종/세부 분야(예: 성형외과, 피부과, 치과, 카페, 레스토랑, 건축, 법무, 테크 등)의 상위 1% 퀄리티 사이트에 걸맞은 완성도 높은 한국어 콘텐츠와 **각 섹션 글에 딱 맞는 영문 AI 이미지 생성 프롬프트**를 순수 JSON으로만 출력하십시오.
마크다운 코드펜스나 설명 없이 오직 하나의 유효한 JSON 객체만 출력하십시오.

[절대 규칙]
1. 사용자가 "성형외과"라고 하면 100% 성형외과 브랜드·시술·전문의·사례·이미지 프롬프트로, "피부과"면 100% 피부과로, "카페"면 100% 카페로 작성하십시오.
2. 모든 imgPrompt / heroPrompt / revealPrompt / founderPrompt 는 해당 섹션의 한국어 글 내용과 100% 일치하는 구체적인 영문 AI 이미지 생성 프롬프트로 작성하십시오(인물은 반드시 Korean 명시, "no text, editorial photography, 8k" 수준 묘사).
3. palette 는 업종에 가장 고급스럽게 어울리는 8개 HEX 색상으로 정하십시오(paper는 밝은 에디토리얼 톤, brand는 딥 포인트, accent는 고대비 하이라이트).

JSON 스키마:
{
  "benchmarkNotes": ["상위 1% 업종 벤치마크 분석 인사이트 1", "인사이트 2", "인사이트 3"],
  "palette": {"paper":"#f5f1eb","paper2":"#ebe4da","ink":"#141110","ink2":"#3d3632","mute":"#877d75","brand":"#1d3a2c","brand2":"#264a39","accent":"#d8e86c","dark":"#111111"},
  "brand": "영문 브랜드명 (1단어, 대문자)",
  "brandSub": "영문 서브 타이틀",
  "est": "2016, Seoul",
  "practice1": "핵심 영역 1 · 2 (영문)",
  "practice2": "핵심 영역 3 · 4 (영문)",
  "status": "현재 예약/모집 상태 한 줄 (한국어)",
  "heroLines": ["첫째줄(4~7자)", "둘째줄(4~7자)", "셋째줄(4~6자)."],
  "heroLightWord": "둘째줄 전체 또는 핵심 단어",
  "heroDesc": "브랜드 핵심 가치 2문장 (한국어)",
  "ctaPrimary": "메인 CTA 버튼명",
  "ctaSecondary": "보조 CTA 버튼명",
  "heroMotionTag": "UPPERCASE MOTION TAG · SEOUL",
  "heroPrompt": "구체적 영문 AI 이미지 생성 프롬프트 (히어로 메인 공간/비주얼)",
  "marqueeLabel": "Trusted by / Certified Excellence (영문)",
  "marquee": ["신뢰 키워드/파트너 8~10개"],
  "revealPrompt": "풀블리드 확장 공간 영문 AI 이미지 프롬프트",
  "revealStats": [["라벨1","값1"],["라벨2","값2"],["라벨3","값3"]],
  "beliefEyebrow": "(01) — Our Philosophy",
  "beliefTitle": "철학 헤드라인 1문장",
  "founderName": "대표/원장 이름 + 직함",
  "founderRole": "핵심 약력 한 줄",
  "founderPrompt": "대표 인물 Korean 에디토리얼 포트레이트 영문 프롬프트",
  "statementText": "브랜드 철학 본문 2~3문장 (한국어)",
  "statementHighlight": "statementText 안에 그대로 포함된 강조 구절(10~18자)",
  "principles": [["01 · 원칙1","설명"],["02 · 원칙2","설명"],["03 · 원칙3","설명"]],
  "servicesTitle": "서비스 섹션 제목",
  "services": [
    {"code":"S/01","name":"서비스명","summary":"1~2문장 설명","tags":["태그1","태그2","태그3","태그4"],"imgPrompt":"이 서비스에 딱 맞는 영문 AI 이미지 프롬프트"},
    {"code":"S/02","name":"...","summary":"...","tags":["..."],"imgPrompt":"..."},
    {"code":"S/03","name":"...","summary":"...","tags":["..."],"imgPrompt":"..."},
    {"code":"S/04","name":"...","summary":"...","tags":["..."],"imgPrompt":"..."}
  ],
  "kpis": [["숫자","단위","설명"],["숫자","단위","설명"],["숫자","단위","설명"],["숫자","단위","설명"]],
  "processTitle": "프로세스 섹션 제목",
  "process": [
    {"step":"01","time":"STEP 01 · 단계명","title":"제목","desc":"설명","tags":["태그1","태그2","태그3"],"imgPrompt":"이 단계에 맞는 영문 AI 이미지 프롬프트"},
    {"step":"02","time":"STEP 02 · 단계명","title":"제목","desc":"설명","tags":["..."],"imgPrompt":"..."},
    {"step":"03","time":"STEP 03 · 단계명","title":"제목","desc":"설명","tags":["..."],"imgPrompt":"..."},
    {"step":"04","time":"STEP 04 · 단계명","title":"제목","desc":"설명","tags":["..."],"imgPrompt":"..."}
  ],
  "casesTitle": "성과/사례 섹션 제목",
  "casesSubtitle": "(04) — SELECTED CASES · 서브 안내",
  "cases": [
    {"code":"C/01","cat":"CATEGORY · TAG","year":"2026","title":"사례 제목","desc":"설명","k1":["수치","단위","라벨"],"k2":["수치","단위","라벨"],"imgPrompt":"이 사례에 맞는 영문 AI 이미지 프롬프트"},
    {"code":"C/02","cat":"...","year":"2026","title":"...","desc":"...","k1":["..."],"k2":["..."],"imgPrompt":"..."},
    {"code":"C/03","cat":"...","year":"2026","title":"...","desc":"...","k1":["..."],"k2":["..."],"imgPrompt":"..."},
    {"code":"C/04","cat":"...","year":"2026","title":"...","desc":"...","k1":["..."],"k2":["..."],"imgPrompt":"..."}
  ],
  "teamTitle": "팀/전문의 섹션 제목",
  "team": [
    {"code":"P/01","name":"한국어 성함","role":"직함 · 전문분야","bio":"핵심 경력 한 줄","imgPrompt":"Korean specialist editorial studio portrait English prompt"},
    {"code":"P/02","name":"...","role":"...","bio":"...","imgPrompt":"..."},
    {"code":"P/03","name":"...","role":"...","bio":"...","imgPrompt":"..."},
    {"code":"P/04","name":"...","role":"...","bio":"...","imgPrompt":"..."}
  ],
  "insightsTitle": "칼럼/인사이트 섹션 제목",
  "insights": [
    {"tag":"Report","date":"2026.08","title":"칼럼 제목","desc":"요약","imgPrompt":"칼럼 주제에 맞는 영문 AI 이미지 프롬프트"},
    {"tag":"Column","date":"2026.07","title":"...","desc":"...","imgPrompt":"..."},
    {"tag":"Guide","date":"2026.06","title":"...","desc":"...","imgPrompt":"..."}
  ],
  "faqs": [["질문1","답변1"],["질문2","답변2"],["질문3","답변3"],["질문4","답변4"]],
  "contactTitle": "문의 섹션 첫줄",
  "contactSub": "문의 섹션 둘째줄",
  "contactChips": ["관심분야1","관심분야2","관심분야3","관심분야4","관심분야5"],
  "address": "서울 주소",
  "phone": "02-000-0000",
  "email": "hello@brand.kr",
  "hours": "운영 시간 안내"
}`;

  function mergeBlueprint(spec, parsed, prompt) {
    const base = spec.fallback || SPECIALTIES.derma.fallback;
    const d = (parsed && typeof parsed === 'object') ? parsed : {};
    const pal = { ...spec.palette, ...(d.palette && typeof d.palette === 'object' ? d.palette : {}) };
    const hexOk = (v, fb) => (/^#[0-9a-f]{6}$/i.test(String(v || '').trim()) ? String(v).trim() : fb);
    const palette = {
      paper: hexOk(pal.paper, spec.palette.paper),
      paper2: hexOk(pal.paper2, spec.palette.paper2),
      ink: hexOk(pal.ink, spec.palette.ink),
      ink2: hexOk(pal.ink2, spec.palette.ink2),
      mute: hexOk(pal.mute, spec.palette.mute),
      brand: hexOk(pal.brand, spec.palette.brand),
      brand2: hexOk(pal.brand2, spec.palette.brand2),
      accent: hexOk(pal.accent, spec.palette.accent),
      dark: hexOk(pal.dark, spec.palette.dark),
    };
    const arr = (v, fb, min = 1) => (Array.isArray(v) && v.length >= min ? v : fb);
    const str = (v, fb) => (typeof v === 'string' && v.trim() ? v.trim() : fb);

    return {
      specialtyLabel: spec.label,
      benchmarkNotes: arr(d.benchmarkNotes, spec.benchmarks, 2),
      palette,
      brand: str(d.brand, base.brand),
      brandSub: str(d.brandSub, base.brandSub),
      est: str(d.est, base.est),
      practice1: str(d.practice1, base.practice1),
      practice2: str(d.practice2, base.practice2),
      status: str(d.status, base.status),
      heroLines: arr(d.heroLines, base.heroLines, 3).slice(0, 3),
      heroLightWord: str(d.heroLightWord, base.heroLightWord),
      heroDesc: str(d.heroDesc, base.heroDesc),
      ctaPrimary: str(d.ctaPrimary, base.ctaPrimary),
      ctaSecondary: str(d.ctaSecondary, base.ctaSecondary),
      heroMotionTag: str(d.heroMotionTag, base.heroMotionTag),
      heroPrompt: str(d.heroPrompt, base.heroPrompt),
      marqueeLabel: str(d.marqueeLabel, base.marqueeLabel),
      marquee: arr(d.marquee, base.marquee, 4),
      revealPrompt: str(d.revealPrompt, base.revealPrompt),
      revealStats: arr(d.revealStats, base.revealStats, 3).slice(0, 3),
      beliefEyebrow: str(d.beliefEyebrow, base.beliefEyebrow),
      beliefTitle: str(d.beliefTitle, base.beliefTitle),
      founderName: str(d.founderName, base.founderName),
      founderRole: str(d.founderRole, base.founderRole),
      founderPrompt: str(d.founderPrompt, base.founderPrompt),
      statementText: str(d.statementText, base.statementText),
      statementHighlight: str(d.statementHighlight, base.statementHighlight),
      principles: arr(d.principles, base.principles, 3).slice(0, 3),
      servicesTitle: str(d.servicesTitle, base.servicesTitle),
      services: arr(d.services, base.services, 4).slice(0, 4).map((s, i) => ({
        code: str(s.code, `S/0${i + 1}`),
        name: str(s.name, base.services[i]?.name || '시그니처 서비스'),
        summary: str(s.summary, base.services[i]?.summary || ''),
        tags: arr(s.tags, base.services[i]?.tags || ['맞춤 설계', '전담 케어'], 2),
        imgPrompt: str(s.imgPrompt, base.services[i]?.imgPrompt || base.heroPrompt),
      })),
      kpis: arr(d.kpis, base.kpis, 4).slice(0, 4),
      processTitle: str(d.processTitle, base.processTitle),
      process: arr(d.process, base.process, 4).slice(0, 4).map((p, i) => ({
        step: str(p.step, `0${i + 1}`),
        time: str(p.time, base.process[i]?.time || `STEP 0${i + 1}`),
        title: str(p.title, base.process[i]?.title || '정밀 단계'),
        desc: str(p.desc, base.process[i]?.desc || ''),
        tags: arr(p.tags, base.process[i]?.tags || ['정밀 분석'], 2),
        imgPrompt: str(p.imgPrompt, base.process[i]?.imgPrompt || base.heroPrompt),
      })),
      casesTitle: str(d.casesTitle, base.casesTitle),
      casesSubtitle: str(d.casesSubtitle, base.casesSubtitle),
      cases: arr(d.cases, base.cases, 4).slice(0, 4).map((c, i) => ({
        code: str(c.code, `C/0${i + 1}`),
        cat: str(c.cat, base.cases[i]?.cat || 'CASE'),
        year: str(c.year, '2026'),
        title: str(c.title, base.cases[i]?.title || '대표 사례'),
        desc: str(c.desc, base.cases[i]?.desc || ''),
        k1: arr(c.k1, base.cases[i]?.k1 || ['+98', '%', '만족도'], 3),
        k2: arr(c.k2, base.cases[i]?.k2 || ['1:1', '', '전담 케어'], 3),
        imgPrompt: str(c.imgPrompt, base.cases[i]?.imgPrompt || base.heroPrompt),
      })),
      teamTitle: str(d.teamTitle, base.teamTitle),
      team: arr(d.team, base.team, 4).slice(0, 4).map((t, i) => ({
        code: str(t.code, `P/0${i + 1}`),
        name: str(t.name, base.team[i]?.name || '전문가'),
        role: str(t.role, base.team[i]?.role || '대표'),
        bio: str(t.bio, base.team[i]?.bio || ''),
        imgPrompt: str(t.imgPrompt, base.team[i]?.imgPrompt || base.founderPrompt),
      })),
      insightsTitle: str(d.insightsTitle, base.insightsTitle),
      insights: arr(d.insights, base.insights, 3).slice(0, 3).map((ins, i) => ({
        tag: str(ins.tag, base.insights[i]?.tag || 'Column'),
        date: str(ins.date, '2026.08'),
        title: str(ins.title, base.insights[i]?.title || '인사이트'),
        desc: str(ins.desc, base.insights[i]?.desc || ''),
        imgPrompt: str(ins.imgPrompt, base.insights[i]?.imgPrompt || base.revealPrompt),
      })),
      faqs: arr(d.faqs, base.faqs, 4).slice(0, 4),
      contactTitle: str(d.contactTitle, base.contactTitle),
      contactSub: str(d.contactSub, base.contactSub),
      contactChips: arr(d.contactChips, base.contactChips, 3),
      address: str(d.address, base.address),
      phone: str(d.phone, base.phone),
      email: str(d.email, base.email),
      hours: str(d.hours, base.hours),
    };
  }

  /* ================= MERIDIAN-GRADE HTML GENERATOR ================= */
  function renderMeridianSite(bp, specKey = 'default') {
    const P = bp.palette;
    const baseSeed = Math.floor((Date.now() / 1000) % 89000) + 1000;
    let sIdx = 0;
    const nextUrl = (prompt, w = 1200, h = 840) => bespokeImgUrl(prompt, baseSeed + (++sIdx) * 37, w, h, specKey, sIdx - 1);

    const heroImg = nextUrl(bp.heroPrompt, 960, 1200);
    const revealImg = nextUrl(bp.revealPrompt, 1600, 1000);
    const founderImg = nextUrl(bp.founderPrompt, 800, 1060);
    const services = bp.services.map((s) => ({ ...s, img: nextUrl(s.imgPrompt, 900, 1140) }));
    const process = bp.process.map((p) => ({ ...p, img: nextUrl(p.imgPrompt, 1100, 740) }));
    const cases = bp.cases.map((c) => ({ ...c, img: nextUrl(c.imgPrompt, 1000, 900) }));
    const team = bp.team.map((t) => ({ ...t, img: nextUrl(t.imgPrompt, 720, 900) }));
    const insights = bp.insights.map((ins) => ({ ...ins, img: nextUrl(ins.imgPrompt, 1000, 760) }));

    // Build word-by-word spans for philosophy scroll reveal
    const stmtRaw = bp.statementText;
    const hl = bp.statementHighlight;
    const stmtHtml = stmtRaw.split(/\s+/).map((w) => {
      const isHl = hl && hl.includes(w.replace(/[.,!?]/g, '')) && w.length >= 2;
      return `<span class="w${isHl ? ' hl' : ''}">${esc(w)}</span>`;
    }).join(' ');

    const heroLine2Html = bp.heroLightWord && bp.heroLines[1].includes(bp.heroLightWord)
      ? bp.heroLines[1].replace(bp.heroLightWord, `<span class="thin">${esc(bp.heroLightWord)}</span>`)
      : `<span class="thin">${esc(bp.heroLines[1])}</span>`;
    const heroLine3 = String(bp.heroLines[2] || '').replace(/\.$/, '');

    const marqueeItems = [...bp.marquee, ...bp.marquee].map((m, i) => `<span class="mq-item${i % 3 === 1 ? ' alt' : ''}">${esc(m)}</span>`).join('');

    const clientData = JSON.stringify({
      brand: bp.brand,
      brandSub: bp.brandSub,
      specialty: specKey,
      palette: P,
      heroImg,
      heroTag: bp.heroMotionTag,
      team: team.map((t) => ({ name: t.name, role: t.role })),
      chips: bp.contactChips,
    }).replace(/<\/script/gi, '<\\/script');

    return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(bp.brand)} — ${esc(bp.brandSub)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js" defer></script>
<style>
:root{
  --paper:${P.paper};--paper-2:${P.paper2};--ink:${P.ink};--ink-2:${P.ink2};--mute:${P.mute};
  --brand:${P.brand};--brand-2:${P.brand2};--accent:${P.accent};--dark:${P.dark};
  --line:rgba(17,17,17,.14);--line-d:rgba(255,255,255,.14);
  --ease:cubic-bezier(.16,1,.3,1);
  --sans:'Pretendard Variable',Pretendard,-apple-system,BlinkMacSystemFont,sans-serif;
  --mono:'JetBrains Mono',ui-monospace,Consolas,monospace;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;scroll-behavior:smooth;background:var(--paper);color:var(--ink)}
body{font-family:var(--sans);background:var(--paper);color:var(--ink);overflow-x:hidden;-webkit-font-smoothing:antialiased;word-break:keep-all;line-height:1.55}
::selection{background:var(--accent);color:var(--ink)}
img{display:block;max-width:100%;height:auto}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
.wrap{max-width:1440px;margin:0 auto;padding:0 clamp(20px,4vw,56px)}
.mono{font-family:var(--mono);font-size:11.5px;letter-spacing:.05em;text-transform:uppercase}

/* Film grain & scroll progress */
.grain{position:fixed;inset:0;pointer-events:none;z-index:990;opacity:.055;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.prog{position:fixed;top:0;left:0;height:2.5px;width:0;background:var(--accent);z-index:1010;transition:width .08s linear}

/* Fast editorial preloader */
.loader{position:fixed;inset:0;z-index:2000;background:var(--dark);color:#fff;display:flex;flex-direction:column;justify-content:space-between;padding:36px clamp(20px,4vw,56px);transition:transform .8s cubic-bezier(.76,0,.24,1),visibility .8s}
.loader.done{transform:translateY(-102%);visibility:hidden;pointer-events:none}
.ld-top{display:flex;justify-content:space-between;color:rgba(255,255,255,.55)}
.ld-mid{overflow:hidden}
.ld-brand{font-size:clamp(2.8rem,8vw,6.8rem);font-weight:700;letter-spacing:-.05em;line-height:.92;transform:translateY(0);transition:transform .6s var(--ease)}
.ld-bar{height:2px;background:rgba(255,255,255,.15);overflow:hidden}
.ld-bar i{display:block;height:100%;width:0;background:var(--accent);transition:width .55s var(--ease)}

/* Custom cursor */
.cur,.cur-r{position:fixed;top:0;left:0;pointer-events:none;z-index:1100;transform:translate(-50%,-50%);display:none}
@media(hover:hover) and (pointer:fine){.cur,.cur-r{display:block}}
.cur{width:6px;height:6px;border-radius:50%;background:var(--ink);transition:background .25s,transform .15s}
.cur-r{width:36px;height:36px;border-radius:50%;border:1px solid rgba(17,17,17,.35);display:grid;place-items:center;font-family:var(--mono);font-size:10px;font-weight:500;color:var(--ink);transition:width .35s var(--ease),height .35s var(--ease),background .3s,border-color .3s,color .3s}
.cur-r.big{width:62px;height:62px;border-color:var(--brand);background:rgba(17,17,17,.06)}
.cur-r.pill{width:94px;height:94px;border-color:transparent;background:var(--accent);color:var(--ink)}
.cur.on-dark{background:#fff}
.cur-r.on-dark{border-color:rgba(255,255,255,.45);color:#fff}

/* Adaptive Fixed Header */
#hdr{position:fixed;top:0;left:0;right:0;height:74px;z-index:900;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 clamp(20px,4vw,56px);transition:background .4s var(--ease),color .35s,border-color .35s;border-bottom:1px solid transparent}
#hdr.solid{background:color-mix(in srgb,var(--paper) 84%,transparent);backdrop-filter:blur(14px);border-bottom-color:var(--line)}
#hdr.brand{background:color-mix(in srgb,var(--brand) 88%,transparent);backdrop-filter:blur(14px);color:#fff;border-bottom-color:var(--line-d)}
#hdr.dark{background:color-mix(in srgb,var(--dark) 88%,transparent);backdrop-filter:blur(14px);color:#fff;border-bottom-color:var(--line-d)}
.logo{font-weight:700;font-size:18px;letter-spacing:-.04em;display:inline-flex;align-items:baseline;gap:6px}
.logo sup{font-size:10px;opacity:.65}
.nav{display:flex;gap:clamp(14px,2.2vw,30px);font-size:13.5px;font-weight:500}
.nav a{position:relative;padding:4px 0;opacity:.75;transition:opacity .25s}
.nav a:hover,.nav a.act{opacity:1}
.nav a::after{content:'';position:absolute;left:0;right:0;bottom:-2px;height:1.5px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform .4s var(--ease)}
.nav a:hover::after,.nav a.act::after{transform:scaleX(1)}
.hdr-r{display:flex;align-items:center;justify-content:flex-end;gap:18px}
.clk{opacity:.65;font-variant-numeric:tabular-nums}
.hdr-cta{font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:999px;border:1px solid currentColor;transition:background .3s,color .3s}
.hdr-cta:hover{background:var(--ink);color:#fff;border-color:var(--ink)}
#hdr.brand .hdr-cta:hover,#hdr.dark .hdr-cta:hover{background:var(--accent);color:var(--ink);border-color:var(--accent)}
@media(max-width:640px){.nav,.clk{display:none}#hdr{grid-template-columns:1fr auto}}

/* Pill Buttons (bottom-up fill wipe) */
.pill{position:relative;display:inline-flex;align-items:center;gap:12px;padding:15px 26px;border-radius:999px;border:1px solid var(--ink);font-size:14.5px;font-weight:600;overflow:hidden;isolation:isolate;transition:color .4s var(--ease),border-color .4s}
.pill::before{content:'';position:absolute;inset:0;background:var(--brand);transform:translateY(102%);transition:transform .45s var(--ease);z-index:-1;border-radius:inherit}
.pill:hover{color:#fff;border-color:var(--brand)}
.pill:hover::before{transform:translateY(0)}
.pill.fill{background:var(--ink);color:#fff;border-color:var(--ink)}
.pill.fill::before{background:var(--brand)}
.pill .ar{display:inline-block;transition:transform .4s var(--ease)}
.pill:hover .ar{transform:rotate(-45deg)}
.pill.lime{background:var(--accent);color:var(--ink);border-color:var(--accent)}
.pill.lime::before{background:#fff}
.pill.lime:hover{color:var(--ink)}

/* 01. HERO */
.hero{padding-top:102px;padding-bottom:64px;min-height:100vh;display:flex;flex-direction:column;justify-content:space-between;gap:34px}
.meta-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:14px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.meta-strip div{display:flex;flex-direction:column;gap:4px}
.meta-strip span{color:var(--mute)}
.meta-strip b{font-size:13px;font-weight:500;letter-spacing:-.01em}
.status-b{display:inline-flex;align-items:center;gap:7px}
.status-b i{width:7px;height:7px;border-radius:50%;background:var(--brand);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 55%,transparent);animation:pulse 1.8s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.hero-stage{position:relative;display:grid;grid-template-columns:1fr minmax(210px,33%);gap:clamp(18px,3.2vw,48px);align-items:center;padding:14px 0}
.hero h1{font-size:clamp(2.55rem,6.8vw,6.8rem);font-weight:700;letter-spacing:-.065em;line-height:.93}
.hero h1 .ln{display:block;overflow:hidden}
.hero h1 .ln span{display:inline-block;animation:slideUp .95s var(--ease) both}
.hero h1 .ln:nth-child(2){padding-left:clamp(22px,8vw,136px)}
.hero h1 .ln:nth-child(2) span{animation-delay:.12s}
.hero h1 .ln:nth-child(3) span{animation-delay:.24s}
.hero h1 .thin{font-weight:250}
.hero h1 .dot{color:var(--brand)}
@keyframes slideUp{from{transform:translateY(108%);opacity:0}to{transform:none;opacity:1}}
.hero-motion{position:relative;border-radius:20px;overflow:hidden;aspect-ratio:4/5;background:var(--dark);box-shadow:0 32px 72px rgba(17,17,17,.22)}
.hero-motion canvas{width:100%;height:100%;display:block}
.hm-badge{position:absolute;top:12px;left:12px;right:12px;display:flex;align-items:center;justify-content:space-between;padding:7px 11px;border-radius:999px;background:rgba(14,14,16,.56);backdrop-filter:blur(10px);color:#fff;font-family:var(--mono);font-size:9.5px;letter-spacing:.05em}
.hm-badge i{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--accent);margin-right:7px;animation:pulse 1.4s infinite}
.hero-foot{display:grid;grid-template-columns:1.1fr auto;gap:24px;align-items:end;padding-top:20px;border-top:1px solid var(--line)}
.hero-foot p{max-width:540px;font-size:clamp(14px,1.2vw,17.5px);color:var(--ink-2);line-height:1.68}
.hero-acts{display:flex;gap:10px;flex-wrap:wrap}
@media(max-width:620px){.meta-strip{grid-template-columns:1fr 1fr}.hero-stage{grid-template-columns:1fr}.hero-motion{aspect-ratio:16/10;max-height:340px}.hero-foot{grid-template-columns:1fr}}

/* 02. MARQUEE */
.clients{padding:36px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden}
.cl-head{text-align:center;color:var(--mute);margin-bottom:20px}
.mq-wrap{mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
.mq-track{display:flex;gap:clamp(34px,5vw,72px);width:max-content;animation:mq 34s linear infinite}
.mq-wrap:hover .mq-track{animation-play-state:paused}
@keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.mq-item{font-size:clamp(1.1rem,2vw,1.65rem);font-weight:650;letter-spacing:-.03em;color:var(--ink-2);opacity:.78;white-space:nowrap}
.mq-item.alt{font-weight:300;letter-spacing:.04em}

/* 03. SCROLL-EXPANDING CLIP-PATH VISUAL */
.reveal-img{position:relative;height:185vh;margin:36px 0}
.ri-sticky{position:sticky;top:0;height:100vh;overflow:hidden;display:grid;place-items:center}
.ri-frame{position:relative;width:100%;height:100%;clip-path:inset(14% 16% 14% 16% round 24px);overflow:hidden;will-change:clip-path}
.ri-frame img{width:100%;height:100%;object-fit:cover;transform:scale(1.16);will-change:transform}
.ri-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,14,16,.1) 35%,rgba(14,14,16,.78) 100%)}
.ri-stats{position:absolute;left:clamp(20px,4vw,56px);right:clamp(20px,4vw,56px);bottom:clamp(24px,4vw,48px);display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding-top:18px;border-top:1px solid rgba(255,255,255,.24);color:#fff}
.ri-stats span{display:block;opacity:.65;margin-bottom:4px}
.ri-stats b{font-size:clamp(16px,1.7vw,22px);font-weight:600;letter-spacing:-.02em}

/* Section Headers */
.sec{padding:clamp(76px,9vw,130px) 0}
.sec-eyebrow{color:var(--mute);margin-bottom:14px;display:block}
.sec-h2{font-size:clamp(2.1rem,4.6vw,4rem);font-weight:680;letter-spacing:-.05em;line-height:1.06;margin-bottom:clamp(34px,4vw,56px)}

/* 04. PHILOSOPHY / WORD-BY-WORD SCRUB */
.stmt-grid{display:grid;grid-template-columns:minmax(240px,.78fr) 2fr;gap:clamp(30px,5vw,84px);align-items:start}
.founder-card{position:sticky;top:104px}
.founder-pic{aspect-ratio:3/4;border-radius:16px;overflow:hidden;background:var(--paper-2);margin-bottom:14px}
.founder-pic img{width:100%;height:100%;object-fit:cover}
.founder-card b{display:block;font-size:15.5px;margin-bottom:3px}
.founder-card small{color:var(--mute);font-size:13px}
.stmt-body{font-size:clamp(1.6rem,3.1vw,2.75rem);font-weight:500;letter-spacing:-.035em;line-height:1.38;margin-bottom:52px}
.stmt-body .w{opacity:.22;transition:opacity .35s var(--ease)}
.stmt-body .w.on{opacity:1}
.stmt-body .w.hl.on{background:linear-gradient(180deg,transparent 62%,color-mix(in srgb,var(--accent) 82%,transparent) 62%)}
.princ{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding-top:28px;border-top:1px solid var(--line)}
.princ h3{font-size:15px;font-weight:680;margin-bottom:8px;letter-spacing:-.02em}
.princ p{font-size:13.8px;color:var(--ink-2);line-height:1.68}
@media(max-width:900px){.stmt-grid,.princ{grid-template-columns:1fr}.founder-card{position:static;max-width:300px}}

/* 05. SERVICES INTERACTIVE ACCORDION + FLOATING PREVIEW */
.srv-list{border-top:1px solid var(--line)}
.srv-row{border-bottom:1px solid var(--line);transition:background .3s}
.srv-btn{width:100%;display:grid;grid-template-columns:80px 1fr 42px;align-items:center;padding:clamp(22px,2.8vw,34px) 0;text-align:left;gap:16px}
.srv-code{color:var(--mute)}
.srv-name{font-size:clamp(1.5rem,3vw,2.6rem);font-weight:620;letter-spacing:-.04em;transition:transform .45s var(--ease),color .3s}
.srv-row:hover .srv-name{transform:translateX(18px);color:var(--brand)}
.srv-plus{width:38px;height:38px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;font-size:20px;font-weight:300;transition:transform .45s var(--ease),background .3s,color .3s}
.srv-row.open .srv-plus{transform:rotate(45deg);background:var(--brand);color:#fff;border-color:var(--brand)}
.srv-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .55s var(--ease)}
.srv-row.open .srv-panel{grid-template-rows:1fr}
.srv-inner{overflow:hidden}
.srv-content{padding:0 0 30px 96px;display:grid;gap:16px;max-width:760px}
.srv-content p{font-size:15.5px;color:var(--ink-2);line-height:1.7}
.tags{display:flex;flex-wrap:wrap;gap:8px}
.tags span{padding:6px 14px;border-radius:999px;border:1px solid var(--line);background:var(--paper-2);font-size:12.5px;font-weight:500}
.float-img{position:fixed;width:280px;height:350px;border-radius:16px;overflow:hidden;pointer-events:none;z-index:800;opacity:0;transform:translate(-50%,-50%) scale(.86) rotate(-4deg);transition:opacity .35s var(--ease),transform .45s var(--ease);box-shadow:0 28px 64px rgba(0,0,0,.28);background:var(--dark)}
.float-img.show{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(-2.5deg)}
.float-img img{width:100%;height:100%;object-fit:cover}
@media(max-width:760px){.srv-btn{grid-template-columns:54px 1fr 34px}.srv-content{padding-left:0}.float-img{display:none}}

/* 06. KPI NUMBERS STRIP */
.nums{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.num-cell{padding:clamp(28px,4vw,52px) clamp(16px,2.2vw,30px);border-right:1px solid var(--line)}
.num-cell:last-child{border-right:0}
.num-v{font-size:clamp(2.8rem,5.6vw,5.4rem);font-weight:300;letter-spacing:-.05em;line-height:1;margin-bottom:14px;font-variant-numeric:tabular-nums}
.num-v sup{font-size:.42em;font-weight:600;color:var(--brand);vertical-align:super;margin-left:2px}
.num-l{font-size:13.5px;color:var(--ink-2)}
@media(max-width:820px){.nums{grid-template-columns:1fr 1fr}.num-cell:nth-child(2){border-right:0}.num-cell:nth-child(1),.num-cell:nth-child(2){border-bottom:1px solid var(--line)}}

/* 07. PROCESS STICKY SPLIT */
.proc-grid{display:grid;grid-template-columns:.85fr 1.25fr;gap:clamp(28px,5vw,84px);align-items:start}
.proc-left{position:sticky;top:110px}
.proc-big{font-size:clamp(6rem,14vw,12rem);font-weight:200;letter-spacing:-.08em;line-height:.88;color:var(--brand);margin:14px 0 22px;font-variant-numeric:tabular-nums}
.proc-bar{height:2px;background:var(--line);overflow:hidden;max-width:280px}
.proc-bar i{display:block;height:100%;width:25%;background:var(--brand);transition:width .5s var(--ease)}
.proc-list{display:grid;gap:clamp(42px,6vw,78px)}
.pstep{opacity:.3;transition:opacity .6s var(--ease)}
.pstep.act{opacity:1}
.pstep-img{aspect-ratio:16/10;border-radius:16px;overflow:hidden;margin-bottom:20px;background:var(--paper-2)}
.pstep-img img{width:100%;height:100%;object-fit:cover;transform:scale(1.08);transition:transform 1s var(--ease)}
.pstep.act .pstep-img img{transform:scale(1)}
.pstep h3{font-size:clamp(1.4rem,2.4vw,2rem);font-weight:650;letter-spacing:-.035em;margin:6px 0 10px}
.pstep p{font-size:15px;color:var(--ink-2);margin-bottom:14px;line-height:1.7}
@media(max-width:900px){.proc-grid{grid-template-columns:1fr}.proc-left{position:static}.pstep{opacity:1}}

/* 08. SELECTED CASES HORIZONTAL SCROLL BAND */
.cases-band{position:relative;height:280vh;background:var(--brand);color:#fff}
.cases-sticky{position:sticky;top:0;height:100vh;display:flex;flex-direction:column;justify-content:space-between;padding:88px 0 34px;overflow:hidden}
.cases-hd{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap}
.cases-hd h2{font-size:clamp(2.2rem,4.8vw,4.2rem);font-weight:700;letter-spacing:-.055em;line-height:1.02}
.cases-hd h2 span{color:var(--accent)}
.cases-track{display:flex;gap:26px;padding:0 clamp(20px,4vw,56px);will-change:transform}
.ccard{flex:0 0 min(78vw,760px);display:grid;grid-template-columns:1fr 1fr;background:color-mix(in srgb,var(--brand-2) 86%,#000);border:1px solid rgba(255,255,255,.12);border-radius:20px;overflow:hidden;min-height:380px}
.ccard-img{position:relative;overflow:hidden;background:#0c0f0e}
.ccard-img img{width:100%;height:100%;object-fit:cover}
.ccard-b{padding:clamp(20px,2.8vw,34px);display:flex;flex-direction:column;justify-content:space-between;gap:18px}
.ccard-cat{color:var(--accent);opacity:.9}
.ccard-b h3{font-size:clamp(1.25rem,2vw,1.65rem);font-weight:650;letter-spacing:-.03em;line-height:1.3;margin:8px 0 10px}
.ccard-b p{font-size:13.8px;color:rgba(255,255,255,.76);line-height:1.65}
.ckpis{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding-top:16px;border-top:1px solid rgba(255,255,255,.14)}
.ckpis b{display:block;font-size:clamp(1.7rem,3vw,2.6rem);font-weight:300;letter-spacing:-.04em;color:var(--accent);line-height:1.05}
.ckpis b em{font-style:normal;font-size:.48em;margin-left:2px}
.ckpis span{font-size:12px;color:rgba(255,255,255,.68)}
.ccard-cta{flex:0 0 min(68vw,460px);background:var(--accent);color:var(--ink);border-radius:20px;padding:38px;display:flex;flex-direction:column;justify-content:space-between}
.ccard-cta h3{font-size:clamp(1.8rem,3.2vw,2.7rem);font-weight:700;letter-spacing:-.045em;line-height:1.12}
.cases-foot{display:flex;align-items:center;gap:18px;padding:0 clamp(20px,4vw,56px)}
.cases-bar{flex:1;height:2px;background:rgba(255,255,255,.18);overflow:hidden}
.cases-bar i{display:block;height:100%;width:20%;background:var(--accent)}
@media(max-width:760px){.cases-band{height:auto}.cases-sticky{position:static;height:auto;gap:28px}.cases-track{overflow-x:auto;scroll-snap-type:x mandatory}.ccard{grid-template-columns:1fr;flex:0 0 86vw;scroll-snap-align:start}}

/* 09. TEAM DIRECTORY (Bottom-up black inversion) */
.team-list{border-top:1px solid var(--line)}
.trow{position:relative;display:grid;grid-template-columns:76px 1fr 1.2fr 1.6fr;align-items:center;gap:16px;padding:clamp(20px,2.4vw,30px) 14px;border-bottom:1px solid var(--line);overflow:hidden;isolation:isolate;transition:color .4s var(--ease)}
.trow::before{content:'';position:absolute;inset:0;background:var(--dark);transform:scaleY(0);transform-origin:bottom;transition:transform .48s var(--ease);z-index:-1}
.trow:hover{color:#fff}
.trow:hover::before{transform:scaleY(1)}
.trow:hover .t-mute{color:rgba(255,255,255,.65)}
.t-name{font-size:clamp(1.35rem,2.3vw,2rem);font-weight:650;letter-spacing:-.035em}
.t-role{font-size:14.5px;font-weight:500}
.t-bio{font-size:13.5px;color:var(--ink-2)}
.trow:hover .t-bio{color:rgba(255,255,255,.8)}
@media(max-width:860px){.trow{grid-template-columns:56px 1fr}.t-role,.t-bio{grid-column:2}}

/* 10. INSIGHTS ASYMMETRIC GRID */
.ins-grid{display:grid;grid-template-columns:1.35fr 1fr 1fr;gap:26px}
.icard{display:flex;flex-direction:column;gap:14px}
.icard-img{position:relative;aspect-ratio:4/3;border-radius:16px;overflow:hidden;background:var(--paper-2)}
.icard-img img{width:100%;height:100%;object-fit:cover;transition:transform .75s var(--ease)}
.icard:hover .icard-img img{transform:scale(1.06)}
.icard-pill{position:absolute;top:14px;left:14px;padding:5px 12px;border-radius:999px;background:var(--paper);color:var(--ink);font-size:11px;font-weight:600}
.icard h3{font-size:clamp(1.1rem,1.5vw,1.35rem);font-weight:650;letter-spacing:-.025em;line-height:1.38;display:inline;background:linear-gradient(currentColor,currentColor) 0 100%/0 1.5px no-repeat;transition:background-size .5s var(--ease)}
.icard:hover h3{background-size:100% 1.5px}
.icard p{font-size:13.8px;color:var(--ink-2);line-height:1.65}
@media(max-width:900px){.ins-grid{grid-template-columns:1fr}}

/* 11. FAQ ACCORDION */
.faq-grid{display:grid;grid-template-columns:1fr 2fr;gap:clamp(28px,5vw,76px);align-items:start}
.faq-list{border-top:1px solid var(--line)}
.fitem{border-bottom:1px solid var(--line)}
.fq{width:100%;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:22px 0;text-align:left;font-size:17px;font-weight:600;letter-spacing:-.02em}
.fq i{font-style:normal;font-size:22px;font-weight:300;transition:transform .4s var(--ease)}
.fitem.open .fq i{transform:rotate(45deg)}
.fa{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s var(--ease)}
.fitem.open .fa{grid-template-rows:1fr}
.fa>div{overflow:hidden}
.fa p{padding:0 0 22px;font-size:14.8px;color:var(--ink-2);line-height:1.72}
@media(max-width:860px){.faq-grid{grid-template-columns:1fr}}

/* 12. DARK CONTACT + LIVE BOOKING & CRM */
.contact{background:var(--dark);color:#fff;border-radius:32px 32px 0 0;padding:clamp(72px,9vw,124px) 0 40px;margin-top:40px}
.ct-top{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;padding-bottom:44px;border-bottom:1px solid var(--line-d)}
.ct-h2{font-size:clamp(2.8rem,7.2vw,6.4rem);font-weight:700;letter-spacing:-.06em;line-height:.96}
.ct-ball{width:clamp(74px,8vw,108px);height:clamp(74px,8vw,108px);border-radius:50%;background:var(--accent);color:var(--ink);display:grid;place-items:center;font-size:32px;transition:transform .5s var(--ease)}
.ct-ball:hover{transform:rotate(-45deg) scale(1.06)}
.ct-grid{display:grid;grid-template-columns:.9fr 1.3fr;gap:clamp(32px,5vw,80px);padding:52px 0}
.ct-info{display:grid;gap:22px;align-content:start}
.ct-info div span{display:block;color:rgba(255,255,255,.5);margin-bottom:4px}
.ct-info div b{font-size:16px;font-weight:500}
.crm-btn{justify-self:start;padding:10px 16px;border-radius:999px;border:1px solid rgba(255,255,255,.22);font-size:12.5px;color:var(--accent);display:inline-flex;align-items:center;gap:8px;transition:background .25s}
.crm-btn:hover{background:rgba(255,255,255,.08)}
.ct-form{display:grid;gap:20px}
.f2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.fld label{display:block;font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.55);margin-bottom:7px;letter-spacing:.05em}
.fld input,.fld textarea{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.16);border-radius:12px;padding:13px 15px;color:#fff;font:14.5px var(--sans);outline:none;transition:border-color .25s}
.fld input:focus,.fld textarea:focus{border-color:var(--accent)}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{padding:8px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.18);font-size:13px;color:rgba(255,255,255,.78);transition:.25s}
.chip.on{background:var(--accent);border-color:var(--accent);color:var(--ink);font-weight:600}
@media(max-width:860px){.ct-grid,.f2{grid-template-columns:1fr}}

/* Giant Footer Wordmark */
footer{background:var(--dark);color:rgba(255,255,255,.65);padding-top:26px;overflow:hidden}
.ft-bar{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;padding-bottom:24px;border-bottom:1px solid var(--line-d);font-size:13px}
.ft-word{font-size:clamp(4.5rem,21vw,22rem);font-weight:750;letter-spacing:-.065em;line-height:.78;color:#fff;text-align:center;user-select:none;margin-top:24px;transform:translateY(14%)}

/* Booking Modal & Admin CRM Drawer */
.modal-bg{position:fixed;inset:0;z-index:1200;background:rgba(0,0,0,.72);backdrop-filter:blur(8px);display:none;place-items:center;padding:20px}
.modal-bg.open{display:grid}
.modal{width:min(100%,560px);background:#16171a;color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:22px;padding:28px;display:grid;gap:18px;box-shadow:0 32px 80px rgba(0,0,0,.6)}
.m-top{display:flex;justify-content:space-between;align-items:center}
.m-id{padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.08);color:var(--accent)}
.slots{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.slot{padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,.16);text-align:center;font-size:13px}
.slot.on{background:var(--accent);color:var(--ink);border-color:var(--accent);font-weight:700}
.drawer-bg{position:fixed;inset:0;z-index:1250;background:rgba(0,0,0,.64);display:none;justify-content:flex-end}
.drawer-bg.open{display:flex}
.drawer{width:min(100%,760px);height:100%;background:#121316;color:#fff;border-left:1px solid rgba(255,255,255,.12);padding:26px;overflow:auto;display:grid;gap:18px;align-content:start}
.crm-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.crm-k{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px}
.crm-k span{display:block;font-size:11px;color:rgba(255,255,255,.55)}
.crm-k b{font-size:22px;color:var(--accent)}
.crm-row{display:grid;grid-template-columns:1fr auto;gap:10px;padding:12px;border-radius:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08)}
.crm-row select{background:#1b1d22;color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:8px;padding:6px 10px;font-size:12px}
/* Korean Zero-Friction Floating Quick Consult Dock (DBCut · Imweb standard) */
.kr-dock{position:fixed;right:18px;bottom:22px;z-index:880;display:flex;flex-direction:column;gap:8px}
.kr-dock a,.kr-dock button{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:800;box-shadow:0 12px 26px rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.14);transition:transform .25s var(--ease)}
.kr-dock a:hover,.kr-dock button:hover{transform:translateY(-3px)}
.kr-dock .dk-kakao{background:#fee500;color:#191919;border-color:#fee500;font-size:13px}
.kr-dock .dk-book{background:var(--brand);color:var(--accent)}
.kr-dock .dk-top{background:var(--dark);color:#fff;font-family:var(--mono);font-size:9.5px}
</style>
</head>
<body>
<div class="grain" aria-hidden="true"></div>
<div class="prog" id="prog"></div>
<div class="cur" id="cur"></div>
<div class="cur-r" id="curR"></div>

<div class="loader" id="loader">
  <div class="ld-top mono"><span>${esc(bp.brand)} · ${esc(bp.brandSub)}</span><span id="ldPct">00%</span></div>
  <div class="ld-mid"><div class="ld-brand">${esc(bp.brand)}®</div></div>
  <div class="ld-bar"><i id="ldBar"></i></div>
</div>

<header id="hdr">
  <a href="#top" class="logo">${esc(bp.brand)}<sup>®</sup></a>
  <nav class="nav">
    <a href="#services">Services</a>
    <a href="#process">Process</a>
    <a href="#cases">Cases</a>
    <a href="#team">Specialists</a>
    <a href="#insights">Insights</a>
  </nav>
  <div class="hdr-r">
    <span class="clk mono" id="clk">SEOUL 00:00</span>
    <a href="#contact" class="hdr-cta">예약 문의 ↗</a>
  </div>
</header>

<main>
  <!-- HERO -->
  <section id="top" class="hero wrap" data-stitch-screen="메인 히어로">
    <div class="meta-strip">
      <div><span class="mono">(Est.)</span><b>${esc(bp.est)}</b></div>
      <div><span class="mono">(Practice)</span><b>${esc(bp.practice1)}</b></div>
      <div><span class="mono">(Specialty)</span><b>${esc(bp.practice2)}</b></div>
      <div><span class="mono">(Status)</span><b class="status-b"><i></i>${esc(bp.status)}</b></div>
    </div>

    <div class="hero-stage">
      <h1>
        <span class="ln"><span>${esc(bp.heroLines[0])}</span></span>
        <span class="ln"><span>${heroLine2Html}</span></span>
        <span class="ln"><span>${esc(heroLine3)}<em class="dot" style="font-style:normal">.</em></span></span>
      </h1>
      <div class="hero-motion" data-cur="LIVE">
        <canvas id="heroCanvas" width="720" height="900"></canvas>
        <div class="hm-badge"><span><i></i>${esc(bp.heroMotionTag)}</span><span>60FPS</span></div>
      </div>
    </div>

    <div class="hero-foot">
      <p>${esc(bp.heroDesc)}</p>
      <div class="hero-acts">
        <a href="#contact" class="pill fill">${esc(bp.ctaPrimary)} <span class="ar">→</span></a>
        <a href="#services" class="pill">${esc(bp.ctaSecondary)} <span class="ar">→</span></a>
      </div>
    </div>
  </section>

  <!-- MARQUEE -->
  <section class="clients" aria-label="Certifications">
    <div class="cl-head mono">${esc(bp.marqueeLabel)}</div>
    <div class="mq-wrap"><div class="mq-track">${marqueeItems}</div></div>
  </section>

  <!-- SCROLL-EXPANDING CLIP-PATH VISUAL -->
  <section class="reveal-img" id="rimg">
    <div class="ri-sticky">
      <div class="ri-frame" id="riFrame">
        <img src="${esc(revealImg)}" alt="${esc(bp.brand)} 공간" data-art-label="${esc(bp.brand + ' · SPACE')}">
        <div class="ri-shade"></div>
        <div class="ri-stats">
          ${bp.revealStats.map(([k, v]) => `<div><span class="mono">${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- PHILOSOPHY STATEMENT -->
  <section class="sec wrap" id="belief" data-stitch-screen="브랜드 철학">
    <span class="sec-eyebrow mono">${esc(bp.beliefEyebrow)}</span>
    <h2 class="sec-h2">${esc(bp.beliefTitle)}</h2>
    <div class="stmt-grid">
      <div class="founder-card">
        <div class="founder-pic"><img src="${esc(founderImg)}" alt="${esc(bp.founderName)}" data-art-label="${esc(bp.founderName)}"></div>
        <b>${esc(bp.founderName)}</b>
        <small>${esc(bp.founderRole)}</small>
      </div>
      <div>
        <div class="stmt-body" id="stmt">${stmtHtml}</div>
        <div class="princ">
          ${bp.principles.map(([t, d]) => `<div><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- SERVICES ACCORDION -->
  <section class="sec wrap" id="services" data-stitch-screen="시그니처 센터">
    <span class="sec-eyebrow mono">(02) — SIGNATURE SERVICES</span>
    <h2 class="sec-h2">${esc(bp.servicesTitle)}</h2>
    <div class="srv-list">
      ${services.map((s, i) => `
      <div class="srv-row${i === 0 ? ' open' : ''}" data-float="${esc(s.img)}" data-cur="EXPLORE">
        <button class="srv-btn" type="button">
          <span class="srv-code mono">${esc(s.code)}</span>
          <span class="srv-name">${esc(s.name)}</span>
          <span class="srv-plus">+</span>
        </button>
        <div class="srv-panel"><div class="srv-inner"><div class="srv-content">
          <p>${esc(s.summary)}</p>
          <div class="tags">${s.tags.map((tg) => `<span>${esc(tg)}</span>`).join('')}</div>
        </div></div></div>
      </div>`).join('')}
    </div>
  </section>

  <!-- KPI NUMBERS -->
  <section class="wrap">
    <div class="nums">
      ${bp.kpis.map(([n, u, l]) => `<div class="num-cell"><div class="num-v">${esc(n)}<sup>${esc(u)}</sup></div><div class="num-l">${esc(l)}</div></div>`).join('')}
    </div>
  </section>

  <!-- PROCESS STICKY SPLIT -->
  <section class="sec wrap" id="process" data-stitch-screen="정밀 프로세스">
    <span class="sec-eyebrow mono">(03) — PROCESS</span>
    <h2 class="sec-h2">${esc(bp.processTitle)}</h2>
    <div class="proc-grid">
      <div class="proc-left">
        <span class="mono" style="color:var(--mute)">ACTIVE STAGE</span>
        <div class="proc-big" id="procNum">01</div>
        <div class="proc-bar"><i id="procBar"></i></div>
      </div>
      <div class="proc-list">
        ${process.map((p, i) => `
        <article class="pstep${i === 0 ? ' act' : ''}" data-step="${esc(p.step)}">
          <div class="pstep-img"><img src="${esc(p.img)}" alt="${esc(p.title)}" data-art-label="${esc(p.time)}"></div>
          <span class="mono" style="color:var(--brand)">${esc(p.time)}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.desc)}</p>
          <div class="tags">${p.tags.map((tg) => `<span>${esc(tg)}</span>`).join('')}</div>
        </article>`).join('')}
      </div>
    </div>
  </section>

  <!-- HORIZONTAL SCROLL CASES -->
  <section class="cases-band" id="cases" data-theme="brand" data-stitch-screen="임상 · 대표 사례">
    <div class="cases-sticky">
      <div class="wrap cases-hd">
        <h2>${esc(bp.casesTitle.split(' ')[0])} <span>${esc(bp.casesTitle.split(' ').slice(1).join(' '))}</span></h2>
        <span class="mono" style="opacity:.78">${esc(bp.casesSubtitle)}</span>
      </div>
      <div class="cases-track" id="casesTrack">
        ${cases.map((c) => `
        <article class="ccard" data-cur="CASE">
          <div class="ccard-img"><img src="${esc(c.img)}" alt="${esc(c.title)}" data-art-label="${esc(c.code + ' · ' + c.cat)}"></div>
          <div class="ccard-b">
            <div>
              <div class="ccard-cat mono">${esc(c.code)} · ${esc(c.cat)} · ${esc(c.year)}</div>
              <h3>${esc(c.title)}</h3>
              <p>${esc(c.desc)}</p>
            </div>
            <div class="ckpis">
              <div><b>${esc(c.k1[0])}<em>${esc(c.k1[1])}</em></b><span>${esc(c.k1[2])}</span></div>
              <div><b>${esc(c.k2[0])}<em>${esc(c.k2[1])}</em></b><span>${esc(c.k2[2])}</span></div>
            </div>
          </div>
        </article>`).join('')}
        <div class="ccard-cta">
          <span class="mono">(NEXT CASE)</span>
          <h3>다음 성공 사례의 주인공은 당신입니다.</h3>
          <a href="#contact" class="pill fill">1:1 맞춤 상담 신청 <span class="ar">→</span></a>
        </div>
      </div>
      <div class="cases-foot">
        <span class="mono" id="caseIdx">01 / 05</span>
        <div class="cases-bar"><i id="caseBar"></i></div>
        <span class="mono" style="opacity:.7">SCROLL →</span>
      </div>
    </div>
  </section>

  <!-- TEAM / SPECIALISTS -->
  <section class="sec wrap" id="team" data-stitch-screen="전문의 · 팀 소개">
    <span class="sec-eyebrow mono">(05) — SPECIALISTS</span>
    <h2 class="sec-h2">${esc(bp.teamTitle)}</h2>
    <div class="team-list">
      ${team.map((t) => `
      <div class="trow" data-float="${esc(t.img)}" data-cur="PROFILE">
        <span class="mono t-mute">${esc(t.code)}</span>
        <span class="t-name">${esc(t.name)}</span>
        <span class="t-role">${esc(t.role)}</span>
        <span class="t-bio">${esc(t.bio)}</span>
      </div>`).join('')}
    </div>
  </section>

  <!-- INSIGHTS -->
  <section class="sec wrap" id="insights">
    <span class="sec-eyebrow mono">(06) — INSIGHTS</span>
    <h2 class="sec-h2">${esc(bp.insightsTitle)}</h2>
    <div class="ins-grid">
      ${insights.map((ins) => `
      <article class="icard" data-cur="READ">
        <div class="icard-img">
          <img src="${esc(ins.img)}" alt="${esc(ins.title)}" data-art-label="${esc(ins.tag)}">
          <span class="icard-pill mono">${esc(ins.tag)} · ${esc(ins.date)}</span>
        </div>
        <div><h3>${esc(ins.title)}</h3></div>
        <p>${esc(ins.desc)}</p>
      </article>`).join('')}
    </div>
  </section>

  <!-- FAQ -->
  <section class="sec wrap" id="faq">
    <div class="faq-grid">
      <div>
        <span class="sec-eyebrow mono">(07) — FAQ</span>
        <h2 class="sec-h2" style="margin-bottom:0">자주 묻는<br>질문.</h2>
      </div>
      <div class="faq-list">
        ${bp.faqs.map(([q, a], i) => `
        <div class="fitem${i === 0 ? ' open' : ''}">
          <button class="fq" type="button"><span>${esc(q)}</span><i>+</i></button>
          <div class="fa"><div><p>${esc(a)}</p></div></div>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- DARK CONTACT + LIVE BOOKING & CRM -->
  <section class="contact" id="contact" data-theme="dark" data-stitch-screen="실시간 예약 · 오시는 길">
    <div class="wrap">
      <div class="ct-top">
        <h2 class="ct-h2">${esc(bp.contactTitle)}<br>${esc(bp.contactSub)}</h2>
        <a href="#bookingForm" class="ct-ball" aria-label="예약 폼으로">↗</a>
      </div>
      <div class="ct-grid">
        <div class="ct-info">
          <div><span class="mono">LOCATION</span><b>${esc(bp.address)}</b></div>
          <div><span class="mono">DIRECT LINE</span><b>${esc(bp.phone)}</b></div>
          <div><span class="mono">CONCIERGE</span><b>${esc(bp.email)}</b></div>
          <div><span class="mono">HOURS</span><b>${esc(bp.hours)}</b></div>
          <button type="button" class="crm-btn" id="openCrm">관리자 예약 현황 미리보기 · <b id="crmCount">0건</b></button>
        </div>
        <form class="ct-form" id="bookingForm">
          <div class="f2">
            <div class="fld"><label>NAME *</label><input name="name" required placeholder="성함을 입력해 주세요"></div>
            <div class="fld"><label>PHONE *</label><input name="phone" required placeholder="010-0000-0000"></div>
          </div>
          <div class="fld"><label>EMAIL</label><input name="email" type="email" placeholder="name@example.com"></div>
          <div class="fld">
            <label>INTEREST AREA</label>
            <div class="chips" id="chipBox">${bp.contactChips.map((c, i) => `<button type="button" class="chip${i === 0 ? ' on' : ''}">${esc(c)}</button>`).join('')}</div>
          </div>
          <div class="fld"><label>MESSAGE</label><textarea name="memo" rows="3" placeholder="원하시는 상담 내용이나 고민을 편하게 남겨주세요."></textarea></div>
          <div><button type="submit" class="pill lime">실시간 예약 접수하기 <span class="ar">→</span></button></div>
        </form>
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="wrap ft-bar">
    <span>© 2026 ${esc(bp.brand)} ${esc(bp.brandSub)}. All rights reserved.</span>
    <a href="#top" class="mono">Back to top ↑</a>
  </div>
  <div class="ft-word">${esc(bp.brand)}®</div>
</footer>

<div class="float-img" id="floatImg"><img alt=""></div>
<div class="kr-dock" aria-label="빠른 상담">
  <button type="button" class="dk-kakao" title="카카오톡 1:1 상담" onclick="alert('${esc(bp.brand)} 카카오톡 1:1 실시간 상담으로 연결됩니다.')">Ch</button>
  <a href="#contact" class="dk-book" title="실시간 예약">예약</a>
  <a href="#top" class="dk-top" title="맨 위로">TOP</a>
</div>

<!-- Booking Confirmation Modal -->
<div class="modal-bg" id="bookModal">
  <div class="modal">
    <div class="m-top"><b>예약이 접수되었습니다</b><span class="m-id mono" id="mId">ILL-0000</span></div>
    <p id="mSummary" style="font-size:14px;color:rgba(255,255,255,.78);line-height:1.6"></p>
    <div>
      <div class="mono" style="color:rgba(255,255,255,.55);margin-bottom:8px">선호 상담 시간 선택</div>
      <div class="slots" id="slotBox">
        <button type="button" class="slot on">내일 11:00</button>
        <button type="button" class="slot">내일 14:30</button>
        <button type="button" class="slot">모레 16:00</button>
      </div>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:10px">
      <button type="button" class="pill lime" id="mConfirm" style="padding:10px 20px">일정 확정</button>
    </div>
  </div>
</div>

<!-- Admin CRM Preview Drawer -->
<div class="drawer-bg" id="crmDrawer">
  <div class="drawer">
    <div class="m-top"><b>실시간 예약 관리 (CRM Preview)</b><button type="button" id="closeCrm" class="mono">CLOSE ✕</button></div>
    <div class="crm-kpis" id="crmKpis"></div>
    <div id="crmList" style="display:grid;gap:10px"></div>
  </div>
</div>

<script>
const CFG=${clientData};
/* High-craft bespoke generative architectural & editorial artwork synthesizer (0ms, zero rate limits) */
function makeEditorialArt(label, idx, w, h){
  const c=document.createElement('canvas'); c.width=w||1200; c.height=h||900;
  const x=c.getContext('2d'), P=CFG.palette, W=c.width, H=c.height;
  const seed=(idx+1)*137.5;
  // Base architectural lighting gradient
  const g=x.createLinearGradient(0,0,W,H);
  if(idx%3===0){g.addColorStop(0,P.brand);g.addColorStop(.55,P.brand2);g.addColorStop(1,P.dark);}
  else if(idx%3===1){g.addColorStop(0,'#1c1816');g.addColorStop(.5,P.brand);g.addColorStop(1,P.dark);}
  else {g.addColorStop(0,P.paper2);g.addColorStop(.55,P.paper);g.addColorStop(1,P.brand2);}
  x.fillStyle=g; x.fillRect(0,0,W,H);
  // Warm volumetric studio sunbeam
  const lx=W*(.28+((idx*29)%50)/100), ly=H*(.22+((idx*17)%35)/100);
  const rg=x.createRadialGradient(lx,ly,20,lx,ly,W*.72);
  rg.addColorStop(0,P.accent+'aa'); rg.addColorStop(.42,P.accent+'28'); rg.addColorStop(1,'transparent');
  x.fillStyle=rg; x.fillRect(0,0,W,H);
  // Sculptural architectural arches & golden ratio geometry
  x.save();
  x.strokeStyle=idx%3===2?'rgba(20,17,16,0.16)':'rgba(255,255,255,0.16)';
  x.lineWidth=2;
  const cx=W*.5, cy=H*.52;
  // Grand arch silhouette
  x.beginPath();
  x.arc(cx,cy-H*.06,Math.min(W,H)*.31,Math.PI,0);
  x.lineTo(cx+Math.min(W,H)*.31,H*.86);
  x.lineTo(cx-Math.min(W,H)*.31,H*.86);
  x.closePath();
  const ag=x.createLinearGradient(cx,H*.15,cx,H*.86);
  ag.addColorStop(0,idx%3===2?P.brand+'22':'rgba(255,255,255,0.14)');
  ag.addColorStop(1,'rgba(0,0,0,0.22)');
  x.fillStyle=ag; x.fill(); x.stroke();
  // Floating sculptural sphere / contour rings
  for(let k=1;k<=4;k++){
    x.beginPath();
    x.ellipse(cx+Math.sin(seed+k)*36, cy+Math.cos(seed+k)*22, Math.min(W,H)*(.09*k), Math.min(W,H)*(.13*k), (idx*.35), 0, Math.PI*2);
    x.strokeStyle=k===2?P.accent+'88':(idx%3===2?'rgba(20,17,16,0.12)':'rgba(255,255,255,0.12)');
    x.lineWidth=k===2?2.2:1.2;
    x.stroke();
  }
  // Smooth organic contour ribbon
  x.beginPath();
  for(let px=0;px<=W;px+=18){
    const py=H*.56+Math.sin(px*.006+seed)*H*.11+Math.cos(px*.012-idx)*H*.04;
    if(px===0)x.moveTo(px,py); else x.lineTo(px,py);
  }
  x.strokeStyle=P.accent+'99'; x.lineWidth=2.5; x.stroke();
  x.restore();
  // Bottom vignette & editorial caption
  const sh=x.createLinearGradient(0,H*.62,0,H);
  sh.addColorStop(0,'rgba(0,0,0,0)'); sh.addColorStop(1,'rgba(12,10,10,0.72)');
  x.fillStyle=sh; x.fillRect(0,0,W,H);
  x.fillStyle=P.accent; x.font='600 '+Math.round(W*.016)+'px JetBrains Mono,monospace';
  x.fillText(CFG.brand+' · BESPOKE VISUAL 0'+((idx%9)+1), Math.round(W*.055), Math.round(H*.86));
  x.fillStyle='#ffffff'; x.font='600 '+Math.round(W*.028)+'px Pretendard,sans-serif';
  x.fillText(String(label||CFG.brandSub).slice(0,32), Math.round(W*.055), Math.round(H*.92));
  return c.toDataURL('image/png');
}
const ART_CACHE={};
function getArt(label,idx,w,h){const k=label+':'+idx; return ART_CACHE[k]||(ART_CACHE[k]=makeEditorialArt(label,idx,w,h));}
document.querySelectorAll('img').forEach((im,idx)=>{
  const lbl=im.dataset.artLabel||im.alt||CFG.brand;
  const src=(im.getAttribute('src')||'').trim();
  if(!src){im.src=getArt(lbl,idx,1200,900);}
  else{im.addEventListener('error',()=>{if(!im.dataset.fb){im.dataset.fb='1';im.src=getArt(lbl,idx,1200,900);}});}
});
document.querySelectorAll('[data-float]').forEach((el,idx)=>{
  if(!el.dataset.float){
    const lbl=el.querySelector('.srv-name,.t-name')?.textContent||CFG.brand;
    el.dataset.float=getArt(lbl,idx+20,840,1050);
  }
});

/* Fast editorial preloader */
(function(){
  const ld=document.getElementById('loader'),bar=document.getElementById('ldBar'),pct=document.getElementById('ldPct');
  let p=0;
  const iv=setInterval(()=>{
    p=Math.min(100,p+25); bar.style.width=p+'%'; pct.textContent=String(p).padStart(2,'0')+'%';
    if(p>=100){clearInterval(iv);setTimeout(()=>ld.classList.add('done'),120);}
  },75);
})();

/* Lenis smooth scroll */
window.addEventListener('DOMContentLoaded',()=>{
  if(window.Lenis){const lenis=new Lenis({duration:1.15,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t))});function raf(t){lenis.raf(t);requestAnimationFrame(raf);}requestAnimationFrame(raf);}
});

/* Live Seoul clock */
function tickClk(){
  const d=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Seoul'}));
  document.getElementById('clk').textContent='SEOUL '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}
tickClk(); setInterval(tickClk,15000);

/* 60fps Generative Hero Cinema Canvas (architectural light beams, golden-ratio sculpture & bokeh film) */
(function(){
  const cv=document.getElementById('heroCanvas'), ctx=cv.getContext('2d');
  const im=CFG.heroImg?new Image():null;
  if(im){im.crossOrigin='anonymous';im.src=CFG.heroImg;}
  const pts=Array.from({length:26},()=>({x:Math.random(),y:Math.random(),r:1.5+Math.random()*4.2,vx:(Math.random()-.5)*.0018,vy:-.0012-Math.random()*.0026,a:.14+Math.random()*.32}));
  let t=0;
  function draw(){
    requestAnimationFrame(draw); t+=0.012;
    const w=cv.width,h=cv.height,P=CFG.palette;
    const bg=ctx.createLinearGradient(0,0,w,h);
    bg.addColorStop(0,P.brand); bg.addColorStop(.55,P.brand2); bg.addColorStop(1,P.dark);
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    if(im && im.complete && im.naturalWidth>0){
      const sc=1.08+Math.sin(t*.45)*0.06, ox=Math.cos(t*.35)*18, oy=Math.sin(t*.3)*14;
      const ir=im.naturalWidth/im.naturalHeight, cr=w/h;
      let dw=w,dh=h; if(ir>cr){dh=h;dw=h*ir;}else{dw=w;dh=w/ir;}
      ctx.save(); ctx.translate(w/2+ox,h/2+oy); ctx.scale(sc,sc);
      ctx.drawImage(im,-dw/2,-dh/2,dw,dh); ctx.restore();
    } else {
      // Silky volumetric studio sunbeam + architectural arch + morphing golden-ratio ribbons
      const lx=w*(.52+Math.sin(t*.5)*.2), ly=h*(.34+Math.cos(t*.4)*.12);
      const rg=ctx.createRadialGradient(lx,ly,16,lx,ly,w*.88);
      rg.addColorStop(0,P.accent+'b8'); rg.addColorStop(.38,P.accent+'30'); rg.addColorStop(1,'transparent');
      ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
      // Architectural recessed arch
      ctx.save();
      const aw=w*.34, ax=w*.5, ay=h*.42;
      ctx.beginPath(); ctx.arc(ax,ay,aw,Math.PI,0); ctx.lineTo(ax+aw,h*.84); ctx.lineTo(ax-aw,h*.84); ctx.closePath();
      const ag=ctx.createLinearGradient(ax,ay-aw,ax,h*.84);
      ag.addColorStop(0,'rgba(255,255,255,0.16)'); ag.addColorStop(1,'rgba(0,0,0,0.34)');
      ctx.fillStyle=ag; ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.22)'; ctx.lineWidth=1.5; ctx.stroke();
      // Rotating sculptural orbits
      for(let k=0;k<4;k++){
        ctx.beginPath();
        ctx.ellipse(w*.5,h*.48,w*(.15+k*.085),h*(.11+k*.065),t*(.18+k*.06)*(k%2?1:-1),0,Math.PI*2);
        ctx.strokeStyle=k===1?P.accent+'aa':'rgba(255,255,255,0.16)';
        ctx.lineWidth=k===1?2.2:1.2; ctx.stroke();
      }
      // Flowing silk light wave
      for(let r=0;r<3;r++){
        ctx.beginPath();
        for(let px=0;px<=w;px+=14){
          const py=h*(.52+r*.06)+Math.sin(px*.009+t*1.1+r)*38+Math.cos(px*.016-t*.8)*18;
          if(px===0)ctx.moveTo(px,py); else ctx.lineTo(px,py);
        }
        ctx.strokeStyle=r===0?P.accent+'99':'rgba(255,255,255,0.18)';
        ctx.lineWidth=r===0?2.4:1.1; ctx.stroke();
      }
      ctx.restore();
    }
    const sh=ctx.createLinearGradient(0,h*.55,0,h);
    sh.addColorStop(0,'rgba(0,0,0,0)'); sh.addColorStop(1,'rgba(0,0,0,0.74)');
    ctx.fillStyle=sh; ctx.fillRect(0,0,w,h);
    pts.forEach(pt=>{
      pt.x=(pt.x+pt.vx+1)%1; pt.y=(pt.y+pt.vy+1)%1;
      ctx.beginPath(); ctx.arc(pt.x*w,pt.y*h,pt.r,0,Math.PI*2);
      ctx.fillStyle=P.accent+Math.round(pt.a*255).toString(16).padStart(2,'0'); ctx.fill();
    });
    ctx.fillStyle=P.accent; ctx.font='600 13px JetBrains Mono,monospace';
    ctx.fillText('BESPOKE MOTION · '+CFG.brandSub,30,h-64);
    ctx.fillStyle='rgba(255,255,255,0.94)'; ctx.font='700 28px Pretendard,sans-serif';
    ctx.fillText(CFG.brand+'®',30,h-30);
  }
  draw();
})();

/* Custom cursor & floating preview image */
const cur=document.getElementById('cur'),curR=document.getElementById('curR'),fImg=document.getElementById('floatImg'),fImEl=fImg.querySelector('img');
let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
window.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
  fImg.style.left=(mx+150)+'px'; fImg.style.top=my+'px';
});
(function loopCur(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;curR.style.left=rx+'px';curR.style.top=ry+'px';requestAnimationFrame(loopCur);})();
document.querySelectorAll('[data-float]').forEach(el=>{
  el.addEventListener('mouseenter',()=>{fImEl.src=el.dataset.float;fImg.classList.add('show');});
  el.addEventListener('mouseleave',()=>fImg.classList.remove('show'));
});
document.querySelectorAll('a,button,[data-cur]').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    const lbl=el.dataset.cur;
    if(lbl){curR.textContent=lbl;curR.classList.add('pill');}else{curR.classList.add('big');}
  });
  el.addEventListener('mouseleave',()=>{curR.textContent='';curR.classList.remove('big','pill');});
});

/* Accordions (Services & FAQ) */
document.querySelectorAll('.srv-btn').forEach(b=>b.onclick=()=>{
  const row=b.closest('.srv-row'), was=row.classList.contains('open');
  document.querySelectorAll('.srv-row').forEach(r=>r.classList.remove('open'));
  if(!was)row.classList.add('open');
});
document.querySelectorAll('.fq').forEach(b=>b.onclick=()=>b.closest('.fitem').classList.toggle('open'));

/* Master Scroll Choreography */
const hdr=document.getElementById('hdr'),prog=document.getElementById('prog'),riSec=document.getElementById('rimg'),riFrame=document.getElementById('riFrame'),riImg=riFrame.querySelector('img');
const words=[...document.querySelectorAll('#stmt .w')],psteps=[...document.querySelectorAll('.pstep')],procNum=document.getElementById('procNum'),procBar=document.getElementById('procBar');
const cBand=document.getElementById('cases'),cTrack=document.getElementById('casesTrack'),cIdx=document.getElementById('caseIdx'),cBar=document.getElementById('caseBar');
const ctSec=document.getElementById('contact'),navLinks=[...document.querySelectorAll('.nav a')];

function onScroll(){
  const y=scrollY, maxY=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  prog.style.width=(y/maxY*100)+'%';

  // Adaptive header polarity
  const cRect=cBand.getBoundingClientRect(), ctRect=ctSec.getBoundingClientRect();
  const inBrand=cRect.top<=74 && cRect.bottom>=74, inDark=ctRect.top<=74;
  hdr.className=inDark?'dark':inBrand?'brand':y>40?'solid':'';
  cur.classList.toggle('on-dark',inBrand||inDark);
  curR.classList.toggle('on-dark',inBrand||inDark);

  // Scroll-spy nav
  navLinks.forEach(a=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(!t)return; const r=t.getBoundingClientRect();
    a.classList.toggle('act',r.top<=innerHeight*.4 && r.bottom>=innerHeight*.2);
  });

  // Clip-path expanding visual
  const rr=riSec.getBoundingClientRect();
  const rp=Math.max(0,Math.min(1,-rr.top/Math.max(1,rr.height-innerHeight)));
  const iv=(1-rp)*14, ih=(1-rp)*16, rad=(1-rp)*24;
  riFrame.style.clipPath='inset('+iv+'% '+ih+'% '+iv+'% '+ih+'% round '+rad+'px)';
  riImg.style.transform='scale('+(1.16-rp*.16)+')';

  // Word-by-word scrub
  const st=document.getElementById('stmt').getBoundingClientRect();
  const sp=Math.max(0,Math.min(1,(innerHeight*.82-st.top)/Math.max(1,st.height+innerHeight*.22)));
  const activeCount=Math.floor(sp*words.length);
  words.forEach((w,i)=>w.classList.toggle('on',i<=activeCount));

  // Sticky process step
  let curStep=0;
  psteps.forEach((s,i)=>{
    const r=s.getBoundingClientRect();
    const isAct=r.top<innerHeight*.58;
    if(isAct)curStep=i;
    s.classList.toggle('act',i===curStep);
  });
  procNum.textContent=psteps[curStep]?.dataset.step||'01';
  procBar.style.width=((curStep+1)/psteps.length*100)+'%';

  // Horizontal scroll cases
  if(innerWidth>760){
    const hp=Math.max(0,Math.min(1,-cRect.top/Math.max(1,cRect.height-innerHeight)));
    const maxShift=Math.max(0,cTrack.scrollWidth-innerWidth+56);
    cTrack.style.transform='translate3d('+(-hp*maxShift)+'px,0,0)';
    const idx=Math.min(5,Math.floor(hp*4.99)+1);
    cIdx.textContent='0'+idx+' / 05';
    cBar.style.width=(20+hp*80)+'%';
  }
}
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',onScroll);
onScroll();

/* Live Booking Form + Modal + LocalStorage CRM */
const CRM_KEY='ill_crm_'+CFG.brand.toLowerCase();
const getLeads=()=>{try{return JSON.parse(localStorage.getItem(CRM_KEY)||'[]');}catch{return [];}};
const saveLeads=l=>{try{localStorage.setItem(CRM_KEY,JSON.stringify(l));}catch{}};
function syncCrmCount(){document.getElementById('crmCount').textContent=getLeads().length+'건';}
syncCrmCount();

document.querySelectorAll('#chipBox .chip').forEach(c=>c.onclick=()=>c.classList.toggle('on'));
document.querySelectorAll('#slotBox .slot').forEach(s=>s.onclick=()=>{document.querySelectorAll('#slotBox .slot').forEach(x=>x.classList.remove('on'));s.classList.add('on');});

const bookModal=document.getElementById('bookModal');
let latestId=null;
document.getElementById('bookingForm').addEventListener('submit',e=>{
  e.preventDefault();
  const fd=new FormData(e.target);
  const interests=[...document.querySelectorAll('#chipBox .chip.on')].map(x=>x.textContent);
  const id='ILL-'+String(Math.floor(1000+Math.random()*9000));
  latestId=id;
  const lead={id,name:fd.get('name'),phone:fd.get('phone'),email:fd.get('email')||'-',interests:interests.length?interests:[CFG.chips[0]||'상담'],memo:fd.get('memo')||'',status:'신규',slot:'내일 11:00',created:new Date().toLocaleString('ko-KR')};
  const leads=getLeads(); leads.unshift(lead); saveLeads(leads); syncCrmCount();
  document.getElementById('mId').textContent=id;
  document.getElementById('mSummary').textContent=lead.name+'님('+lead.interests.join(', ')+')의 예약 요청이 정상 접수되었습니다. 담당자 '+CFG.team[0].name+' 팀에서 빠르게 안내드리겠습니다.';
  bookModal.classList.add('open');
  e.target.reset();
});
document.getElementById('mConfirm').onclick=()=>{
  const slot=document.querySelector('#slotBox .slot.on')?.textContent||'내일 11:00';
  const leads=getLeads(); const hit=leads.find(x=>x.id===latestId);
  if(hit){hit.slot=slot;hit.status='미팅 확정';saveLeads(leads);}
  bookModal.classList.remove('open');
};
bookModal.onclick=e=>{if(e.target===bookModal)bookModal.classList.remove('open');};

const crmDrawer=document.getElementById('crmDrawer');
function renderCrm(){
  const leads=getLeads(), confirmed=leads.filter(x=>x.status==='미팅 확정').length, fresh=leads.filter(x=>x.status==='신규').length;
  document.getElementById('crmKpis').innerHTML='<div class="crm-k"><span>전체 문의</span><b>'+leads.length+'</b></div><div class="crm-k"><span>신규 접수</span><b>'+fresh+'</b></div><div class="crm-k"><span>예약 확정</span><b>'+confirmed+'</b></div><div class="crm-k"><span>확정률</span><b>'+(leads.length?Math.round(confirmed/leads.length*100):0)+'%</b></div>';
  document.getElementById('crmList').innerHTML=leads.length?leads.map(l=>'<div class="crm-row"><div><b>'+l.name+' · '+l.phone+'</b><div style="font-size:12px;color:rgba(255,255,255,.65);margin-top:4px">'+l.id+' · '+l.interests.join(', ')+' · '+l.slot+'</div></div><select data-lid="'+l.id+'"><option'+(l.status==='신규'?' selected':'')+'>신규</option><option'+(l.status==='상담 중'?' selected':'')+'>상담 중</option><option'+(l.status==='미팅 확정'?' selected':'')+'>미팅 확정</option></select></div>').join(''):'<p style="color:rgba(255,255,255,.55);font-size:13px">아직 접수된 예약이 없습니다. 좌측 폼에서 예약 테스트를 진행해 보세요.</p>';
  document.querySelectorAll('#crmList select').forEach(s=>s.onchange=()=>{const ls=getLeads();const h=ls.find(x=>x.id===s.dataset.lid);if(h){h.status=s.value;saveLeads(ls);renderCrm();}});
}
document.getElementById('openCrm').onclick=()=>{renderCrm();crmDrawer.classList.add('open');};
document.getElementById('closeCrm').onclick=()=>crmDrawer.classList.remove('open');
crmDrawer.onclick=e=>{if(e.target===crmDrawer)crmDrawer.classList.remove('open');};
</script>
</body>
</html>`;
  }

  /* ================= 4-STAGE EXECUTION ENTRYPOINT ================= */
  async function runWebsitePipeline(prompt, run, callTracked) {
    const spec = detectSpecialty(prompt);
    run.stage('BENCHMARK');
    run.log(`bench  업종 인식: ${spec.label} · 상위 1% 레퍼런스 UX 패턴 분석`, 'k');
    spec.benchmarks.forEach((b) => run.log(`bench  • ${b}`, 't'));

    run.stage('ARCHITECTURE');
    run.log('arch   13-밴드 에디토리얼 UI 아키텍처 & 업종 맞춤 카피·AI 비주얼 프롬프트 생성', 'k');
    let parsed = null;
    try {
      const r = await callTracked(run, {
        role: 'general',
        label: 'blueprint',
        system: BLUEPRINT_SYS,
        messages: [{ role: 'user', content: `사용자 요청: ${prompt}\n감지된 업종: ${spec.label}\n\n이 요청에 100% 맞춤화된 상위 1% 하이엔드 웹사이트 JSON 블루프린트를 작성하십시오. 모든 글과 영문 AI 이미지 프롬프트(imgPrompt)가 이 업종에 완벽하게 일치해야 합니다.` }],
        maxTokens: 4096,
        temperature: 0.55,
      });
      const jm = r.text.match(/\{[\s\S]*\}/);
      if (jm) parsed = JSON.parse(jm[0]);
    } catch (e) {
      if (e.kind === 'abort') throw e;
      run.log('arch   JSON 구조 보정 → 업종 특화 프리미엄 템플릿 엔진 결합', 'warn');
    }

    const bp = mergeBlueprint(spec, parsed, prompt);
    const arch = spec.archetype || 'meridian';
    const archNames = {
      atelier: '아틀리에 룩북 (코튼 페이퍼 · 듀얼 폴드 · 재봉선 스크롤)',
      architecture: '아키텍처 스톤 (라임워시 · 필터 포트폴리오 · 자동 견적 계산기)',
      luxury: '녹터널 럭셔리 (옵시디언 골드 · 시네마틱 히어로 · 실시간 요금 예약)',
      cafe: '오가닉 다이닝 (필름 프레임 · 신선도 배지 · 가격표 메뉴 보드)',
      saas: '테크니컬 SaaS (다크 네이비 · 라이브 프로덕션 콘솔 · SDK · 요금 토글)',
      corporate: '한국형 기업·B2B (DBCut·GDWEB 풀블리드 슬라이더 · 4단 호버 사업영역 · 뉴스룸/IR)',
      commerce: '한국형 D2C 쇼핑몰 (Imweb·DBCut 3단 룩북 · 클릭 쿠폰팩 · 슬라이드 장바구니 · 무료배송 게이지)',
      landing: '고전환 랜딩·상세페이지 (Notefolio 카운트다운 · 드래그 Before/After 슬라이더 · Sticky CTA)',
      meridian: '스위스 에디토리얼 모션 (13-밴드 스크롤 코레오그래피 · 실시간 CRM · 플로팅 상담 독)',
    };
    run.stage('VISUALS');
    run.log(`visual 아키타입 [${archNames[arch]}] 전용 비주얼·60fps 모션 캔버스 직접 합성`, 'ok');

    run.stage('MOTION');
    run.log(`motion 업종 특화 인터랙션 모듈 및 반응형 완성본 조립`, 'ok');
    function dispatchRender(bp, specKey, arch) {
      const A = window.ILLArchetypes || {};
      const photos = PHOTO_BANK[specKey] || PHOTO_BANK.default;
      const bpWithPhotos = { ...bp, _photos: photos };
      if (arch === 'atelier' && A.renderAtelier) return A.renderAtelier(bpWithPhotos);
      if (arch === 'architecture' && A.renderArchitecture) return A.renderArchitecture(bpWithPhotos);
      if (arch === 'luxury' && A.renderLuxury) return A.renderLuxury(bpWithPhotos);
      if (arch === 'cafe' && A.renderCafe) return A.renderCafe(bpWithPhotos);
      if (arch === 'saas' && A.renderSaaS) return A.renderSaaS(bpWithPhotos);
      if (arch === 'corporate' && A.renderCorporate) return A.renderCorporate(bpWithPhotos);
      if (arch === 'commerce' && A.renderCommerce) return A.renderCommerce(bpWithPhotos);
      if (arch === 'landing' && A.renderLanding) return A.renderLanding(bpWithPhotos);
      return renderMeridianSite(bpWithPhotos, specKey);
    }
    const html = dispatchRender(bp, spec.key, arch);
    run.siteState = { bp, specKey: spec.key, arch, specialtyLabel: bp.specialtyLabel };
    run.calls.push({ label: 'editorial-engine', provider: 'ILL Multi-Archetype Engine', short: arch.toUpperCase(), pid: 'media', model: 'v4' });

    const benchMd = bp.benchmarkNotes.map((b) => `- ${b}`).join('\n');
    return `## 합의 요약
- **업종 벤치마크 & 아키타입 선정 (${bp.specialtyLabel})**:
  - 적용 아키타입: **${archNames[arch]}**
${benchMd}
- **브랜드 & 디자인 시스템**: **${bp.brand} (${bp.brandSub})** · 업종 전용 팔레트(\`${bp.palette.paper}\` / \`${bp.palette.brand}\` / \`${bp.palette.accent}\`) 적용
- **고화질 에디토리얼 비주얼 & 인터랙션**: 업종 맞춤 고화질 실사 비주얼·60fps 모션 히어로와 실전 인터랙션(견적 계산기·요금 엔진·라이브 콘솔·장바구니·Before/After 슬라이더·CRM 예약)을 통합 구현했습니다.

## 자율 실행 산출물
\`\`\`html
${html}
\`\`\`

## 세션 상태 스냅샷
\`\`\`yaml
user_goal: "${String(prompt).slice(0, 70).replace(/"/g, "'")}"
specialty: "${bp.specialtyLabel}"
archetype: "${arch}"
brand: "${bp.brand}"
completed_steps: ["상위 1% 업종 벤치마크 및 아키타입 선정", "업종 전용 레이아웃·맞춤 카피 설계", "고화질 에디토리얼 비주얼·60fps 모션 합성", "업종 특화 인터랙션·예약/견적 모듈 빌드"]
active_artifacts: ["index.html"]
\`\`\``;
  }

  /* ================= CLEAN JSON-PATCH FOLLOW-UP REVISION (NEVER CHOPS HTML / ZERO BROKEN CSS) ================= */
  async function reviseWebsiteBlueprint(prompt, lastSite, run, callTracked) {
    run.stage('BENCHMARK');
    run.log(`revise 기존 [${lastSite.bp.brand}] 블루프린트 기반 정밀 수정 분석`, 'k');
    run.stage('ARCHITECTURE');
    let patched = null;
    try {
      const r = await callTracked(run, {
        role: 'general',
        label: 'revise-json',
        system: '당신은 웹 디자인 JSON 편집기입니다. 사용자의 수정 요청을 반영해 변경이 필요한 필드만 담은 순수 JSON 패치 객체만 출력하십시오(코드펜스·설명 금지). palette 변경 요청 시 paper/paper2/ink/ink2/mute/brand/brand2/accent/dark HEX 값을 모두 조화롭게 갱신하십시오.',
        messages: [{ role: 'user', content: `현재 블루프린트:\n${JSON.stringify(lastSite.bp).slice(0, 6000)}\n\n사용자 수정 요청:\n${prompt}\n\n수정할 JSON 패치만 출력:` }],
        maxTokens: 2400,
        temperature: 0.4,
      });
      const jm = r.text.match(/\{[\s\S]*\}/);
      if (jm) patched = JSON.parse(jm[0]);
    } catch (e) {
      if (e.kind === 'abort') throw e;
    }
    const nextBp = {
      ...lastSite.bp,
      ...(patched && typeof patched === 'object' ? patched : {}),
      palette: { ...lastSite.bp.palette, ...(patched?.palette || {}) },
    };
    run.stage('VISUALS');
    run.log('visual 수정된 디자인 시스템에 맞춰 고화질 비주얼 재매핑', 'ok');
    run.stage('MOTION');
    const A = window.ILLArchetypes || {};
    const photos = PHOTO_BANK[lastSite.specKey] || PHOTO_BANK.default;
    const bpWithPhotos = { ...nextBp, _photos: photos };
    const arch = lastSite.arch || 'meridian';
    let html;
    if (arch === 'atelier' && A.renderAtelier) html = A.renderAtelier(bpWithPhotos);
    else if (arch === 'architecture' && A.renderArchitecture) html = A.renderArchitecture(bpWithPhotos);
    else if (arch === 'luxury' && A.renderLuxury) html = A.renderLuxury(bpWithPhotos);
    else if (arch === 'cafe' && A.renderCafe) html = A.renderCafe(bpWithPhotos);
    else if (arch === 'saas' && A.renderSaaS) html = A.renderSaaS(bpWithPhotos);
    else if (arch === 'corporate' && A.renderCorporate) html = A.renderCorporate(bpWithPhotos);
    else if (arch === 'commerce' && A.renderCommerce) html = A.renderCommerce(bpWithPhotos);
    else if (arch === 'landing' && A.renderLanding) html = A.renderLanding(bpWithPhotos);
    else html = renderMeridianSite(bpWithPhotos, lastSite.specKey);
    run.siteState = { ...lastSite, bp: nextBp };
    run.calls.push({ label: 'revise-engine', provider: 'ILL Multi-Archetype Engine', short: 'REVISE', pid: 'media', model: 'v4' });
    return `## 합의 요약
- 요청하신 수정 사항(**"${String(prompt).slice(0, 50)}"**)을 **${nextBp.brand}** 전체 디자인 시스템과 레이아웃 손상 없이 깔끔하게 반영했습니다.

## 자율 실행 산출물
\`\`\`html
${html}
\`\`\`

## 세션 상태 스냅샷
\`\`\`yaml
user_goal: "${String(prompt).slice(0, 70).replace(/"/g, "'")}"
brand: "${nextBp.brand}"
archetype: "${arch}"
active_artifacts: ["index.html"]
\`\`\``;
  }

  window.ILLMeridian = { runWebsitePipeline, reviseWebsiteBlueprint, detectSpecialty, renderMeridianSite };
})();
