const axios = require('axios');

const src = {
  host: process.env.SRC_HOST,
  apikey: process.env.SRC_APIKEY,
  root: process.env.SRC_ROOT,
};

const dst = {
  host: process.env.DST_HOST,
  apikey: process.env.DST_APIKEY,
  root: process.env.DST_ROOT,
};

const log = (message, title) => {
  const msg = title ? `${title}: ${message}` : message;
  console.log(msg);
  return msg;
};

const addSeries = (json, resolutions, profile) => {
  if (!json.episodeFileCount === 0) {
    return log('Not downloaded. Skipping.', json.title);
  }
  const {
    title, titleSlug, tvdbId, year,
  } = json;
  const path = json.path.replace(src.root, dst.root);
  const qualityProfileId = parseInt(profile, 10);
  if (Number.isNaN(qualityProfileId)) {
    return log(`Quality profile id must be an integer. Got '${profile}'`);
  }
  const payload = {
    title,
    titleSlug,
    tvdbId,
    path,
    qualityProfileId,
    seasons: [],
    images: [],
    year,
    addOptions: {
      searchForMissingEpisodes: true,
    },
  };

  return axios.post(`${dst.host}/api/series?apikey=${dst.apikey}`, payload)
    .then(() => log('Synced!', title))
    .catch(() => log('Unable to add series', title));
};

const sync = ({ id, resolutions, profile }) => axios.get(`${src.host}/api/series/${id}?apikey=${src.apikey}`)
  .then((data) => {
    if (data.message === 'Not Found') {
      return log(`Series id not found: ${id}`);
    }
    return addSeries(data.data, resolutions, profile);
  });

const importAll = ({ resolutions, profile }) => axios.get(`${src.host}/api/series?apikey=${src.apikey}`)
  .then(data => data.data.map(d => addSeries(d, resolutions, profile)).filter(series => series));

module.exports = { sync, importAll };
