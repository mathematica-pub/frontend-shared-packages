const folder = 'content/data/';

const path = {
  current: {
    bda: `${folder}BDA_Results_v2.csv`,
    csa: `${folder}Statistical_Results.csv`,
  },
  old: {
    bda: `${folder}BDA_Results_v2 old charts.csv`,
    csa: `${folder}Statistical_Results old charts.csv`,
  },
  mock: {
    bda: `${folder}Mock_BDA_Results.csv`,
    csa: `${folder}Mock_Statistical_Results.csv`,
  },
};

export const dataPath = path.current;
