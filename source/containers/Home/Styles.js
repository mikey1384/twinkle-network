import styled from 'react-emotion'

export const Container = styled('div')`
  display: flex;
`

export const Left = styled('div')`
  position: fixed;
  left: 1rem;
  @media (max-width: 991px) {
    display: none;
  }
  @media (min-width: 992px) {
    display: block;
    width: 15%;
  }
`

export const MenuItems = styled('ul')`
  margin-top: 2rem;
  display: flex;
  font-size: 2rem;
  padding-left: 0;
  flex-direction: column;
  li {
    margin-top: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    a {
      text-decoration: none;
      color: #7c7c7c;
      img {
        width: 3vw;
        height: 3vw;
      }
    }
    a:nth-child(2) {
      margin-left: 1rem;
    }
  }
  li:first-child {
    margin-top: 0;
  }
`

/*

.home-left-menu {
  cursor: pointer;
  background-color: #f1f3f6;
  border: none;
}

.home-left-menu > a {
  text-decoration: none;
  color: #7c7c7c;
}

.home-left-menu.active {
  background-color: #fbfbfb;
  font-weight: bold;
}

.home-left-menu.active:hover {
  background-color: #fbfbfb;
}

.home-left-menu.active > a {
  color: #333333;
}

*/
