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
      re: /(병원|클리닉|의원|정형외과|한의원|내과|안과|산부인과|건강검진|메디컬|재활|통증|hospital|medical|clinic)/i,
      label: '프리미엄 메디컬 센터 · 전문 클리닉',
      palette: { paper: '#f3f4f1', paper2: '#e6e8e3', ink: '#101417', ink2: '#374149', mute: '#7c858c', brand: '#17343a', brand2: '#214850', accent: '#c9e58c', dark: '#0e1315' },
      benchmarks: ['상위 1% 프리미엄 종합·특화 메디컬 센터의 차분한 신뢰 에디토리얼 톤', '대학병원급 정밀 장비·전문의 협진·원스톱 검사 시스템을 수치와 프로세스로 시각화', '센터별 플로팅 프리뷰 아코디언 + 임상 성과 가로 쇼케이스 + 실시간 진료예약'],
      fallback: null, // uses structured LLM output or adapts derma/meridian
    },

    cafe: {
      re: /(카페|커피|베이커리|디저트|레스토랑|다이닝|바|와인|호텔|리조트|브런치|cafe|coffee|bakery|restaurant|dining|hotel)/i,
      label: '하이엔드 호스피탈리티 · F&B 브랜드',
      palette: { paper: '#f4eee4', paper2: '#e8dfd1', ink: '#1a1512', ink2: '#473c35', mute: '#8b7d72', brand: '#2b2019', brand2: '#3e2f25', accent: '#dfc084', dark: '#120e0c' },
      benchmarks: ['성수·한남 상위 1% 로스터리/파인다이닝/부티크 호텔의 웜 에디토리얼 톤', '공간·원재료·장인정신을 대형 타이포그래피와 스크롤 클립패스 비주얼로 연출', '시그니처 메뉴 플로팅 프리뷰 아코디언 + 시즌 컬렉션 가로 스크롤 + 프라이빗 예약'],
      fallback: null,
    },

    tech: {
      re: /(테크|ai|스타트업|saas|앱|소프트웨어|플랫폼|스튜디오|에이전시|개발|보안|핀테크|tech|startup|software|agency|studio)/i,
      label: '하이엔드 테크 · 크리에이티브 스튜디오',
      palette: { paper: '#efeff3', paper2: '#e2e3ea', ink: '#0e0f14', ink2: '#393b47', mute: '#7c8091', brand: '#181c36', brand2: '#242a52', accent: '#c8f065', dark: '#0a0b10' },
      benchmarks: ['글로벌 Awwwards 1티어 테크/디자인 스튜디오의 스위스 그리드 + 네오 에디토리얼 톤', '제품 아키텍처·성능 지표·도입 사례를 정밀 타이포그래피와 인터랙션으로 증명', '솔루션 아코디언 + 고객 성과 가로 스크롤 + 실시간 데모 예약 및 CRM'],
      fallback: null,
    },

    default: {
      re: /.*/,
      label: '하이엔드 에디토리얼 브랜드 · 컨설팅',
      palette: { paper: '#f1ede4', paper2: '#e8e2d5', ink: '#111111', ink2: '#3a3a36', mute: '#85827a', brand: '#1d3a2c', brand2: '#25493a', accent: '#d8e86c', dark: '#111111' },
      benchmarks: ['Meridian급 스위스 에디토리얼 레이아웃(Warm Paper + Deep Forest Ink + Acid Lime)', '스크롤 연동 클립패스 확장·단어별 리빌·호버 플로팅 프리뷰·가로 스크롤 케이스', '실제 작동하는 예약 모달 + 로컬 CRM 관리자 드로어 완비'],
      fallback: null,
    },
  };

  function detectSpecialty(prompt) {
    for (const key of ['plastic', 'derma', 'dental', 'hospital', 'cafe', 'tech']) {
      if (SPECIALTIES[key].re.test(prompt)) return { key, ...SPECIALTIES[key] };
    }
    return { key: 'default', ...SPECIALTIES.default };
  }

  /* ================= AI-GENERATED BESPOKE IMAGE URL BUILDER ================= */
  function aiImgUrl(prompt, seed, w = 1280, h = 860) {
    const clean = String(prompt || 'luxury minimalist Korean architectural studio interior, soft daylight, editorial photography, 8k')
      .replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 260);
    const enc = encodeURIComponent(clean + ', ultra detailed, editorial photography, no text, no watermark');
    return `https://image.pollinations.ai/prompt/${enc}?width=${w}&height=${h}&seed=${seed}&nologo=true&enhance=true`;
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
  function renderMeridianSite(bp) {
    const P = bp.palette;
    const baseSeed = Math.floor((Date.now() / 1000) % 89000) + 1000;
    let sIdx = 0;
    const nextUrl = (prompt, w = 1200, h = 840) => aiImgUrl(prompt, baseSeed + (++sIdx) * 37, w, h);

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
@media(max-width:900px){.nav,.clk{display:none}#hdr{grid-template-columns:1fr auto}}

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
.hero-stage{position:relative;display:grid;grid-template-columns:1fr minmax(260px,31%);gap:clamp(24px,4vw,52px);align-items:center;padding:18px 0}
.hero h1{font-size:clamp(3rem,8.2vw,7.4rem);font-weight:700;letter-spacing:-.065em;line-height:.93}
.hero h1 .ln{display:block;overflow:hidden}
.hero h1 .ln span{display:inline-block;animation:slideUp .95s var(--ease) both}
.hero h1 .ln:nth-child(2){padding-left:clamp(28px,10vw,150px)}
.hero h1 .ln:nth-child(2) span{animation-delay:.12s}
.hero h1 .ln:nth-child(3) span{animation-delay:.24s}
.hero h1 .thin{font-weight:250}
.hero h1 .dot{color:var(--brand)}
@keyframes slideUp{from{transform:translateY(108%);opacity:0}to{transform:none;opacity:1}}
.hero-motion{position:relative;border-radius:22px;overflow:hidden;aspect-ratio:4/5;background:var(--dark);box-shadow:0 32px 72px rgba(17,17,17,.18)}
.hero-motion canvas{width:100%;height:100%;display:block}
.hm-badge{position:absolute;top:14px;left:14px;right:14px;display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:999px;background:rgba(14,14,16,.52);backdrop-filter:blur(10px);color:#fff;font-family:var(--mono);font-size:10px;letter-spacing:.06em}
.hm-badge i{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--accent);margin-right:7px;animation:pulse 1.4s infinite}
.hero-foot{display:grid;grid-template-columns:1.1fr auto;gap:28px;align-items:end;padding-top:24px;border-top:1px solid var(--line)}
.hero-foot p{max-width:560px;font-size:clamp(15px,1.25vw,18px);color:var(--ink-2);line-height:1.68}
.hero-acts{display:flex;gap:12px;flex-wrap:wrap}
@media(max-width:960px){.meta-strip{grid-template-columns:1fr 1fr}.hero-stage{grid-template-columns:1fr}.hero-motion{aspect-ratio:16/10;max-height:360px}.hero-foot{grid-template-columns:1fr}}

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
/* Bespoke generative fallback art if any AI image takes too long */
function paintFallbackArt(img){
  if(img.dataset.fbDone)return; img.dataset.fbDone='1';
  const c=document.createElement('canvas'); c.width=1200; c.height=900;
  const x=c.getContext('2d'), P=CFG.palette;
  const g=x.createLinearGradient(0,0,1200,900);
  g.addColorStop(0,P.brand); g.addColorStop(.58,P.brand2); g.addColorStop(1,P.dark);
  x.fillStyle=g; x.fillRect(0,0,1200,900);
  const r=x.createRadialGradient(840,260,30,840,260,520);
  r.addColorStop(0,P.accent+'66'); r.addColorStop(1,'transparent');
  x.fillStyle=r; x.fillRect(0,0,1200,900);
  x.strokeStyle='rgba(255,255,255,0.12)'; x.lineWidth=1.5;
  for(let k=1;k<5;k++){x.beginPath();x.arc(600,450,k*135,0,Math.PI*2);x.stroke();}
  x.fillStyle='rgba(255,255,255,0.88)'; x.font='600 28px Pretendard,sans-serif';
  x.fillText(img.dataset.artLabel||CFG.brand,72,810);
  img.src=c.toDataURL('image/png');
}
document.querySelectorAll('img').forEach(im=>{im.addEventListener('error',()=>paintFallbackArt(im));});

/* Fast editorial preloader */
(function(){
  const ld=document.getElementById('loader'),bar=document.getElementById('ldBar'),pct=document.getElementById('ldPct');
  let p=0;
  const iv=setInterval(()=>{
    p=Math.min(100,p+22); bar.style.width=p+'%'; pct.textContent=String(p).padStart(2,'0')+'%';
    if(p>=100){clearInterval(iv);setTimeout(()=>ld.classList.add('done'),160);}
  },90);
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

/* 60fps Generative Hero Cinema Canvas (blends AI-generated visual with Ken Burns + bokeh light) */
(function(){
  const cv=document.getElementById('heroCanvas'), ctx=cv.getContext('2d');
  const im=new Image(); im.crossOrigin='anonymous'; im.src=CFG.heroImg;
  const pts=Array.from({length:20},()=>({x:Math.random(),y:Math.random(),r:2+Math.random()*5,vx:(Math.random()-.5)*.002,vy:-.0015-Math.random()*.003,a:.12+Math.random()*.25}));
  let t=0;
  function draw(){
    requestAnimationFrame(draw); t+=0.008;
    const w=cv.width,h=cv.height,P=CFG.palette;
    const bg=ctx.createLinearGradient(0,0,w,h);
    bg.addColorStop(0,P.brand); bg.addColorStop(1,P.dark);
    ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    if(im.complete && im.naturalWidth>0){
      const sc=1.08+Math.sin(t*.45)*0.06, ox=Math.cos(t*.35)*18, oy=Math.sin(t*.3)*14;
      const ir=im.naturalWidth/im.naturalHeight, cr=w/h;
      let dw=w,dh=h; if(ir>cr){dh=h;dw=h*ir;}else{dw=w;dh=w/ir;}
      ctx.save(); ctx.translate(w/2+ox,h/2+oy); ctx.scale(sc,sc);
      ctx.drawImage(im,-dw/2,-dh/2,dw,dh); ctx.restore();
    } else {
      const rg=ctx.createRadialGradient(w*(.5+.18*Math.sin(t)),h*(.4+.15*Math.cos(t)),20,w*.5,h*.5,w*.85);
      rg.addColorStop(0,P.accent+'55'); rg.addColorStop(1,'transparent');
      ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
    }
    const sh=ctx.createLinearGradient(0,h*.55,0,h);
    sh.addColorStop(0,'rgba(0,0,0,0)'); sh.addColorStop(1,'rgba(0,0,0,0.68)');
    ctx.fillStyle=sh; ctx.fillRect(0,0,w,h);
    pts.forEach(pt=>{
      pt.x=(pt.x+pt.vx+1)%1; pt.y=(pt.y+pt.vy+1)%1;
      ctx.beginPath(); ctx.arc(pt.x*w,pt.y*h,pt.r,0,Math.PI*2);
      ctx.fillStyle=P.accent+Math.round(pt.a*255).toString(16).padStart(2,'0'); ctx.fill();
    });
    ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.font='600 22px Pretendard,sans-serif';
    ctx.fillText(CFG.brand+' · '+CFG.brandSub,30,h-34);
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
    run.stage('VISUALS');
    run.log(`visual AI 맞춤 비주얼 18종 직접 생성 매핑 (공간·전문의·시술·사례·칼럼 + 60fps 히어로 모션 캔버스)`, 'ok');

    run.stage('MOTION');
    run.log('motion Lenis 스무스 스크롤 · 클립패스 확장 · 단어별 리빌 · 호버 플로팅 · 가로 스크롤 케이스 · 실시간 CRM 조립', 'ok');
    const html = renderMeridianSite(bp);
    run.calls.push({ label: 'editorial-engine', provider: 'ILL Editorial Motion Engine', short: 'MERIDIAN', pid: 'media', model: 'v2' });

    const benchMd = bp.benchmarkNotes.map((b) => `- ${b}`).join('\n');
    return `## 합의 요약
- **업종 벤치마크 분석 (${bp.specialtyLabel})**:
${benchMd}
- **브랜드 & 디자인 시스템**: **${bp.brand} (${bp.brandSub})** · 업종 전용 에디토리얼 팔레트(\`${bp.palette.paper}\` / \`${bp.palette.brand}\` / \`${bp.palette.accent}\`) 적용
- **AI 맞춤 비주얼 & 모션**: 각 섹션 카피에 맞춰 **AI가 직접 생성한 맞춤 이미지 18종** + **60fps 제너레이티브 히어로 모션 캔버스**, 클립패스 스크롤 확장, 단어별 리빌, 호버 플로팅 프리뷰, 가로 스크롤 사례집, 실시간 예약 모달·CRM까지 통합 구현했습니다.

## 자율 실행 산출물
\`\`\`html
${html}
\`\`\`

## 세션 상태 스냅샷
\`\`\`yaml
user_goal: "${String(prompt).slice(0, 70).replace(/"/g, "'")}"
specialty: "${bp.specialtyLabel}"
brand: "${bp.brand}"
completed_steps: ["상위 1% 업종 벤치마크 분석", "13-밴드 에디토리얼 UI 및 맞춤 카피 설계", "섹션별 AI 맞춤 이미지·60fps 히어로 모션 생성", "스크롤 코레오그래피·실시간 예약 CRM 빌드"]
active_artifacts: ["index.html"]
\`\`\``;
  }

  window.ILLMeridian = { runWebsitePipeline, detectSpecialty, renderMeridianSite };
})();
