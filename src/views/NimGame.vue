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

        <!-- Người chơi -->
        <div class="space-y-2">
          <PlayerCard
            :name="
              props.gameMode === 'PVP' ? 'Người chơi 1' : 'Người chơi (Bạn)'
            "
            :status="currentPlayer === 1 ? 'ĐANG CHƠI' : 'CHỜ ĐẾN LƯỢT'"
            :active="currentPlayer === 1"
          />

          <PlayerCard
            :name="props.gameMode === 'PVP' ? 'Người chơi 2' : 'MÁY (AI)'"
            :status="currentPlayer === 2 ? 'ĐANG CHƠI' : 'CHỜ ĐẾN LƯỢT'"
            :active="currentPlayer === 2"
          />
        </div>

        <!-- Hướng dẫn -->
        <div class="mt-2">
          <Instructor :gameRules="props.gameRules" />
        </div>

        <!-- Log nước đi -->
        <div class="mt-4">
          <div class="bg-white/5 border border-white/10 rounded-xl p-3">
            <h3 class="text-xs text-gray-400 mb-2 tracking-wider">
              LỊCH SỬ NƯỚC ĐI
            </h3>

            <div
              class="log-scroll max-h-60 overflow-y-auto text-xs space-y-1 pr-2"
            >
              <div
                v-for="(log, i) in moveLogs"
                :key="i"
                :class="[
                  'transition-all',
                  i === 0
                    ? 'text-white font-medium'
                    : 'text-gray-400 opacity-70',
                ]"
              >
                <span
                  :class="
                    log.player === 1 ? 'text-blue-400' : 'text-purple-400'
                  "
                >
                  {{ getPlayerName(log.player) }}
                </span>

                lấy {{ log.removeCount }} viên từ đống
                {{ String.fromCharCode(65 + log.heapIndex) }}
              </div>
            </div>
          </div>
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
              selectedMove?.heapIndex === i
                ? selectedMove.removeCount
                : aiMove?.heapIndex === i
                  ? aiMove.removeCount
                  : 0
            "
            :isAI="aiMove?.heapIndex === i"
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

    <transition name="popup-fade">
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
    </transition>

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
            Không
          </button>

          <button
            @click="showExitConfirm = false"
            class="px-5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
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
const emit = defineEmits(["goMenu", "saveMatch", "removeFinishedMatch"]);
const removedOnFinish = ref(false);
const aiMove = ref(null);
const winner = ref(null);
const moveLogs = ref([]);
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
  matchData: {
    type: Object,
    default: null,
  },
});

// Nếu có matchData từ lịch sử thì dùng nó, nếu không thì tạo mới
function createHeaps(size) {
  const getRandom = () => Math.floor(Math.random() * 10) + 1;
  if (size === "SMALL") return Array.from({ length: 3 }, getRandom);
  if (size === "MEDIUM") return Array.from({ length: 5 }, getRandom);
  if (size === "LARGE") return Array.from({ length: 10 }, getRandom);
}

const heaps = ref(
  props.matchData?.heaps
    ? [...props.matchData.heaps]
    : createHeaps(props.gameSize),
);

watch(
  () => props.gameSize,
  (newSize) => {
    if (props.matchData) return;

    heaps.value = createHeaps(newSize);
    selectedMove.value = null;
    currentPlayer.value = 1;
    winner.value = null;
  },
);

// Nếu load ván đã lưu thì cập nhật lại trạng thái game theo matchData
watch(
  () => props.matchData,
  (match) => {
    if (!match) return;

    heaps.value = [...match.heaps];
    currentPlayer.value = match.currentPlayer;
    winner.value = null;
    selectedMove.value = null;
    hasMove.value = false;

    if (props.gameMode === "PVE" && currentPlayer.value === 2) {
      setTimeout(() => {
        endTurn();
      }, 500);
    }
  },
);

// Nếu có winner thì xóa ván game đó khỏi lịch sử (nếu đang chơi ván đã lưu)
watch(
  () => winner.value,
  (newWinner) => {
    if (!newWinner) return;
    if (removedOnFinish.value) return;

    const loadedMatchId = props.matchData?.id;
    if (loadedMatchId) {
      emit("removeFinishedMatch", loadedMatchId);
      removedOnFinish.value = true;
    }
  },
);

watch(
  () => props.matchData,
  () => {
    removedOnFinish.value = false;
  },
);

const selectedMove = ref(null);
const showExitConfirm = ref(false);
const hasMove = ref(false);

/*
Player 1 = 1
Player 2 = AI = 2
*/
const currentPlayer = ref(props.matchData?.currentPlayer || 1);

/****************** GAME LOGIC ******************/

function getPlayerName(player) {
  if (props.gameMode === "PVP") {
    return player === 1 ? "Người chơi 1" : "Người chơi 2";
  }
  return player === 1 ? "Bạn" : "AI";
}

function playerMove({ heapIndex, removeCount }) {
  if (winner.value) return;

  if (props.gameMode === "PVE" && currentPlayer.value !== 1) return;

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
  if (props.gameRules === "NORMAL") {
    result = playerEndTurnNormal(
      heaps.value,
      selectedMove.value,
      currentPlayer.value,
    );
  }

  // MISERE
  if (props.gameRules === "MISERE") {
    result = playerEndTurnMisere(
      heaps.value,
      selectedMove.value,
      currentPlayer.value,
    );
  }

  if (!result) return;

  heaps.value = result.heaps;

  moveLogs.value.unshift({
    player: currentPlayer.value,
    heapIndex: selectedMove.value.heapIndex,
    removeCount: selectedMove.value.removeCount,
  });

  winner.value = result.winner;

  currentPlayer.value = result.currentPlayer;

  selectedMove.value = null;

  hasMove.value = true;

  // AI TURN
  if (props.gameMode === "PVE" && currentPlayer.value === 2) {
    setTimeout(() => {
      let aiResult = null;

      // NORMAL
      if (props.gameRules === "NORMAL") {
        if (props.gameAI === "EASY")
          aiResult = aiMoveTurnNormalEasy(heaps.value);

        if (props.gameAI === "HARD")
          aiResult = aiMoveTurnNormalHard(heaps.value);
      }

      // MISERE
      if (props.gameRules === "MISERE") {
        if (props.gameAI === "EASY")
          aiResult = aiMoveTurnMisereEasy(heaps.value);

        if (props.gameAI === "HARD")
          aiResult = aiMoveTurnMisereHard(heaps.value);
      }

      if (!aiResult) return;

      aiMove.value = {
        heapIndex: aiResult.heapIndex,
        removeCount: aiResult.removeCount,
      };

      moveLogs.value.unshift({
        player: 2,
        heapIndex: aiResult.heapIndex,
        removeCount: aiResult.removeCount,
      });

      setTimeout(() => {
        heaps.value = aiResult.heaps;
        winner.value = aiResult.winner;
        currentPlayer.value = aiResult.currentPlayer;

        aiMove.value = null;
      }, 1000);

      // heaps.value = aiResult.heaps;

      // winner.value = aiResult.winner;

      // currentPlayer.value = aiResult.currentPlayer;
    }, 800);
  }
}

function resetGame() {
  heaps.value = createHeaps(props.gameSize);

  selectedMove.value = null;

  currentPlayer.value = 1;

  winner.value = null;

  hasMove.value = false;

  moveLogs.value = [];
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
  const match = {
    id: props.matchData?.id ?? Date.now() + Math.floor(Math.random() * 1000),
    mode: props.gameMode,
    size: props.gameSize,
    rule: props.gameRules,
    ai: props.gameAI,
    heaps: [...heaps.value],
    currentPlayer: currentPlayer.value,
    date: new Date().toLocaleString(),
  };

  showExitConfirm.value = false;
  emit("saveMatch", match);
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

/* Winner pop-up style */
.popup-fade-enter-active {
  transition: all 0.35s ease;
}

.popup-fade-leave-active {
  transition: all 0.25s ease;
}

.popup-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.popup-fade-enter-to {
  opacity: 1;
  transform: scale(1);
}

.popup-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Bảng log */
.log-scroll::-webkit-scrollbar {
  width: 4px;
}

.log-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.log-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 999px;
}

.log-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.35);
}

.log-scroll div {
  transition: all 0.2s ease;
}
</style>
