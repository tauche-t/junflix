import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getMovies, getTopRated, getUpComing, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: #000;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-items: center;
  flex-direction: column;
  overflow: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Slider = styled.div`
  width: 100%;
  height: 800px;
  padding: 130px 30px 150px 30px;
  /* padding: 150px 30px; */
  margin-top: 110px;
  overflow-x: scroll;
  overflow-y: hidden;
  transition: all 0.2s;
  white-space: nowrap;
  perspective: 500px;
  transform: scale(0.98);
  will-change: transform;
  position: relative;
  cursor: pointer;
`;

const MovieCard = styled.div<{bgPhoto: string}>`
  width: 200px;
  height: calc(100% - 40px);
  display: inline-block;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  align-items: center;
  justify-content: center;
  margin-right: 65px;
  border-radius: 5px;
  -webkit-box-reflect: below -1vw -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(0.45, transparent), to(rgba(255, 255, 255, 0.25)));

  &:nth-child(even) {
    transform: scaleX(1.31) rotateY(15deg);
  }

  &:nth-child(odd) {
    transform: scaleX(1.31) rotateY(-15deg);
  }
`;

const Menu = styled.div`
  position: absolute;
  top: 100px;
  display: flex;
`;

const MenuItem = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-right: 30px;
  transition: color 0.5s;
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: #f03e3e;
    z-index: -1;
    transition: all 0.3s;
  }

  &:hover {
    color: ${(props) => props.theme.white.lighter};
    &::before {
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const LogoBar = styled.div`
  width: 100%;
  padding-left: 62px;
  padding-top: 20px;
  box-sizing: border-box;
`;

const Logo = styled(motion.svg)`
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 6px;
    stroke: white;
  }
`;


function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  const sliderRef = useRef<HTMLDivElement | number | any>(0);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const onMouseDown = (e:any) => {
    setIsDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);

    // console.log(startX, scrollLeft);
  }
  const onMouseLeave = () => {
    setIsDown(false);
  }
  const onMouseUp = () => {
    setIsDown(false);
  }
  const onMouseMove = (e:any) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 3;
    // setScrollLeft((prev) => prev - walk);
    sliderRef.current.scrollLeft = scrollLeft - walk;
  }

  console.log(data);

  return (
    <Wrapper>
      { isLoading ? <Loader>Loading...</Loader> : 
      <>
      <LogoBar>
          <Logo
            whileHover="active"
            initial="normal"
            xmlns="http://www.w3.org/2000/svg"
            width="1024"
            height="276.742"
            viewBox="0 0 1024 276.742"
          >
            <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
          </Logo>
        </LogoBar>
        <Menu>
          <MenuItem>
            <Link to="/movies">Movies</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/tv">TvShows</Link>
          </MenuItem>
        </Menu>
        <Slider ref={sliderRef} onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
          {data?.results.map((movie) => (
            <MovieCard key={movie.id} bgPhoto={makeImagePath(movie.poster_path, "w500")} />
          ))}
        </Slider>
      </> }
    </Wrapper>
  );
}

export default Home;
