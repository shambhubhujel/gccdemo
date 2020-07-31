import NodeGeocoder from 'node-geocoder';

const options = {
  provider: process.env.GEO_CODE_PROVIDER,
  apiKey: process.env.GEO_CODE_KEY,
  formatter: null,
};

const GeoCoder = NodeGeocoder(options);

export default GeoCoder;
