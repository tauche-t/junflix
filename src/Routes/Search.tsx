import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { API_KEY, BASE_PATH, IGetMoviesResult, IGetTvResult } from "../api";
import { makeImagePath } from "../utils";
import { Box, boxVariants, Info, infoVariants, LeftArrow, Loader, offset, RightArrow, Row, rowVariants, Slider, Wrapper } from "./Tv";

const SearchContents = styled.div`
  margin-top: 150px;
`;

const SearchSlider = styled(Slider)`
  top: 0;
`;

const SearchInfo = styled(Info)`
  opacity: 1;
  background-color: rgba(0,0,0,0.5);
`;

const SearchBox = styled(Box)`
  position: relative;
`;

export const rowVariants2 = {
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

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const [left, setLeft] = useState(false);
  const [index, setIndex] = useState(0);
  const [tvindex, setTvIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  
  function getSearchMovies() {
    return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`).then(
      (response) => response.json()
    );
  }

  function getSearchTv() {
    return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`).then(
      (response) => response.json()
    );
  }

  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "searchMovies"], getSearchMovies);
  const { data:tvData } = useQuery<IGetTvResult>(["tv", "searchTv"], getSearchTv);

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

  const tvIncreaseIndex = () => {
    if(tvData) {
      if(leaving) return;
      toggleLeaving();
      setLeft(false);
      const totalMovies = tvData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;


      setTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      console.log('asdasd');
    }
  }
  const tvIndicreaseIndex = () => {
    if(tvData) {
      if(leaving) return;
      toggleLeaving();
      setLeft(true);
      const totalMovies = tvData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;


      setTvIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  }

  const toggleLeaving = () => setLeaving(prev => !prev);


  return (
    <>
      <Wrapper>
        { isLoading ? <Loader>Loading...</Loader> : (
          <>
            <SearchContents>
              { data ? (
                <SearchSlider>
                  <h3 style={{ paddingLeft: "20px" }}>Movies</h3>
                  <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row variants={rowVariants} initial={left ? "exit" : "hidden"} animate="visible" exit={left ? "hidden" : "exit"} transition={{ type: "tween" }} key={index}>
                      {data?.results.slice(1).slice(offset*index, offset*index+offset).map((movie) => (
                        <SearchBox
                          key={movie.id} 
                          bgPhoto={makeImagePath(movie.backdrop_path, "w500")} 
                        >
                          <SearchInfo>
                            <h4>{movie.title}</h4>
                          </SearchInfo>
                        </SearchBox>
                      ))}
                    </Row>
                  </AnimatePresence>
                  <RightArrow onClick={increaseIndex}>          
                    <AiOutlineRight />
                  </RightArrow>
                  <LeftArrow onClick={indicreaseIndex}>          
                    <AiOutlineLeft />
                  </LeftArrow>
                </SearchSlider>
              ) : null }
            </SearchContents>

            <SearchContents style={{ marginTop: "100px" }}>
              { tvData ? (
                <SearchSlider>
                  <h3 style={{ paddingLeft: "20px" }}>TvShow</h3>
                  <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row variants={rowVariants2} initial={left ? "exit" : "hidden"} animate="visible" exit={left ? "hidden" : "exit"} transition={{ type: "tween" }} key={tvindex}>
                      {tvData?.results.slice(1).slice(offset*tvindex, offset*tvindex+offset).map((tv) => (
                        <SearchBox
                          key={tv.id} 
                          bgPhoto={makeImagePath(tv.backdrop_path, "w500")} 
                        >
                          <SearchInfo>
                            <h4>{tv.name}</h4>
                          </SearchInfo>
                        </SearchBox>
                      ))}
                    </Row>
                  </AnimatePresence>
                  <RightArrow onClick={tvIncreaseIndex}>          
                    <AiOutlineRight />
                  </RightArrow>
                  <LeftArrow onClick={tvIndicreaseIndex}>          
                    <AiOutlineLeft />
                  </LeftArrow>
                </SearchSlider>
              ) : null }
            </SearchContents>
          </>
        ) }
      </Wrapper>
    </>
  );
}

export default Search;