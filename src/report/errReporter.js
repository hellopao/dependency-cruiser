"use strict";

const chalk = require('chalk');

const LEVEL2CHALK = {
    'error'       : chalk.red,
    'warning'     : chalk.yellow,
    'information' : chalk.cyan
};

function formatError(pErr) {
    return `${LEVEL2CHALK[pErr.rule.level](pErr.rule.level)} ${pErr.rule.name}: ` +
           `${chalk.bold(pErr.source)} => ${chalk.bold(pErr.resolved)}`;
}

function cutNonTransgressions(pSourceEntry) {
    return {
        source: pSourceEntry.source,
        dependencies: pSourceEntry.dependencies.filter(pDep => pDep.valid === false)
    };
}

function addSource(pSource) {
    return pDependency => Object.assign(pDependency, {source: pSource});
}

function render(pInput) {
    let lViolations = pInput
        .map(cutNonTransgressions)
        .filter(pDep => pDep.dependencies.length > 0)
        .sort((pOne, pTwo) => pOne.source > pTwo.source ? 1 : -1)
        .reduce(
            (pAll, pThis) => pAll.concat(pThis.dependencies.map(addSource(pThis.source))),
            []
        );

    if (lViolations.length === 0){
        return "";
    }

    return lViolations.reduce(
        (pAll, pThis) => `${pAll}    ${formatError(pThis)}\n`,
        "\n"
    ).concat(
        chalk.red(`\n  ${lViolations.length} violations found\n\n`)
    );
}

exports.render = render;
