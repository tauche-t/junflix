# JUNFLIX

넷플릭스 사이트를 클론하여 만든 웹 사이트입니다.
<br />
영화 api를 연동하여 현재 방영, 인기순위, 개봉예정등 영ㅎ롸와 TvShow 프로그램에 대한 정보를 가져온 뒤,
<br />
화면에 나타내었고, motion framer 라이브러리를 이용해 인터렉션을 강조하였습니다.
<br />
상태관리는 사용하기 간편하고 비교적 가벼운 Recoil을 사용하였습니다.


### Pages
```
1) Home
  - Movies
  - Search
  - Tv
```

### 디렉토리 설정
```
1) src
  - App.tsx
  - api.ts
  - index.tsx
  - styled.d.ts
  - theme.ts
  - utils.ts
  - Components
    - Movies
      - Popular.tsx
      - TopRated.tsx
      - UpComing.tsx
    - Tv
      - Air.tsx
      - Popular.tsx
      - TopRated.tsx
    - Header.tsx
  - Routes
    - Home.tsx
    - Movies.tsx
    - Search.tsx
    - Tv.tsx
```

### themovie API 연동
<img src="https://raw.githubusercontent.com/tauche-t/Portfolio/main/img/junflix-img1.PNG" />

### MotionFramer를 활용한 인터렉션
<img src="https://raw.githubusercontent.com/tauche-t/Portfolio/main/img/motion.gif" />

