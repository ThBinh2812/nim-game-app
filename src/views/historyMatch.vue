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
          @click="emit('goMenu')"
          class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
        >
          Trở về
        </button>
      </div>

      <!-- MATCH LIST -->

      <div v-if="props.matches.length === 0" class="text-center text-gray-400 py-10">
        Lịch sử trống. Hãy chơi một ván để lưu lại lịch sử trận đấu!
      </div>

      <div v-else class="space-y-3 max-h-[400px] overflow-y-auto">
        <div
          v-for="match in props.matches"
          :key="match.id"
          class="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex justify-between items-center"
        >
          <div>
            <p class="font-medium">
              {{ modeMap[match.mode] }} • {{ ruleMap[match.rule] }}
            </p>

            <p class="text-sm text-gray-400">
              Kích thước: {{ sizeMap[match.size] }}
            </p>

            <p v-if="match.mode === 'PVE'" class="text-sm text-gray-400">
              Độ khó: {{ aiMap[match.ai] }}
            </p>

            <p class="text-xs text-gray-500">
              {{ match.date }}
            </p>
          </div>

          <button
            @click="playMatch(match)"
            class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 shadow shadow-blue-500/40"
          >
            Chơi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["goMenu", "loadMatch"]);

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

/*
==================== DEMO DATA ====================

[
  {
    id: 1,
    mode: "PVP",
    rule: "NORMAL",
    size: "MEDIUM",
    ai: "EASY",
    heaps: [3, 5, 7, 2, 6],
    currentPlayer: 1,
    date: "24-03-2026 14:30",
  },
  {
    id: 2,
    mode: "PVE",
    rule: "MISERE",
    size: "SMALL",
    ai: "HARD",
    heaps: [1, 1, 3],
    currentPlayer: 2,
    date: "24-03-2026 15:00",
  }
]

===================================================
*/

function playMatch(match) {
  emit("loadMatch", match);
}
</script>