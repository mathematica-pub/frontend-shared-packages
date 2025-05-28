const folder = 'content/data/';

const caAccessPath = {
  current: {
    bda: `${folder}BDA_Results_v2.csv`,
    csa: `${folder}Statistical_Results.csv`,
  },
  old: {
    bda: `${folder}BDA_Results_v2 old charts.csv`,
    csa: `${folder}Statistical_Results old charts.csv`,
  },
  old073024: {
    bda: `${folder}BDA_Results_v2 old charts.csv`,
    csa: `${folder}Statistical_Results_073024.csv`,
  },
  old080524: {
    bda: `${folder}BDA_Results_v2 old charts.csv`,
    csa: `${folder}Statistical_Results_080524.csv`,
  },
  old081924: {
    bda: `${folder}BDA_Results_v2 old charts.csv`,
    csa: `${folder}Statistical_Results_081924.csv`,
  },
  old082824: {
    bda: `${folder}BDA_Results_v2_082624.csv`,
    csa: `${folder}Statistical_Results_082824.csv`,
  },
  old091924: {
    bda: `${folder}BDA_Results_v2_091724.csv`,
    csa: `${folder}Statistical_Results_091924.csv`,
  },
  old101124: {
    bda: `${folder}BDA_Results_v2_091724.csv`,
    csa: `${folder}Statistical_Results_101124.csv`,
  },
  old101624: {
    bda: `${folder}BDA_Results_v2_091724.csv`,
    csa: `${folder}Statistical_Results_101624.csv`,
  },
  old101624b: {
    bda: `${folder}BDA_Results_v2_091724.csv`,
    csa: `${folder}Statistical_Results_101624b.csv`,
  },
  old102924: {
    bda: `${folder}BDA_Results_v2_102924.csv`,
    csa: `${folder}Statistical_Results_102924.csv`,
  },
  old110424: {
    bda: `${folder}BDA_Results_v2_110424.csv`,
    csa: `${folder}Statistical_Results_102924.csv`,
  },
  old021125: {
    bda: `${folder}BDA_Results_v2_110424.csv`,
    csa: `${folder}Statistical_Results_021124.csv`,
  },
  mock: {
    bda: `${folder}Mock_BDA_Results.csv`,
    csa: `${folder}Mock_Statistical_Results.csv`,
  },
};

const mlbPath = {
  current: {
    bda: `${folder}MLB_BDA_Results.csv`,
    percentiles: `${folder}MLB_Results.csv`,
  },
  mock: {
    bda: `${folder}Mock_MLB_BDA_Results.csv`,
    percentiles: `${folder}Mock_MLB_Results.csv`,
  },
};

export const dataPath = caAccessPath.mock;
export const mlbDataPath = mlbPath.mock;
