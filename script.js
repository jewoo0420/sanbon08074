
const API_KEY = '4505383191d748cdb7624645250708';
const API_BASE_URL = 'https://api.weatherapi.com/v1';

// DOM 요소들
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const weatherInfo = document.getElementById('weatherInfo');
const error = document.getElementById('error');

// 날씨 정보 표시 요소들
const cityName = document.getElementById('cityName');
const currentTime = document.getElementById('currentTime');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const weatherCondition = document.getElementById('weatherCondition');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const visibility = document.getElementById('visibility');

// 이벤트 리스너
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchWeather();
  }
});

// 페이지 로드 시 서울 날씨 표시
document.addEventListener('DOMContentLoaded', () => {
  getWeather('Seoul');
});

// 날씨 검색 함수
function searchWeather() {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
}

// 날씨 정보 가져오기
async function getWeather(city) {
  showLoading();
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no&lang=ko`
    );
    
    if (!response.ok) {
      throw new Error('날씨 정보를 찾을 수 없습니다.');
    }
    
    const data = await response.json();
    displayWeather(data);
    
  } catch (err) {
    showError();
    console.error('Error fetching weather:', err);
  }
}

// 로딩 표시
function showLoading() {
  hideAllSections();
  loading.classList.remove('hidden');
}

// 에러 표시
function showError() {
  hideAllSections();
  error.classList.remove('hidden');
}

// 모든 섹션 숨기기
function hideAllSections() {
  loading.classList.add('hidden');
  weatherInfo.classList.add('hidden');
  error.classList.add('hidden');
}

// 날씨 정보 표시
function displayWeather(data) {
  hideAllSections();
  
  const { location, current } = data;
  
  // 기본 정보
  cityName.textContent = `${location.name}, ${location.country}`;
  currentTime.textContent = formatDateTime(location.localtime);
  
  // 온도 및 날씨 상태
  temperature.textContent = Math.round(current.temp_c);
  weatherIcon.src = `https:${current.condition.icon}`;
  weatherIcon.alt = current.condition.text;
  weatherCondition.textContent = current.condition.text;
  
  // 상세 정보
  feelsLike.textContent = Math.round(current.feelslike_c);
  humidity.textContent = current.humidity;
  windSpeed.textContent = current.wind_kph;
  visibility.textContent = current.vis_km;
  
  // 날씨 정보 표시
  weatherInfo.classList.remove('hidden');
}

// 날짜/시간 포맷팅
function formatDateTime(datetime) {
  const date = new Date(datetime);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul'
  };
  
  return date.toLocaleDateString('ko-KR', options);
}

// 배경 색상을 날씨에 따라 변경 (선택사항)
function updateBackgroundByWeather(condition) {
  const body = document.body;
  const conditionCode = condition.code;
  
  // 날씨 코드에 따른 배경 색상 변경
  if (conditionCode === 1000) { // 맑음
    body.style.background = 'linear-gradient(135deg, #74b9ff, #0984e3)';
  } else if (conditionCode >= 1003 && conditionCode <= 1009) { // 구름
    body.style.background = 'linear-gradient(135deg, #636e72, #2d3436)';
  } else if (conditionCode >= 1063 && conditionCode <= 1201) { // 비
    body.style.background = 'linear-gradient(135deg, #74b9ff, #0984e3)';
  } else if (conditionCode >= 1210 && conditionCode <= 1282) { // 눈
    body.style.background = 'linear-gradient(135deg, #ddd, #74b9ff)';
  }
}
