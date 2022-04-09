const schedule = require('node-schedule');
const axios = require('axios');
const Post = require('./models/post');
const User = require('./models/user');

const thirtySeconds = '*/30 * * * * *';

schedule.scheduleJob(thirtySeconds, async () => {
  try {
    const postsToSkip = await Post.count({});

    console.log('postsToSkip -', postsToSkip);

    const result = await axios.post(
      'https://api.thegraph.com/subgraphs/name/ijlal-ishaq/social-blocks-rinkeby',
      {
        query: `
      {
        posts(skip: ${postsToSkip}) {
            id
            creator {
              id
              address
              userName
              displayName
              bio
              image
            }
            owner {
              id
              address
              userName
              displayName
              bio
              image
            }
            uri
            buyStatus
            sellValue
            transferHistory
        }
      }
      `,
      },
    );

    console.log('posts -', result.data?.data?.posts?.length);

    if (result.data?.data?.posts?.length) {
      const postsIpfsData = result.data.data.posts.map(post => {
        return axios.get(post.uri);
      });

      const postsIpfsDataResult = await Promise.all(postsIpfsData);

      const postsData = postsIpfsDataResult.map((post, index) => {
        const additionalData = result.data.data.posts[index];
        const postData = {
          ...post.data,
          sellValue: Number(additionalData.sellValue),
          owner: additionalData.owner,
          creator: additionalData.creator,
          _id: parseInt(additionalData.id),
          transferHistory: additionalData.transferHistory,
          buyStatus: additionalData.buyStatus,
        };

        return new Post(postData).save();
      });

      await Promise.all(postsData);

      console.log('done');
    }
  } catch (error) {
    console.log('rttpt', error);
  }
});

schedule.scheduleJob(thirtySeconds, async () => {
  try {
    const result = await axios.post(
      'https://api.thegraph.com/subgraphs/name/ijlal-ishaq/social-blocks-rinkeby',
      {
        query: `
          { 
            changes() {
              id
              block
              postId
              post {
                id
                creator {
                  id
                }
                owner {
                  id
                }
                uri
                buyStatus
                sellValue
                transferHistory
              }
            }
          }
      `,
      },
    );

    if (result.data?.data?.posts?.length) {
      const updatedPostData = result.data?.data?.posts.map(post => {
        return Post.findOneAndUpdate(
          { _id: String(parseInt(post.postId)) },
          {
            sellValue: Number(post.sellValue),
            owner: post.owner.id,
            transferHistory: post.transferHistory,
            buyStatus: post.buyStatus,
          },
        );
      });

      await Promise.all(updatedPostData);
      console.log('done');
    }
  } catch (error) {
    console.log('rttpt', error);
  }
});

schedule.scheduleJob(thirtySeconds, async () => {
  try {
    const usersToSkip = await User.count({});

    const result = await axios.post(
      'https://api.thegraph.com/subgraphs/name/ijlal-ishaq/social-blocks-rinkeby',
      {
        query: `
          {
            users(orderBy: createdAt, orderDirection: asc, skip: ${usersToSkip}) {
                id
                address
                userName
                displayName
                bio
                image
                rewardClaimed
                createdAt
                postsCreated {
                  id
                }
                postsOwn {
                  id
                }
            }
          }
      `,
      },
    );

    console.log('users -', result.data?.data?.users?.length);

    if (result.data?.data?.users?.length) {
      const usersData = result.data?.data?.users.map(user => {
        return new User(user).save();
      });

      await Promise.all(usersData);

      console.log('done');
    }
  } catch (error) {
    console.log('rttpt', error);
  }
});
