// const data = {
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 5,
//     avgDailyIncomePopulation: 0.71
//   },
//   periodType: 'days',
//   timeToElapse: 28,
//   reportedCases: 674,
//   population: 66622705,
//   totalHospitalBeds: 1380614
// };

const convertToDays = (periodType, timeToElapse) => {
  switch (periodType) {
    case 'days':
      return timeToElapse;
    case 'weeks':
      return timeToElapse * 7;
    case 'months':
      return timeToElapse * 30;
    default:
      return timeToElapse;
  }
};

const fifteenPercent = (infectionsByRequestedTime) => 0.15 * infectionsByRequestedTime;

const availableBeds = (totalHospitalBeds, severeCasesByRequestedTime) => {
  const availableBedSpace = 0.35 * totalHospitalBeds;
  return availableBedSpace - severeCasesByRequestedTime;
};

const ICUcare = (infectionsByRequestedTime) => 0.05 * infectionsByRequestedTime;

const ventilators = (infectionsByRequestedTime) => 0.02 * infectionsByRequestedTime;

const dollarsInFlightCalc = (
  infectionsByRequestedTime,
  avgDailyIncome,
  avgDailyIncomePercent,
  days
) => {
  const value = infectionsByRequestedTime * avgDailyIncome * avgDailyIncomePercent * days;
  return value.toFixed(2);
};

const covid19ImpactEstimator = (data) => {
  const outputData = {
    data: null,
    impact: {},
    severeImpact: {}
  };

  const {
    timeToElapse, reportedCases, periodType, totalHospitalBeds
  } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = data.region;
  const { impact, severeImpact } = outputData;
  outputData.data = data;
  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;
  const days = convertToDays(periodType, timeToElapse);
  const factor = 2 ** Math.trunc(days / 3);
  impact.infectionsByRequestedTime = impact.currentlyInfected * factor;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * factor;
  impact.severeCasesByRequestedTime = fifteenPercent(
    impact.infectionsByRequestedTime
  );
  severeImpact.severeCasesByRequestedTime = fifteenPercent(
    severeImpact.infectionsByRequestedTime
  );
  impact.hospitalBedsByRequestedTime = availableBeds(
    totalHospitalBeds,
    impact.severeCasesByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = availableBeds(
    totalHospitalBeds,
    severeImpact.severeCasesByRequestedTime
  );
  impact.casesForICUByRequestedTime = ICUcare(impact.infectionsByRequestedTime);
  severeImpact.casesForICUByRequestedTime = ICUcare(
    severeImpact.infectionsByRequestedTime
  );
  impact.casesForVentilatorsByRequestedTime = ventilators(
    impact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = ventilators(
    severeImpact.infectionsByRequestedTime
  );
  impact.casesForVentilatorsByRequestedTime = ventilators(
    impact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = ventilators(
    severeImpact.infectionsByRequestedTime
  );
  impact.dollarsInFlight = dollarsInFlightCalc(
    impact.infectionsByRequestedTime,
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD,
    days
  );
  severeImpact.dollarsInFlight = dollarsInFlightCalc(
    severeImpact.infectionsByRequestedTime,
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD,
    days
  );

  return outputData;
};

// console.log(covid19ImpactEstimator(data));
export default covid19ImpactEstimator;
