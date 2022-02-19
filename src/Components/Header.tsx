import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import Image from '../img/junflix.png';

const Nav = styled(motion.nav)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  /* background: #050505; */
  height: 80px;
  font-size: 17px;
  padding: 20px 60px;
  color: white;
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  width: 105px;
  margin-right: 35px;
  /* background-image: url('/img/Junflix.png'); */

  img {
    width: 100%;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Search = styled.form`
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
`;

const Circle = styled(motion.span)`
  width: 7px;
  height: 7px;
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.red};
  border-radius: 5px;
`;

const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  right: 0px;
  padding: 5px 10px;
  padding-left: 40px;
  z-index: -1;
  color: white;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;


const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    }
  },
}

const navVariants = {
  top: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  scroll: {
    backgroundColor: "rgba(0, 0, 0, 1)",
  }
}


interface IForm {
  keyword: string;
}

function Header() {
  const history = useHistory();
  const movieMathch = useRouteMatch("/movies");
  const tvMatch = useRouteMatch("/tv");
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollY } = useViewportScroll();
  const navAnimation = useAnimation();

  const toggleSearch = () => setSearchOpen((prev) => !prev);

  useEffect(() => {
    scrollY.onChange(() => {
      if(scrollY.get() > 80) {
        navAnimation.start("scroll");
      }else{
        navAnimation.start("top");
      }
    });
  }, [scrollY, navAnimation]);

  const { register, handleSubmit } = useForm<IForm>();

  const onValid = (data: IForm) => {
    history.push(`/search?keyword=${data.keyword}`);
    window.location.reload();
  }

  return (
    <Nav variants={navVariants} animate={navAnimation} initial="top">
      <Col>
        <Link to="/">
          <Logo>
            <img src={Image} alt="logo" />
          </Logo>
        </Link>
        <Items>
          <Item>
            <Link to="/movies">
              Movies { movieMathch?.isExact && <Circle layoutId="circle" /> }
            </Link>
          </Item>
          <Item>
            <Link to="/tv">
              Tv Shows { tvMatch && <Circle layoutId="circle" /> }
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: searchOpen ? -180 : 0 }}
            transition={{ type: "liner" }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>

          <Input {...register("keyword", {required: true, minLength: 2})} animate={{ scaleX: searchOpen ? 1 : 0 }} transition={{ type: "liner" }} placeholder="Search for movie or tv show..." />
        </Search>
      </Col>
    </Nav>
  );
}

export default Header;