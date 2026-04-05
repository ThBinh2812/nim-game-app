<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0b0f1a] to-[#05070d] flex items-center justify-center text-gray-200"
    :style="{ backgroundImage: `url(${nimBG3})` }"
  >
    <div
      class="w-[520px] relative bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-2xl overflow-hidden"
    >
      <!-- ICON SETTINGS -->
      <img
        src="@/assets/settingIcon.jpg"
        class="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/20 bg-white/5 p-1 backdrop-blur hover:rotate-90 hover:scale-110 transition duration-300"
        @click="goSetting"
      />

      <!-- TITLE -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-semibold tracking-wide">NIM GAME</h1>
        <p class="text-gray-400 text-sm">Trò chơi chiến thuật xóa đá cổ điển</p>
      </div>

      <transition name="slide-fade" mode="out-in">
        <!-- ================= MAIN ================= -->
        <div v-if="step === 'MAIN'" key="main" class="space-y-4">
          <button @click="goPVP" class="menuBtn pvpBtn">Người vs Người</button>

          <button @click="goPVE" class="menuBtn pveBtn">Người vs Máy</button>

          <button @click="continueGame" class="menuBtn">Chơi tiếp</button>
        </div>

        <!-- ================= PVP ================= -->
        <div v-else-if="step === 'PVP'" key="pvp" class="space-y-6">
          <!-- RULE -->
          <div>
            <h2 class="title">LUẬT CHƠI</h2>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <button
                @click="selectOption(() => (rule = 'NORMAL'))"
                :class="stoneBtn(rule === 'NORMAL')"
              >
                Thường
              </button>
              <button
                @click="selectOption(() => (rule = 'MISERE'))"
                :class="stoneBtn(rule === 'MISERE')"
              >
                Misère
              </button>
            </div>
          </div>

          <!-- SIZE -->
          <div>
            <h2 class="title">KÍCH THƯỚC MÀN CHƠI</h2>
            <div class="grid grid-cols-3 gap-4 mt-2">
              <button
                @click="selectOption(() => (size = 'SMALL'))"
                :class="stoneBtn(size === 'SMALL')"
              >
                Nhỏ
              </button>
              <button
                @click="selectOption(() => (size = 'MEDIUM'))"
                :class="stoneBtn(size === 'MEDIUM')"
              >
                Vừa
              </button>
              <button
                @click="selectOption(() => (size = 'LARGE'))"
                :class="stoneBtn(size === 'LARGE')"
              >
                Lớn
              </button>
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
              <button
                @click="selectOption(() => (rule = 'NORMAL'))"
                :class="stoneBtn(rule === 'NORMAL')"
              >
                Thường
              </button>
              <button
                @click="selectOption(() => (rule = 'MISERE'))"
                :class="stoneBtn(rule === 'MISERE')"
              >
                Misère
              </button>
            </div>
          </div>

          <!-- AI -->
          <div>
            <h2 class="title">ĐỘ KHÓ</h2>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <button
                @click="selectOption(() => (ai = 'EASY'))"
                :class="stoneBtn(ai === 'EASY')"
              >
                Dễ
              </button>
              <button
                @click="selectOption(() => (ai = 'HARD'))"
                :class="stoneBtn(ai === 'HARD')"
              >
                Khó
              </button>
            </div>
          </div>

          <!-- SIZE -->
          <div>
            <h2 class="title">KÍCH THƯỚC MÀN CHƠI</h2>
            <div class="grid grid-cols-3 gap-4 mt-2">
              <button
                @click="selectOption(() => (size = 'SMALL'))"
                :class="stoneBtn(size === 'SMALL')"
              >
                Nhỏ
              </button>
              <button
                @click="selectOption(() => (size = 'MEDIUM'))"
                :class="stoneBtn(size === 'MEDIUM')"
              >
                Vừa
              </button>
              <button
                @click="selectOption(() => (size = 'LARGE'))"
                :class="stoneBtn(size === 'LARGE')"
              >
                Lớn
              </button>
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
import { ref, onMounted } from "vue";
import { playMenuClick, playBGM } from "../store/gameSound";
import nimBG3 from "@/assets/nimBG3.avif";

onMounted(() => {
  playBGM();
});

function playClick() {
  playMenuClick();
}

function selectOption(setter) {
  playClick();
  setter();
}

const emit = defineEmits(["startGame", "continueGame", "goSetting"]);

const step = ref("MAIN");
const size = ref("");
const ai = ref("");
const rule = ref("");

// NAV
function goPVP() {
  playClick();
  step.value = "PVP";
}

function goPVE() {
  playClick();
  step.value = "PVE";
}

function back() {
  playClick();
  step.value = "MAIN";
}

function goSetting() {
  playClick();
  emit("goSetting");
}

// ACTION
function startGame(mode) {
  playClick();
  emit("startGame", {
    mode,
    size: size.value,
    ai: ai.value,
    rule: rule.value,
  });
}

function continueGame() {
  playClick();
  emit("continueGame");
}

// STYLE stone
function stoneBtn(active) {
  return `
    py-3 rounded-xl border transition-all duration-200
    ${
      active
        ? "border-blue-400 bg-blue-500/20 shadow-md shadow-blue-500/30 scale-105"
        : "border-white/20 bg-white/5 hover:bg-blue-500/10 hover:scale-105"
    }
  `;
}
</script>

<style scoped>
.menuBtn {
  width: 100%;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.2s;
}

.menuBtn:hover {
  background: rgba(255, 255, 255, 0.1);
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

/* PVP - xanh */
.pvpBtn {
  border: 1px solid rgba(59, 130, 246, 0.4);
  background: rgba(59, 130, 246, 0.15);
  color: #bfdbfe;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.25);
}

.pvpBtn:hover {
  background: rgba(59, 130, 246, 0.25);
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.4);
}

/* PVE - tím */
.pveBtn {
  border: 1px solid rgba(168, 85, 247, 0.4);
  background: rgba(168, 85, 247, 0.15);
  color: #e9d5ff;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.25);
}

.pveBtn:hover {
  background: rgba(168, 85, 247, 0.25);
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(168, 85, 247, 0.4);
}
</style>
