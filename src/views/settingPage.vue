<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f1a] to-[#05070d] text-gray-200"
  >
    <div
      class="w-[420px] bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6"
    >
      <h1 class="text-xl font-semibold text-center">CÀI ĐẶT ÂM THANH</h1>

      <!-- BGM Volume -->
      <div>
        <p class="text-sm mb-2 text-gray-400">Nhạc nền:</p>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="bgmVolume"
          @input="updateBGM"
          class="w-full volume-slider"
          :style="getSliderStyle(bgmVolume)"
        />
        <p class="text-xs text-right">{{ Math.round(bgmVolume * 100) }}%</p>
      </div>

      <!-- SFX Volume -->
      <div>
        <p class="text-sm mb-2 text-gray-400">Hiệu ứng (SFX):</p>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="sfxVolume"
          @input="updateSFX"
          class="w-full volume-slider"
          :style="getSliderStyle(sfxVolume)"
        />
        <p class="text-xs text-right">{{ Math.round(sfxVolume * 100) }}%</p>
      </div>

      <!-- Buttons -->
      <div class="flex gap-3 pt-4">
        <button
          @click="
            {
              saveSettings();
              $emit('close');
            }
          "
          class="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
        >
          Lưu
        </button>

        <button
          @click="
            {
              playMenuClick();
              $emit('close');
            }
          "
          class="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  setBGMVolume,
  getBGMVolume,
  setSFXVolume,
  getSFXVolume,
  playMenuClick,
} from "@/store/gameSound.js";
import { emit } from "@tauri-apps/api/event";

const bgmVolume = ref(getBGMVolume());
const sfxVolume = ref(getSFXVolume());

onMounted(() => {
  const savedBGM = localStorage.getItem("bgmVolume");
  const savedSFX = localStorage.getItem("sfxVolume");

  if (savedBGM !== null) {
    bgmVolume.value = Number(savedBGM);
    setBGMVolume(bgmVolume.value);
  }

  if (savedSFX !== null) {
    sfxVolume.value = Number(savedSFX);
    setSFXVolume(sfxVolume.value);
  }
});

function getSliderStyle(value) {
  const percent = value * 100;
  return {
    background: `linear-gradient(to right, #3b82f6 ${percent}%, rgba(255,255,255,0.2) ${percent}%)`
  };
}

function updateBGM() {
  setBGMVolume(bgmVolume.value);
}

function updateSFX() {
  setSFXVolume(sfxVolume.value);
}

function saveSettings() {
  playMenuClick();
  localStorage.setItem("bgmVolume", bgmVolume.value);
  localStorage.setItem("sfxVolume", sfxVolume.value);
}
</script>

<style scoped>
.volume-slider {
  appearance: none;
  height: 6px;
  border-radius: 999px;
  outline: none;
}

/* Thumb */
.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 0 6px rgba(59,130,246,0.6);
}

/* Firefox */
.volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}
</style>
