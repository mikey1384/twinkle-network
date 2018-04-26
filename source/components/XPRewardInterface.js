import React, { Component } from 'react'
import Textarea from 'components/Texts/Textarea'
import { Color } from 'constants/css'
import { css } from 'emotion'
import { exceedsCharLimit, stringIsEmpty } from 'helpers/stringHelpers'
import Button from 'components/Button'

export default class XPRewardInterface extends Component {
  state = {
    rewardExplanation: '',
    twoStarSelected: false
  }

  render() {
    const { rewardExplanation, twoStarSelected } = this.state
    return (
      <div
        className={css`
          display: flex;
          flex-direction: column;
          padding: 1rem;
          font-size: 1.6rem;
          background: #fff;
          align-items: center;
          color: ${Color.pink()};
        `}
      >
        <section style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Button
            logo
            style={{ display: 'flex' }}
            filled={!twoStarSelected}
            onClick={() => this.setState({ twoStarSelected: false })}
          >
            <span className="glyphicon glyphicon-star" />
            &nbsp;Reward a star (Great - 200 XP)
          </Button>
          <Button
            gold
            style={{ display: 'flex', marginTop: '1rem' }}
            filled={twoStarSelected}
            onClick={() => this.setState({ twoStarSelected: true })}
          >
            <span className="glyphicon glyphicon-star" />
            <span className="glyphicon glyphicon-star" />
            &nbsp;Reward 2 stars (Excellent - 400 XP)
          </Button>
        </section>
        <Textarea
          autoFocus
          className={css`
            margin-top: 1rem;
          `}
          minRows={3}
          value={rewardExplanation}
          onChange={event =>
            this.setState({ rewardExplanation: event.target.value })
          }
          placeholder="Write a note explaining why you are rewarding XP for this comment (required)"
          style={exceedsCharLimit({
            contentType: 'rewardComment',
            text: rewardExplanation
          })}
        />
        <section
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            width: '100%',
            marginTop: '1rem'
          }}
        >
          <Button
            primary
            filled
            disabled={
              stringIsEmpty(rewardExplanation) ||
              exceedsCharLimit({
                contentType: 'rewardComment',
                text: rewardExplanation
              })
            }
            onClick={() => console.log('submit success')}
          >
            Confirm
          </Button>
        </section>
      </div>
    )
  }
}
