import { css } from 'react-emotion'
import { Color, mobileMaxWidth, desktopMinWidth } from 'constants/css'

export const container = css`
  background: ${Color.headingGray};
  display: flex;
  z-index: 100;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-bottom: 0px;
  .header-nav {
    display: flex;
    margin-right: 2rem;
    .chat {
      color: ${Color.menuGray};
    }
    a {
      color: ${Color.menuGray};
      text-decoration: none;
      margin-left: 0.5rem;
      .glyphicon {
        margin-top: 2%;
        margin-right: 0.7rem;
        color: ${Color.menuGray};
        display: block;
      }
    }
    a.active {
      color: ${Color.black};
      span {
        color: ${Color.black};
      }
    }
    &:hover {
      .glyphicon {
        color: ${Color.black};
      }
      a {
        color: ${Color.black};
      }
    }
    @media (max-width: ${mobileMaxWidth}) {
      width: 100%;
      justify-content: center;
      font-size: 4rem;
      a {
        .glyphicon {
          margin-top: 0;
          margin-right: 0;
        }
        .nav-label {
          display: none;
        }
      }
    }
  }
  .main-tabs {
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: ${mobileMaxWidth}) {
      padding: 0;
      width: 100%;
    }
  }
  @media (min-width: ${desktopMinWidth}) {
    top: 0;
    border-bottom: 1px solid ${Color.borderGray};
  }
  @media (max-width: ${mobileMaxWidth}) {
    bottom: 0;
    height: 9rem;
    border-top: 1px solid ${Color.borderGray};
  }
`
