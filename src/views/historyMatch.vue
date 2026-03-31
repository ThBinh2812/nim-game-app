<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0b0f1a] to-[#05070d] text-gray-200 flex items-center justify-center"
  >
    <div
      class="w-[650px] bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl"
    >
      <!-- HEADER -->

      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold">Lịch Sử</h1>

        <button
          @click="{ playMenuClick() ;emit('goMenu'); }"
          class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
        >
          Trở về
        </button>
      </div>

      <!-- MATCH LIST -->

      <div
        v-if="props.matches.length === 0"
        class="text-center text-gray-400 py-10"
      >
        Lịch sử trống. Hãy chơi một ván để lưu lại lịch sử trận đấu!
      </div>
      
      <div v-else class="space-y-3 max-h-[400px] overflow-y-auto log-scroll">
        <div
          v-for="match in props.matches"
          :key="match.id"
          class="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex justify-between items-center"
        >
          <!-- LEFT -->
          <div>
            <p class="font-medium">
              {{ modeMap[match.mode] }} • {{ ruleMap[match.rule] }}
            </p>

            <p class="text-sm text-gray-400">
              Màn chơi: {{ sizeMap[match.size] }}
            </p>

            <p v-if="match.mode === 'PVE'" class="text-sm text-gray-400">
              Độ khó: {{ aiMap[match.ai] }}
            </p>

            <p class="text-xs text-gray-500">
              {{ match.date }}
            </p>
          </div>

          <!-- RIGHT -->
          <div class="flex gap-2">
            <button
              @click="playMatch(match)"
              class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 shadow shadow-blue-500/40"
            >
              Chơi
            </button>

            <button
              @click="openDeleteConfirm(match.id)"
              class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 shadow shadow-red-500/40"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="showDeleteConfirm"
    class="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
  >
    <div
      class="bg-[#111827] text-white p-8 rounded-xl border border-white/10 text-center space-y-5 w-80 shadow-2xl"
    >
      <h2 class="text-xl font-semibold">Xóa ván game?</h2>

      <p class="text-gray-300 text-sm">
        Ván game này sẽ bị xóa khỏi lịch sử và không thể khôi phục.
      </p>

      <div class="flex gap-3 justify-center">
        <button
          @click="confirmDelete"
          class="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500"
        >
          Xóa
        </button>

        <button
          @click="cancelDelete"
          class="px-5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-200"
        >
          Hủy
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { playMenuClick } from "../store/gameSound";

const emit = defineEmits(["goMenu", "loadMatch", "deleteMatch"]);
const showDeleteConfirm = ref(false);
const pendingDeleteId = ref(null);
const props = defineProps({
  matches: {
    type: Array,
    default: () => [],
  },
});

const modeMap = {
  PVP: "Người vs Người",
  PVE: "Người vs Máy",
};

const ruleMap = {
  NORMAL: "Thường",
  MISERE: "Misère",
};

const sizeMap = {
  SMALL: "Nhỏ",
  MEDIUM: "Vừa",
  LARGE: "Lớn",
};

const aiMap = {
  EASY: "Dễ",
  HARD: "Khó",
};

function playMatch(match) {
  playMenuClick();
  emit("loadMatch", match);
}

// function deleteMatch(matchId) {
//   emit("deleteMatch", matchId);
// }

function openDeleteConfirm(matchId) {
  playMenuClick();
  pendingDeleteId.value = matchId;
  showDeleteConfirm.value = true;
}
function cancelDelete() {
  playMenuClick();
  showDeleteConfirm.value = false;
  pendingDeleteId.value = null;
}
function confirmDelete() {
  if (pendingDeleteId.value != null) {
    playMenuClick();
    emit("deleteMatch", pendingDeleteId.value);
  }
  cancelDelete();
}
</script>
<style>
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