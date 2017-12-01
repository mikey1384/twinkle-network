import React from 'react'
import Styles from './Styles'
import Rankings from './Rankings'

export default function TwinkleXP() {
  const {logoHead, logoTail, spanXP} = Styles
  const twinkleXpText = (
    <div style={{fontWeight: 'bold', display: 'inline'}}>
      <span style={logoHead}>Twin</span>
      <span style={logoTail}>kle</span>
      <span>{' '}</span>
      <span style={spanXP}>XP</span>
    </div>
  )
  return (
    <div className="container-fluid">
      <div className="col-xs-8">
        <div style={Styles.mainContainer}>
          <p style={{...Styles.header, textAlign: 'center'}}>
            About {twinkleXpText}
          </p>
          <p style={Styles.subHeader}>
            What is it?
          </p>
          <div style={Styles.section}>
            <p style={Styles.paragraph}>
              {`
                You earn `}{twinkleXpText}{` (XP = experience points) by watching videos with star icons on the top-left side of their thumbnails. With it you can gain higher ranks and unlock exclusive features such as multiple picture slots for your profile, ability to create multiple groups, upload blog posts, and more. With enough XP you can even become a moderator of this website.
              `}
            </p>
            <br />
            <img src="/img/starred_video_example.png" />
            <br />
            <br />
            <p style={Styles.subHeader}>
              How do I earn them?
            </p>
            <p style={Styles.paragraph}>
              {`
                For now, the only way to earn `}{twinkleXpText}{` is by watching starred videos. But later you will be awarded XP for participating in discussions, answering questions, and posting great comments both on the main section and on General Chat channel.
              `}
            </p>
            <br />
            <p style={Styles.subHeader}>
              Anything else?
            </p>
            <p style={Styles.paragraph}>
              {`
                Currently, Andrew teacher, Miguel teacher and I (Mikey) are discussing the possibility of awarding students with high `}{twinkleXpText}{` various prizes like iPads, computer accessories, books, and lego products. So in the meantime, watch those starred videos and gather as much XP as possible! Who knows, you might actually win an iPad.
              `}
            </p>
            <br />
          </div>
        </div>
      </div>
      <Rankings />
    </div>
  )
}
