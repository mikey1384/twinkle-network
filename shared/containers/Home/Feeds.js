import React from 'react';
import FeedInputPanel from './FeedInputPanel';
import FeedPanel from './FeedPanel';
import Button from 'components/Button';


export default function Feeds({feeds, loadMoreButton, userId, renderFilterBar, loadMoreFeeds}) {
  return (
    <div>
      {!feeds &&
        <p style={{
          textAlign: 'center',
          paddingTop: '1em',
          paddingBottom: '1em',
          fontSize: '3em'
        }}>
          <span className="glyphicon glyphicon-refresh spinning"></span>&nbsp;
          <span>Loading...</span>
        </p>
      }
      {!!feeds && feeds.length > 0 &&
        <div>
          <FeedInputPanel />
          {renderFilterBar()}
          {feeds.map(feed => {
            return <FeedPanel key={`${feed.id}`} feed={feed} userId={userId} />;
          })}
          {loadMoreButton &&
            <div className="text-center" style={{paddingBottom: '1em'}}>
              <Button className="btn btn-success" onClick={() => loadMoreFeeds}>Load More</Button>
            </div>
          }
        </div>
      }
      {!!feeds && feeds.length === 0 &&
        <p style={{
          textAlign: 'center',
          paddingTop: '1em',
          paddingBottom: '1em',
          fontSize: '2em'
        }}>
          <span>Hello!</span>
        </p>
      }
    </div>
  )
}
