const repository = require('./repository');

// eslint-disable-next-line no-unused-vars
const getSpotifySongs = async (request, app) => {
  try {
    const response = await repository.getSpotifySongs(
      request.body.lastfm_username,
      request.body.lastfm_password,
      request.body.username,
      request.body.method
    );
    if (response.success === true) {
      return {
        success: true,
        data: response.data,
      };
    }
    return {
      success: false,
      status: 403,
      message: 'Could not be fetched from last.fm, please check your credentials and playlist info and try again!',
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: error,
    };
  }
};

module.exports = {
  getSpotifySongs,
};
