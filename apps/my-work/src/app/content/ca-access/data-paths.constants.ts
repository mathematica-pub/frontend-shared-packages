const folder = 'content/data/';

const path = {
  real: {
    bda: `${folder}BDA_Results_v2.csv`,
    csa: `${folder}Statistical_Results.csv`,
  },
  mock: {
    bda: `${folder}Mock_BDA_Results.csv`,
    csa: `${folder}Mock_Statistical_Results.csv`,
  },
};

export const dataPath = path.mock;
