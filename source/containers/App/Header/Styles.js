import { css } from 'react-emotion'
import { Color, mobileMaxWidth, desktopMinWidth } from 'constants/css'

export const container = css`
  z-index: 500;
  font-family: Helvetica;
  font-size: 1.5rem;
  background: #fff;
  padding: 0.8rem;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 3px 3px -3px ${Color.menuGray()};
  align-items: center;
  width: 100%;
  margin-bottom: 0px;
  .header-nav {
    display: flex;
    margin-right: 2rem;
    .chat {
      color: ${Color.menuGray()};
    }
    a {
      text-decoration: none;
      margin-left: 0.5rem;
      color: ${Color.menuGray()};
      span.new {
        color: ${Color.lightBlue()};
      }
      .icon {
        line-height: 1.7rem;
        margin-right: 0.7rem;
        display: flex;
        align-items: center;
      }
    }
    a.active {
      font-weight: bold;
      color: ${Color.black()};
      span.no-hover {
        color: ${Color.menuGray()};
      }
    }
    &:hover {
      a {
        span {
          color: ${Color.black()};
        }
        span.new {
          color: ${Color.lightBlue()}!important;
        }
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
      &:hover {
        a {
          span {
            color: ${Color.menuGray()};
          }
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
  }
  @media (max-width: ${mobileMaxWidth}) {
    bottom: 0;
    height: 9rem;
    border-top: 1px solid ${Color.borderGray()};
  }
`
