import { createSignal, createEffect, onCleanup } from "solid-js";
import "./index.css";
import JSConfetti from "js-confetti";
import { Toaster, toast } from "solid-toast";

const GRID_SIZE = 3; // 3x3 grid
const GAME_DURATION = 30; // Game duration in seconds
const MOLE_APPEAR_INTERVAL = 700; // Milliseconds
const jsConfetti = new JSConfetti();

export default function App() {
  const [score, setScore] = createSignal(0);
  const [timeLeft, setTimeLeft] = createSignal(GAME_DURATION);
  const [molePosition, setMolePosition] = createSignal(-1);
  const [isGameActive, setIsGameActive] = createSignal(false);

  // High score signal
  const [highScore, setHighScore] = createSignal(
    parseInt(localStorage.getItem("highScore")) || 0,
  );

  let gameInterval;
  let moleInterval;

  // Function to start the game
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsGameActive(true);

    gameInterval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      if (timeLeft() <= 1) endGame();
    }, 1000);

    moleInterval = setInterval(() => {
      setMolePosition(Math.floor(Math.random() * GRID_SIZE * GRID_SIZE));
    }, MOLE_APPEAR_INTERVAL);
  };

  // Function to end the game
  const endGame = () => {
    setIsGameActive(false);
    clearInterval(gameInterval);
    clearInterval(moleInterval);
    setMolePosition(-1); // Hide the mole
    setTimeLeft(0);

    // Updating high score if current score is higher
    if (score() > highScore()) {
      jsConfetti.addConfetti();
      toast("Новый Рекорд!", {
        className: "font-bold text-xl",
        style: {
          background: "#e4e4e7",
          color: "#18181b",
        },
        icon: "🎉",
        position: "top-right",
      });
      setHighScore(score());
      localStorage.setItem("highScore", score());
    }
  };

  // Function to handle a mole hit
  const whacMole = (position) => {
    if (position === molePosition() && isGameActive()) {
      setScore(score() + 1);
      setMolePosition(-1); // Hide mole immediately after hit
    }
  };

  // Clean up intervals on component unmount
  onCleanup(() => {
    clearInterval(gameInterval);
    clearInterval(moleInterval);
  });

  return (
    <div class="bg-slate-50 font-display flex flex-col items-center justify-center min-h-screen bg-zinc-900">
      <Toaster />
      <h1 class="text-3xl text-zinc-200 font-bold mb-4">Убей вирус 💻 </h1>

      <div class="flex-col gap-4 mb-4">
        <div class="p-4 border rounded border-zinc-200 mb-4 text-zinc-200 font-bold">
          <p>Время: {timeLeft()} сек</p>
          <hr class="mt-1 mb-1" />
          <p>Очки: {score()}</p>
          <p>Рекорд: {highScore()}</p>
        </div>

        <div class="flex gap-4">
          <button
            class="text-zinc-900 font-bold px-4 py-2 bg-emerald-400 text-zinc-100 rounded mb-4"
            onClick={startGame}
            disabled={isGameActive()}
          >
            Начать
          </button>

          <button
            class="border border-rose-400 hover:text-zinc-900 hover:bg-rose-400 font-bold px-4 py-2 bg-transparent text-rose-400 rounded mb-4"
            onClick={endGame}
            disabled={!isGameActive()}
          >
            Сброс
          </button>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
          <div
            key={index}
            onClick={() => whacMole(index)}
            class={`w-24 h-24 flex items-center justify-center cursor-pointer rounded text-4xl
              ${molePosition() === index ? "bg-purple-200" : "bg-zinc-600 hover:bg-zinc-500"}
            `}
          >
            {molePosition() === index && "👾"}
          </div>
        ))}
      </div>
    </div>
  );
}
