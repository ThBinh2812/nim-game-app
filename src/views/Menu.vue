<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0b0f1a] to-[#05070d] flex items-center justify-center text-gray-200">

    <div class="w-[520px] bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-2xl overflow-hidden">

      <!-- TITLE -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-semibold tracking-wide">NIM GAME</h1>
        <p class="text-gray-400 text-sm">Trò chơi chiến thuật xóa đá cổ điển</p>
      </div>

      <transition name="slide-fade" mode="out-in">

        <!-- ================= MAIN ================= -->
        <div v-if="step === 'MAIN'" key="main" class="space-y-4">

          <button @click="goPVP" class="menuBtn">
            Người với người
          </button>

          <button @click="goPVE" class="menuBtn">
            Người với máy
          </button>

          <button @click="continueGame" class="menuBtn">
            Chơi tiếp
          </button>

        </div>

        <!-- ================= PVP ================= -->
        <div v-else-if="step === 'PVP'" key="pvp" class="space-y-6">

          <!-- RULE -->
          <div>
            <h2 class="title">LUẬT CHƠI</h2>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <button @click="rule = 'NORMAL'" :class="stoneBtn(rule === 'NORMAL')">Thường</button>
              <button @click="rule = 'MISERE'" :class="stoneBtn(rule === 'MISERE')">Misère</button>
            </div>
          </div>

          <!-- SIZE -->
          <div>
            <h2 class="title">KÍCH THƯỚC MÀN CHƠI</h2>
            <div class="grid grid-cols-3 gap-4 mt-2">
              <button @click="size = 'SMALL'" :class="stoneBtn(size === 'SMALL')">Nhỏ</button>
              <button @click="size = 'MEDIUM'" :class="stoneBtn(size === 'MEDIUM')">Vừa</button>
              <button @click="size = 'LARGE'" :class="stoneBtn(size === 'LARGE')">Lớn</button>
            </div>
          </div>

          <!-- ACTION -->
          <div class="grid grid-cols-2 gap-4 pt-4">
            <button @click="startGame('PVP')" class="menuBtn">Bắt đầu</button>
            <button @click="back" class="menuBtn">Trở lại</button>
          </div>

        </div>

        <!-- ================= PVE ================= -->
        <div v-else key="pve" class="space-y-6">

          <!-- RULE -->
          <div>
            <h2 class="title">LUẬT CHƠI</h2>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <button @click="rule = 'NORMAL'" :class="stoneBtn(rule === 'NORMAL')">Thường</button>
              <button @click="rule = 'MISERE'" :class="stoneBtn(rule === 'MISERE')">Misère</button>
            </div>
          </div>

          <!-- AI -->
          <div>
            <h2 class="title">ĐỘ KHÓ</h2>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <button @click="ai = 'EASY'" :class="stoneBtn(ai === 'EASY')">Dễ</button>
              <button @click="ai = 'HARD'" :class="stoneBtn(ai === 'HARD')">Khó</button>
            </div>
          </div>

          <!-- SIZE -->
          <div>
            <h2 class="title">KÍCH THƯỚC MÀN CHƠI</h2>
            <div class="grid grid-cols-3 gap-4 mt-2">
              <button @click="size = 'SMALL'" :class="stoneBtn(size === 'SMALL')">Nhỏ</button>
              <button @click="size = 'MEDIUM'" :class="stoneBtn(size === 'MEDIUM')">Vừa</button>
              <button @click="size = 'LARGE'" :class="stoneBtn(size === 'LARGE')">Lớn</button>
            </div>
          </div>

          <!-- ACTION -->
          <div class="grid grid-cols-2 gap-4 pt-4">
            <button @click="startGame('PVE')" class="menuBtn">Bắt đầu</button>
            <button @click="back" class="menuBtn">Trở lại</button>
          </div>

        </div>

      </transition>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["startGame", "continueGame"]);

const step = ref("MAIN");
const size = ref("MEDIUM");
const ai = ref("HARD");
const rule = ref("NORMAL");

// NAV
function goPVP() {
  step.value = "PVP";
}

function goPVE() {
  step.value = "PVE";
}

function back() {
  step.value = "MAIN";
}

// ACTION
function startGame(mode) {
  emit("startGame", {
    mode,
    size: size.value,
    ai: ai.value,
    rule: rule.value,
  });
}

function continueGame() {
  emit("continueGame");
}

// STYLE stone
function stoneBtn(active) {
  return `
    py-3 rounded-xl border transition-all duration-200
    ${active
      ? "border-blue-400 bg-blue-500/20 shadow-md shadow-blue-500/30 scale-105"
      : "border-white/20 bg-white/5 hover:bg-blue-500/10 hover:scale-105"}
  `;
}
</script>

<style scoped>
.menuBtn {
  width: 100%;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  transition: all 0.2s;
}

.menuBtn:hover {
  background: rgba(255,255,255,0.1);
  transform: scale(1.05);
}

.menuBtn:active {
  transform: scale(0.95);
}

/* animation */
.slide-fade-enter-active {
  transition: all 0.35s ease;
}
.slide-fade-leave-active {
  transition: all 0.25s ease;
  position: absolute;
  width: 100%;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.title {
  font-size: 12px;
  letter-spacing: 2px;
  color: #9ca3af;
}
</style>