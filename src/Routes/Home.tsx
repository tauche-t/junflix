import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getMovies, getTopRated, getUpComing, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import Image from '../img/junflix.png';

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

  &::-webkit-scrollbar {
    display: none;
  }
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

const Logo = styled.div`
  width: 105px;
  /* background-image: url('/img/Junflix.png'); */

  img {
    width: 100%;
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
          <Logo>
            <img src={Image} alt="logo" />
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
