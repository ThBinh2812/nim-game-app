<template>
  <div
    class="h-screen overflow-hidden bg-gradient-to-br from-[#0b0f1a] to-[#05070d] text-gray-200 flex"
  >
    <!-- LEFT PANEL -->
    <aside class="w-72 border-r border-white/10 p-4 flex flex-col gap-6">
      <div>
        <h2 class="text-xs tracking-widest text-gray-400 mb-3">
          VÁN ĐẤU HIỆN TẠI
        </h2>

        <div class="space-y-2">
          <PlayerCard
            :name="props.gameMode === 'PVP' ? 'Người chơi 1' : 'Người chơi (Bạn)'"
            :status="currentPlayer === 1 ? 'ĐANG CHƠI' : 'CHỜ ĐẾN LƯỢT'"
            :active="currentPlayer === 1"
          />

          <PlayerCard
            :name="props.gameMode === 'PVP' ? 'Người chơi 2' : 'MÁY (AI)'"
            :status="currentPlayer === 2 ? 'ĐANG CHƠI' : 'CHỜ ĐẾN LƯỢT'"
            :active="currentPlayer === 2"
          />
        </div>
        <div class="mt-2">
          <Instructor :gameRules="gameRules" />
        </div>
      </div>
    </aside>

    <!-- CENTER -->
    <main class="flex-1 flex flex-col overflow-hidden relative">
      <!-- HEADER -->
      <div class="text-center pt-6">
        <h1 class="text-2xl font-semibold">Chọn đống đá</h1>

        <p class="text-gray-400 text-sm mt-2">
          Chọn một số viên đá (từ trái sang phải) trong một đống bất kỳ.
        </p>
      </div>

      <!-- PILES AREA -->
      <div class="flex-1 flex items-center justify-center overflow-hidden px-6">
        <TransitionGroup
          name="pile"
          tag="div"
          class="flex flex-wrap justify-center gap-5 max-w-full"
        >
          <Pile
            v-for="(pile, i) in heaps"
            :key="i"
            :label="'Đống ' + String.fromCharCode(65 + i)"
            :count="pile"
            :index="i"
            :selected="
              selectedMove?.heapIndex === i ? selectedMove.removeCount : 0
            "
            @remove="playerMove"
          />
        </TransitionGroup>
      </div>

      <!-- BUTTONS (ALWAYS VISIBLE) -->
      <div class="pb-6 flex gap-4 justify-center">
        <button
          @click="endTurn"
          class="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          Kết thúc lượt
        </button>

        <button
          @click="resetGame"
          class="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
        >
          Chơi lại
        </button>

        <button
          @click="tryGoMenu"
          class="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/30"
        >
          Về Menu
        </button>
      </div>
    </main>

    <!-- WINNER POPUP -->

    <div
      v-if="winner"
      class="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div
        class="bg-[#111827] p-8 rounded-xl border border-white/10 text-center space-y-5 w-80 shadow-2xl"
      >
        <h2 class="text-2xl font-semibold">
          {{
            props.gameMode === "PVE"
              ? winner === 1
                ? "Bạn thắng!"
                : "Máy thắng!"
              : winner === 1
                ? "Người chơi 1 thắng!"
                : "Người chơi 2 thắng!"
          }}
        </h2>

        <p class="text-gray-400 text-sm">Trò chơi kết thúc</p>

        <div class="flex gap-3 justify-center">
          <button
            @click="resetGame"
            class="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500"
          >
            Chơi lại
          </button>

          <button
            @click="$emit('goMenu')"
            class="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
          >
            Về Menu
          </button>
        </div>
      </div>
    </div>

    <!-- EXIT CONFIRM POPUP -->

    <div
      v-if="showExitConfirm"
      class="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div
        class="bg-[#111827] p-8 rounded-xl border border-white/10 text-center space-y-5 w-80 shadow-2xl"
      >
        <h2 class="text-xl font-semibold">Thoát trò chơi?</h2>

        <p class="text-gray-400 text-sm">
          Bạn có muốn lưu ván chơi trước khi thoát không?
        </p>

        <div class="flex gap-3 justify-center">
          <button
            @click="saveAndExit"
            class="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
          >
            Lưu
          </button>

          <button
            @click="exitWithoutSave"
            class="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500"
          >
            Không Lưu
          </button>

          <button
            @click="showExitConfirm = false"
            class="px-5 py-2 rounded-lg bg-white/5 border border-white/10"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PlayerCard from "@/components/PlayerCard.vue";
import Instructor from "@/components/Instructor.vue";
import Pile from "@/components/Pile.vue";
import {
  playerEndTurnNormal,
  aiMoveTurnNormalEasy,
  aiMoveTurnNormalHard,
  playerEndTurnMisere,
  aiMoveTurnMisereEasy,
  aiMoveTurnMisereHard,
} from "@/store/startGame.js";
import { watch } from "vue";

/* GAME STATE */
const emit = defineEmits(["goMenu"]);
const props = defineProps({
  gameSize: {
    type: String,
  },
  gameMode: {
    type: String,
  },
  gameRules: {
    type: String,
  },
  gameAI: {
    type: String,
  },
});

const heaps = ref(createHeaps(props.gameSize));

const gameMode = props.gameMode;
const gameRules = props.gameRules;
const gameAI = props.gameAI;

watch(
  () => props.gameSize,
  (newSize) => {
    heaps.value = createHeaps(newSize);
    selectedMove.value = null;
    currentPlayer.value = 1;
    winner.value = null;
  },
);

const selectedMove = ref(null);
const showExitConfirm = ref(false);
const hasMove = ref(false);

/*
Player 1 = 1
Player 2 = AI = 2
*/

const currentPlayer = ref(1);

const winner = ref(null);

function createHeaps(size) {
  const getRandom = () => Math.floor(Math.random() * 10) + 1;
  if (size === "SMALL") return Array.from({ length: 3 }, getRandom);
  if (size === "MEDIUM") return Array.from({ length: 5 }, getRandom);
  if (size === "LARGE") return Array.from({ length: 10 }, getRandom);
}

/****************** GAME LOGIC ******************/

function playerMove({ heapIndex, removeCount }) {
  if (winner.value) return;

  if (gameMode === "PVE" && currentPlayer.value !== 1) return;

  selectedMove.value = {
    heapIndex,
    removeCount,
  };
}

/* Main Logic */
function endTurn() {
  if (winner.value) return;

  let result = null;

  // NORMAL
  if (gameRules === "NORMAL") {
    result = playerEndTurnNormal(
      heaps.value,
      selectedMove.value,
      currentPlayer.value,
    );
  }

  // MISERE
  if (gameRules === "MISERE") {
    result = playerEndTurnMisere(
      heaps.value,
      selectedMove.value,
      currentPlayer.value,
    );
  }

  if (!result) return;

  heaps.value = result.heaps;

  winner.value = result.winner;

  currentPlayer.value = result.currentPlayer;

  selectedMove.value = null;

  hasMove.value = true;

  // AI TURN
  if (gameMode === "PVE" && currentPlayer.value === 2) {
    setTimeout(() => {
      let aiResult = null;

      // NORMAL
      if (gameRules === "NORMAL") {
        if (gameAI === "EASY") aiResult = aiMoveTurnNormalEasy(heaps.value);

        if (gameAI === "HARD") aiResult = aiMoveTurnNormalHard(heaps.value);
      }

      // MISERE
      if (gameRules === "MISERE") {
        if (gameAI === "EASY") aiResult = aiMoveTurnMisereEasy(heaps.value);

        if (gameAI === "HARD") aiResult = aiMoveTurnMisereHard(heaps.value);
      }

      if (!aiResult) return;

      heaps.value = aiResult.heaps;

      winner.value = aiResult.winner;

      currentPlayer.value = aiResult.currentPlayer;
    }, 1000);
  }
}

function resetGame() {
  heaps.value = createHeaps(props.gameSize);

  selectedMove.value = null;

  currentPlayer.value = 1;

  winner.value = null;

  hasMove.value = false;
}

function tryGoMenu() {
  if (winner.value) {
    emit("goMenu");
    return;
  }

  // nếu chưa có move
  if (!hasMove.value) {
    emit("goMenu");
    return;
  }

  // đã chơi rồi -> hỏi save
  showExitConfirm.value = true;
}

function saveAndExit() {
  // TODO: Xử lý save game vào lịch sử
  emit("goMenu");
}

function exitWithoutSave() {
  emit("goMenu");
}
</script>

<style scoped>
.pile-enter-active,
.pile-leave-active {
  transition: all 0.35s ease;
}

.pile-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.pile-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
}
</style>
