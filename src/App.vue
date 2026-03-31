<template>
  <Menu
    v-if="screen === 'MENU'"
    @startGame="launchGame"
    @continueGame="screen = 'HISTORY'"
    @goSetting="screen = 'SETTING'"
  />

  <Game
    v-if="screen === 'GAME'"
    :gameMode="gameMode"
    :gameSize="gameSize"
    :gameRules="gameRules"
    :gameAI="gameAI"
    :matchData="currentMatch"
    @goMenu="screen = 'MENU'"
    @saveMatch="handleSaveMatch"
    @removeFinishedMatch="handleRemoveFinishedMatch"
  />

  <HistoryMatch
    v-if="screen === 'HISTORY'"
    :matches="savedMatches"
    @goMenu="screen = 'MENU'"
    @loadMatch="loadSavedGame"
    @deleteMatch="handleDeleteMatch"
  />

  <SettingPage
  v-if="screen === 'SETTING'"
  @close="screen = 'MENU'"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";

import Menu from "@/views/Menu.vue";
import Game from "@/views/NimGame.vue";
import HistoryMatch from "@/views/historyMatch.vue";
import SettingPage from "@/views/SettingPage.vue";
import {
  savedGames,
  loadSavedGames,
  writeSavedGames,
} from "@/store/gameSaving.js";

const screen = ref("MENU");

const gameMode = ref("PVP");
const gameSize = ref("MEDIUM");
const gameRules = ref("NORMAL");
const gameAI = ref("EASY");
const currentMatch = ref(null);

// Dữ liệu chính
const savedMatches = ref([]);

// =======================
// LOAD HISTORY
// =======================
onMounted(async () => {
  await loadSavedGames();
  savedMatches.value = [...savedGames.value];
});

// =======================
// START GAME
// =======================
function launchGame(data) {
  gameSize.value = data.size;
  gameMode.value = data.mode;
  gameRules.value = data.rule;
  gameAI.value = data.ai;

  currentMatch.value = null;

  screen.value = "GAME";
}

// =======================
// LOAD SAVED GAME
// =======================
function loadSavedGame(match) {
  gameMode.value = match.mode;
  gameSize.value = match.size;
  gameRules.value = match.rule;
  gameAI.value = match.ai;

  currentMatch.value = match;

  screen.value = "GAME";
}

// =======================
// SAVE GAME
// =======================
async function handleSaveMatch(match) {
  const index = savedGames.value.findIndex((g) => g.id === match.id);

  if (index !== -1) {
    savedGames.value[index] = match;
  } else {
    savedGames.value.unshift(match);
  }

  savedMatches.value = [...savedGames.value];
  await writeSavedGames();
}

// Xóa ván game khỏi lịch sử
async function handleDeleteMatch(matchId) {
  const index = savedGames.value.findIndex((g) => g.id === matchId);
  if (index === -1) return;

  savedGames.value.splice(index, 1);
  savedMatches.value = [...savedGames.value];
  await writeSavedGames();

  if (currentMatch.value?.id === matchId) {
    currentMatch.value = null;
  }
}

// Xóa ván game đã hoàn thành khỏi lịch sử
async function handleRemoveFinishedMatch(matchId) {
  const index = savedGames.value.findIndex((g) => g.id === matchId);
  if (index === -1) return;

  savedGames.value.splice(index, 1);
  savedMatches.value = [...savedGames.value];
  await writeSavedGames();

  if (currentMatch.value?.id === matchId) {
    currentMatch.value = null;
  }
}
</script>
