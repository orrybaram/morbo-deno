import ora from 'ora';

const noop = () => {};

export default class MorboSpinner {
  constructor() {
    this.morboSayingInterval = 0;
  }

  spinner = ora({
    text: 'Morbo scanning your puny human codebase!',
    color: 'green',
  });

  morboSayings = [
    'Humans have easily injured knees',
    'Morbo wishes these stalwart nomads peace among the codebase.',
    'May death come quickly to your tech debt',
    'This reporter applauds the demise of the pathetic code!',
    'Hello, little todo. I will destroy you!',
  ];

  morboSayingInterval: number;

  start = () => {
    this.morboSayingInterval = setInterval(this.updateMorboSpinner, 3000);
    this.spinner.start();
  }

  succeed = (fileName: string) => {
    this.spinner.succeed(`Report created: ${fileName}`);
  }

  updateText = (text: string) => {
    if (this.morboSayingInterval) {
      clearInterval(this.morboSayingInterval);
    }
    this.spinner.text = text;
    return null;
  }

  updateMorboSpinner = () => {
    if (!this.spinner.isSpinning) {
      clearInterval(this.morboSayingInterval);
      return false;
    }

    const randomSayingIndex = Math.floor(
      Math.random() * this.morboSayings.length,
    );
    this.spinner.text = this.morboSayings[randomSayingIndex];
    return null;
  }
}
