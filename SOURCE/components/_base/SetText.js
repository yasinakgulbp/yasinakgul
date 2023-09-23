class SetText {
  static splitText({
    target
  }) {
    return new Promise((resolve) => {
      if (!target || !target.length) {
        resolve(true);
        return;
      }

      target.each(function () {
        const
          $el = $(this),
          type = $el.data('split-text-type'),
          set = $el.data('split-text-set');

        let $content = $el;

        // split children elements if they are exist
        // instead of the actual element
        if ($el.children(':not(br)').length > 0) {
          $content = $el.find(' > *');
        }

        // handle texts with drop cap
        const $contentWithDropcap = $content.filter('.has-drop-cap');
        const firstChar = $contentWithDropcap.text()[0];

        // remove first char
        $contentWithDropcap.text($contentWithDropcap.text().substring(1));
        $contentWithDropcap.prepend(`<span class="drop-cap">${firstChar}</span>`).addClass('has-drop-cap_split');

        new SplitText($content, {
          type: type,
          linesClass: ($contentWithDropcap.length || set === 'words') ? 'split-text__line overflow' : 'split-text__line',
          wordsClass: 'split-text__word',
          charsClass: 'split-text__char',
          reduceWhiteSpace: false,
        });

        // double wrapper for "only lines" split type
        if (type === 'lines') {
          new SplitText($content, {
            type: type,
            linesClass: 'overflow',
            reduceWhiteSpace: false,
          });
        }

        $el.removeClass('js-split-text');
      });

      resolve(true);

    });
  }

  static setLines({
    target,
    y = '100%'
  }) {
    return new Promise((resolve) => {
      if (!target || !target.length) {
        resolve(true);
        return;
      }

      gsap.set(target.find('.split-text__line'), {
        y,
        onComplete: resolve(true)
      });
    });
  }

  static setWords({
    target,
    y = '100%'
  }) {
    return new Promise((resolve) => {
      if (!target || !target.length) {
        resolve(true);
        return;
      }

      gsap.set(target.find('.split-text__word'), {
        y,
        onComplete: resolve(true)
      });
    });
  }

  static setChars({
    target,
    x = 0,
    y = 0,
    distribute = true
  }) {
    return new Promise((resolve) => {
      if (!target || !target.length) {
        resolve(true);
        return;
      }

      const instance = new SetText();

      gsap.set(target, {
        clearProps: 'all'
      });

      target.each(function () {
        const
          $el = $(this),
          $lines = $el.find('.split-text__line'),
          textAlign = $el.css('text-align');

        if (distribute === true) {
          switch (textAlign) {
            case 'left':
              instance._setFromLeft({
                lines: $lines,
                x,
                y
              });
              break;
            case 'center':
              instance._setFromCenter({
                lines: $lines,
                x,
                y
              });
              break;
            case 'right':
              instance._setFromRight({
                lines: $lines,
                x,
                y
              });
              break;
          }
        } else {
          instance._setFromLeft({
            lines: $lines,
            x,
            y
          });
        }
      });

      resolve(true);
    });
  }

  _setFromLeft({
    lines,
    x,
    y
  }) {
    if (!lines || !lines.length) {
      return;
    }

    gsap.set(lines.find('.split-text__char'), {
      x,
      y,
      autoAlpha: 0
    });
  }

  _setFromRight({
    lines,
    x,
    y
  }) {
    if (!lines || !lines.length) {
      return;
    }

    gsap.set(lines.find('.split-text__char'), {
      x: -x,
      y: -y,
      autoAlpha: 0
    });
  }

  _setFromCenter({
    lines,
    x,
    y
  }) {
    const self = this;

    if (!lines || !lines.length) {
      return;
    }

    lines.each(function () {
      const
        $currentLine = $(this),
        $wordsInCurrentLine = $currentLine.find('.split-text__word');

      /**
       * 1. Only 1 word in the current line
       */
      if ($wordsInCurrentLine.length === 1) {
        self._setCharsSingleWord({
          words: $wordsInCurrentLine,
          x,
          y
        });
      }

      /**
       * 2. Even number of words in the current line
       */
      if ($wordsInCurrentLine.length !== 1 && $wordsInCurrentLine.length % 2 === 0) {
        self._setCharsEvenWords({
          words: $wordsInCurrentLine,
          x,
          y
        });
      }

      /**
       * 3. Odd number of words in the current line
       */
      if ($wordsInCurrentLine.length !== 1 && $wordsInCurrentLine.length % 2 !== 0) {
        self._setCharsOddWords({
          words: $wordsInCurrentLine,
          x,
          y
        });
      }
    });
  }

  _setCharsSingleWord({
    words,
    x,
    y
  }) {
    const
      $charsInWord = words.find('.split-text__char'),
      halfWord = Math.ceil($charsInWord.length / 2),
      $fistHalfWord = $charsInWord.slice(0, halfWord),
      $secondHalfWord = $charsInWord.slice(halfWord, $charsInWord.length);

    // first half of word to the left
    gsap.set($fistHalfWord, {
      x: -x,
      y: -y,
      autoAlpha: 0
    });

    // second half of word to the right
    gsap.set($secondHalfWord, {
      x,
      y,
      autoAlpha: 0
    });
  }

  _setCharsOddWords({
    words,
    x,
    y
  }) {
    const
      halfLine = Math.ceil(words.length / 2),
      $fistHalf = words.slice(0, halfLine),
      $secondHalf = words.slice(halfLine, words.length),
      $middleWord = words.eq(halfLine - 1),
      $charsInMiddleWord = $middleWord.find('.split-text__char'),
      halfLineMiddleWord = Math.ceil($charsInMiddleWord.length / 2),
      $fistHalfMiddleWord = $charsInMiddleWord.slice(0, halfLineMiddleWord),
      $secondHalfMiddleWord = $charsInMiddleWord.slice(halfLineMiddleWord, $charsInMiddleWord.length);

    // first half
    $fistHalf.each(function () {
      const $charsInWord = $(this).find('.split-text__char');

      gsap.set($charsInWord, {
        x: -x,
        y: -y,
        autoAlpha: 0
      });
    });

    // second half
    $secondHalf.each(function () {
      const $charsInWord = $(this).find('.split-text__char');

      gsap.set($charsInWord, {
        x,
        y,
        autoAlpha: 0
      });
    });

    // middle word: first half
    $fistHalfMiddleWord.each(function () {
      const $charsInWord = $(this);

      gsap.set($charsInWord, {
        x: -x,
        y: -y,
        autoAlpha: 0
      });
    });

    // middle word: second half
    $secondHalfMiddleWord.each(function () {
      const $charsInWord = $(this);

      gsap.set($charsInWord, {
        x,
        y,
        autoAlpha: 0
      });
    });
  }

  _setCharsEvenWords({
    words,
    x,
    y
  }) {
    const
      halfLine = Math.ceil(words.length / 2),
      $fistHalf = words.slice(0, halfLine),
      $secondHalf = words.slice(halfLine, words.length);

    // first half
    $fistHalf.each(function () {
      const $charsInWord = $(this).find('.split-text__char');

      gsap.set($charsInWord, {
        x: -x,
        y: y,
        autoAlpha: 0
      });
    });

    // second half
    $secondHalf.each(function () {
      const $charsInWord = $(this).find('.split-text__char');

      gsap.set($charsInWord, {
        x: x,
        y: y,
        autoAlpha: 0
      });
    });
  }
}
