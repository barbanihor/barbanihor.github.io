async function fetchFragments() {
  const response = await fetch("fragments.txt");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const text = await response.text();
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function longestPuzzleSequence(fragments) {
  const n = fragments.length;
  const dp = new Array(n).fill(0); // Массив для зберігання довжини найдовшої послідовності для кожного фрагмента
  const prev = new Array(n).fill(-1); // Массив для відстеження попереднього фрагмента в послідовності

  // Ініціалізуємо dp значеннями довжини фрагментів
  for (let i = 0; i < n; i++) {
    dp[i] = fragments[i].length;
  }

  let maxLength = 0;
  let maxIndex = -1;

  // Заповнюємо dp масив
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (canAppend(fragments[j], fragments[i])) {
        if (dp[j] + fragments[i].length > dp[i]) {
          dp[i] = dp[j] + fragments[i].length;
          prev[i] = j; // Запам'ятовуємо попередній фрагмент
        }
      }
    }
    // Оновлюємо максимальну довжину та індекс
    if (dp[i] > maxLength) {
      maxLength = dp[i];
      maxIndex = i;
    }
  }

  // Відтворюємо найдовшу послідовність
  let sequence = "";
  while (maxIndex !== -1) {
    sequence = fragments[maxIndex] + (sequence ? " " + sequence : "");
    maxIndex = prev[maxIndex];
  }

  return sequence;
}

function removeFirstTwoDigitsAfterSpace(input) {
  // Використовуємо регулярний вираз для видалення перших двох цифр після пробілу
  const modifiedString = input.replace(/(?<=\s)\d{2}/g, "");

  // Видаляємо всі пробіли
  const result = modifiedString.replace(/\s+/g, "");

  return result;
}

// Допоміжна функція для перевірки можливості приєднання фрагментів
const canAppend = (current, next) => {
  return current.slice(-2) === next.slice(0, 2);
};

const main = async () => {
  const numbers = await fetchFragments();
  const notPuzzled = longestPuzzleSequence(numbers);
  const puzzledResult = removeFirstTwoDigitsAfterSpace(notPuzzled);

  const puzzle = document.getElementById("puzzle");
  if (puzzle) {
    puzzle.textContent = puzzledResult;
  }
};

main();
