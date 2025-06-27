/* =========================================
   케이스 성형외과 메인 스크립트 v2.1 (최종 업데이트)
   ========================================= */
/**
 * 웹사이트의 주요 동적 기능들을 초기화하고 관리합니다.
 * - DOMContentLoaded: HTML 문서가 완전히 로드되고 파싱되었을 때 모든 스크립트 실행을 시작합니다.
 * - 기능별 함수 분리: initCarousel, initEventListeners 등 각 기능별로 함수를 분리하여 코드의 역할을 명확하게 합니다.
 * - 방어적 코딩: 특정 요소가 없는 페이지(예: 서브페이지)에서 오류가 발생하지 않도록 항상 if(!element) 체크를 합니다.
 */

// 1. 페이지 로딩과 화면 크기 변경 시 핵심 기능들을 실행하도록 이벤트를 등록합니다.
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();         // 캐러셀 기능 초기화
    initEventListeners();   // 각종 이벤트 리스너 설정
    setDynamicHeights();    // 네비게이션/상담 바의 동적 높이 계산 및 적용
    adjustCarouselHeight(); // [신규 기능 추가] 캐러셀 높이 조정 함수 호출
    // [추가] 첫 슬라이드 프로모션 문구 세팅
    updatePromoText(0);

    // [추가] 캐러셀 슬라이드 변경 시 프로모션 문구 동적 변경
    const mainCarousel = document.getElementById('mainCarousel');
    if (mainCarousel) {
        mainCarousel.addEventListener('slide.bs.carousel', function(e) {
            // e.to: 이동할 슬라이드 인덱스
            updatePromoText(e.to);
        });
    }

    // [추가] 프로모션 텍스트 위치를 consult bar 높이에 맞게 동적으로 조정하는 함수
    adjustPromoTextPosition();
    // [신규] 모바일 플라이아웃 메뉴 기능 초기화
    setupMobileFlyoutMenu();
});

window.addEventListener('resize', function() { // 기존 window.addEventListener('resize', setDynamicHeights); 라인을 수정
    setDynamicHeights();    // 리사이즈 시 네비게이션/상담 바 높이 재계산
    adjustCarouselHeight(); // [신규 기능 추가] 리사이즈 시 캐러셀 높이 재조정
    // consult bar 높이 변경 시마다 promo text 위치 조정
    adjustPromoTextPosition();
    // [신규] 리사이즈 시 모바일 메뉴 기능 재설정
    setupMobileFlyoutMenu();
});


/* =========================================
   기능 1: 캐러셀 초기화 함수
   ========================================= */
/**
 * 메인 페이지의 캐러셀 슬라이드를 동적으로 생성하고 설정합니다.
 * img 태그 대신 div의 배경 이미지 기법을 사용하여 '아트 디렉션'을 구현합니다.
 */
function initCarousel() {
    // 캐러셀의 아이템들이 들어갈 컨테이너 요소를 찾습니다.
    const carouselInner = document.querySelector('#mainCarousel .carousel-inner');

    // 방어적 코딩: 캐러셀이 없는 페이지(예: 서브페이지)에서 오류가 나지 않도록 함수를 즉시 종료합니다.
    if (!carouselInner) {
        return;
    }

    const totalSlides = 9;
    const pages = [
        'index.html', 'about.html', 'umbilicoplasty.html', 'eyelid-surgery.html',
        'rhinoplasty.html', 'anti-aging.html', 'implant-removal.html',
        'case-reviews.html', 'event.html'
    ];

    carouselInner.innerHTML = ''; // 중복 생성을 막기 위해 기존 내용을 비웁니다.

    for (let i = 0; i < totalSlides; i++) {
        const div = document.createElement('div');
        div.className = `carousel-item ${i === 0 ? 'active' : ''}`;      
        div.style.backgroundImage = `url('../images/main-slider${i}.png')`;
        console.log('carousel-item', i, div, div.style.backgroundImage);

        /**
         * [수정] 각 슬라이드에 고유한 클래스 부여 및 특정 슬라이드에 모바일 이미지 교체 클래스 추가
         * 기존 'slide-2-special-position' 로직을 대체하여 모든 슬라이드에 대해 일관된 명명 규칙을 적용합니다.
         * 또한, main-slider-7 (인덱스 7)에만 모바일 이미지 교체를 위한 클래스를 추가합니다.
         */
        div.classList.add(`slide-${i}-position`); // 예: slide-0-position, slide-1-position ...

        // main-slider-7 (인덱스 7, 즉 8번째 슬라이드)에만 모바일용 이미지 교체를 위한 클래스 추가
        if (i === 7) {
            div.classList.add('mobile-replace-image-7');
        }

        // 각 슬라이드를 클릭하면 지정된 페이지로 이동하는 이벤트를 추가합니다.
        div.addEventListener('click', function() {
            if (pages[i]) {
                window.location.href = pages[i];
            }
        });

        carouselInner.appendChild(div);
    }
}


/* =========================================
   기능 2: 각종 이벤트 리스너 설정 함수
   ========================================= */
/**
 * 로그인 모달, 폼 제출, 언어 선택 등 사용자의 상호작용과 관련된
 * 모든 이벤트 리스너를 이 곳에서 한 번에 설정하고 관리합니다.
 */
function initEventListeners() {
    // 유저 아이콘 클릭 시 로그인 모달 창 표시
    const userIcon = document.getElementById('userIcon');
    if (userIcon) {
        userIcon.addEventListener('click', function(e) {
            e.preventDefault(); // a 태그의 기본 동작(페이지 이동)을 막습니다.
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        });
    }

    // 빠른 상담 신청 폼 유효성 검사 및 제출 처리
    const consultForm = document.getElementById('consultForm');
    if(consultForm) {
        consultForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 폼의 기본 제출 동작(새로고침)을 막습니다.

            // 각 입력 필드의 값을 가져옵니다. .trim()은 앞뒤 공백 제거.
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const consultType = document.getElementById('consultType').value;
            const privacyAgree = document.getElementById('privacyAgree').checked;
            const phoneRegex = /^\d{2,3}-?\d{3,4}-?\d{4}$/; // 전화번호 형식 검사를 위한 정규표현식

            // 유효성 검사
            if (!name) { return alert('이름을 입력해주세요.'); }
            if (!phoneRegex.test(phone)) { return alert('올바른 연락처 형식이 아닙니다. (예: 010-1234-5678)'); }
            if (!consultType) { return alert('상담 분야를 선택해주세요.'); }
            if (!privacyAgree) { return alert('개인정보처리방침에 동의해주세요.'); }

            // 모든 검사를 통과하면 성공 메시지를 보여줍니다. (실제 서버 전송 로직은 추후 추가)
            alert('상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.');
            this.reset(); // 폼 필드를 초기화합니다.
        });
    }

    // (이하 다른 이벤트 리스너들은 기존과 동일)
    // 로그인 폼, 소셜 로그인 버튼 등...
}


/* =========================================
   기능 3: 동적 높이 계산 및 CSS 변수 설정 함수
   ========================================= */
/**
 * [핵심 기능]
 * 화면 상단과 하단에 고정된 바(bar)들의 '실제 높이'를 JavaScript로 직접 측정합니다.
 * 그리고 측정된 높이 값을 CSS가 사용할 수 있는 변수(--navbar-height, --consult-bar-height)로 만들어 전달합니다.
 * 이 함수 덕분에 바의 높이가 반응형으로 변하더라도 웹페이지 전체 레이아웃이 깨지지 않고 안정적으로 유지됩니다.
 *
 * [수정 내용]
 * 기존에는 body의 padding-bottom을 이 함수에서 설정했으나, 이제 캐러셀의 동적 높이 계산(adjustCarouselHeight)과 역할을 분리합니다.
 * body의 padding-bottom은 고정 요소가 콘텐츠를 가리지 않도록 하는 역할에 집중합니다.
 */
function setDynamicHeights() {
    // 1. 상단 네비게이션 바의 높이를 측정합니다.
    const navbar = document.querySelector('.navbar.fixed-top');
    if (navbar) {
        const navbarHeight = navbar.offsetHeight; // .offsetHeight는 테두리, 패딩을 포함한 요소의 실제 높이를 반환합니다.
        // document.documentElement는 <html> 태그를 의미합니다. 여기에 style 속성으로 CSS 변수를 저장합니다.
        document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
    }

    // 2. 하단 상담 바의 높이를 측정합니다.
    const consultBar = document.querySelector('.quick-consult-bar');
    if (consultBar) {
        const consultBarHeight = consultBar.offsetHeight;
        document.documentElement.style.setProperty('--consult-bar-height', `${consultBarHeight}px`);
        // 캐러셀의 동적 높이 계산은 별도의 adjustCarouselHeight 함수에서 담당하므로,
        // 여기서는 body의 padding-bottom을 직접적으로 설정하지 않습니다.
    } else {
        // 하단 바가 없는 페이지를 위한 안전장치
        document.documentElement.style.setProperty('--consult-bar-height', '0px');
    }

    // body의 padding-bottom을 설정하여 하단 고정바에 콘텐츠가 가려지지 않도록 합니다.
    const currentConsultBarHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--consult-bar-height'));
    document.body.style.paddingBottom = `${currentConsultBarHeight}px`;
    // [추가] consult bar 높이 반영 후 promo text 위치도 조정
    adjustPromoTextPosition();
}


/* =========================================
   [신규 추가] 기능 4: 캐러셀 동적 높이 조정 함수
   ========================================= */
/**
 * 고정된 네비게이션 바와 상담 바의 높이를 제외하고,
 * 캐러셀이 사용 가능한 '실제 뷰포트 공간'에 맞춰 자신의 높이를 동적으로 조정합니다.
 * 이를 통해 캐러셀 내용이 상단 또는 하단 고정 요소에 가려지지 않고 항상 올바르게 표시됩니다.
 */
function adjustCarouselHeight() {
    const mainCarousel = document.getElementById('mainCarousel');
    if (!mainCarousel) {
        return; // 캐러셀 요소가 없으면 함수 종료 (예: 서브페이지)
    }

    // CSS 변수에서 네비게이션 바와 상담 바의 높이를 가져옵니다.
    // getComputedStyle과 parseFloat를 사용하여 px 단위의 숫자 값으로 변환합니다.
    const navbarHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'));
    const consultBarHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--consult-bar-height'));

    // 캐러셀이 차지할 수 있는 실제 뷰포트 높이를 계산합니다.
    // window.innerHeight는 현재 뷰포트의 높이입니다.
    // 여기서 상단 바와 하단 바의 높이를 빼서 캐러셀이 차지할 수 있는 유효 공간을 구합니다.
    const availableHeight = window.innerHeight - navbarHeight - consultBarHeight;

    // 계산된 높이를 캐러셀 요소의 CSS style 속성에 직접 적용합니다.
    // 이렇게 하면 CSS 파일의 static한 height 값을 동적으로 오버라이드할 수 있습니다.
    mainCarousel.style.height = `${availableHeight}px`;
    mainCarousel.style.maxHeight = `${availableHeight}px`; // max-height도 동일하게 설정하여 일관성을 유지합니다.
}

// [프로모션 문구 배열] 각 슬라이드 인덱스별로 line1, line2를 정의
const promoTexts = [
    { line1: '눈이 정말 편하고', line2: '마음에 쏙 들게 예뻐졌어요.' },
    { line1: '자연스러운 변화', line2: '티 안 나게 예뻐지는 비결!' },
    { line1: '부끄러운 배꼽', line2: '자신있게 비키니 입고 싶어요.' },
    { line1: '또렷한 눈매', line2: '매일 아침이 즐거워요.' },
    { line1: '콧대가 살아나니', line2: '자신감이 생겼어요.' },
    { line1: '동안 시술로', line2: '10년은 젊어진 느낌!' },
    { line1: '이물질 걱정 끝!', line2: '안전하게 제거했어요.' },
    { line1: '후기만 믿고 왔는데', line2: '정말 만족합니다.' },
    { line1: '이벤트 혜택까지', line2: '지금이 기회예요!' }
];

// [프로모션 문구 업데이트 함수]
function updatePromoText(slideIndex) {
    const promo = promoTexts[slideIndex] || { line1: '', line2: '' };
    const line1 = document.querySelector('.carousel-promo-text .line-1');
    const line2 = document.querySelector('.carousel-promo-text .line-2');
    if (line1) line1.textContent = promo.line1;
    if (line2) line2.textContent = promo.line2;
}

// [추가] 프로모션 텍스트 위치를 consult bar 높이에 맞게 동적으로 조정하는 함수
function adjustPromoTextPosition() {
    const promoText = document.querySelector('.carousel-promo-text');
    const consultBar = document.querySelector('.quick-consult-bar');
    if (promoText && consultBar) {
        const consultBarHeight = consultBar.offsetHeight;
        // consult bar가 2줄 이상이 되면 높이가 커지므로, 그만큼 promo text를 위로 올림
        promoText.style.bottom = (consultBarHeight + 8) + 'px'; // 8px은 여유값
    }
}

/* =========================================
   [신규 추가] 기능 5: 모바일 플라이아웃 메뉴 제어
   ========================================= */
/**
 * 모바일 뷰(991.98px 이하)에서만 동작하는 플라이아웃 메뉴 로직을 관리합니다.
 * 1. 1depth 메뉴 중 가장 긴 항목의 너비를 계산하여 2depth 패널의 가로 위치를 동적으로 설정합니다.
 * 2. 1depth 메뉴 클릭 시, 해당 메뉴의 세로 위치에 맞춰 2depth 패널을 엽니다.
 * 3. 다른 메뉴를 클릭하거나, 메뉴 외부를 클릭/스크롤하면 열려있는 패널을 닫습니다.
 * 4. 데스크탑 뷰로 전환되면 모든 모바일 관련 이벤트 리스너를 제거하여 충돌을 방지합니다.
 */
const MOBILE_BREAKPOINT = 991.98;
let isMobileMenuSetup = false;

// 1. 모바일 메뉴 초기화/제거를 담당하는 메인 함수
function setupMobileFlyoutMenu() {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
        if (!isMobileMenuSetup) {
            initMobileFlyoutMenu();
            isMobileMenuSetup = true;
        }
    } else {
        if (isMobileMenuSetup) {
            destroyMobileFlyoutMenu();
            isMobileMenuSetup = false;
        }
    }
}

// 2. 실제 메뉴 로직을 초기화하고 이벤트 리스너를 추가하는 함수
function initMobileFlyoutMenu() {
    calculateAndSetFlyoutPosition();
    const dropdownToggles = document.querySelectorAll('.navbar-nav .nav-item.dropdown > a.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        // [수정] 부트스트랩의 기본 드롭다운 기능을 비활성화하고, 커스텀 핸들러를 연결합니다.
        toggle.removeAttribute('data-bs-toggle');
        toggle.addEventListener('click', handleFlyoutToggle);
    });
    window.addEventListener('resize', calculateAndSetFlyoutPosition, { passive: true });
}

// 3. 모바일 메뉴 관련 모든 이벤트 리스너를 제거하는 함수
function destroyMobileFlyoutMenu() {
    const dropdownToggles = document.querySelectorAll('.navbar-nav .nav-item.dropdown > a.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        // [수정] 커스텀 핸들러를 제거하고, 부트스트랩 드롭다운 기능을 복원합니다.
        toggle.setAttribute('data-bs-toggle', 'dropdown');
        toggle.removeEventListener('click', handleFlyoutToggle);
    });
    window.removeEventListener('resize', calculateAndSetFlyoutPosition);
    closeAllFlyouts();
}

// 4. 메뉴 토글 클릭을 처리하는 핸들러
function handleFlyoutToggle(e) {
    e.preventDefault();
    e.stopPropagation();

    const currentToggle = e.currentTarget;
    const parentNavItem = currentToggle.parentElement;
    const flyoutPanel = parentNavItem.querySelector('.dropdown-menu');
    const navCollapse = document.querySelector('.navbar-collapse');

    if (!flyoutPanel || !navCollapse) return;

    const isAlreadyOpen = flyoutPanel.classList.contains('show');
    closeAllFlyouts();

    if (!isAlreadyOpen) {
        flyoutPanel.classList.add('show');
        
        // [수정] getBoundingClientRect를 사용하여 더 정확한 top 위치 계산
        // 부모 메뉴(li)와 전체 메뉴 컨테이너(.navbar-collapse)의 화면상 위치를 얻어
        // 상대적인 top 값을 계산합니다.
        const containerRect = navCollapse.getBoundingClientRect();
        const parentRect = parentNavItem.getBoundingClientRect();
        const topPosition = parentRect.top - containerRect.top;

        flyoutPanel.style.top = `${topPosition}px`;

        setTimeout(() => {
            document.addEventListener('click', closeAllFlyouts, { once: true });
            window.addEventListener('scroll', closeAllFlyouts, { once: true });
        }, 0);
    }
}

// 5. 모든 플라이아웃 패널을 닫는 유틸리티 함수
function closeAllFlyouts() {
    document.querySelectorAll('.navbar-nav .dropdown-menu.show').forEach(openPanel => {
        openPanel.classList.remove('show');
    });
    // 혹시 모를 이벤트 리스너 제거 (안전장치)
    document.removeEventListener('click', closeAllFlyouts);
    window.removeEventListener('scroll', closeAllFlyouts);
}

// 6. 가장 긴 메뉴 길이를 계산해서 반환하는 함수 (직접 left에 할당하기 위한 용도)
function getFlyoutLeftPosition() {
    if (window.innerWidth > MOBILE_BREAKPOINT) return 0;

    const primaryNavLinks = document.querySelectorAll('.navbar-nav > .nav-item > a.nav-link');
    if (primaryNavLinks.length === 0) return 0;

    let longestWidth = 0;
    primaryNavLinks.forEach(link => {
        if (link.offsetWidth > longestWidth) {
            longestWidth = link.offsetWidth;
        }
    });

    // 가장 긴 메뉴의 오른쪽 끝 + 약간의 여백(1rem)
    return longestWidth +1; // 16px = 1rem
}