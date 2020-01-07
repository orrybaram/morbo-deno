const morboAngries = [
  'annoyed',
  'enraged',
  'furious',
  'impassioned',
  'irritated',
  'offended',
  'outraged',
  'resentful',
  'affronted',
  'chafed',
  'convulsed',
  'displeased',
  'ferocious',
  'fuming',
  'huffy',
  'incensed',
  'infuriated',
  'maddened',
  'raging',
  'riled',
  'storming',
  'wrathful',
];

const morboHappys = [
  'appeased',
  'pleased',
  'satisfied',
  'fulfilled',
  'gratified',
  'unconcerned ',
  'sated',
  'impressed',
];

const catGifs = [
  'https://media.giphy.com/media/X2A2d62PrrMCk/giphy.gif',
  'https://media.giphy.com/media/HZUHce5TyYixq/giphy.gif',
  'https://media.giphy.com/media/ocGGCX3B84iA/giphy.gif',
  'https://media.giphy.com/media/VNfKqvm8Lg4qQ/giphy.gif',
  'https://media.giphy.com/media/nURzWHsOTpDDa/giphy.gif',
  'https://media.giphy.com/media/vMbC8xqhIf9ny/giphy.gif',
  'https://media.giphy.com/media/13kGpTCAisbtCM/giphy.gif',
  'https://media.giphy.com/media/Fc1QWasqMDJAc/giphy.gif',
  'https://media.giphy.com/media/581Zvttgt7Witjgc0Y/giphy.gif',
  'https://media.giphy.com/media/sE6jQonM5S8mI/giphy.gif',
  'https://media.giphy.com/media/11s7Ke7jcNxCHS/giphy.gif',
];

const getRandomMorboAngrySaying = () =>
  morboAngries[Math.floor(Math.random() * morboAngries.length)];

const getRandomMorboHappySaying = () =>
  morboHappys[Math.floor(Math.random() * morboHappys.length)];
const getRandomKitty = () =>
  catGifs[Math.floor(Math.random() * catGifs.length)];

const getRepoType = repo => {
  if (!repo) return null;
  if (repo.match(/bitbucket/)) {
    return 'bitbucket';
  }
  if (repo.match(/github/)) {
    return 'github';
  }
  return null;
};

const getBaseFileUrl = repo => {
  const repoType = getRepoType(repo);

  if (!repo) return null;
  if (repoType === 'bitbucket') {
    return `${repo}/src/master/`;
  }
  if (repoType === 'github') {
    return `${repo}/tree/master/`;
  }
  return null;
};

const getBaseCommitUrl = repo => {
  const repoType = getRepoType(repo);

  if (!repo) return null;
  if (repoType === 'bitbucket') {
    return `${repo}/commits/`;
  }
  if (repoType === 'github') {
    return `${repo}/commit/`;
  }
  return null;
};

window.run = payload => {
  const techDebt = payload.results;
  let techDebtCount = 0;
  const fileNames = new Set();

  const $body = document.querySelector('body');
  const $debtCount = document.querySelector('#techDebtCount');
  const $fileCount = document.querySelector('#fileCount');
  const $results = document.querySelector('#results');
  const $morbosTemperment = document.querySelector('#morbosTemperment');
  const $resultsHeader = document.querySelector('#resultsHeader');
  const $catGif = document.querySelector('#catGif');
  const $success = document.querySelector('#success');

  const baseCommitUrl = getBaseCommitUrl(payload.repositoryUrl);

  Object.keys(techDebt).forEach(type => {
    const $typeWrapper = document.createElement('div');
    const $typeName = document.createElement('h3');
    $typeName.innerHTML = `${type} (${techDebt[type].messages.length})`;
    $typeWrapper.appendChild($typeName);

    techDebt[type].messages.forEach(message => {
      const $message = document.createElement('div');

      const author = message.commitData && message.commitData.author.name;

      const commitHash = message.commitData && message.commitData.hash;

      const getFileOutput = () => {
        const repoType = getRepoType(payload.repositoryUrl);
        const baseUrl = getBaseFileUrl(payload.repositoryUrl);

        let href;
        if (repoType === 'github') {
          href = `${baseUrl}${message.fileName}#L${message.lineNumber}`;
        }
        if (repoType === 'bitbucket') {
          href = `${baseUrl}${message.fileName}#lines-${message.lineNumber}`;
        }

        if (href) {
          return `<a target="_blank" href="${href}">${message.fileName}:${
            message.lineNumber
          }</a>`;
        }

        return `${message.fileName}:${message.lineNumber}`;
      };

      $message.classList.add('message');
      $message.innerHTML = `
        <div>
          <pre>${getFileOutput()}</pre>
          ${message.message ? `<span>-- ${message.message}</span>` : ''}
        </div>
        <div class="commit-data">
          <small>
            <span class="commit-data__author">${author}
            ${baseCommitUrl &&
              commitHash &&
              `<a href="${baseCommitUrl}${commitHash}" class="commit-data__commit">${commitHash.substring(
                0,
                8,
              )}</a>`}
            </span>
            </small>
        </div>
      `;
      $typeWrapper.appendChild($message);
      techDebtCount += 1;
      fileNames.add(message.fileName);
    });
    $results.appendChild($typeWrapper);
  });

  // ANGRY
  if (techDebtCount > 0) {
    $morbosTemperment.innerHTML = getRandomMorboAngrySaying();
    $body.classList.add('morbo--angry');
    $resultsHeader.innerHTML = "Morbo's airing of grievances";

    // HAPPY
  } else {
    $morbosTemperment.innerHTML = getRandomMorboHappySaying();
    $body.classList.add('morbo--happy');
    $resultsHeader.innerHTML =
      'Good work puny human. You have pleased Morbo. <br>This cat will not be eaten today.';
    $catGif.src = getRandomKitty();
    $success.style.display = 'block';
  }

  $debtCount.innerHTML = techDebtCount;
  $fileCount.innerHTML = fileNames.size;
};
