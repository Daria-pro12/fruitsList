// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector(".fruits__list"); // список карточек
const shuffleButton = document.querySelector(".shuffle__btn"); // кнопка перемешивания
const filterButton = document.querySelector(".filter__btn"); // кнопка фильтрации
const sortKindLabel = document.querySelector(".sort__kind"); // поле с названием сортировки
const sortTimeLabel = document.querySelector(".sort__time"); // поле с временем сортировки
const sortChangeButton = document.querySelector(".sort__change__btn"); // кнопка смены сортировки
const sortActionButton = document.querySelector(".sort__action__btn"); // кнопка сортировки
const kindInput = document.querySelector(".kind__input"); // поле с названием вида
const colorInput = document.querySelector(".color__input"); // поле с названием цвета
const weightInput = document.querySelector(".weight__input"); // поле с весом
const addActionButton = document.querySelector(".add__action__btn"); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/
// отрисовка карточек
const display = () => {
  // очищаем fruitsList от вложенных элементов, чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML = "";
  for (let i = 0; i < fruits.length; i++) {
    // формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    const li = document.createElement("li");
    li.classList.add("fruit__item");
    if (fruits[i].color == "фиолетовый") {
      li.classList.add("fruit_violet");
    }
    if (fruits[i].color == "зеленый") {
      li.classList.add("fruit_green");
    }
    if (fruits[i].color == "розово-красный") {
      li.classList.add("fruit_carmazin");
    }
    if (fruits[i].color == "желтый") {
      li.classList.add("fruit_yellow");
    }
    if (fruits[i].color == "светло-коричневый") {
      li.classList.add("fruit_lightbrown");
    }
    fruitsList.appendChild(li);

    const div = document.createElement("div");
    div.classList.add("fruit__info");
    li.appendChild(div);

    div.innerHTML = `<div>Индекс: ${i}</div>
      <div>Фрукт: ${fruits[i].kind}</div>
      <div>Цвет: ${fruits[i].color}</div>
      <div>Вес (кг): ${fruits[i].weight}</div>`;
  }
};
display(fruits);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Перемешивание массива
const shuffleFruits = () => {
  let result = [];
  let restFruits = [...fruits];
  while (fruits.length > 0) {
    let randomFruits = getRandomInt(0, fruits.length - 1); // случайный элемент из fruits
    result.push(fruits[randomFruits]); // вставляем случайный элемент из fruits в result
    fruits.splice(randomFruits, 1); // вырезаем случайный элемент из fruits
  }
  fruits = result;
  // Проверка на совпадение при перемешивании
  let notShuffled = fruits.every((el, index) => el === restFruits[index]);
  if (notShuffled) {
    alert("Порядок не изменен! Перемешайте ещё раз");
  }
};

shuffleButton.addEventListener("click", () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
function filterFruits(result) {
  let minWeight = document.querySelector(".minweight__input");
  let maxWeight = document.querySelector(".maxweight__input");
  if (minWeight.value === "" || maxWeight.value === "") {
    alert("Введите минимальное и максимальное значения для фильтрации");
    return fruits;
  } else {
    if (isNaN(minWeight.value) || isNaN(maxWeight.value)) {
      minWeight.value = " ";
      maxWeight.value = " ";
      alert("Укажите числовые значения для фильтрации");
      return fruits;
    } else {
      fruits = result.filter(
        (item) =>
          item.weight >= minWeight.value && item.weight <= maxWeight.value
      );
    }
  }
}

filterButton.addEventListener("click", () => {
  filterFruits(fruits);
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = "bubbleSort"; // инициализация состояния вида сортировки
let sortTime = "-"; // инициализация состояния времени сортировки

// функция сравнения двух элементов по цвету
const comparationColor = (a, b) => {
  const priority = [
    "розово-красный",
    "желтый",
    "зеленый",
    "фиолетовый",
    "светло-коричневый",
  ];
  return priority.indexOf(a.color) > priority.indexOf(b.color);
};

function bubbleSort() {
  const n = fruits.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (comparationColor(fruits[j], fruits[j + 1])) {
        let temp = fruits[j + 1];
        fruits[j + 1] = fruits[j];
        fruits[j] = temp;
      }
    }
  }
}

// функция обмена элементов
function swap(firstIndex, secondIndex) {
  const temp = fruits[firstIndex];
  fruits[firstIndex] = fruits[secondIndex];
  fruits[secondIndex] = temp;
}

// функция разделитель
function partition(left, right) {
  let pivot = fruits[Math.floor((right + left) / 2)],
    i = left,
    j = right;
  while (i <= j) {
    while (fruits[i] < pivot) {
      i++;
    }
    while (fruits[j] > pivot) {
      j--;
    }
    if (i <= j) {
      swap(i, j);
      i++;
      j--;
    }
  }
  return i;
}

// алгоритм быстрой сортировки
function quickSort(left, right) {
  let index;
  if (fruits.length > 1) {
    left = typeof left != "number" ? 0 : left;
    right = typeof right != "number" ? fruits.length - 1 : right;
    index = partition(left, right);
    if (left < index - 1) {
      quickSort(left, index - 1);
    }
    if (index < right) {
      quickSort(index, right);
    }
  }
  return fruits;
}

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener("click", () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  sortKindLabel.textContent == "bubbleSort"
    ? (sortKindLabel.textContent = "quickSort")
    : (sortKindLabel.textContent = "bubbleSort");
});

sortActionButton.addEventListener("click", () => {
  const start = new Date().getTime();
  sortKindLabel.textContent == "bubbleSort" ? bubbleSort(fruits) : quickSort();
  const end = new Date().getTime();
  sortTimeLabel.textContent = `${end - start} ms`;
  display(fruits);
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener("click", () => {
  // создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  if (
    kindInput.value === "" ||
    colorInput.value === "" ||
    weightInput.value === ""
  ) {
    alert("Для добавления фрукта, заполните все поля");
  } else {
    if (isNaN(weightInput.value)) {
      alert("Вес должен быть указан числом");
      weightInput.value = "";
    } else {
      fruits.push({
        kind: kindInput.value,
        color: colorInput.value,
        weight: weightInput.value,
      });
      display();
      // oчищаем поля после добавления
      kindInput.value = "";
      colorInput.value = "";
      weightInput.value = "";
    }
  }
});