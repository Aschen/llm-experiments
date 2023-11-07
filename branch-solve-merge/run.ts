import { BSMExecutor } from './BSMExecutor';

import { example1, example2, example3 } from './examples';

async function runExample1() {
  const { question, answers } = example1;

  const bsm = new BSMExecutor({ question, answers, criteriaCount: 3 });

  await bsm.execute();
}

async function runExample2() {
  const { question, answers } = example2;

  const bsm = new BSMExecutor({ question, answers, criteriaCount: 3 });

  await bsm.execute();
}

async function runExample3() {
  const { question, criterias } = example3;

  const bsm = new BSMExecutor({ question, criterias, answerCount: 3 });

  await bsm.execute();
}

runExample3();
