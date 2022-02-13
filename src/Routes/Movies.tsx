import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getMovies, getTopRated, getUpComing, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';
import Popular from "../Components/Movies/Popular";
import TopReated from "../Components/Movies/TopRated";
import UpComing from "../Components/Movies/UpComing";


export const Wrapper = styled.div`
  background-color: #000;
`;

export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8)) , url(${(props) => props.bgPhoto});
  background-size: cover;
`;

export const Title = styled.div`
  font-size: 54px;
  margin-bottom: 20px;
`;

export const Overview = styled.div`
  font-size: 24px;
  width: 50%;
`;

export const Slider = styled.div`
  position: relative;
  height: 300px;
  top: -120px;

  h3 {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 5px;
  }
`;

export const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  margin-bottom: 5px;
`;

export const Box = styled(motion.div)<{bgPhoto: string}>`
  background-color: #fff;
  height: 200px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  &::first-child {
    transform-origin: center left;
  }
  &::last-child {
    transform-origin: center right;
  }
`;

export const Info = styled(motion.div)`
  padding: 20px;
  /* background-color: ${(props) => props.theme.black.lighter}; */
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    text-align: center;
    font-size: 18px;
  }
`;


export const rowVariants = {
  hidden: {
    x: window.innerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 5,
  },
}

export const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      type: "tween",
    }
  }
}

export const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      type: "tween",
    }
  }
}

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 1;
  `;

export const BigMovie = styled(motion.div)`
  position: absolute; 
  width: 40vw; 
  height: 80vh; 
  left: 0; 
  right: 0; 
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 10; 
`;

export const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center;
  height: 400px;
`;

export const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  /* text-align: center; */
  padding-left: 30px;
  padding-top: 20px;
`;

export const BigOverview = styled.div`
  padding: 30px;
  color: ${(props) => props.theme.white.lighter};
`;

export const BigVote = styled.div`
  padding: 0 30px;
  color: ${(props) => props.theme.white.lighter};
`;

export const offset = 6;

export const RightArrow = styled.div`
  width: 62px;
  height: 62px;
  display: flex;
  justify-content: center;
  align-items: center;  
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28px;
  color: ${(props) => props.theme.black.lighter};
  opacity: 0.3;
  cursor: pointer;
`;

export const LeftArrow = styled.div`
  width: 62px;
  height: 62px;
  display: flex;
  justify-content: center;
  align-items: center;  
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28px;
  color: ${(props) => props.theme.black.lighter};
  opacity: 0.3;
  cursor: pointer;
`;

function Movie() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{movieId: string}>("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  console.log(data);
  const [left, setLeft] = useState(false);
  // const { data: topRatedData , isLoading: topRatedLoading } = useQuery<IGetMoviesResult>(["topRatedMovies", "top_rated"], getTopRated);
  // const { data: upcomingData , isLoading: upcomingLoading } = useQuery<IGetMoviesResult>(["upcomingMovies", "upcoming"], getUpComing);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if(data) {
      if(leaving) return;
      toggleLeaving();
      setLeft(false);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;


      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }

    // if(topRatedData) {
    //   if(leaving) return;
    //   toggleLeaving();
    //   const totalMovies = topRatedData.results.length - 1;
    //   const maxIndex = Math.floor(totalMovies / offset) - 1;


    //   setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    // }
  }
  const indicreaseIndex = () => {
    if(data) {
      if(leaving) return;
      toggleLeaving();
      setLeft(true);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;


      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  }
  const toggleLeaving = () => setLeaving(prev => !prev);

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  }

  const onOverlayClick = () => {
    history.push('/movies');
  }

  const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find(movie => movie.id+"" === bigMovieMatch.params.movieId);

  // console.log(clickedMovie);

  return (
    <>
      <Wrapper>
        { isLoading ? <Loader>Loading...</Loader> : 
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>

          <Slider>
            <h3 style={{ paddingLeft: "20px" }}>NowPlaying</h3>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row variants={rowVariants} initial={left ? "exit" : "hidden"} animate="visible" exit={left ? "hidden" : "exit"} transition={{ type: "tween" }} key={index}>
                {data?.results.slice(1).slice(offset*index, offset*index+offset).map((movie) => (
                  <Box
                    layoutId={movie.id + ""}
                    key={movie.id} 
                    bgPhoto={makeImagePath(movie.backdrop_path, "w500")} 
                    whileHover="hover" 
                    variants={boxVariants} 
                    initial="normal" 
                    transition={{ type: "tween" }}
                    onClick={() => onBoxClicked(movie.id)}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
            <RightArrow onClick={increaseIndex}>          
              <AiOutlineRight />
            </RightArrow>
            <LeftArrow onClick={indicreaseIndex}>          
              <AiOutlineLeft />
            </LeftArrow>
          </Slider>
  {/* 
          <Slider>
            <h3>TopRated</h3>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween" }} key={index}>
                {topRatedData?.results.slice(0).slice(offset*index, offset*index+offset).map((movie) => (
                  <Box
                    layoutId={movie.id + "pop"}
                    key={movie.id} 
                    bgPhoto={makeImagePath(movie.backdrop_path, "w500")} 
                    whileHover="hover" 
                    variants={boxVariants} 
                    initial="normal" 
                    transition={{ type: "tween" }}
                    onClick={() => onBoxClicked(movie.id)}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <Slider>
            <h3>UpComing</h3>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween" }} key={index}>
                {upcomingData?.results.slice(0).slice(offset*index, offset*index+offset).map((movie) => (
                  <Box
                    layoutId={movie.id + "pop"}
                    key={movie.id} 
                    bgPhoto={makeImagePath(movie.backdrop_path, "w500")} 
                    whileHover="hover" 
                    variants={boxVariants} 
                    initial="normal" 
                    transition={{ type: "tween" }}
                    onClick={() => onBoxClicked(movie.id)}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider> */}

          {bigMovieMatch ?
            <AnimatePresence>
              <>
                <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
                <BigMovie layoutId={bigMovieMatch.params.movieId} style={{ top: scrollY.get() + 100 }}>
                  {clickedMovie && (
                    <>
                    <BigCover style={{ backgroundImage: `url(${makeImagePath(clickedMovie.backdrop_path, "w500")})` }} />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                      <BigVote>grade: {clickedMovie.vote_average}</BigVote>
                    </>
                  )}
                </BigMovie>
              </>
            </AnimatePresence>
          : null}
        </> }
      </Wrapper>

      <Popular />
      <UpComing />
      <TopReated />
    </>
  );
}

export default Movie;
