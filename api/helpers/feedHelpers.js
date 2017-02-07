const {poolQuery} = require('../helpers')

module.exports = {
  fetchFeedsMin(req, res) {
    const feedId = Number(req.query.lastFeedId) || 0
    const filter = req.query.filter
    console.log(filter)
    let where = 'WHERE timeStamp IS NOT NULL '
    if (feedId !== 0) where += 'AND id < ' + feedId + ' '
    if (filter !== 'undefined' && filter !== 'all') where += 'AND type = "' + filter + '" '
    const query = `
      SELECT id, type, contentId, parentContentId, uploaderId, timeStamp FROM noti_feeds
      ${where} ORDER BY id DESC LIMIT 21
    `
    return poolQuery(query).then(
      feeds => res.send(feeds)
    ).catch(
      err => {
        console.error(err)
        return res.status(500).send({error: err})
      }
    )
  },

  fetchFeeds(req, res) {
    const feedId = Number(req.query.lastFeedId) || 0
    const filter = req.query.filter
    let where = 'WHERE feed.timeStamp IS NOT NULL '
    if (feedId !== 0) where += 'AND feed.id < ' + feedId + ' '
    if (filter !== 'undefined' && filter !== 'all') where += 'AND feed.type = "' + filter + '" '
    const query = `
      SELECT
        feed.id AS id,
        feed.type AS type,
        feed.contentId AS contentId,
        feed.parentContentId AS parentContentId,
        video.title AS parentContentTitle,
        video.description AS parentContentDescription,
        feed.uploaderId AS uploaderId,
        user1.username AS uploaderName,
        userPhoto.id AS uploaderPicId,
        feed.timeStamp AS timeStamp,
        comment1.content AS content,
        video.title AS contentTitle,
        NULL AS contentDescription,
        video.videoCode AS videoCode,
        comment1.commentId AS commentId,
        comment1.replyId AS replyId,
        comment2.userId AS targetCommentUploaderId,
        comment2.content AS targetComment,
        user2.username AS targetCommentUploaderName,
        comment3.userId AS targetReplyUploaderId,
        comment3.content AS targetReply,
        user3.username AS targetReplyUploaderName,
        comment1.discussionId AS discussionId,
        discussion.title AS discussionTitle,
        discussion.description AS discussionDescription,
        NULL AS videoViews,
        (SELECT COUNT(*) FROM vq_comments WHERE commentId = feed.contentId) AS numChildComments,
        (SELECT COUNT(*) FROM vq_comments WHERE replyId = feed.contentId) AS numChildReplies

      FROM noti_feeds feed
      JOIN vq_comments comment1
        ON feed.type = 'comment' AND feed.contentId = comment1.id
      LEFT JOIN vq_videos video
        ON feed.parentContentId = video.id
      LEFT JOIN users user1
        ON feed.uploaderId = user1.id
      LEFT JOIN users_photos userPhoto
        ON feed.uploaderId = userPhoto.userId AND userPhoto.isProfilePic = '1'
      LEFT JOIN vq_comments comment2
        ON comment1.commentId = comment2.id
      LEFT JOIN users user2
        ON comment2.userId = user2.id
      LEFT JOIN vq_comments comment3
        ON comment1.replyId = comment3.id
      LEFT JOIN users user3
        ON comment3.userId = user3.id
      LEFT JOIN content_discussions discussion
        ON comment1.discussionId = discussion.id
      ${where}

      UNION SELECT
        feed.id AS id,
        feed.type AS type,
        feed.contentId AS contentId,
        feed.parentContentId AS parentContentId,
        video.title AS parentContentTitle,
        video.description AS parentContentDescription,
        feed.uploaderId AS uploaderId,
        user.username AS uploaderName,
        userPhoto.id AS uploaderPicId,
        feed.timeStamp AS timeStamp,
        video.videoCode AS content,
        video.title AS contentTitle,
        video.description AS contentDescription,
        video.videoCode AS videoCode,
        NULL AS commentId,
        NULL AS replyId,
        NULL AS targetCommentUploaderId,
        NULL AS targetComment,
        NULL AS targetCommentUploaderName,
        NULL AS targetReplyUploaderId,
        NULL AS targetReply,
        NULL AS targetReplyUploaderName,
        NULL AS discussionId,
        NULL AS discussionTitle,
        NULL AS discussionDescription,
        (SELECT COUNT(*) FROM vq_video_views WHERE videoId = feed.contentId) AS videoViews,
        (SELECT COUNT(*) FROM vq_comments WHERE videoId = feed.contentId) AS numChildComments,
        NULL AS numChildReplies

      FROM noti_feeds feed
      JOIN vq_videos video
        ON feed.type = 'video' AND feed.contentId = video.id
      LEFT JOIN users user
        ON video.uploader = user.id
      LEFT JOIN users_photos userPhoto
        ON feed.uploaderId = userPhoto.userId AND userPhoto.isProfilePic = '1'
      ${where}

      UNION SELECT
        feed.id AS id,
        feed.type AS type,
        feed.contentId AS contentId,
        feed.parentContentId AS parentContentId,
        url.title AS parentContentTitle,
        url.description AS parentContentDescription,
        feed.uploaderId AS uploaderId,
        user.username AS uploaderName,
        userPhoto.id AS uploaderPicId,
        feed.timeStamp AS timeStamp,
        url.url AS content,
        url.title AS contentTitle,
        NULL AS contentDescription,
        NULL AS videoCode,
        NULL AS commentId,
        NULL AS replyId,
        NULL AS targetCommentUploaderId,
        NULL AS targetComment,
        NULL AS targetCommentUploaderName,
        NULL AS targetReplyUploaderId,
        NULL AS targetReply,
        NULL AS targetReplyUploaderName,
        NULL AS discussionId,
        NULL AS discussionTitle,
        NULL AS discussionDescription,
        NULL AS videoViews,
        NULL AS numChildComments,
        NULL AS numChildReplies

      FROM noti_feeds feed
      JOIN content_urls url
        ON feed.type = 'url' AND feed.contentId = url.id
      LEFT JOIN users user
        ON url.uploader = user.id
      LEFT JOIN users_photos userPhoto
        ON feed.uploaderId = userPhoto.userId AND userPhoto.isProfilePic = '1'
      ${where}

      UNION SELECT
        feed.id AS id,
        feed.type AS type,
        feed.contentId AS contentId,
        feed.parentContentId AS parentContentId,
        video.title AS parentContentTitle,
        video.description AS parentContentDescription,
        feed.uploaderId AS uploaderId,
        user.username AS uploaderName,
        userPhoto.id AS uploaderPicId,
        feed.timeStamp AS timeStamp,
        NULL AS content,
        discussion.title AS contentTitle,
        discussion.description AS contentDescription,
        video.videoCode AS videoCode,
        NULL AS commentId,
        NULL AS replyId,
        NULL AS targetCommentUploaderId,
        NULL AS targetComment,
        NULL AS targetCommentUploaderName,
        NULL AS targetReplyUploaderId,
        NULL AS targetReply,
        NULL AS targetReplyUploaderName,
        NULL AS discussionId,
        NULL AS discussionTitle,
        NULL AS discussionDescription,
        NULL AS videoViews,
        (SELECT COUNT(*) FROM vq_comments WHERE discussionId = discussion.id) AS numChildComments,
        NULL AS numChildReplies

      FROM noti_feeds feed
      JOIN content_discussions discussion
        ON feed.type = 'discussion' AND feed.contentId =
      discussion.id
      LEFT JOIN vq_videos video
        ON discussion.refContentType = 'video' AND refContentId = video.id
      LEFT JOIN users user
        ON discussion.userId = user.id
      LEFT JOIN users_photos userPhoto
        ON feed.uploaderId = userPhoto.userId AND userPhoto.isProfilePic = '1'
      ${where}

      ORDER BY id DESC LIMIT 21
    `

    poolQuery(query).then(
      feeds => {
        let taskArray = feeds.map(feed => {
          feed['commentsShown'] = false
          feed['childComments'] = []
          feed['commentsLoadMoreButton'] = false
          feed['isReply'] = false
          return finalizeFeed(feed)

          function finalizeFeed(feed) {
            let commentQuery = [
              'SELECT a.userId, b.username ',
              'FROM vq_commentupvotes a LEFT JOIN users b ON ',
              'a.userId = b.id WHERE ',
              'a.commentId = ?'
            ].join('')
            let videoQuery = [
              'SELECT a.userId, b.username ',
              'FROM vq_video_likes a LEFT JOIN users b ON ',
              'a.userId = b.id WHERE ',
              'a.videoId = ?'
            ].join('')
            let targetId = feed.replyId || feed.commentId
            if (feed.type === 'comment') {
              return Promise.all([
                poolQuery(commentQuery, feed.contentId),
                poolQuery(commentQuery, targetId || '0'),
                poolQuery(videoQuery, feed.parentContentId)
              ]).then(
                results => {
                  feed['contentLikers'] = results[0]
                  feed['targetContentLikers'] = results[1]
                  feed['parentContentLikers'] = results[2]
                  return Promise.resolve()
                }
              )
            } else {
              if (feed.type === 'url' || feed.type === 'discussion') {
                feed['contentLikers'] = []
                feed['parentContentLikers'] = []
                return Promise.resolve()
              }
              return poolQuery(videoQuery, feed.contentId).then(
                rows => {
                  feed['contentLikers'] = rows
                  return Promise.resolve()
                }
              )
            }
          }
        })

        return Promise.all(taskArray).then(
          () => res.send(feeds)
        )
      }
    ).catch(
      err => {
        console.error(err)
        return res.status(500).send({error: err})
      }
    )
  }
}
