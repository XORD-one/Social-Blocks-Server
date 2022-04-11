const schedule = require('node-schedule');
const axios = require('axios');
const Post = require('./models/post');
const User = require('./models/user');
const PostChanges = require('./models/PostChages');
const UserChanges = require('./models/UserChanges');

const thirtySeconds = '*/30 * * * * *';

function isValidUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (e) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

schedule.scheduleJob(thirtySeconds, async () => {
  try {
    const postsToSkip = await Post.count({});

    console.log('postsToSkip -', postsToSkip);

    const result = await axios.post(
      'https://api.thegraph.com/subgraphs/name/ijlal-ishaq/social-blocks-subgraph',
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
        try {
          if (isValidUrl(post.uri)) {
            return axios.get(post.uri);
          }
        } catch (e) {
          console.log(e);
        }
      });

      const postsIpfsDataResult = await Promise.all(postsIpfsData);

      const postsData = postsIpfsDataResult.map((post, index) => {
        const additionalData = result.data.data.posts[index];
        const postData = {
          // ...post.data,
          name: post ? post?.data?.name : 'No title found.',
          description: post ? post?.data?.description : 'No description found.',
          image: post ? post?.data?.image : '',
          sellValue: Number(additionalData.sellValue),
          owner: {
            ...additionalData.owner,
            image: isValidUrl(additionalData.owner.image)
              ? additionalData.owner.image
              : '',
          },
          creator: {
            ...additionalData.creator,
            image: isValidUrl(additionalData.creator.image)
              ? additionalData.creator.image
              : '',
          },
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
    const postChanges = await PostChanges.findOne({});

    console.log('postchangesToSkip -', postChanges.count);

    const result = await axios.post(
      'https://api.thegraph.com/subgraphs/name/ijlal-ishaq/social-blocks-subgraph',
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
      postChanges.count += result.data?.data?.posts?.length;
      postChanges.save();
      console.log('done');
    }
  } catch (error) {
    console.log('rttpt', error);
  }
});

schedule.scheduleJob(thirtySeconds, async () => {
  try {
    const usersToSkip = await User.count({});

    console.log('usersToSkip -', usersToSkip);

    const result = await axios.post(
      'https://api.thegraph.com/subgraphs/name/ijlal-ishaq/social-blocks-subgraph',
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
        return new User({
          ...user,
          image: isValidUrl(user.image) ? user.image : '',
        }).save();
      });

      await Promise.all(usersData);

      console.log('done');
    }
  } catch (error) {
    console.log('rttpt', error);
  }
});

schedule.scheduleJob(thirtySeconds, async () => {
  try {
    const userChanges = await UserChanges.findOne({});

    console.log('userschangesToSkip -', userChanges.count);

    const result = await axios.post(
      'https://api.thegraph.com/subgraphs/name/ijlal-ishaq/social-blocks-subgraph',
      {
        query: `
        {
          userChanges(orderBy:block,orderDirection:asc,skip:${userChanges.count}){
            id
            block
            userAddress
            user{
              id
              displayName
              bio
              image
            }
          }
        }
        
      `,
      },
    );

    console.log(result.data?.data?.userChanges);

    if (result.data?.data?.userChanges?.length) {
      const updatedUserData = result.data?.data?.userChanges.map(user => {
        return User.findOneAndUpdate(
          { address: user.userAddress },
          {
            displayName: user.user.displayName,
            bio: user.user.bio,
            image: user.user.image,
          },
        );
      });

      await Promise.all(updatedUserData);
      // console.log(updatedUserData[0]);
      userChanges.count += result.data?.data?.userChanges?.length;
      userChanges.save();
      console.log('done user changes');
    }
  } catch (error) {
    console.log('rttpt', error);
  }
});
