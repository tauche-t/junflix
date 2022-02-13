import { AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getPopular, IGetMoviesResult } from "../../api";
import { BigCover, BigMovie, BigOverview, BigTitle, BigVote, Box, boxVariants, Info, infoVariants, LeftArrow, Loader, offset, Overlay, RightArrow, Row, rowVariants, Slider, Wrapper } from "../../Routes/Movies";
import { makeImagePath } from "../../utils";

function Popular() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{movieId: string}>("/movies/popular/:movieId");
  const { scrollY } = useViewportScroll();
  const [left, setLeft] = useState(false);
  const { data , isLoading } = useQuery<IGetMoviesResult>(["popularMovies", "popular"], getPopular);
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
    history.push(`/movies/popular/${movieId}`);
  }

  const onOverlayClick = () => {
    history.push('/movies');
  }

  const clickedMovie = bigMovieMatch?.params.movieId + "popular" && data?.results.find(movie => movie.id + "popular" === bigMovieMatch?.params.movieId + "popular");

  console.log(clickedMovie);

  return (
    <>
        <Slider>
          <h3 style={{ paddingLeft: "20px" }}>Popular</h3>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <Row variants={rowVariants} initial={left ? "exit" : "hidden"} animate="visible" exit={left ? "hidden" : "exit"} transition={{ type: "tween" }} key={index}>
              {data?.results.slice(1).slice(offset*index, offset*index+offset).map((movie) => (
                <Box
                  layoutId={movie.id + "popular"}
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

        {bigMovieMatch ?
          <AnimatePresence>
              <>
                <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
                <BigMovie layoutId={bigMovieMatch.params.movieId + "popular"} style={{ top: scrollY.get() + 100 }}>
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
      </> 

  );
}

export default Popular;
